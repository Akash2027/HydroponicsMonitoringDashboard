export default function AlertCards({ data }) {
  const getAlerts = () => {
    const alerts = [];
    
    if (!data) {
      alerts.push({ type: "info", title: "📡 Waiting for Data", message: "No sensor data available. Check connection." });
      return alerts;
    }
    
    // pH interpretation - USING YOUR EXACT CODE LOGIC
    if (data.pH !== undefined) {
      if (data.pH >= 5.5 && data.pH <= 6.5) {
        alerts.push({ type: "success", title: "✅ pH OPTIMAL", message: "pH level is optimal for nutrient uptake. Perfect growing conditions." });
      } else if (data.pH >= 5.0 && data.pH <= 7.0) {
        alerts.push({ type: "warning", title: "📊 pH WARNING", message: "pH is within acceptable range. Monitor for any fluctuations." });
      } else if (data.pH < 5.0) {
        alerts.push({ type: "critical", title: "⚠️ pH CRITICAL", message: "pH is too acidic. Risk of nutrient lockout. Add pH up solution." });
      } else if (data.pH > 7.0) {
        alerts.push({ type: "critical", title: "⚠️ pH CRITICAL", message: "pH is too alkaline. Nutrient absorption may be impaired. Add pH down solution." });
      }
    }
    
    // TDS/Nutrient interpretation - USING YOUR EXACT CODE LOGIC
    if (data.tds !== undefined) {
      if (data.tds >= 1000 && data.tds <= 1500) {
        alerts.push({ type: "success", title: "💧 NUTRIENTS OPTIMAL", message: "TDS levels are ideal for most hydroponic crops." });
      } else if (data.tds >= 800 && data.tds <= 1800) {
        alerts.push({ type: "warning", title: "📊 NUTRIENTS ACCEPTABLE", message: "TDS within acceptable range for plant growth." });
      } else if (data.tds < 800) {
        alerts.push({ type: "critical", title: "⚠️ LOW NUTRIENTS", message: "TDS is low. Increase nutrient concentration in solution." });
      } else if (data.tds > 1800) {
        alerts.push({ type: "critical", title: "⚠️ HIGH NUTRIENTS", message: "TDS is high. Risk of nutrient burn. Dilute solution." });
      }
    }
    
    // Turbidity interpretation - USING YOUR EXACT CODE LOGIC
    if (data.turbidity !== undefined) {
      if (data.turbidity < 5) {
        alerts.push({ type: "success", title: "💧 WATER CLEAR", message: "Water clarity is excellent. No contamination detected." });
      } else if (data.turbidity < 10) {
        alerts.push({ type: "warning", title: "📊 SLIGHT TURBIDITY", message: "Slight turbidity present. Monitor water quality." });
      } else if (data.turbidity >= 10) {
        alerts.push({ type: "critical", title: "⚠️ CONTAMINATION RISK", message: "High turbidity detected. Possible contamination. Check filtration system." });
      }
    }
    
    // Temperature interpretation - USING YOUR EXACT CODE LOGIC
    if (data.temperature !== undefined) {
      if (data.temperature >= 18 && data.temperature <= 25) {
        alerts.push({ type: "success", title: "🌡️ TEMP OPTIMAL", message: "Temperature is optimal for root health and nutrient absorption." });
      } else if (data.temperature >= 15 && data.temperature <= 28) {
        alerts.push({ type: "warning", title: "📊 TEMP ACCEPTABLE", message: "Temperature is within acceptable range." });
      } else if (data.temperature < 15) {
        alerts.push({ type: "critical", title: "⚠️ TEMP TOO LOW", message: "Temperature is too low. Root growth may be slowed. Consider heating." });
      } else if (data.temperature > 28) {
        alerts.push({ type: "critical", title: "⚠️ TEMP TOO HIGH", message: "Temperature is too high. Risk of root rot and oxygen depletion. Cool the system." });
      }
    }
    
    // Overall status
    if (data.status) {
      const lower = data.status.toLowerCase();
      if (lower === 'healthy' || lower === 'good') {
        alerts.push({ type: "success", title: "✅ SYSTEM HEALTHY", message: "Overall system health is excellent. All parameters are within optimal ranges." });
      } else if (lower === 'warning' || lower === 'caution') {
        alerts.push({ type: "warning", title: "⚠️ SYSTEM WARNING", message: "System requires attention. Some parameters need adjustment." });
      } else if (lower === 'danger' || lower === 'critical' || lower === 'degraded') {
        alerts.push({ type: "critical", title: "🚨 SYSTEM CRITICAL", message: "CRITICAL: Immediate intervention required. Multiple parameters are out of range." });
      }
    }
    
    return alerts;
  };
  
  const alerts = getAlerts();
  
  return (
    <div className="ai-card">
      <div className="ai-header">
        <div className="ai-icon">🤖</div>
        <div className="ai-title">AI Interpretation</div>
      </div>
      <div className="alerts-list">
        {alerts.map((alert, index) => (
          <div key={index} className={`alert-item ${alert.type}-alert`}>
            <div className="alert-title">{alert.title}</div>
            <div className="alert-message">{alert.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}