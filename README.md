# 💧 Hydroponic Water Health Dashboard

A real-time monitoring dashboard for hydroponic systems that tracks water quality parameters and provides AI-powered insights for optimal plant growth.



## 🌱 Overview

This dashboard monitors critical hydroponic water parameters including pH, TDS (Total Dissolved Solids), CF (Conductivity Factor), turbidity, and temperature. It connects to a Firebase Realtime Database to display live sensor data and historical trends, with intelligent interpretation of readings to help maintain optimal growing conditions.

## ✨ Features

- **Real-time Monitoring**: Live sensor data updates via Firebase Realtime Database
- **Comprehensive Metrics**: Tracks pH, TDS, CF Score, Turbidity, and Temperature
- **Historical Trends**: Visual charts showing CF score trends over time (last 50 readings)
- **AI-Powered Insights**: Intelligent interpretation of sensor readings with actionable recommendations
- **Status Indicators**: Color-coded status system (Optimal/Warning/Critical)
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Corrective Actions**: Quick-trigger button for system interventions

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | Frontend framework |
| Vite | 4.4.5 | Build tool |
| Firebase Realtime Database | 12.14.0 | Data storage |
| Recharts | 3.8.1 | Data visualization |
| CSS3 | - | Styling & animations |

## 📊 Sensor Parameters & Ranges

| Parameter | Optimal Range | Warning Range | Critical Range |
|-----------|---------------|---------------|----------------|
| **pH** | 5.5 - 6.5 | 5.0 - 7.0 | <5.0 or >7.0 |
| **TDS** | 1000 - 1500 ppm | 800 - 1800 ppm | <800 or >1800 ppm |
| **Turbidity** | <5 NTU | 5 - 10 NTU | >10 NTU |
| **Temperature** | 18 - 25°C | 15 - 28°C | <15 or >28°C |
| **CF Score** | >80 | 60 - 79 | <60 |

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Realtime Database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akash2027/HydroponicsMonitoringDashboard.git
   cd HydroponicsMonitoringDashboard
Install dependencies

bash
npm install
Configure Firebase

Create a .env file in the root directory:

env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
Start development server

bash
npm run dev
Open your browser

text
http://localhost:5173
📁 Firebase Database Structure
json
{
  "hydroponics": {
    "system1": {
      "live": {
        "cf": 71.7,
        "pH": 7.27,
        "tds": 349.9,
        "turbidity": 27,
        "temperature": 25.0,
        "status": "DEGRADED"
      },
      "history": {
        "timestamp_1": {
          "cf": 71.7,
          "pH": 7.27,
          "tds": 349.9,
          "turbidity": 27,
          "temperature": 25.0,
          "status": "DEGRADED"
        }
      }
    }
  }
}
🎯 Usage
Development Commands
Command	Description
npm run dev	Start development server
npm run build	Create production build
npm run preview	Preview production build
npm run lint	Run ESLint
📁 Project Structure
text
HydroponicsMonitoringDashboard/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── AlertCards.jsx
│   │   ├── DashboardCards.jsx
│   │   ├── StatusBadge.jsx
│   │   └── TrendChart.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── firebase.js
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
🧩 Components
App.jsx
The main application component that:

Connects to Firebase Realtime Database

Manages live data and historical data state

Handles dark/light mode toggle

Renders the dashboard layout

DashboardCards.jsx
Displays sensor metrics in card format with:

CF Score and Status cards

pH, TDS, Turbidity, and Temperature cards

Color-coded status indicators (left border)

AI-powered interpretation sidebar

Corrective actions trigger button

AlertCards.jsx
Generates intelligent alerts based on sensor readings:

pH level analysis

Nutrient concentration recommendations

Turbidity contamination warnings

Temperature alerts

TrendChart.jsx
Visualizes historical CF score trends using Recharts:

Responsive line chart

Last 50 data points

Interactive tooltips with CF values

Custom styling with dark/light mode support

🎨 Design Features
Animated Background: Floating gradient spheres with grid overlay

Glassmorphism Cards: Frosted glass effect with backdrop blur

Outer Glow Effects: Pulsing blue glow on header and time badge

Color-coded Borders: Left border color indicates status (Green/Yellow/Red)

Smooth Animations: Hover effects, pulse on data updates, light sweep

Dark/Light Mode: Toggle between themes with persistent preference

🔧 Configuration
Firebase Security Rules
json
{
  "rules": {
    "hydroponics": {
      "system1": {
        "live": {
          ".read": true,
          ".write": false
        },
        "history": {
          ".read": true,
          ".write": false
        }
      }
    }
  }
}
Environment Variables
Create .env file in root:

env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
🚢 Deployment
Deploy to Vercel (Recommended)
Push code to GitHub

Go to vercel.com

Import your GitHub repository

Add environment variables (same as .env)

Click Deploy

Auto-deploy Setup
Once connected to Vercel, every git push automatically redeploys your dashboard.

📱 Responsive Design
Desktop (1200px+): Full layout with sidebar

Tablet (768px-1200px): Adaptive grid, sidebar below charts

Mobile (<768px): Stacked cards, simplified layout

🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

📝 License
This project is private and proprietary.

🐛 Troubleshooting
Firebase Connection Issues
Verify your Firebase configuration in src/firebase.js

Ensure Realtime Database is enabled in Firebase console

Check database rules allow read access

Build Errors
Clear node_modules and reinstall: rm -rf node_modules && npm install

Check Node.js version compatibility (v16+ recommended)

Data Not Displaying
Verify Firebase database structure matches expected format

Check browser console for Firebase connection errors

Ensure data is being written to the correct path: hydroponics/system1/live

📞 Support
For support or questions, please open an issue on GitHub.

Built with 💧 for hydroponic enthusiasts

Live Demo: https://hydroponicsmonitoringdashboard.vercel.app
