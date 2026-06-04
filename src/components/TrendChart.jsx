import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        backgroundColor: '#1e293b',
        border: '1px solid #3b82f6',
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <p style={{ margin: 0, color: '#3b82f6', fontSize: '24px', fontWeight: 'bold' }}>
          {data.cf?.toFixed(1)}
        </p>
        <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '11px' }}>
          Reading #{data.readingId || data.index + 1}
        </p>
      </div>
    );
  }
  return null;
};

export default function TrendChart({ history, darkMode }) {
  const lineColor = darkMode ? '#3b82f6' : '#2563eb';
  const gridColor = darkMode ? '#334155' : '#cbd5e1';
  const textColor = darkMode ? '#94a3b8' : '#64748b';
  
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorCf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis 
          dataKey="index" 
          stroke={textColor}
          tick={{ fill: textColor, fontSize: 10 }}
          tickLine={{ stroke: gridColor }}
          label={{ value: 'Reading Number', position: 'insideBottom', offset: -5, fill: textColor, fontSize: 11 }}
        />
        <YAxis 
          stroke={textColor}
          tick={{ fill: textColor, fontSize: 10 }}
          tickLine={{ stroke: gridColor }}
          label={{ value: 'CF Score', angle: -90, position: 'insideLeft', fill: textColor, fontSize: 11 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="cf"
          stroke={lineColor}
          strokeWidth={2}
          fill="url(#colorCf)"
        />
        <Line
          type="monotone"
          dataKey="cf"
          stroke={lineColor}
          strokeWidth={2.5}
          dot={{ fill: lineColor, strokeWidth: 0, r: 3 }}
          activeDot={{ r: 6, fill: lineColor, stroke: '#fff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}