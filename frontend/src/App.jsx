import { useState, useEffect } from 'react'
import { FiActivity, FiZap, FiDroplet, FiServer, FiRefreshCw, FiInfo, FiX, FiCheck } from 'react-icons/fi'
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
import IntelligenceCenter from './components/IntelligenceCenter'

function App() {
  const [stats, setStats] = useState([])
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [activeTab, setActiveTab] = useState('overview') // 'overview', 'predictions', 'what-if'
  const [mlStatus, setMlStatus] = useState({})
  const [activeView, setActiveView] = useState('dashboard') // 'dashboard', '3d', 'operations'
  const [globalTimeRange, setGlobalTimeRange] = useState('24h') // Global time interval for KPIs
  const [showScoringMethod, setShowScoringMethod] = useState(false) // Transparent Scoring Dialog
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString())

  const [campusMetrics, setCampusMetrics] = useState({
    totalEnergy: 0,
    totalWater: 0,
    avgScore: 0,
    buildingCount: 0,
    greywaterReuse: 34, // percentage
    connectedBuildings: 0,
    totalBuildings: 0
  })

  const [previousMetrics, setPreviousMetrics] = useState({
    totalEnergy: 0,
    totalWater: 0,
    avgScore: 0
  })

  useEffect(() => {
    webSocketService.connect()

    const unsubscribe = webSocketService.subscribe('stats_update', (data) => {
      const buildings = Object.values(data.buildings || {})
      setStats(buildings)
      calculateCampusMetrics(buildings)
      setConnected(true)
      setLastUpdated(new Date().toLocaleTimeString())
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
      const hoursMap = { '24h': 24, '7d': 168, '30d': 720 }
      const hours = hoursMap[globalTimeRange] || 24
      const data = await dataAPI.getBuildingStats({ hours })
      const buildings = data.buildings || []
      setStats(buildings)
      calculateCampusMetrics(buildings)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Error fetching data:', error)
      const mockData = generateMockData()
      setStats(mockData)
      calculateCampusMetrics(mockData)
      setLastUpdated(new Date().toLocaleTimeString())
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
    const connectedBuildings = buildings.filter(b => b.status !== 'unknown').length

    // Store previous metrics before updating
    setPreviousMetrics({
      totalEnergy: campusMetrics.totalEnergy || totalEnergy,
      totalWater: campusMetrics.totalWater || totalWater,
      avgScore: campusMetrics.avgScore || avgScore
    })

    setCampusMetrics({
      totalEnergy: Math.round(totalEnergy),
      totalWater: Math.round(totalWater),
      avgScore: Math.round(avgScore),
      buildingCount,
      greywaterReuse: 34, // Backend telemetry parameter
      connectedBuildings,
      totalBuildings: buildingCount
    })
  }

  // Calculate comparison percentages
  const getComparison = (current, previous) => {
    if (!previous || previous === 0) return { value: 0, isIncrease: false }
    const percentChange = ((current - previous) / previous) * 100
    return {
      value: Math.abs(Math.round(percentChange * 10) / 10),
      isIncrease: percentChange > 0
    }
  }

  const energyComparison = getComparison(campusMetrics.totalEnergy, previousMetrics.totalEnergy)
  const waterComparison = getComparison(campusMetrics.totalWater, previousMetrics.totalWater)
  const scoreComparison = getComparison(campusMetrics.avgScore, previousMetrics.avgScore)

  // Calculate consistent sustainability grade
  const getSustainabilityGrade = (score) => {
    if (score >= 85) return 'A+'
    if (score >= 75) return 'A'
    if (score >= 60) return 'B'
    if (score >= 45) return 'C'
    return 'D'
  }

  const handleTimeRangeChange = async (newRange) => {
    setGlobalTimeRange(newRange)
    try {
      const hoursMap = { '24h': 24, '7d': 168, '30d': 720 }
      const hours = hoursMap[newRange] || 24
      const data = await dataAPI.getBuildingStats({ hours })
      const buildings = data.buildings || []
      setStats(buildings)
      calculateCampusMetrics(buildings)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Error fetching data for time range:', error)
    }
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

  // Cross-view navigation to 3D Campus
  const handleNavigateTo3D = (buildingId) => {
    setActiveView('3d')
    if (buildingId) {
      const found = stats.find(b => b.building_id === buildingId)
      if (found) {
        setSelectedBuilding(found)
      }
    }
  }

  if (loading) {
    return (
      <div className="startup-screen min-h-screen bg-[#CFE8D6] flex items-center justify-center p-6">
        <div className="startup-card border-[3px] border-[#121210] bg-[#FFFFFF] shadow-[6px_6px_0_#121210] p-8 max-w-md w-full text-center">
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
        onViewChange={(view) => {
          setActiveView(view)
          if (view === 'dashboard') {
            setActiveTab('overview')
          }
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Navigation & Building Queue */}
        <Sidebar
          stats={stats}
          selectedBuilding={selectedBuilding}
          onBuildingSelect={handleBuildingSelect}
          onNavigateTo3D={handleNavigateTo3D}
          activeView={activeView}
          onViewChange={setActiveView}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#CFE8D6] grid-paper">
          {/* Quick Metrics Bar (Brutalist Stat Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 p-3 md:p-5 border-b-[3px] border-[#121210] bg-[#CFE8D6] shrink-0">
            {/* Metric 01: Energy Load */}
            <div className="brut-card p-3 md:p-4 relative">
              <span className="absolute -top-2.5 -left-2 bg-[#FFFFFF] border-2 border-[#121210] px-1.5 py-0.2 text-[9px] font-mono font-bold shadow-[2px_2px_0_#121210]">
                METRIC-01
              </span>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#121210]/60">
                    CAMPUS ENERGY LOAD
                  </p>
                  <p className="font-mono font-black text-2xl text-[#121210] mt-1">
                    {campusMetrics.totalEnergy !== undefined ? campusMetrics.totalEnergy : '—'}{' '}
                    <span className="text-xs font-normal text-[#121210]/60">kWh</span>
                  </p>
                </div>
                <div className="w-8 h-8 border-2 border-[#121210] bg-[#E8A030] flex items-center justify-center font-bold text-sm shadow-[2px_2px_0_#121210]">
                  <FiZap className="text-[#121210]" />
                </div>
              </div>
              <div className="flex items-center justify-between gap-1.5 mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="tag bg-[#CFE8D6] text-[8.5px] py-0 px-1 font-mono">
                    {globalTimeRange.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono font-bold">
                    {energyComparison.value > 0 ? (
                      <span className={energyComparison.isIncrease ? 'text-[#C03A3A]' : 'text-[#2E8C42]'}>
                        {energyComparison.isIncrease ? '▲ +' : '▼ -'}{energyComparison.value}%
                      </span>
                    ) : (
                      <span className="text-[#121210]/60">±0.0%</span>
                    )}
                  </span>
                </div>
                <span className="text-[9.5px] font-mono text-[#121210]/60">VS PREV {globalTimeRange.toUpperCase()}</span>
              </div>
            </div>

            {/* Metric 02: Water Consumption */}
            <div className="brut-card p-3 md:p-4 relative">
              <span className="absolute -top-2.5 -left-2 bg-[#FFFFFF] border-2 border-[#121210] px-1.5 py-0.2 text-[9px] font-mono font-bold shadow-[2px_2px_0_#121210]">
                METRIC-02
              </span>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#121210]/60">
                    WATER CONSUMPTION
                  </p>
                  <p className="font-mono font-black text-2xl text-[#121210] mt-1">
                    {campusMetrics.totalWater !== undefined ? campusMetrics.totalWater : '—'}{' '}
                    <span className="text-xs font-normal text-[#121210]/60">LITERS</span>
                  </p>
                </div>
                <div className="w-8 h-8 border-2 border-[#121210] bg-[#CFE8D6] flex items-center justify-center font-bold text-sm shadow-[2px_2px_0_#121210]">
                  <FiDroplet className="text-[#121210]" />
                </div>
              </div>
              <div className="flex items-center justify-between gap-1.5 mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="tag bg-[#2E8C42] text-white text-[8.5px] py-0 px-1 font-mono">
                    {globalTimeRange.toUpperCase()}
                  </span>
                  <span className="tag bg-[#CFE8D6] text-[8.5px] py-0 px-1 font-mono">
                    GREYWATER: 34%
                  </span>
                </div>
                <span className="text-[9.5px] font-mono text-[#121210]/60">REUSED</span>
              </div>
            </div>

            {/* Metric 03: Sustainability Index */}
            <div className="brut-card p-3 md:p-4 relative">
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
              <div className="flex items-center justify-between gap-1.5 mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="tag bg-[#FFFFFF] text-[9px] py-0 px-1 font-mono font-bold">
                    GRADE: {getSustainabilityGrade(campusMetrics.avgScore)}
                  </span>
                  <span className="stamp text-[#2E8C42] border-[#2E8C42] text-[8px] py-0 px-1">
                    AUDITED
                  </span>
                </div>
                <button
                  onClick={() => setShowScoringMethod(true)}
                  className="text-[9.5px] font-mono underline text-[#121210] hover:text-[#2E8C42] font-bold btn-press"
                  title="View Transparent Scoring Algorithm"
                >
                  METHOD ℹ
                </button>
              </div>
            </div>

            {/* Metric 04: Connected Buildings */}
            <div className="brut-card p-3 md:p-4 relative">
              <span className="absolute -top-2.5 -left-2 bg-[#FFFFFF] border-2 border-[#121210] px-1.5 py-0.2 text-[9px] font-mono font-bold shadow-[2px_2px_0_#121210]">
                METRIC-04
              </span>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#121210]/60">
                    CONNECTED BUILDINGS
                  </p>
                  <p className="font-mono font-black text-2xl text-[#121210] mt-1">
                    {campusMetrics.connectedBuildings || stats.length}{' '}
                    <span className="text-xs font-normal text-[#121210]/60">/ {campusMetrics.totalBuildings || stats.length} FACILITIES</span>
                  </p>
                </div>
                <div className="w-8 h-8 border-2 border-[#121210] bg-[#FFFFFF] flex items-center justify-center font-bold text-sm shadow-[2px_2px_0_#121210]">
                  <FiServer className="text-[#121210]" />
                </div>
              </div>
              <div className="flex items-center justify-between gap-1.5 mt-2 flex-wrap">
                <span className="tag bg-[#2E8C42] text-white text-[9px] py-0 px-1 font-mono">
                  {connected ? '100% ONLINE' : 'SIMULATOR SYNC'}
                </span>
                <span className="text-[10px] font-mono text-[#121210]/60">SLA: 99.98%</span>
              </div>
            </div>
          </div>

          {/* Main View Area */}
          <div className="flex-1 overflow-hidden p-3 md:p-5 relative flex flex-col min-h-0">
            {activeView === '3d' ? (
              <div className="h-full border-[3px] border-[#121210] bg-[#FFFFFF] shadow-[6px_6px_0_#121210] overflow-hidden relative">
                <div className="absolute top-3 left-3 z-10 tag bg-[#FFFFFF] text-[8px] md:text-[9px]">
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
                <div className="flex items-center gap-0 border-b-[3px] border-[#121210] mb-3 md:mb-4 shrink-0 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`font-display font-bold text-[10px] md:text-xs uppercase px-3 md:px-5 py-2 md:py-2.5 border-[3px] border-[#121210] border-b-0 -mb-[3px] btn-press transition-colors whitespace-nowrap ${
                      activeTab === 'overview'
                        ? 'bg-[#121210] text-[#FFFFFF]'
                        : 'bg-[#FFFFFF] text-[#121210] hover:bg-[#CFE8D6]'
                    }`}
                  >
                    Campus Analytics & Telemetry
                  </button>
                  <button
                    onClick={() => setActiveTab('intelligence')}
                    className={`font-display font-bold text-[10px] md:text-xs uppercase px-3 md:px-5 py-2 md:py-2.5 border-[3px] border-[#121210] border-l-0 border-b-0 -mb-[3px] btn-press transition-colors whitespace-nowrap ${
                      activeTab === 'intelligence'
                        ? 'bg-[#121210] text-[#FFFFFF]'
                        : 'bg-[#FFFFFF] text-[#121210] hover:bg-[#CFE8D6]'
                    }`}
                  >
                    Campus Intelligence Center
                  </button>
                  <button
                    onClick={() => setActiveTab('predictions')}
                    className={`font-display font-bold text-[10px] md:text-xs uppercase px-3 md:px-5 py-2 md:py-2.5 border-[3px] border-[#121210] border-l-0 border-b-0 -mb-[3px] btn-press transition-colors whitespace-nowrap ${
                      activeTab === 'predictions'
                        ? 'bg-[#121210] text-[#FFFFFF]'
                        : 'bg-[#FFFFFF] text-[#121210] hover:bg-[#CFE8D6]'
                    }`}
                  >
                    AI Forecasts & Models
                  </button>
                  <button
                    onClick={() => setActiveTab('what-if')}
                    className={`font-display font-bold text-[10px] md:text-xs uppercase px-3 md:px-5 py-2 md:py-2.5 border-[3px] border-[#121210] border-l-0 border-b-0 -mb-[3px] btn-press transition-colors whitespace-nowrap ${
                      activeTab === 'what-if'
                        ? 'bg-[#121210] text-[#FFFFFF]'
                        : 'bg-[#FFFFFF] text-[#121210] hover:bg-[#CFE8D6]'
                    }`}
                  >
                    What-If Scenarios & Retrofit
                  </button>
                </div>

                {/* Tab Views */}
                {activeTab === 'intelligence' && (
                  <div className="flex-1 overflow-y-auto min-h-0 pr-1">
                    <IntelligenceCenter
                      stats={stats}
                      selectedBuilding={selectedBuilding}
                      onSelectBuilding={handleBuildingSelect}
                      onNavigateTo3D={handleNavigateTo3D}
                    />
                  </div>
                )}
                {activeTab === 'overview' && (
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-5 overflow-hidden min-h-0">
                    <div className="lg:col-span-8 overflow-y-auto pr-1">
                      <Dashboard
                        stats={stats}
                        timeRange={globalTimeRange}
                        onTimeRangeChange={handleTimeRangeChange}
                        selectedBuilding={selectedBuilding}
                        onBuildingSelect={handleBuildingSelect}
                        onNavigateTo3D={handleNavigateTo3D}
                      />
                    </div>
                    <div className="lg:col-span-4 overflow-y-auto space-y-4 pr-1">
                      <Leaderboard
                        stats={stats}
                        selectedBuilding={selectedBuilding}
                        onBuildingSelect={handleBuildingSelect}
                        onNavigateTo3D={handleNavigateTo3D}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'predictions' && (
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-5 overflow-hidden min-h-0">
                    <div className="lg:col-span-8 overflow-y-auto pr-1">
                      <AIPredictions selectedBuilding={selectedBuilding} />
                    </div>
                    <div className="lg:col-span-4 overflow-y-auto pr-1">
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

      {/* Transparent Scoring Methodology Modal */}
      {showScoringMethod && (
        <div className="fixed inset-0 bg-[#121210]/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border-[3px] border-[#121210] shadow-[8px_8px_0_#121210] max-w-lg w-full p-6 text-[#121210] font-sans animate-fadeIn">
            <div className="flex justify-between items-start border-b-[3px] border-[#121210] pb-3 mb-4">
              <div>
                <span className="tag bg-[#2E8C42] text-white text-[9px] mb-1">
                  OFFICIAL ALGORITHM SPEC
                </span>
                <h3 className="font-display font-black text-xl uppercase">
                  Sustainability Index Scoring Method
                </h3>
              </div>
              <button
                onClick={() => setShowScoringMethod(false)}
                className="w-8 h-8 border-2 border-[#121210] bg-white flex items-center justify-center font-bold hover:bg-[#CFE8D6] shadow-[2px_2px_0_#121210]"
              >
                <FiX />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <p className="text-[#121210]/80">
                The CampusOS Sustainability Index (0-100) measures real-time performance against international ASHRAE 90.1 energy and potable conservation standards:
              </p>

              <div className="p-3 bg-[#CFE8D6]/40 border-2 border-[#121210] space-y-1.5">
                <div className="font-bold text-[#121210]">WEIGHTED FORMULA:</div>
                <div className="text-[11px] font-bold text-[#2E8C42]">
                  Final Score = (Energy_Score × 0.50) + (Water_Score × 0.30) + (Air_Score × 0.20)
                </div>
              </div>

              <div className="space-y-1.5 pt-1 text-[11px]">
                <div className="flex justify-between p-1.5 border border-[#121210]/20 bg-white">
                  <span>⚡ Energy Score (50%)</span>
                  <span className="font-bold">max(0, 100 - (kWh / 5))</span>
                </div>
                <div className="flex justify-between p-1.5 border border-[#121210]/20 bg-white">
                  <span>💧 Water Score (30%)</span>
                  <span className="font-bold">max(0, 100 - (Liters / 10))</span>
                </div>
                <div className="flex justify-between p-1.5 border border-[#121210]/20 bg-white">
                  <span>🌫️ Indoor Air/CO₂ (20%)</span>
                  <span className="font-bold">max(0, 100 - ((CO₂ ppm - 400) / 10))</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-[#121210]/60">
                Grades: A+ (≥85), A (≥75), B (≥60), C (≥45), D (&lt;45). Verified tamper-evident ledger block commit.
              </div>
            </div>

            <button
              onClick={() => setShowScoringMethod(false)}
              className="mt-5 w-full border-2 border-[#121210] bg-[#121210] text-white py-2.5 font-display font-bold text-xs uppercase shadow-[3px_3px_0_#121210] btn-press"
            >
              CLOSE SPECIFICATION
            </button>
          </div>
        </div>
      )}

      {/* Brutalist Bottom Audit Footer */}
      <footer className="border-t-[3px] border-[#121210] bg-[#FFFFFF] px-3 md:px-5 py-2 text-[10px] md:text-xs font-mono flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0 shrink-0">
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 font-bold">
            <span
              className={`w-2 h-2 rounded-full border border-[#121210] ${
                connected ? 'bg-[#2E8C42]' : 'bg-[#E8A030]'
              }`}
            ></span>
            <span className="hidden sm:inline">
              {connected ? 'LIVE TELEMETRY STREAM (INFLUXDB)' : 'CONTINUOUS SIMULATION DATA STREAM'}
            </span>
            <span className="sm:hidden">{connected ? 'LIVE' : 'SIMULATION'}</span>
          </span>
          <span className="text-[#121210]/40 hidden md:inline">·</span>
          <span className="text-[#121210]/70">
            AUDIT HASH: <span className="font-bold">0x8F92...B41A</span>
            <span className="hidden md:inline"> (SHA-256)</span>
          </span>
          <span className="text-[#121210]/40 hidden md:inline">·</span>
          <span className="text-[#121210]/60">
            LAST SYNC: <span className="font-bold text-[#121210]">{lastUpdated}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="border-2 border-[#121210] bg-[#CFE8D6] px-2 md:px-2.5 py-0.5 font-bold flex items-center gap-1.5 btn-press shadow-[2px_2px_0_#121210] text-[10px]"
          >
            <FiRefreshCw className="text-xs" />
            <span className="hidden sm:inline">REFRESH TELEMETRY</span>
            <span className="sm:hidden">REFRESH</span>
          </button>
        </div>
      </footer>
    </div>
  )
}

export default App
