import { useState, useEffect } from 'react';

export default function AIInterpretation({ data }) {
  const [interpretation, setInterpretation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usingAI, setUsingAI] = useState(false);

  // Fallback rule-based interpretation
  const getFallbackInterpretation = (data) => {
    const alerts = [];
    
    if (!data) {
      alerts.push({ title: '📡 Waiting for Data', message: 'No sensor data available.' });
      return alerts;
    }

    if (data.pH !== undefined) {
      if (data.pH >= 5.5 && data.pH <= 6.5) {
        alerts.push({ title: '✅ pH Optimal', message: 'pH level is optimal for nutrient uptake.' });
      } else if (data.pH >= 5.0 && data.pH <= 7.0) {
        alerts.push({ title: '📊 pH Warning', message: 'pH is within acceptable range. Monitor closely.' });
      } else if (data.pH < 5.0) {
        alerts.push({ title: '⚠️ pH Critical', message: 'pH is too acidic! Add pH up solution.' });
      } else {
        alerts.push({ title: '⚠️ pH Critical', message: 'pH is too alkaline. Add pH down solution.' });
      }
    }

    if (data.tds !== undefined) {
      if (data.tds >= 1000 && data.tds <= 1500) {
        alerts.push({ title: '✅ Nutrients Optimal', message: 'TDS levels are ideal.' });
      } else if (data.tds >= 800 && data.tds <= 1800) {
        alerts.push({ title: '📊 Nutrients Acceptable', message: 'TDS within acceptable range.' });
      } else if (data.tds < 800) {
        alerts.push({ title: '⚠️ Low Nutrients', message: 'TDS is low. Increase nutrient concentration.' });
      } else {
        alerts.push({ title: '⚠️ High Nutrients', message: 'TDS is high. Dilute solution.' });
      }
    }

    if (data.turbidity !== undefined) {
      if (data.turbidity < 5) {
        alerts.push({ title: '✅ Water Clear', message: 'Excellent water clarity.' });
      } else if (data.turbidity < 10) {
        alerts.push({ title: '📊 Slight Turbidity', message: 'Monitor water quality closely.' });
      } else {
        alerts.push({ title: '⚠️ Contamination Risk', message: 'High turbidity! Check filtration system.' });
      }
    }

    if (data.temperature !== undefined) {
      if (data.temperature >= 18 && data.temperature <= 25) {
        alerts.push({ title: '✅ Temp Optimal', message: 'Temperature is perfect for root health.' });
      } else if (data.temperature >= 15 && data.temperature <= 28) {
        alerts.push({ title: '📊 Temp Acceptable', message: 'Temperature within acceptable range.' });
      } else if (data.temperature < 15) {
        alerts.push({ title: '⚠️ Temp Too Low', message: 'Temperature too low. Consider heating.' });
      } else {
        alerts.push({ title: '⚠️ Temp Too High', message: 'Temperature too high! Cool the system.' });
      }
    }

    if (data.status) {
      const lower = data.status.toLowerCase();
      if (lower === 'healthy' || lower === 'good') {
        alerts.push({ title: '✅ System Healthy', message: 'All parameters are optimal.' });
      } else if (lower === 'warning' || lower === 'caution') {
        alerts.push({ title: '⚠️ System Warning', message: 'Some parameters need adjustment.' });
      } else if (lower === 'danger' || lower === 'critical' || lower === 'degraded') {
        alerts.push({ title: '🚨 System Critical', message: 'Immediate intervention required.' });
      }
    }

    return alerts;
  };

  // AI Interpretation using REST API directly
  const getAIInterpretation = async (sensorData) => {
    if (!sensorData || !sensorData.pH) {
      setInterpretation(getFallbackInterpretation(sensorData));
      return;
    }

    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.length < 20) {
        console.log('No valid API key found, using fallback');
        setUsingAI(false);
        setInterpretation(getFallbackInterpretation(sensorData));
        setLoading(false);
        return;
      }

      // Master prompt with all rules
      const prompt = `
        You are a hydroponic farming expert. Analyze these sensor readings and provide brief interpretations.

        Sensor Readings:
        pH: ${sensorData.pH || 'N/A'}
        TDS: ${sensorData.tds || 'N/A'} ppm
        CF: ${sensorData.cf || 'N/A'}
        Turbidity: ${sensorData.turbidity || 'N/A'} NTU
        Temperature: ${sensorData.temperature || 'N/A'}°C
        Status: ${sensorData.status || 'Unknown'}

        Optimal Ranges:
        pH: 5.5-6.5
        TDS: 1000-1500 ppm
        CF: 60-80
        Turbidity: <5 NTU
        Temperature: 18-25°C

        For each parameter OUT OF RANGE, provide:
        1. A title with emoji (✅ for good, ⚠️ for warning, 🚨 for critical)
        2. Brief message with action

        Format each as: "Title - Message"
        Example: "⚠️ pH Critical - pH is too alkaline. Add pH down solution."

        Only mention parameters that need attention.
        If all are good, just say "✅ All Optimal - All parameters are within optimal ranges."
        Keep it very short and direct.
      `;

      // Use the REST API endpoint (more reliable than SDK)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
      
      console.log('Calling Gemini API via REST...');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`API returned ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log('Gemini response:', text);

      // Parse the response
      const lines = text.split('\n').filter(line => line.trim());
      const alerts = lines.map(line => {
        const cleanLine = line.trim();
        let title = 'Info';
        let message = cleanLine;
        
        if (cleanLine.includes(' - ')) {
          const parts = cleanLine.split(' - ');
          title = parts[0].trim();
          message = parts.slice(1).join(' - ').trim();
        } else if (cleanLine.includes(':')) {
          const parts = cleanLine.split(':');
          title = parts[0].trim();
          message = parts.slice(1).join(':').trim();
        }

        return { title, message };
      });

      if (alerts.length === 0) {
        alerts.push({
          title: '✅ All Optimal',
          message: 'All parameters are within optimal ranges.'
        });
      }

      setInterpretation(alerts);
      setUsingAI(true);
    } catch (err) {
      console.error('AI Error:', err);
      setUsingAI(false);
      setInterpretation(getFallbackInterpretation(sensorData));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data && data.pH !== undefined) {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.length > 20) {
        getAIInterpretation(data);
      } else {
        setUsingAI(false);
        setInterpretation(getFallbackInterpretation(data));
      }
    }
  }, [data]);

  if (loading) {
    return (
      <div className="ai-card">
        <div className="ai-header">
          <div className="ai-icon">🤖</div>
          <div className="ai-title">AI Interpretation</div>
        </div>
        <div className="alerts-list">
          <div className="alert-item info-alert">
            <div className="alert-title">⏳ Analyzing...</div>
            <div className="alert-message">AI is interpreting sensor readings...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-card">
      <div className="ai-header">
        <div className="ai-icon">🤖</div>
        <div className="ai-title">AI Interpretation</div>
        {usingAI && (
          <span style={{ fontSize: '10px', color: '#22c55e', marginLeft: 'auto' }}>
            ✨ Gemini AI
          </span>
        )}
        {!usingAI && interpretation && (
          <span style={{ fontSize: '10px', color: '#f59e0b', marginLeft: 'auto' }}>
            📋 Rule-Based
          </span>
        )}
      </div>
      <div className="alerts-list">
        {interpretation && interpretation.length > 0 ? (
          interpretation.map((alert, index) => (
            <div key={index} className="alert-item ph-alert">
              <div className="alert-title">{alert.title}</div>
              <div className="alert-message">{alert.message}</div>
            </div>
          ))
        ) : (
          <div className="alert-item info-alert">
            <div className="alert-title">📡 No Data</div>
            <div className="alert-message">No sensor data available.</div>
          </div>
        )}
      </div>
    </div>
  );
}