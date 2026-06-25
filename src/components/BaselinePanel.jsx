import React, { useState } from 'react';

const FIELDS = [
  ['Power',   'power',   'W'],
  ['QPS',     'qps',     ''],
  ['Latency', 'latency', 'ms'],
];

const BaselinePanel = ({ baseline, onUpload }) => {
  const [fileName, setFileName] = useState(null);

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = evt => {
      const lines = evt.target.result.split('\n').filter(l => l.trim());
      if (lines.length < 2) return;
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const vals = lines[1].split(',').map(v => parseFloat(v.trim()));
      const data = Object.fromEntries(
        headers.map((h, i) => [h, vals[i]]).filter(([, v]) => !isNaN(v))
      );
      if (data.power !== undefined || data.qps !== undefined || data.latency !== undefined) {
        onUpload(prev => ({ ...prev, ...data }));
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div className="baseline-data">
        <h3>Baseline Data</h3>
        {FIELDS.map(([label, key, unit]) => (
          <div key={key} className="baseline-item">
            <span className="baseline-label">{label}:</span>
            <span className="baseline-value">{baseline[key]}{unit ? ` ${unit}` : ''}</span>
          </div>
        ))}
      </div>

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
            onChange={handleFile}
            className="csv-input"
          />
          {fileName && (
            <div className="file-info">
              <span className="file-name">📄 {fileName}</span>
            </div>
          )}
        </div>
        <div className="csv-format-info">
          <small>Expected format: power,qps,latency</small>
        </div>
      </div>
    </>
  );
};

export default BaselinePanel;
