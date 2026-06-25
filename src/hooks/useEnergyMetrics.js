import { useState, useEffect, useCallback } from 'react';

const DEFAULT_PARAMS = { alpha: 0.5, beta: 0.3, gamma: 0.7, lambda: 0.4 };
const DEFAULT_BASELINE = { power: 100, qps: 1000, latency: 50 };

function computeEntropy(alpha, beta, gamma, lambda) {
  const vals = [alpha, beta, gamma, lambda];
  const sum = vals.reduce((a, v) => a + v, 0);
  if (sum === 0) return 0;
  const norm = vals.map(v => v / sum);
  const entropy = -norm.reduce((a, p) => (p > 0 ? a + p * Math.log2(p) : a), 0);
  return entropy / Math.log2(4);
}

export function useEnergyMetrics() {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [baseline, setBaseline] = useState(DEFAULT_BASELINE);
  const [metrics, setMetrics] = useState({
    deltaI: 0, efficiency: 0, evirt: 0, ereal: 0, throughputGain: 0, latencyReduction: 0,
  });

  const compute = useCallback(() => {
    const { alpha, beta, gamma, lambda } = params;
    const { power, qps, latency } = baseline;
    const eff = computeEntropy(alpha, beta, gamma, lambda);
    const dI = (alpha * beta + gamma * lambda) * eff;
    const evirt = dI * power * (1 + alpha);
    setMetrics({
      deltaI: dI,
      efficiency: eff,
      evirt,
      ereal: evirt * eff * beta,
      throughputGain: qps * (1 + dI * gamma) * eff,
      latencyReduction: latency * (1 - dI * lambda * eff),
    });
  }, [params, baseline]);

  useEffect(() => { compute(); }, [compute]);

  const reset = () => {
    setParams(DEFAULT_PARAMS);
    setBaseline(DEFAULT_BASELINE);
  };

  return { params, setParams, baseline, setBaseline, metrics, compute, reset };
}
