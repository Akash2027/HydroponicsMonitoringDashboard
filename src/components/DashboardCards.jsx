import TrendChart from "./TrendChart";
import CFRangeTable from "./CFRangeTable";
import AlertCards from "./AlertCards";

export default function DashboardCards({ data, history, isConnected, darkMode }) {
  
  // Function to get CF status and color based on CF score (REVERSED - higher = better)
  const getCFStatus = (cf) => {
    if (!cf) return { text: 'No Data', color: '#94a3b8', class: '' };
    
    if (cf >= 81 && cf <= 100) {
      return { text: 'Excellent / No Contamination', color: '#22c55e', class: 'excellent' };
    } else if (cf >= 61 && cf <= 80) {
      return { text: 'Mild Anomaly', color: '#84cc16', class: 'mild' };
    } else if (cf >= 41 && cf <= 60) {
      return { text: 'Significant Deviation', color: '#f59e0b', class: 'significant' };
    } else if (cf >= 21 && cf <= 40) {
      return { text: 'Contamination Likely', color: '#f97316', class: 'likely' };
    } else if (cf >= 0 && cf <= 20) {
      return { text: 'Severe Contamination', color: '#ef4444', class: 'severe' };
    }
    return { text: 'Unknown', color: '#94a3b8', class: '' };
  };

  if (!isConnected) {
    return (
      <div className="status-card" style={{ textAlign: 'center', padding: '60px' }}>
        <h3>📡 Waiting for sensor data...</h3>
        <p style={{ marginTop: '12px', color: '#94a3b8' }}>Connect your ESP32 to start receiving data</p>
      </div>
    );
  }

  // Get CF status
  const cfStatus = getCFStatus(data?.cf);

  return (
    <div className="main-dashboard">
      {/* Left Section */}
      <div className="left-section">
        {/* Sensor Grid - No colored borders, no status labels */}
        <div className="sensor-grid">
          <div className="sensor-card">
            <div className="sensor-label">💧 CF SCORE</div>
            <div className="sensor-value">{data?.cf?.toFixed(1) || "--"}</div>
          </div>

          <div className="sensor-card">
            <div className="sensor-label">🧪 pH LEVEL</div>
            <div className="sensor-value">{data?.pH?.toFixed(2) || "--"}</div>
          </div>

          <div className="sensor-card">
            <div className="sensor-label">📊 TDS</div>
            <div className="sensor-value">{data?.tds?.toFixed(1) || "--"}<span className="sensor-unit">ppm</span></div>
          </div>

          <div className="sensor-card">
            <div className="sensor-label">🌊 TURBIDITY</div>
            <div className="sensor-value">{data?.turbidity || "--"}<span className="sensor-unit">NTU</span></div>
          </div>

          <div className="sensor-card">
            <div className="sensor-label">🌡️ TEMPERATURE</div>
            <div className="sensor-value">{data?.temperature?.toFixed(1) || "--"}<span className="sensor-unit">°C</span></div>
          </div>
        </div>

        {/* CF Range Table & System Status - 2 equal boxes */}
        <div className="status-info-row">
          {/* CF Range Table */}
          <CFRangeTable />
          
          {/* System Status - Color based on CF score */}
          <div className="status-display-compact">
            <div className="status-display-title">🔄 System Status</div>
            <div className={`status-display-value ${cfStatus.class}`} style={{ color: cfStatus.color }}>
              {cfStatus.text}
            </div>
            <div className="status-cf-score" style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
              CF Score: {data?.cf?.toFixed(1) || '--'}
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