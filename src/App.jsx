import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "./firebase";
import DashboardCards from "./components/DashboardCards";
import "./App.css";

function App() {
  const [liveData, setLiveData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live clock
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    const liveRef = ref(db, "hydroponics/system1/live");
    
    const unsubscribeLive = onValue(liveRef, (snapshot) => {
      const data = snapshot.val();
      if (data && Object.keys(data).length > 0) {
        setLiveData(data);
        setIsConnected(true);
        
        const container = document.querySelector('.dashboard-container');
        if (container) {
          container.classList.add('data-updated');
          setTimeout(() => container.classList.remove('data-updated'), 500);
        }
      } else {
        setIsConnected(false);
      }
    }, (error) => {
      console.error("Firebase connection error:", error);
      setIsConnected(false);
    });

    const historyRef = ref(db, "hydroponics/system1/history");
    
    const unsubscribeHistory = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      
      const arr = Object.entries(data).map(([key, item], index) => ({
        index: index,
        cf: item.cf,
        readingId: index + 1
      })).slice(-50);
      
      setHistoryData(arr);
    });

    return () => {
      unsubscribeLive();
      unsubscribeHistory();
    };
  }, []);

  // Apply dark/light mode to body
  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
        <div className="gradient-sphere sphere-3"></div>
        <div className="grid-overlay"></div>
      </div>

      {/* Header - Centered */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="dashboard-title">💧 Hydroponic Water Health Dashboard</h1>
            <p className="dashboard-subtitle">Real-time monitoring & AI insights</p>
          </div>
          
          <div className="header-controls">
            <div className={`connection-badge ${isConnected ? 'connected' : 'disconnected'}`}>
              <span className="pulse-dot"></span>
              {isConnected ? 'Live' : 'Offline'}
            </div>
            
            <div className="current-time">
              🕐 {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: false 
              })}
            </div>
            
            <button 
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle theme"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <DashboardCards data={liveData} history={historyData} isConnected={isConnected} darkMode={darkMode} />
    </div>
  );
}

export default App;