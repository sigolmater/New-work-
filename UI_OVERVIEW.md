# CountrysideBlackholeProduction Component - UI Overview

## Visual Structure

```
╔════════════════════════════════════════════════════════════════════╗
║                    Ray Tracing Simulation                          ║
╚════════════════════════════════════════════════════════════════════╝

┌────────────────────────────────────────────────────────────────────┐
│                   현실 연결 (α-Coupling)                           │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              Coupling Parameters                             │ │
│  │                                                              │ │
│  │  Alpha (α): 0.500                                           │ │
│  │  [=============================O==============]  0-1        │ │
│  │                                                              │ │
│  │  Beta (β): 0.300                                            │ │
│  │  [==================O=============================]  0-1    │ │
│  │                                                              │ │
│  │  Gamma (γ): 0.700                                           │ │
│  │  [===============================================O===]  0-1  │ │
│  │                                                              │ │
│  │  Lambda (λ): 0.400                                          │ │
│  │  [=========================O====================]  0-1      │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌───────────────────────────────────────────────────────────────┐│
│  │                     Energy Metrics                            ││
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            ││
│  │  │ΔI (Modified)│ │ Efficiency  │ │Virtual Energy│            ││
│  │  │   0.2100    │ │   95.32%    │ │  10.50 W    │            ││
│  │  └─────────────┘ └─────────────┘ └─────────────┘            ││
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            ││
│  │  │Real Energy  │ │Throughput G.│ │  Latency Red.│            ││
│  │  │   3.00 W    │ │ 1140.2 QPS  │ │   47.96 ms  │            ││
│  │  └─────────────┘ └─────────────┘ └─────────────┘            ││
│  └───────────────────────────────────────────────────────────────┘│
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    Baseline Data                             │ │
│  │  Power:     100 W                                           │ │
│  │  QPS:       1000                                            │ │
│  │  Latency:   50 ms                                           │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                  Offline Calibration                         │ │
│  │  Upload Baseline Data (CSV):                                │ │
│  │  ┌──────────────────────────────────────────────────┐       │ │
│  │  │  [Choose File]  📄 sample_baseline.csv          │       │ │
│  │  └──────────────────────────────────────────────────┘       │ │
│  │  Expected format: power,qps,latency                         │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│              ┌───────────────┐  ┌────────────────────┐           │
│              │Reset Parameters│  │Recalculate Metrics │           │
│              └───────────────┘  └────────────────────┘           │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                     About This Simulation                          │
│                                                                    │
│  This component integrates energy panel controls with the          │
│  ray-tracing simulation. Adjust the coupling parameters           │
│  (α, β, γ, λ) to see how they affect the energy metrics          │
│  in real-time. Upload a CSV file with baseline data               │
│  (power, QPS, latency) for offline calibration.                   │
│                                                                    │
│  Future enhancements: Additional visualizations such as           │
│  ΔI–Entropy scatter plots and histograms will be added            │
│  in subsequent updates.                                           │
└────────────────────────────────────────────────────────────────────┘
```

## Color Scheme

### Coupling Parameters Section
- Background: Light gray (#f8f9fa)
- Sliders: Blue gradient (#e0e0e0 to #3498db)
- Labels: Dark gray (#555)
- Values: Bright blue (#3498db)

### Energy Metrics Cards
- Background: Purple gradient (from #667eea to #764ba2)
- Text: White
- Hover effect: Slight lift with enhanced shadow

### Baseline Data Section
- Background: Light green (#e8f5e9)
- Border: Green accent (#4caf50)
- Labels: Dark green (#2e7d32)
- Values: Very dark green (#1b5e20)

### CSV Uploader Section
- Background: Light orange (#fff3e0)
- Border: Orange accent (#ff9800)
- Labels: Dark orange (#e65100)
- Input border: Dashed orange (#ff9800)

### Control Buttons
- Reset: Red (#e74c3c) with hover effect
- Recalculate: Green (#27ae60) with hover effect
- Both with shadow and lift on hover

### Info Section
- Background: White
- Border: Purple accent (#9b59b6)
- Text: Dark gray (#555)
- Headings: Purple (#8e44ad)

## Interactive Elements

### Sliders
- Range: 0 to 1
- Step: 0.01 (allows 100 discrete values)
- Real-time value display with 3 decimal precision
- Smooth thumb animation on hover
- Gradient track showing progress

### Buttons
- Reset Parameters: Restores all values to defaults
- Recalculate Metrics: Manually triggers calculation
- Both with smooth hover transitions and color changes

### File Input
- Accept: .csv files only
- Shows selected file name after upload
- Dashed border indicates drop zone
- Hover effect for better UX

## Responsive Breakpoints

### Desktop (> 768px)
- Full width layout with margins
- Metrics in 3-column grid
- Side-by-side buttons

### Tablet (768px - 1024px)
- Slightly narrower margins
- Metrics in 2-column grid
- Side-by-side buttons

### Mobile (< 768px)
- Full width with minimal padding
- Metrics in single column
- Stacked buttons (full width)
- Smaller font sizes
- Reduced padding

## Accessibility Features

- ✅ Semantic HTML elements (labels, buttons, inputs)
- ✅ Proper ARIA attributes
- ✅ Keyboard navigation support
- ✅ High contrast colors for readability
- ✅ Focus indicators on interactive elements
- ✅ Descriptive labels for screen readers
- ✅ Alt text for icons (where applicable)

## Real-Time Updates

When any slider is moved:
1. Parameter value updates immediately (onChange)
2. Displayed value updates (3 decimal places)
3. useEffect triggers recalculation
4. All energy metrics update
5. Smooth transition animations

When CSV is uploaded:
1. File is read and parsed
2. Baseline data updates
3. useEffect triggers recalculation
4. All energy metrics recalculated with new baseline
5. File name displayed under input

## Mathematical Visualization

The component calculates and displays:

```
Efficiency (η) = Shannon_Entropy(α, β, γ, λ) / log₂(4)

ΔI = (α × β + γ × λ) × η

Evirt = ΔI × Power × (1 + α)

Ereal = Evirt × η × β

G = QPS × (1 + ΔI × γ) × η

Lred = Latency × (1 - ΔI × λ × η)
```

All values update in real-time as parameters change!

## Usage Flow

1. **Initial Load**
   - Default values displayed
   - Initial metrics calculated
   - UI rendered with default styling

2. **User Adjusts Sliders**
   - Values update in real-time
   - Metrics recalculate automatically
   - Visual feedback provided

3. **User Uploads CSV** (Optional)
   - File selected via input
   - Data parsed and validated
   - Baseline values updated
   - Metrics recalculated with new baseline

4. **User Views Results**
   - All metrics displayed in cards
   - Color-coded for easy reading
   - Hover effects for engagement

5. **User Resets** (Optional)
   - Click reset button
   - All values return to defaults
   - Metrics recalculated

## Future Visualization Placeholders

Space is conceptually reserved for:
- ΔI–Entropy scatter plot (below metrics)
- Histogram of energy distribution (right sidebar)
- Time-series chart for parameter evolution
- 3D visualization of coupling parameter space

These will be added in future updates as mentioned in the component info section.
