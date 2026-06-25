import React from 'react';

const METRICS = [
  { key: 'deltaI',           label: 'ΔI (Modified)',           fmt: v => v.toFixed(4) },
  { key: 'efficiency',       label: 'Efficiency (η)',           fmt: v => `${(v * 100).toFixed(2)}%` },
  { key: 'evirt',            label: 'Virtual Energy (Evirt)',   fmt: v => `${v.toFixed(2)} W` },
  { key: 'ereal',            label: 'Real Energy (Ereal)',      fmt: v => `${v.toFixed(2)} W` },
  { key: 'throughputGain',   label: 'Throughput Gain (G)',      fmt: v => `${v.toFixed(2)} QPS` },
  { key: 'latencyReduction', label: 'Latency Reduction (Lred)', fmt: v => `${v.toFixed(2)} ms` },
];

const MetricsDisplay = ({ metrics }) => (
  <div className="metrics-display">
    <h3>Energy Metrics</h3>
    {METRICS.map(({ key, label, fmt }) => (
      <div key={key} className="metric-card">
        <div className="metric-label">{label}:</div>
        <div className="metric-value">{fmt(metrics[key])}</div>
      </div>
    ))}
  </div>
);

export default MetricsDisplay;
