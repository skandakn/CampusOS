# CampusOS - Smart Campus Digital Twin

## 📋 Project Overview
**CampusOS** is an AI-powered 3D digital twin visualization system that monitors and optimizes campus sustainability metrics in real-time. Built on a three-tier architecture with React (Three.js) frontend, FastAPI backend, and InfluxDB for time-series data.

## 🏗️ Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│    Backend      │────▶│   Database      │
│  React + Three.js│     │   FastAPI + AI  │     │   InfluxDB      │
│  React-Three-Fiber│    │  WebSockets     │     │  Time-Series    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  3D Campus      │     │  Synthetic Data │     │  Sensor Data    │
│  Visualization  │     │  Simulation     │     │  Storage        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 🎯 Core Features

### 🏢 3D Visualization
- **Interactive Campus** with 10+ building models
- **Real-time color coding** based on sustainability scores
- **Building details** on click with energy/water metrics
- **Day/Night cycle** and weather effects
- **Camera controls** (orbit, pan, zoom)

### 📊 Sustainability Monitoring
- **Live sustainability scoring** (0-100)
- **Building status**: Good/⚠️Warning/🔴Critical
- **Energy consumption** tracking (kWh)
- **Water usage** monitoring (liters)
- **Occupancy** and CO₂ level tracking

### 🤖 AI/ML Intelligence
- **LSTM models** for energy/water prediction (24h forecast)
- **Random Forest** for anomaly detection
- **What-if analysis**: Solar panels, LED lights, water recycling
- **Trend prediction** with recommendations

### 🔔 Real-time Features
- **WebSocket connections** for live updates
- **Anomaly alerts** with severity levels
- **Auto-refreshing** leaderboard
- **Live simulation** of campus data

### 📈 Dashboard & Analytics
- **Sustainability leaderboard** with rankings
- **Interactive charts** (Recharts)
- **Historical data** views (24h, 7d, 30d)
- **Export functionality** (PDF, CSV, PNG)

## 🚀 Quick Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (development only)
- Python 3.10+ (development only)

### Installation (Docker - Recommended)
```bash
# Clone and setup
git clone https://github.com/skandakn/CampusOS.git
cd CampusOS

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start with Docker (development)
docker-compose up --build

# Access applications:
# Frontend:    http://localhost:5173
# Backend API: http://localhost:8000
# API Docs:    http://localhost:8000/docs
# InfluxDB:    http://localhost:8086 (admin/campus123)
```

### Manual Installation (Development)
```bash
# Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend Setup
cd frontend
npm install
npm run dev
```

## 📁 Project Structure
```
CampusOS/
├── backend/
│   ├── app/
│   │   ├── api/           # FastAPI endpoints
│   │   ├── db/            # InfluxDB client
│   │   ├── ml/            # AI/ML models (LSTM, Random Forest)
│   │   ├── simulation/    # Synthetic data generator
│   │   └── core/          # Configuration
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CampusScene/    # 3D visualization
│   │   │   ├── Dashboard/      # Analytics panels
│   │   │   └── Common/         # UI components
│   │   ├── services/           # API & WebSocket services
│   │   └── utils/              # Constants & helpers
│   └── package.json
└── docker-compose.yml
```

## 🔧 Configuration

### Environment Variables
```env
# Backend (.env)
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=my-super-secret-auth-token
INFLUXDB_ORG=campus_org
INFLUXDB_BUCKET=campus_data

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/api/v1/ws/real-time
```

## 🧪 Testing & Demo

### Demo Features Ready
1. **3D Campus Visualization** - Interactive buildings with hover effects
2. **Real-time Simulation** - Start data generation from dashboard
3. **AI Predictions** - Energy/water forecasting for buildings
4. **What-if Analysis** - Test sustainability scenarios
5. **Anomaly Detection** - Random Forest alerts for abnormal patterns

### Quick Test Commands
```bash
# Test backend API
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/data/stats

# Start simulation (5 minutes)
curl -X POST "http://localhost:8000/api/v1/data/simulate"

# Get predictions
curl -X POST "http://localhost:8000/api/v1/predict" \
  -H "Content-Type: application/json" \
  -d '{"building_id": "building_1", "data_type": "energy", "hours_ahead": 24}'
```

## 🎨 Features in Detail

### 1. **3D Campus Features**
- **Interactive Buildings**: Click to view detailed metrics
- **Sustainability Colors**: Green (70-100), Yellow (40-69), Red (0-39)
- **Dynamic Lighting**: Day/night cycle with realistic shadows
- **Weather Effects**: Rain, fog, and clear sky modes
- **Campus Layout**: Roads, paths, vegetation, water features

### 2. **Dashboard Features**
- **Real-time Metrics**: Energy, water, occupancy, CO₂
- **Leaderboard**: Building rankings by sustainability score
- **Anomaly Alerts**: Critical/Warning alerts with notifications
- **Trend Analysis**: 7-day predictions with confidence scores
- **Export Options**: PDF reports, CSV data, PNG screenshots

### 3. **AI/ML Features**
- **24-hour Predictions**: Energy and water consumption forecasts
- **Anomaly Detection**: Random Forest classifier for abnormal patterns
- **What-if Scenarios**:
  - Solar Panel Installation (energy generation, CO₂ reduction)
  - LED Lighting Upgrade (energy savings, cost analysis)
  - Water Recycling System (water savings, ROI calculation)
- **Trend Analysis**: Slope detection and future projections

### 4. **Data Pipeline**
- **Synthetic Data Generation**: Realistic campus patterns (day/night, weekdays/weekends)
- **WebSocket Streaming**: Real-time updates to frontend
- **InfluxDB Storage**: Time-series optimization for sensor data
- **Data Validation**: Type checking and anomaly injection


## 📊 API Endpoints

### Data Endpoints
```
GET    /api/v1/data/sensor      # Get sensor data
GET    /api/v1/data/stats       # Building statistics
POST   /api/v1/data/simulate    # Start data simulation
GET    /api/v1/data/buildings   # List all buildings
```

### Prediction Endpoints
```
POST   /api/v1/predict      # ML predictions
POST   /api/v1/predict/what-if       # Scenario analysis
GET    /api/v1/predict/trend         # Trend prediction
POST   /api/v1/predict/train-model   # Train ML models
GET    /api/v1/predict/model-status  # ML model status
```

### WebSocket
```
WS     /api/v1/ws/real-time    # Real-time data stream
```

## 🛠️ Development

### Available Scripts
```bash
# Frontend
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build

# Backend
python scripts/train_ml.py     # Train ML models
```

### Adding New Features
1. **New Building Type**: Update `constants.js` with building details
2. **New ML Model**: Add to `backend/app/ml/models.py`
3. **New API Endpoint**: Create in `backend/app/api/endpoints/`
4. **New UI Component**: Create in `frontend/src/components/`

## 🔍 Monitoring & Debugging

### Health Checks
```bash
# Application health
curl http://localhost:8000/health

# Service status
docker-compose ps

# Logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Common Issues
1. **Infinite Loading**: Check Three.js version compatibility
2. **Database Errors**: Ensure InfluxDB is running on port 8086
3. **WebSocket Issues**: Check CORS configuration in backend
4. **ML Model Errors**: Train models first via API or script

## 📈 Future Enhancements
- **AR/VR Support**: WebXR integration for immersive viewing
- **Real IoT Integration**: Connect actual campus sensors
- **Advanced Analytics**: Machine learning for optimization
- **Mobile App**: React Native companion app
- **API Gateway**: Advanced routing and rate limiting


## 👤 Author
- **skandakn** ([@skandakn](https://github.com/skandakn)) - Creator & Lead Developer

## 🤝 Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🆘 Support
For issues, questions, or contributions:
1. Check existing issues on GitHub
2. Create new issue with detailed description
3. Include error logs and reproduction steps
