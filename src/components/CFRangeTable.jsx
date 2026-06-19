export default function CFRangeTable() {
  const ranges = [
    { range: "0–20", interpretation: "Severe contamination", color: "#ef4444" },
    { range: "21–40", interpretation: "Contamination likely",  color: "#f97316" },
    { range: "41–60", interpretation: "Significant deviation", color: "#f59e0b" },
    { range: "61–80", interpretation: "Mild anomaly", color: "#84cc16" },
    { range: "81–100", interpretation: "Excellent",  color: "#22c55e" }
  ];

  return (
    <div className="cf-range-compact">
      <div className="cf-range-compact-title">📊 CF Range</div>
      <div className="cf-range-compact-grid">
        {ranges.map((item, index) => (
          <div key={index} className="cf-range-compact-row">
            <div className="cf-range-compact-color" style={{ backgroundColor: item.color }}></div>
            <span className="cf-range-compact-value">{item.range}</span>
            <span className="cf-range-compact-text">{item.interpretation}</span>
          </div>
        ))}
      </div>
    </div>
  );
}