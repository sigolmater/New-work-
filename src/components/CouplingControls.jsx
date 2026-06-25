import React from 'react';

const SLIDERS = [
  { key: 'alpha',  label: 'Alpha (α)',  id: 'alpha-slider' },
  { key: 'beta',   label: 'Beta (β)',   id: 'beta-slider' },
  { key: 'gamma',  label: 'Gamma (γ)',  id: 'gamma-slider' },
  { key: 'lambda', label: 'Lambda (λ)', id: 'lambda-slider' },
];

const CouplingControls = ({ params, onChange }) => (
  <div className="coupling-controls">
    <h3>Coupling Parameters</h3>
    {SLIDERS.map(({ key, label, id }) => (
      <div key={key} className="slider-group">
        <label htmlFor={id}>
          {label}: <span className="value">{params[key].toFixed(3)}</span>
        </label>
        <input
          id={id}
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={params[key]}
          onChange={e => onChange(key, parseFloat(e.target.value))}
          className="coupling-slider"
        />
      </div>
    ))}
  </div>
);

export default CouplingControls;
