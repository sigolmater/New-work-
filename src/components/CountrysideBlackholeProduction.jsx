import React from 'react';
import './CountrysideBlackholeProduction.css';
import { useEnergyMetrics } from '../hooks/useEnergyMetrics';
import ContentReminder from './ContentReminder';
import CouplingControls from './CouplingControls';
import MetricsDisplay from './MetricsDisplay';
import BaselinePanel from './BaselinePanel';

const CountrysideBlackholeProduction = () => {
  const { params, setParams, baseline, setBaseline, metrics, compute, reset } = useEnergyMetrics();

  const updateParam = (key, val) => setParams(p => ({ ...p, [key]: val }));

  return (
    <div className="countryside-blackhole-production">
      <h1>Ray Tracing Simulation</h1>

      <ContentReminder />

      <div className="energy-panel">
        <h2>현실 연결 (α-Coupling)</h2>
        <CouplingControls params={params} onChange={updateParam} />
        <MetricsDisplay metrics={metrics} />
        <BaselinePanel baseline={baseline} onUpload={setBaseline} />
        <div className="control-buttons">
          <button onClick={reset} className="reset-button">Reset Parameters</button>
          <button onClick={compute} className="recalculate-button">Recalculate Metrics</button>
        </div>
      </div>

      <div className="simulation-info">
        <h3>About This Simulation</h3>
        <p>
          Adjust the coupling parameters (α, β, γ, λ) to see how they affect energy
          metrics in real-time. Upload a CSV file with baseline data (power, QPS, latency)
          for offline calibration.
        </p>
        <p>
          <strong>Future enhancements:</strong> ΔI–Entropy scatter plots and histograms
          will be added in subsequent updates.
        </p>
      </div>
    </div>
  );
};

export default CountrysideBlackholeProduction;
