# CountrysideBlackholeProduction Component

## Overview

The CountrysideBlackholeProduction component integrates energy panel, coupling slider, and CSV uploader features into the ray-tracing simulation. This component provides interactive controls for adjusting coupling parameters and displays real-time energy metrics.

## Features

### 1. Coupling Parameters (α, β, γ, λ)
- **Alpha (α)**: Primary coupling coefficient
- **Beta (β)**: Secondary coupling coefficient
- **Gamma (γ)**: Tertiary coupling coefficient
- **Lambda (λ)**: Quaternary coupling coefficient

Each parameter can be adjusted using slider controls with values ranging from 0 to 1.

### 2. Energy Metrics

The component calculates and displays the following metrics in real-time:

- **ΔI (Modified)**: Information delta scaled by coupling parameters and efficiency
- **Efficiency (η)**: Entropy-based efficiency calculation using Shannon entropy
- **Virtual Energy (Evirt)**: Potential energy in the simulation
- **Real Energy (Ereal)**: Actual energy considering efficiency
- **Throughput Gain (G)**: Improvement in queries per second
- **Latency Reduction (Lred)**: Reduction in latency

### 3. CSV Uploader

Upload baseline data for offline calibration. The CSV file should have the following format:

```csv
power,qps,latency
100,1000,50
```

Where:
- **power**: Power consumption in Watts
- **qps**: Queries per second
- **latency**: Latency in milliseconds

A sample baseline CSV file is included: `sample_baseline.csv`

## Entropy-Based Efficiency Calculation

The efficiency is calculated using Shannon entropy adapted for coupling parameters:

1. Parameters are normalized: `p_i = parameter_i / sum(all_parameters)`
2. Shannon entropy is calculated: `H = -Σ(p_i * log2(p_i))`
3. Efficiency is normalized: `η = H / log2(4)` where 4 is the number of parameters

This ensures efficiency values range from 0 to 1, with higher values indicating better parameter distribution.

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Adjust Coupling Parameters**: Use the sliders to modify α, β, γ, and λ values
2. **View Metrics**: Observe how energy metrics update in real-time
3. **Upload Baseline Data**: Click "Choose File" under "Offline Calibration" to upload a CSV file
4. **Reset Parameters**: Click "Reset Parameters" to restore default values
5. **Recalculate Metrics**: Click "Recalculate Metrics" to manually trigger calculation

## Component Structure

```
src/
├── App.js                              # Main application component
├── App.css                             # Application styles
├── index.js                            # React entry point
├── index.css                           # Global styles
└── components/
    ├── CountrysideBlackholeProduction.jsx  # Main simulation component
    └── CountrysideBlackholeProduction.css  # Component-specific styles
```

## Energy Calculation Formulas

### Modified ΔI
```
rawΔI = α * β + γ * λ
modifiedΔI = rawΔI * η
```

### Virtual Energy
```
Evirt = modifiedΔI * power * (1 + α)
```

### Real Energy
```
Ereal = Evirt * η * β
```

### Throughput Gain
```
G = qps * (1 + modifiedΔI * γ) * η
```

### Latency Reduction
```
Lred = latency * (1 - modifiedΔI * λ * η)
```

## Future Enhancements

The following features are planned for future updates:

1. **ΔI–Entropy Scatter Plots**: Visualize the relationship between information delta and entropy
2. **Histograms**: Display distribution of energy metrics over time
3. **Real-time Integration**: Connect to Python simulation backend
4. **Parameter Presets**: Save and load parameter configurations
5. **Export Metrics**: Download calculated metrics as CSV

## UI Panel: 현실 연결 (α-Coupling)

The main UI panel is labeled "현실 연결 (α-Coupling)" (Reality Connection - α-Coupling), emphasizing the connection between theoretical coupling parameters and real-world energy metrics.

## Testing

To run tests (if implemented):
```bash
npm test
```

## Building for Production

To create a production build:
```bash
npm run build
```

The optimized build will be created in the `build/` directory.

## Integration with Python Backend

The component is designed to work with the existing Python ray-tracing simulation in `run.py`. Future updates will include:

- WebSocket connection for real-time data exchange
- API endpoints for fetching simulation results
- Integration with `plot.py` for visualization

## License

This component is part of the New-work- repository and follows the same license.

## Contributing

Contributions are welcome! Please ensure:
- Code follows the existing style
- Components are well-documented
- Tests are included for new features
- CSS is responsive and accessible
