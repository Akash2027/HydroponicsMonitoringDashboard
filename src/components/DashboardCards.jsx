import TrendChart from "./TrendChart";
import CFRangeTable from "./CFRangeTable";
import AlertCards from "./AlertCards"; // This now points to the AI version

export default function DashboardCards({ data, history, isConnected, darkMode }) {
  const getSensorStatus = (type, value) => {
    if (!value) return "normal";
    
    switch(type) {
      case "ph":
        if (value >= 5.5 && value <= 6.5) return "optimal";
        if (value >= 5.0 && value <= 7.0) return "warning";
        return "critical";
      case "tds":
        if (value >= 1000 && value <= 1500) return "optimal";
        if (value >= 800 && value <= 1800) return "warning";
        return "critical";
      case "turbidity":
        if (value < 5) return "optimal";
        if (value < 10) return "warning";
        return "critical";
      case "temperature":
        if (value >= 18 && value <= 25) return "optimal";
        if (value >= 15 && value <= 28) return "warning";
        return "critical";
      default:
        return "normal";
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "normal";
    const lower = status.toLowerCase();
    if (lower === "healthy") return "healthy";
    if (lower === "degraded") return "degraded";
    if (lower === "warning") return "warning";
    if (lower === "critical") return "critical";
    return "normal";
  };

  if (!isConnected) {
    return (
      <div className="status-card" style={{ textAlign: 'center', padding: '60px' }}>
        <h3>📡 Waiting for sensor data...</h3>
        <p style={{ marginTop: '12px', color: '#94a3b8' }}>Connect your ESP32 to start receiving data</p>
      </div>
    );
  }

  const phStatus = getSensorStatus('ph', data?.pH);
  const tdsStatus = getSensorStatus('tds', data?.tds);
  const turbidityStatus = getSensorStatus('turbidity', data?.turbidity);
  const tempStatus = getSensorStatus('temperature', data?.temperature);

  return (
    <div className="main-dashboard">
      {/* Left Section */}
      <div className="left-section">
        {/* Sensor Grid */}
        <div className="sensor-grid">
          <div className="sensor-card normal">
            <div className="sensor-label">💧 CF SCORE</div>
            <div className="sensor-value">{data?.cf?.toFixed(1) || "--"}</div>
          </div>

          <div className={`sensor-card ${phStatus}`}>
            <div className="sensor-label">🧪 pH LEVEL</div>
            <div className="sensor-value">{data?.pH?.toFixed(2) || "--"}</div>
            {data?.pH && (
              <div className={`sensor-status ${phStatus}`}>
                {data.pH < 5.5 ? "Too Acidic" : data.pH > 6.5 ? "Too Alkaline" : "Optimal"}
              </div>
            )}
          </div>

          <div className={`sensor-card ${tdsStatus}`}>
            <div className="sensor-label">📊 TDS</div>
            <div className="sensor-value">{data?.tds?.toFixed(1) || "--"}<span className="sensor-unit">ppm</span></div>
            {data?.tds && (
              <div className={`sensor-status ${tdsStatus}`}>
                {data.tds < 800 ? "Low" : data.tds > 1800 ? "High" : "Normal"}
              </div>
            )}
          </div>

          <div className={`sensor-card ${turbidityStatus}`}>
            <div className="sensor-label">🌊 TURBIDITY</div>
            <div className="sensor-value">{data?.turbidity || "--"}<span className="sensor-unit">NTU</span></div>
            {data?.turbidity && (
              <div className={`sensor-status ${turbidityStatus}`}>
                {data.turbidity < 5 ? "Clean" : data.turbidity < 10 ? "Slight" : "Contaminated"}
              </div>
            )}
          </div>

          <div className={`sensor-card ${tempStatus}`}>
            <div className="sensor-label">🌡️ TEMPERATURE</div>
            <div className="sensor-value">{data?.temperature?.toFixed(1) || "--"}<span className="sensor-unit">°C</span></div>
            {data?.temperature && (
              <div className={`sensor-status ${tempStatus}`}>
                {data.temperature < 18 ? "Cold" : data.temperature > 25 ? "Hot" : "Ideal"}
              </div>
            )}
          </div>
        </div>

        {/* Status Info Row - 3 Columns: Legend | CF Range | System Status */}
        <div className="status-info-row">
          {/* Column 1: Status Legend - Vertical */}
          <div className="status-legend-vertical">
            <div className="status-legend-title">📌 Status Legend</div>
            <div className="legend-items-vertical">
              <div className="legend-item-vertical">
                <div className="legend-color-box-vertical optimal"></div>
                <span>Optimal</span>
              </div>
              <div className="legend-item-vertical">
                <div className="legend-color-box-vertical warning"></div>
                <span>Warning</span>
              </div>
              <div className="legend-item-vertical">
                <div className="legend-color-box-vertical critical"></div>
                <span>Critical</span>
              </div>
              <div className="legend-item-vertical">
                <div className="legend-color-box-vertical normal"></div>
                <span>Normal</span>
              </div>
            </div>
          </div>

          {/* Column 2: CF Range Table - Compact */}
          <CFRangeTable />

          {/* Column 3: System Status */}
          <div className="status-display-compact">
            <div className="status-display-title">🔄 System Status</div>
            <div className={`status-display-value ${getStatusColor(data?.status)}`}>
              {data?.status || "No Data"}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="chart-card">
          <div className="chart-title">📈 CF Score Trend (Last 50 Readings)</div>
          <TrendChart history={history} darkMode={darkMode} />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="right-sidebar">
        <AlertCards data={data} />
        <div className="corrective-card" onClick={() => alert("⚠️ Corrective actions triggered!\n\n• Adding pH down solution\n• Increasing nutrient concentration\n• Activating filtration system\n• Check system in 30 minutes")}>
          <h3>⚡ Trigger Corrective Actions</h3>
        </div>
      </div>
    </div>
  );
}