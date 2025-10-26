import { render, screen, fireEvent } from '@testing-library/react';
import CountrysideBlackholeProduction from './CountrysideBlackholeProduction';

describe('CountrysideBlackholeProduction Component', () => {
  test('renders component title', () => {
    render(<CountrysideBlackholeProduction />);
    const titleElement = screen.getByText(/Ray Tracing Simulation/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders energy panel with Korean title', () => {
    render(<CountrysideBlackholeProduction />);
    const panelTitle = screen.getByText(/현실 연결 \(α-Coupling\)/i);
    expect(panelTitle).toBeInTheDocument();
  });

  test('renders all coupling parameter sliders', () => {
    render(<CountrysideBlackholeProduction />);
    expect(screen.getByLabelText(/Alpha \(α\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Beta \(β\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gamma \(γ\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Lambda \(λ\)/i)).toBeInTheDocument();
  });

  test('renders energy metrics display', () => {
    render(<CountrysideBlackholeProduction />);
    expect(screen.getByText(/ΔI \(Modified\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Efficiency \(η\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Virtual Energy \(Evirt\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Real Energy \(Ereal\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Throughput Gain \(G\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Latency Reduction \(Lred\)/i)).toBeInTheDocument();
  });

  test('renders baseline data section', () => {
    render(<CountrysideBlackholeProduction />);
    expect(screen.getByText(/Power:/i)).toBeInTheDocument();
    expect(screen.getByText(/QPS:/i)).toBeInTheDocument();
    expect(screen.getByText(/Latency:/i)).toBeInTheDocument();
  });

  test('renders CSV uploader', () => {
    render(<CountrysideBlackholeProduction />);
    expect(screen.getByText(/Upload Baseline Data \(CSV\)/i)).toBeInTheDocument();
    const fileInput = screen.getByLabelText(/Upload Baseline Data \(CSV\)/i);
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('accept', '.csv');
  });

  test('renders control buttons', () => {
    render(<CountrysideBlackholeProduction />);
    expect(screen.getByText(/Reset Parameters/i)).toBeInTheDocument();
    expect(screen.getByText(/Recalculate Metrics/i)).toBeInTheDocument();
  });

  test('slider changes update parameter values', () => {
    render(<CountrysideBlackholeProduction />);
    const alphaSlider = screen.getByLabelText(/Alpha \(α\)/i);
    
    fireEvent.change(alphaSlider, { target: { value: '0.7' } });
    
    // Check that the alpha slider has the correct value
    expect(alphaSlider).toHaveValue('0.7');
  });

  test('reset button restores default values', () => {
    render(<CountrysideBlackholeProduction />);
    const alphaSlider = screen.getByLabelText(/Alpha \(α\)/i);
    const resetButton = screen.getByText(/Reset Parameters/i);
    
    // Change slider value
    fireEvent.change(alphaSlider, { target: { value: '0.9' } });
    
    // Click reset
    fireEvent.click(resetButton);
    
    // Check if value is back to default (0.5)
    expect(alphaSlider).toHaveValue('0.5');
  });

  test('displays simulation info section', () => {
    render(<CountrysideBlackholeProduction />);
    expect(screen.getByText(/About This Simulation/i)).toBeInTheDocument();
    expect(screen.getByText(/Future enhancements:/i)).toBeInTheDocument();
  });
});
