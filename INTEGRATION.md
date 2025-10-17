# Integration Guide: React Frontend with Python Backend

This document describes how to integrate the CountrysideBlackholeProduction React component with the existing Python ray-tracing simulation.

## Architecture Overview

```
┌─────────────────────────────────┐
│   React Frontend                │
│   (CountrysideBlackholeProduction) │
│   - Coupling Parameters UI      │
│   - Energy Metrics Display      │
│   - CSV Uploader                │
└──────────────┬──────────────────┘
               │
               │ HTTP/WebSocket
               │
┌──────────────▼──────────────────┐
│   Python Backend (Flask/FastAPI)│
│   - API Endpoints               │
│   - Ray Tracing Engine          │
│   - Energy Calculations         │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│   Simulation Engine             │
│   (run.py, engine/ray.py)       │
└─────────────────────────────────┘
```

## Implementation Steps

### 1. Create Python Backend API

Create a new file `backend/api.py`:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from engine.ray import Ray, run
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

@app.route('/api/simulate', methods=['POST'])
def simulate():
    """
    Run simulation with given coupling parameters
    """
    data = request.json
    alpha = data.get('alpha', 0.5)
    beta = data.get('beta', 0.3)
    gamma = data.get('gamma', 0.7)
    lambda_val = data.get('lambda', 0.4)
    
    # Run simulation with parameters
    rays = data.get('rays', 10)
    bounces = data.get('bounces', 50)
    seed = data.get('seed', 7)
    
    rng = random.Random(seed)
    results = []
    
    for i in range(rays):
        r = Ray(
            (rng.uniform(-0.9, 0.9), rng.uniform(-0.9, 0.9), rng.uniform(-0.9, 0.9)),
            (rng.uniform(-1, 1), rng.uniform(-1, 1), rng.uniform(-1, 1))
        )
        _, hist = run(r, bounces)
        results.append({
            'ray': i,
            'bounces': len(hist),
            'path': hist
        })
    
    return jsonify({
        'results': results,
        'parameters': {
            'alpha': alpha,
            'beta': beta,
            'gamma': gamma,
            'lambda': lambda_val
        }
    })

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

### 2. Install Backend Dependencies

```bash
pip install flask flask-cors
```

### 3. Update React Component to Use Backend

Modify `src/components/CountrysideBlackholeProduction.jsx` to add API integration:

```javascript
// Add at the top of the component
const [simulationResults, setSimulationResults] = useState(null);
const [isSimulating, setIsSimulating] = useState(false);

// Add function to call backend API
const runSimulation = async () => {
  setIsSimulating(true);
  try {
    const response = await fetch('http://localhost:5000/api/simulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        alpha,
        beta,
        gamma,
        lambda,
        rays: 50,
        bounces: 100,
        seed: Math.floor(Math.random() * 1000)
      })
    });
    
    const data = await response.json();
    setSimulationResults(data);
    
    // Update energy metrics based on simulation results
    computeEnergyMetrics();
  } catch (error) {
    console.error('Simulation error:', error);
  } finally {
    setIsSimulating(false);
  }
};

// Add button to trigger simulation
<button onClick={runSimulation} disabled={isSimulating}>
  {isSimulating ? 'Simulating...' : 'Run Simulation'}
</button>
```

### 4. Running the Full Stack

Terminal 1 - Start Python Backend:
```bash
cd backend
python api.py
```

Terminal 2 - Start React Frontend:
```bash
npm start
```

The frontend will be available at `http://localhost:3000` and will communicate with the backend at `http://localhost:5000`.

## WebSocket Integration (Advanced)

For real-time updates during long-running simulations:

### Backend (using Flask-SocketIO)

```python
from flask_socketio import SocketIO, emit

socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('start_simulation')
def handle_simulation(data):
    alpha = data['alpha']
    beta = data['beta']
    gamma = data['gamma']
    lambda_val = data['lambda']
    
    # Emit progress updates
    for i in range(100):
        emit('simulation_progress', {'progress': i + 1, 'total': 100})
        # Perform simulation step
        time.sleep(0.1)
    
    emit('simulation_complete', {'results': results})

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
```

### Frontend (using socket.io-client)

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('simulation_progress', (data) => {
  setProgress(data.progress / data.total * 100);
});

socket.on('simulation_complete', (data) => {
  setSimulationResults(data.results);
});

// Start simulation
socket.emit('start_simulation', { alpha, beta, gamma, lambda });
```

## Data Flow

1. User adjusts coupling parameters in React UI
2. React component sends parameters to Python backend via HTTP/WebSocket
3. Backend runs ray-tracing simulation with parameters
4. Backend calculates energy metrics
5. Backend sends results back to frontend
6. Frontend updates UI with new metrics and visualizations

## API Endpoints

### POST /api/simulate
Run simulation with coupling parameters

**Request:**
```json
{
  "alpha": 0.5,
  "beta": 0.3,
  "gamma": 0.7,
  "lambda": 0.4,
  "rays": 50,
  "bounces": 100,
  "seed": 7
}
```

**Response:**
```json
{
  "results": [
    {
      "ray": 0,
      "bounces": 45,
      "path": [...]
    }
  ],
  "parameters": {
    "alpha": 0.5,
    "beta": 0.3,
    "gamma": 0.7,
    "lambda": 0.4
  }
}
```

### GET /api/health
Health check endpoint

**Response:**
```json
{
  "status": "ok"
}
```

## Environment Variables

Create `.env` file in React root:
```
REACT_APP_API_URL=http://localhost:5000
```

Use in React:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

## Production Deployment

For production deployment:

1. Build React frontend:
```bash
npm run build
```

2. Serve static files from Python backend:
```python
from flask import send_from_directory

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

app.static_folder = '../build'
```

3. Deploy to cloud platform (Heroku, AWS, etc.)

## Testing Integration

Create integration tests:

```javascript
// src/integration/api.test.js
describe('API Integration', () => {
  test('simulate endpoint returns results', async () => {
    const response = await fetch('http://localhost:5000/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alpha: 0.5,
        beta: 0.3,
        gamma: 0.7,
        lambda: 0.4,
        rays: 10,
        bounces: 50
      })
    });
    
    const data = await response.json();
    expect(data.results).toBeDefined();
    expect(data.parameters).toBeDefined();
  });
});
```

## Future Enhancements

1. **Real-time Visualization**: Stream simulation data to frontend for live plotting
2. **Batch Processing**: Queue multiple simulations with different parameters
3. **Result Caching**: Cache simulation results for faster retrieval
4. **Export Functionality**: Export results as CSV/JSON
5. **Parameter Optimization**: Auto-tune parameters for optimal performance
