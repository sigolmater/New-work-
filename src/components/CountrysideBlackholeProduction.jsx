import React, { useState, useEffect, useCallback } from 'react';
import './CountrysideBlackholeProduction.css';
import ContentReminder from './ContentReminder';

/**
 * CountrysideBlackholeProduction Component
 * 
 * Integrates energy panel, coupling slider, CSV uploader, and content reminder features
 * for the ray-tracing simulation with entropy-based efficiency calculations.
 */
const CountrysideBlackholeProduction = () => {
  // State variables for coupling parameters
  const [alpha, setAlpha] = useState(0.5);
  const [beta, setBeta] = useState(0.3);
  const [gamma, setGamma] = useState(0.7);
  const [lambda, setLambda] = useState(0.4);

  // Energy metrics state
  const [deltaI, setDeltaI] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [evirt, setEvirt] = useState(0);
  const [ereal, setEreal] = useState(0);
  const [throughputGain, setThroughputGain] = useState(0);
  const [latencyReduction, setLatencyReduction] = useState(0);

  // Baseline data from CSV
  const [baselineData, setBaselineData] = useState({
    power: 100,
    qps: 1000,
    latency: 50
  });

  // CSV upload handling
  const [csvFile, setCsvFile] = useState(null);

  /**
   * Compute entropy-based efficiency
   * Uses Shannon entropy formula adapted for coupling parameters
   */
  const computeEntropy = (alpha, beta, gamma, lambda) => {
    const params = [alpha, beta, gamma, lambda];
    const sum = params.reduce((acc, val) => acc + val, 0);
    
    if (sum === 0) return 0;
    
    // Normalize parameters
    const normalized = params.map(p => p / sum);
    
    // Calculate Shannon entropy
    const entropy = -normalized.reduce((acc, p) => {
      if (p > 0) {
        return acc + p * Math.log2(p);
      }
      return acc;
    }, 0);
    
    // Convert to efficiency (0-1 range)
    const maxEntropy = Math.log2(4); // Maximum entropy for 4 parameters
    return entropy / maxEntropy;
  };

  /**
   * Compute modified ΔI value considering efficiency
   * and calculate virtual energy, real energy, throughput gain, and latency reduction
   */
  const computeEnergyMetrics = useCallback(() => {
    // Calculate efficiency using entropy
    const eff = computeEntropy(alpha, beta, gamma, lambda);
    setEfficiency(eff);

    // Modified ΔI calculation
    // ΔI represents information delta, scaled by coupling parameters
    const rawDeltaI = alpha * beta + gamma * lambda;
    const modifiedDeltaI = rawDeltaI * eff;
    setDeltaI(modifiedDeltaI);

    // Virtual Energy (Evirt) - potential energy in the simulation
    const virtualEnergy = modifiedDeltaI * baselineData.power * (1 + alpha);
    setEvirt(virtualEnergy);

    // Projected Real Energy (Ereal) - actual energy considering efficiency
    const realEnergy = virtualEnergy * eff * beta;
    setEreal(realEnergy);

    // Throughput Gain (G) - improvement in queries per second
    const gain = baselineData.qps * (1 + modifiedDeltaI * gamma) * eff;
    setThroughputGain(gain);

    // Latency Reduction (Lred) - reduction in latency
    const reduction = baselineData.latency * (1 - modifiedDeltaI * lambda * eff);
    setLatencyReduction(reduction);
  }, [alpha, beta, gamma, lambda, baselineData]);

  // Recalculate metrics when parameters change
  useEffect(() => {
    computeEnergyMetrics();
  }, [computeEnergyMetrics]);

  /**
   * Handle CSV file upload
   * Expected format: power,qps,latency
   */
  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setCsvFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) return;

      // Parse CSV (assumes header row)
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const values = lines[1].split(',').map(v => parseFloat(v.trim()));

      const data = {};
      headers.forEach((header, index) => {
        if (!isNaN(values[index])) {
          data[header] = values[index];
        }
      });

      // Update baseline data if valid fields exist
      if (data.power !== undefined || data.qps !== undefined || data.latency !== undefined) {
        setBaselineData(prev => ({
          power: data.power !== undefined ? data.power : prev.power,
          qps: data.qps !== undefined ? data.qps : prev.qps,
          latency: data.latency !== undefined ? data.latency : prev.latency
        }));
      }
    };
    
    reader.readAsText(file);
  };

  /**
   * Reset all parameters to default values
   */
  const handleReset = () => {
    setAlpha(0.5);
    setBeta(0.3);
    setGamma(0.7);
    setLambda(0.4);
    setBaselineData({
      power: 100,
      qps: 1000,
      latency: 50
    });
    setCsvFile(null);
  };

  return (
    <div className="countryside-blackhole-production">
      <h1>Ray Tracing Simulation</h1>
      
      {/* Content Calendar Reminder */}
      <ContentReminder />
      
      {/* Energy Panel: 현실 연결 (α-Coupling) */}
      <div className="energy-panel">
        <h2>현실 연결 (α-Coupling)</h2>
        
        {/* Coupling Parameter Sliders */}
        <div className="coupling-controls">
          <h3>Coupling Parameters</h3>
          
          <div className="slider-group">
            <label htmlFor="alpha-slider">
              Alpha (α): <span className="value">{alpha.toFixed(3)}</span>
            </label>
            <input
              id="alpha-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="coupling-slider"
            />
          </div>

          <div className="slider-group">
            <label htmlFor="beta-slider">
              Beta (β): <span className="value">{beta.toFixed(3)}</span>
            </label>
            <input
              id="beta-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={beta}
              onChange={(e) => setBeta(parseFloat(e.target.value))}
              className="coupling-slider"
            />
          </div>

          <div className="slider-group">
            <label htmlFor="gamma-slider">
              Gamma (γ): <span className="value">{gamma.toFixed(3)}</span>
            </label>
            <input
              id="gamma-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={gamma}
              onChange={(e) => setGamma(parseFloat(e.target.value))}
              className="coupling-slider"
            />
          </div>

          <div className="slider-group">
            <label htmlFor="lambda-slider">
              Lambda (λ): <span className="value">{lambda.toFixed(3)}</span>
            </label>
            <input
              id="lambda-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={lambda}
              onChange={(e) => setLambda(parseFloat(e.target.value))}
              className="coupling-slider"
            />
          </div>
        </div>

        {/* Energy Metrics Display */}
        <div className="metrics-display">
          <h3>Energy Metrics</h3>
          
          <div className="metric-card">
            <div className="metric-label">ΔI (Modified):</div>
            <div className="metric-value">{deltaI.toFixed(4)}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Efficiency (η):</div>
            <div className="metric-value">{(efficiency * 100).toFixed(2)}%</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Virtual Energy (Evirt):</div>
            <div className="metric-value">{evirt.toFixed(2)} W</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Real Energy (Ereal):</div>
            <div className="metric-value">{ereal.toFixed(2)} W</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Throughput Gain (G):</div>
            <div className="metric-value">{throughputGain.toFixed(2)} QPS</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Latency Reduction (Lred):</div>
            <div className="metric-value">{latencyReduction.toFixed(2)} ms</div>
          </div>
        </div>

        {/* Baseline Data Display */}
        <div className="baseline-data">
          <h3>Baseline Data</h3>
          <div className="baseline-item">
            <span className="baseline-label">Power:</span>
            <span className="baseline-value">{baselineData.power} W</span>
          </div>
          <div className="baseline-item">
            <span className="baseline-label">QPS:</span>
            <span className="baseline-value">{baselineData.qps}</span>
          </div>
          <div className="baseline-item">
            <span className="baseline-label">Latency:</span>
            <span className="baseline-value">{baselineData.latency} ms</span>
          </div>
        </div>

        {/* CSV Uploader */}
        <div className="csv-uploader">
          <h3>Offline Calibration</h3>
          <div className="upload-section">
            <label htmlFor="csv-upload" className="upload-label">
              Upload Baseline Data (CSV):
            </label>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="csv-input"
            />
            {csvFile && (
              <div className="file-info">
                <span className="file-name">📄 {csvFile.name}</span>
              </div>
            )}
          </div>
          <div className="csv-format-info">
            <small>Expected format: power,qps,latency</small>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="control-buttons">
          <button onClick={handleReset} className="reset-button">
            Reset Parameters
          </button>
          <button onClick={computeEnergyMetrics} className="recalculate-button">
            Recalculate Metrics
          </button>
        </div>
      </div>

      {/* Simulation Info */}
      <div className="simulation-info">
        <h3>About This Simulation</h3>
        <p>
          This component integrates energy panel controls with the ray-tracing simulation.
          Adjust the coupling parameters (α, β, γ, λ) to see how they affect the energy
          metrics in real-time. Upload a CSV file with baseline data (power, QPS, latency)
          for offline calibration.
        </p>
        <p>
          <strong>Future enhancements:</strong> Additional visualizations such as
          ΔI–Entropy scatter plots and histograms will be added in subsequent updates.
        </p>
      </div>
    </div>
  );
};

export default CountrysideBlackholeProduction;
