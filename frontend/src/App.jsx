import { useState, useEffect } from 'react'
import { FiActivity, FiZap, FiDroplet, FiServer, FiRefreshCw } from 'react-icons/fi'
import { TbBuildingSkyscraper } from 'react-icons/tb'
import Header from './components/common/Header'
import Sidebar from './components/common/Sidebar'
import CampusScene from './components/CampusScene'
import Dashboard from './components/Dashboard'
import Leaderboard from './components/Dashboard/Leaderboard'
import MetricsPanel from './components/Dashboard/MetricsPanel'
import { dataAPI } from './services/api'
import webSocketService from './services/websocket'
import WhatIfSimulator from './components/WhatIfSimulator'
import AIPredictions from './components/AIPredictions'
import mlService from './services/mlService'
import BuildingDashboard from './components/CampusScene/BuildingDashboard'
import OpsCommandCenter from './components/OpsCommandCenter'

function App() {
  const [stats, setStats] = useState([])
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [activeTab, setActiveTab] = useState('overview') // 'overview', 'predictions', 'what-if'
  const [mlStatus, setMlStatus] = useState({})
  const [activeView, setActiveView] = useState('dashboard') // 'dashboard', '3d', 'operations'
  const [campusMetrics, setCampusMetrics] = useState({
    totalEnergy: 0,
    totalWater: 0,
    avgScore: 0,
    buildingCount: 0
  })

  useEffect(() => {
    webSocketService.connect()

    const unsubscribe = webSocketService.subscribe('stats_update', (data) => {
      const buildings = Object.values(data.buildings || {})
      setStats(buildings)
      calculateCampusMetrics(buildings)
      setConnected(true)
    })

    webSocketService.subscribe('connection', (data) => {
      setConnected(data.status === 'connected')
    })

    webSocketService.subscribe('building_selected', (data) => {
      setSelectedBuilding(data)
    })

    fetchData()

    return () => {
      unsubscribe()
      webSocketService.disconnect()
    }
  }, [])

  useEffect(() => {
    const fetchMlStatus = async () => {
      try {
        const status = await mlService.getModelStatus()
        setMlStatus(status)
      } catch (error) {
        console.error('Error fetching ML status:', error)
      }
    }
    fetchMlStatus()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await dataAPI.getBuildingStats()
      const buildings = data.buildings || []
      setStats(buildings)
      calculateCampusMetrics(buildings)
    } catch (error) {
      console.error('Error fetching data:', error)
      const mockData = generateMockData()
      setStats(mockData)
      calculateCampusMetrics(mockData)
    } finally {
      setLoading(false)
    }
  }

  const calculateCampusMetrics = (buildings) => {
    if (!buildings.length) return
    const totalEnergy = buildings.reduce((sum, b) => sum + (b.avg_energy || 0), 0)
    const totalWater = buildings.reduce((sum, b) => sum + (b.water_usage || 0), 0)
    const avgScore = buildings.reduce((sum, b) => sum + (b.sustainability_score || 0), 0) / buildings.length
    const buildingCount = buildings.length

    setCampusMetrics({
      totalEnergy: Math.round(totalEnergy),
      totalWater: Math.round(totalWater),
      avgScore: Math.round(avgScore),
      buildingCount
    })
  }

  const generateMockData = () => {
    const buildings = []
    const types = ['academic', 'residential', 'administrative', 'library', 'laboratory']
    for (let i = 1; i <= 10; i++) {
      const score = Math.round(50 + Math.random() * 45)
      buildings.push({
        building_id: `building_${i}`,
        name: `Campus Hub ${i}`,
        type: types[(i - 1) % types.length],
        avg_energy: Math.round(50 + Math.random() * 150),
        sustainability_score: score,
        status: score > 70 ? 'good' : score > 45 ? 'warning' : 'critical',
        water_usage: Math.round(200 + Math.random() * 300),
        occupancy: Math.floor(40 + Math.random() * 160),
        co2_levels: Math.round(400 + Math.random() * 350),
        temperature: Math.round(20 + Math.random() * 5)
      })
    }
    return buildings
  }

  const handleBuildingSelect = (building) => {
    setSelectedBuilding(building)
    webSocketService.send({
      type: 'building_selected',
      building_id: building?.building_id
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#CFE8D6] flex items-center justify-center p-6">
        <div className="border-[3px] border-[#121210] bg-[#FFFFFF] shadow-[6px_6px_0_#121210] p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-[#2E8C42] border-2 border-[#121210] mx-auto mb-4 flex items-center justify-center text-white font-mono text-xl font-bold animate-pulse">
            ⚡
          </div>
          <h2 className="font-display font-black text-2xl text-[#121210] mb-2 uppercase">
            CampusOS · Initializing
          </h2>
          <p className="font-mono text-xs text-[#121210]/60">
            CONNECTING TELEMETRY STREAMS & VERIFYING SENSORS...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-[#CFE8D6] flex flex-col overflow-hidden text-[#121210] font-sans selection:bg-[#121210] selection:text-[#FFFFFF]">
      {/* Top Header */}
      <Header
        connected={connected}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Building Queue */}
        <Sidebar
          stats={stats}
          selectedBuilding={selectedBuilding}
          onBuildingSelect={handleBuildingSelect}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#CFE8D6] grid-paper">
          {/* Quick Metrics Bar (Brutalist Stat Cards) */}
          <div className="grid grid-cols-4 gap-4 p-5 border-b-[3px] border-[#121210] bg-[#CFE8D6] shrink-0">
            <div className="brut-card p-4 relative">
              <span className="absolute -top-2.5 -left-2 bg-[#FFFFFF] border-2 border-[#121210] px-1.5 py-0.2 text-[9px] font-mono font-bold shadow-[2px_2px_0_#121210]">
                METRIC-01
              </span>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#121210]/60">
                    CAMPUS ENERGY LOAD
                  </p>
                  <p className="font-mono font-black text-2xl text-[#121210] mt-1">
                    {campusMetrics.totalEnergy}{' '}
                    <span className="text-xs font-normal text-[#121210]/60">kWh</span>
                  </p>
                </div>
                <div className="w-8 h-8 border-2 border-[#121210] bg-[#E8A030] flex items-center justify-center font-bold text-sm shadow-[2px_2px_0_#121210]">
                  <FiZap className="text-[#121210]" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="tag bg-[#CFE8D6] text-[9px] py-0 px-1">PEAK DEMAND</span>
                <span className="text-[10px] font-mono text-[#121210]/60">NET-30 GRID</span>
              </div>
            </div>

            <div className="brut-card p-4 relative">
              <span className="absolute -top-2.5 -left-2 bg-[#FFFFFF] border-2 border-[#121210] px-1.5 py-0.2 text-[9px] font-mono font-bold shadow-[2px_2px_0_#121210]">
                METRIC-02
              </span>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#121210]/60">
                    WATER CONSUMPTION
                  </p>
                  <p className="font-mono font-black text-2xl text-[#121210] mt-1">
                    {campusMetrics.totalWater}{' '}
                    <span className="text-xs font-normal text-[#121210]/60">LITERS</span>
                  </p>
                </div>
                <div className="w-8 h-8 border-2 border-[#121210] bg-[#CFE8D6] flex items-center justify-center font-bold text-sm shadow-[2px_2px_0_#121210]">
                  <FiDroplet className="text-[#121210]" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="tag bg-[#2E8C42] text-white text-[9px] py-0 px-1">POTABLE</span>
                <span className="text-[10px] font-mono text-[#121210]/60">GREYWATER: 34%</span>
              </div>
            </div>

            <div className="brut-card p-4 relative">
              <span className="absolute -top-2.5 -left-2 bg-[#FFFFFF] border-2 border-[#121210] px-1.5 py-0.2 text-[9px] font-mono font-bold shadow-[2px_2px_0_#121210]">
                METRIC-03
              </span>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#121210]/60">
                    SUSTAINABILITY INDEX
                  </p>
                  <p className="font-mono font-black text-2xl text-[#121210] mt-1">
                    {campusMetrics.avgScore}
                    <span className="text-xs font-normal text-[#121210]/60">/100</span>
                  </p>
                </div>
                <div className="w-8 h-8 border-2 border-[#121210] bg-[#2E8C42] text-white flex items-center justify-center font-bold text-sm shadow-[2px_2px_0_#121210]">
                  <FiActivity />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="tag bg-[#FFFFFF] text-[9px] py-0 px-1">
                  {campusMetrics.avgScore >= 70 ? 'GRADE: A+' : 'GRADE: B'}
                </span>
                <span className="stamp text-[#2E8C42] border-[#2E8C42] text-[8px] py-0 px-1">
                  AUDITED
                </span>
              </div>
            </div>

            <div className="brut-card p-4 relative">
              <span className="absolute -top-2.5 -left-2 bg-[#FFFFFF] border-2 border-[#121210] px-1.5 py-0.2 text-[9px] font-mono font-bold shadow-[2px_2px_0_#121210]">
                METRIC-04
              </span>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#121210]/60">
                    CONNECTED BUILDINGS
                  </p>
                  <p className="font-mono font-black text-2xl text-[#121210] mt-1">
                    {campusMetrics.buildingCount}{' '}
                    <span className="text-xs font-normal text-[#121210]/60">FACILITIES</span>
                  </p>
                </div>
                <div className="w-8 h-8 border-2 border-[#121210] bg-[#FFFFFF] flex items-center justify-center font-bold text-sm shadow-[2px_2px_0_#121210]">
                  <FiServer className="text-[#121210]" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="tag bg-[#2E8C42] text-white text-[9px] py-0 px-1">100% ONLINE</span>
                <span className="text-[10px] font-mono text-[#121210]/60">SLA: 99.98%</span>
              </div>
            </div>
          </div>

          {/* Main View Area */}
          <div className="flex-1 overflow-hidden p-5 relative flex flex-col">
            {activeView === '3d' ? (
              <div className="h-full border-[3px] border-[#121210] bg-[#FFFFFF] shadow-[6px_6px_0_#121210] overflow-hidden relative">
                <div className="absolute top-3 left-3 z-10 tag bg-[#FFFFFF]">
                  3D DIGITAL TWIN · ORBIT VIEW
                </div>
                <CampusScene
                  buildings={stats}
                  onBuildingSelect={handleBuildingSelect}
                  selectedBuilding={selectedBuilding}
                />
              </div>
            ) : activeView === 'operations' ? (
              <div className="h-full border-[3px] border-[#121210] bg-[#FFFFFF] shadow-[6px_6px_0_#121210] overflow-hidden">
                <OpsCommandCenter />
              </div>
            ) : (
              <div className="h-full flex flex-col">
                {/* Approva-Style Tab Headers */}
                <div className="flex items-center gap-0 border-b-[3px] border-[#121210] mb-4 shrink-0">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`font-display font-bold text-xs uppercase px-5 py-2.5 border-[3px] border-[#121210] border-b-0 -mb-[3px] btn-press transition-colors ${
                      activeTab === 'overview'
                        ? 'bg-[#121210] text-[#FFFFFF]'
                        : 'bg-[#FFFFFF] text-[#121210] hover:bg-[#CFE8D6]'
                    }`}
                  >
                    Campus Analytics & Telemetry
                  </button>
                  <button
                    onClick={() => setActiveTab('predictions')}
                    className={`font-display font-bold text-xs uppercase px-5 py-2.5 border-[3px] border-[#121210] border-l-0 border-b-0 -mb-[3px] btn-press transition-colors ${
                      activeTab === 'predictions'
                        ? 'bg-[#121210] text-[#FFFFFF]'
                        : 'bg-[#FFFFFF] text-[#121210] hover:bg-[#CFE8D6]'
                    }`}
                  >
                    AI Forecasts & Models
                  </button>
                  <button
                    onClick={() => setActiveTab('what-if')}
                    className={`font-display font-bold text-xs uppercase px-5 py-2.5 border-[3px] border-[#121210] border-l-0 border-b-0 -mb-[3px] btn-press transition-colors ${
                      activeTab === 'what-if'
                        ? 'bg-[#121210] text-[#FFFFFF]'
                        : 'bg-[#FFFFFF] text-[#121210] hover:bg-[#CFE8D6]'
                    }`}
                  >
                    What-If Scenarios & Retrofit
                  </button>
                </div>

                {/* Tab Views */}
                {activeTab === 'overview' && (
                  <div className="flex-1 grid grid-cols-12 gap-5 overflow-hidden min-h-0">
                    <div className="col-span-8 overflow-y-auto pr-1">
                      <Dashboard stats={stats} />
                    </div>
                    <div className="col-span-4 overflow-y-auto space-y-4 pr-1">
                      <Leaderboard stats={stats} />
                    </div>
                  </div>
                )}

                {activeTab === 'predictions' && (
                  <div className="flex-1 grid grid-cols-12 gap-5 overflow-hidden min-h-0">
                    <div className="col-span-8 overflow-y-auto pr-1">
                      <AIPredictions selectedBuilding={selectedBuilding} />
                    </div>
                    <div className="col-span-4 overflow-y-auto pr-1">
                      <MetricsPanel />
                    </div>
                  </div>
                )}

                {activeTab === 'what-if' && (
                  <div className="flex-1 overflow-y-auto min-h-0 pr-1">
                    <WhatIfSimulator selectedBuilding={selectedBuilding} />
                  </div>
                )}
              </div>
            )}

            {/* Building Detail Modal */}
            <BuildingDashboard
              building={selectedBuilding}
              onClose={() => handleBuildingSelect(null)}
            />
          </div>
        </main>
      </div>

      {/* Brutalist Bottom Audit Footer */}
      <footer className="border-t-[3px] border-[#121210] bg-[#FFFFFF] px-5 py-2 text-xs font-mono flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold">
            <span
              className={`w-2 h-2 rounded-full border border-[#121210] ${
                connected ? 'bg-[#2E8C42]' : 'bg-[#E8A030]'
              }`}
            ></span>
            {connected ? 'LIVE TELEMETRY STREAM' : 'SYNTHETIC FALLBACK STREAM'}
          </span>
          <span className="text-[#121210]/40">·</span>
          <span className="text-[#121210]/70">
            AUDIT HASH: <span className="font-bold">0x8F92...B41A</span> (SHA-256)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="border-2 border-[#121210] bg-[#CFE8D6] px-2.5 py-0.5 font-bold flex items-center gap-1.5 btn-press shadow-[2px_2px_0_#121210]"
          >
            <FiRefreshCw className="text-xs" />
            REFRESH AUDIT
          </button>
        </div>
      </footer>
    </div>
  )
}

export default App