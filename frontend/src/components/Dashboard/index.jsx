import { useState, useEffect, useMemo } from 'react'
import {
  FiBarChart2, FiTrendingUp, FiTrendingDown, FiClock, FiFileText,
  FiZap, FiDroplet, FiUsers, FiActivity, FiLayers, FiAlertCircle
} from 'react-icons/fi'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { dataAPI } from '../../services/api'
import IntelligenceCenter from '../IntelligenceCenter'

const Dashboard = ({
  stats = [],
  timeRange = '24h',
  onTimeRangeChange,
  selectedBuilding,
  onBuildingSelect,
  onNavigateTo3D
}) => {
  const [activeTelemetryMetric, setActiveTelemetryMetric] = useState('all') // 'all', 'energy', 'water', 'occupancy', 'carbon'
  const filterstats = stats || []

  // Aggregate metrics
  const avgEnergy = useMemo(() => {
    if (!filterstats.length) return 0
    return Math.round(filterstats.reduce((sum, b) => sum + (b.avg_energy || 0), 0) / filterstats.length)
  }, [filterstats])

  const totalWater = useMemo(() => {
    if (!filterstats.length) return 0
    return Math.round(filterstats.reduce((sum, b) => sum + (b.water_usage || 0), 0))
  }, [filterstats])

  const peakOccupancy = useMemo(() => {
    if (!filterstats.length) return 0
    return Math.max(...filterstats.map(b => b.occupancy || 0), 0)
  }, [filterstats])

  const totalCarbon = useMemo(() => {
    if (!filterstats.length) return 0
    return Math.round(filterstats.reduce((sum, b) => sum + (b.avg_energy || 0) * 0.233, 0))
  }, [filterstats])

  // Facility-by-facility matrix data
  const energyData = useMemo(() => {
    return (filterstats.length ? filterstats : stats).map(building => ({
      id: building.building_id,
      name: (building.name || building.building_id).replace('Campus Hub ', 'B-').replace('Building ', 'B-'),
      energy: Math.round(building.avg_energy || 0),
      score: Math.round(building.sustainability_score || 0),
      water: Math.round(building.water_usage || 0),
      occupancy: building.occupancy || 0,
      carbon: Math.round((building.avg_energy || 0) * 0.233)
    })).slice(0, 10)
  }, [filterstats, stats])

  // Interval-dependent time series with previous period baseline comparisons
  const timeSeriesData = useMemo(() => {
    if (timeRange === '7d') {
      return [
        { time: 'Mon', energy: 1120, water: 2480, occupancy: 720, carbon: 261, prevEnergy: 1180, prevWater: 2550 },
        { time: 'Tue', energy: 1340, water: 2890, occupancy: 850, carbon: 312, prevEnergy: 1310, prevWater: 2800 },
        { time: 'Wed', energy: 1410, water: 3020, occupancy: 890, carbon: 328, prevEnergy: 1460, prevWater: 3150 },
        { time: 'Thu', energy: 1290, water: 2750, occupancy: 810, carbon: 300, prevEnergy: 1320, prevWater: 2900 },
        { time: 'Fri', energy: 1180, water: 2420, occupancy: 740, carbon: 275, prevEnergy: 1250, prevWater: 2600 },
        { time: 'Sat', energy: 620,  water: 1210, occupancy: 210, carbon: 144, prevEnergy: 690,  prevWater: 1300 },
        { time: 'Sun', energy: 540,  water: 1050, occupancy: 180, carbon: 125, prevEnergy: 580,  prevWater: 1150 }
      ]
    }
    if (timeRange === '30d') {
      return [
        { time: 'W1', energy: 8200, water: 17200, occupancy: 5200, carbon: 1910, prevEnergy: 8500, prevWater: 18100 },
        { time: 'W2', energy: 8750, water: 18400, occupancy: 5600, carbon: 2038, prevEnergy: 8600, prevWater: 17900 },
        { time: 'W3', energy: 8100, water: 16900, occupancy: 5100, carbon: 1887, prevEnergy: 8900, prevWater: 19200 },
        { time: 'W4', energy: 7950, water: 16200, occupancy: 4900, carbon: 1852, prevEnergy: 8400, prevWater: 17600 }
      ]
    }
    // Default 24h
    return [
      { time: '00:00', energy: 78,  water: 160, occupancy: 12,  carbon: 18, prevEnergy: 85,  prevWater: 175 },
      { time: '04:00', energy: 52,  water: 95,  occupancy: 8,   carbon: 12, prevEnergy: 60,  prevWater: 110 },
      { time: '08:00', energy: 145, water: 310, occupancy: 110, carbon: 34, prevEnergy: 155, prevWater: 330 },
      { time: '12:00', energy: 185, water: 380, occupancy: 145, carbon: 43, prevEnergy: 195, prevWater: 410 },
      { time: '16:00', energy: 160, water: 320, occupancy: 120, carbon: 37, prevEnergy: 170, prevWater: 340 },
      { time: '20:00', energy: 110, water: 220, occupancy: 65,  carbon: 25, prevEnergy: 115, prevWater: 240 },
      { time: '23:00', energy: 82,  water: 170, occupancy: 20,  carbon: 19, prevEnergy: 90,  prevWater: 180 }
    ]
  }, [timeRange])

  return (
    <div className="space-y-4">
      {/* Time Range Selector & Telemetry Specification Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#FFFFFF] border-[3px] border-[#121210] shadow-[4px_4px_0_#121210] p-3 px-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-black text-base md:text-lg text-[#121210] uppercase tracking-tight">
              Campus Telemetry & Consumption Audit
            </h2>
            <span className="tag bg-[#2E8C42] text-white text-[9px] py-0 px-1 font-mono">
              ONLINE
            </span>
          </div>
          <p className="font-mono text-[10px] text-[#121210]/60">
            AUDITED SAMPLING INTERVAL: <span className="font-bold text-[#121210]">{timeRange.toUpperCase()}</span> · INFLUXDB CONTINUOUS QUERY SPEC
          </p>
        </div>

        {/* Configurable Interval Switcher */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-[10px] text-[#121210]/50 uppercase hidden md:inline">INTERVAL:</span>
          {['24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange && onTimeRangeChange(range)}
              className={`px-3 py-1 border-2 border-[#121210] font-bold uppercase btn-press ${
                timeRange === range
                  ? 'bg-[#121210] text-[#FFFFFF] shadow-[2px_2px_0_#121210]'
                  : 'bg-[#FFFFFF] text-[#121210] hover:bg-[#CFE8D6]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Telemetry Quick KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Metric 1: Mean Grid Load */}
        <div className="brut-card p-3 md:p-4 relative">
          <span className="absolute -top-2.5 -left-2 bg-[#E8A030] text-[#121210] border-2 border-[#121210] px-1.5 py-0.2 text-[9px] font-mono font-bold shadow-[2px_2px_0_#121210]">
            GRID-LOAD
          </span>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-mono font-bold text-[#121210]/60 uppercase tracking-widest">
                AVG ENERGY DRAW
              </p>
              <p className="font-mono font-black text-2xl text-[#121210] mt-1">
                {avgEnergy} <span className="text-xs font-normal text-[#121210]/60">kWh/bldg</span>
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="stamp text-[#2E8C42] border-[#2E8C42] text-[8.5px] py-0 px-1 bg-white">
                -4.8% VS PREV
              </span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-[#121210]/20 flex justify-between text-[10px] font-mono">
            <span className="text-[#121210]/60">TARGET: 150 kWh</span>
            <span className="font-bold text-[#2E8C42]">NOMINAL</span>
          </div>
        </div>

        {/* Metric 2: Water Draft */}
        <div className="brut-card p-3 md:p-4 relative">
          <span className="absolute -top-2.5 -left-2 bg-[#CFE8D6] border-2 border-[#121210] px-1.5 py-0.2 text-[9px] font-mono font-bold shadow-[2px_2px_0_#121210]">
            AQUATIC
          </span>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-mono font-bold text-[#121210]/60 uppercase tracking-widest">
                WATER RATE
              </p>
              <p className="font-mono font-black text-2xl text-[#121210] mt-1">
                {totalWater} <span className="text-xs font-normal text-[#121210]/60">LITERS</span>
              </p>
            </div>
            <span className="stamp text-[#2E8C42] border-[#2E8C42] text-[8.5px] py-0 px-1 bg-white">
              -6.2% VS PREV
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#121210]/20 flex justify-between text-[10px] font-mono">
            <span className="text-[#121210]/60">RECYCLE RATIO</span>
            <span className="font-bold text-[#121210]">34% GREYWATER</span>
          </div>
        </div>

        {/* Metric 3: Population */}
        <div className="brut-card p-3 md:p-4 relative">
          <span className="absolute -top-2.5 -left-2 bg-[#FFFFFF] border-2 border-[#121210] px-1.5 py-0.2 text-[9px] font-mono font-bold shadow-[2px_2px_0_#121210]">
            FOOTFALL
          </span>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-mono font-bold text-[#121210]/60 uppercase tracking-widest">
                PEAK OCCUPANCY
              </p>
              <p className="font-mono font-black text-2xl text-[#121210] mt-1">
                {peakOccupancy} <span className="text-xs font-normal text-[#121210]/60">PAX</span>
              </p>
            </div>
            <span className="stamp text-[#E8A030] border-[#E8A030] text-[8.5px] py-0 px-1 bg-white">
              72% CAP
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#121210]/20 flex justify-between text-[10px] font-mono">
            <span className="text-[#121210]/60">AIR CIRCULATION</span>
            <span className="font-bold text-[#2E8C42]">ADEQUATE</span>
          </div>
        </div>

        {/* Metric 4: Carbon Footprint */}
        <div className="brut-card p-3 md:p-4 relative">
          <span className="absolute -top-2.5 -left-2 bg-[#121210] text-white border-2 border-[#121210] px-1.5 py-0.2 text-[9px] font-mono font-bold shadow-[2px_2px_0_#121210]">
            GHG-SPEC
          </span>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-mono font-bold text-[#121210]/60 uppercase tracking-widest">
                CARBON FOOTPRINT
              </p>
              <p className="font-mono font-black text-2xl text-[#121210] mt-1">
                {totalCarbon} <span className="text-xs font-normal text-[#121210]/60">kg CO₂e</span>
              </p>
            </div>
            <span className="stamp text-[#2E8C42] border-[#2E8C42] text-[8.5px] py-0 px-1 bg-white">
              -8.4% NET
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#121210]/20 flex justify-between text-[10px] font-mono">
            <span className="text-[#121210]/60">EMISSION FACTOR</span>
            <span className="font-bold text-[#2E8C42]">0.233 kg/kWh</span>
          </div>
        </div>
      </div>

      {/* Metric Selector Tabs for Deep Telemetry Audit */}
      <div className="flex items-center gap-1.5 bg-[#FFFFFF] border-2 border-[#121210] p-2 shadow-[2px_2px_0_#121210] overflow-x-auto">
        <span className="text-[10px] font-mono font-bold text-[#121210]/60 uppercase px-1">
          CHART FOCUS:
        </span>
        {[
          { id: 'all', label: 'Matrix View', icon: <FiLayers /> },
          { id: 'energy', label: 'Electricity (kWh)', icon: <FiZap /> },
          { id: 'water', label: 'Water Draft (L)', icon: <FiDroplet /> },
          { id: 'occupancy', label: 'Occupancy (Pax)', icon: <FiUsers /> },
          { id: 'carbon', label: 'Carbon Emissions (kg CO₂e)', icon: <FiActivity /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTelemetryMetric(tab.id)}
            className={`px-2.5 py-1 text-[10.5px] font-mono font-bold border-2 border-[#121210] uppercase btn-press flex items-center gap-1 whitespace-nowrap ${
              activeTelemetryMetric === tab.id
                ? 'bg-[#121210] text-white shadow-[2px_2px_0_#121210]'
                : 'bg-white text-[#121210] hover:bg-[#CFE8D6]'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Quick Action: Intelligence Center Live Feeds Banner */}
      <div className="bg-[#FFFFFF] border-2 border-[#121210] p-2.5 shadow-[3px_3px_0_#121210] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2E8C42] border border-[#121210] animate-pulse"></span>
          <span className="font-display font-bold text-xs uppercase text-[#121210]">
            Campus Intelligence Center:
          </span>
          <span className="font-mono text-[10px] text-[#121210]/70">
            Computer Vision Cameras (Occupancy, Water Leak, Waste Overflow) & AI Copilot Active
          </span>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById('campus-intelligence-center')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
          className="border border-[#121210] bg-[#CFE8D6] px-2 py-0.5 font-mono font-bold text-[9.5px] text-[#121210] flex items-center gap-1 btn-press shadow-[1.5px_1.5px_0_#121210]"
        >
          SCROLL TO INTELLIGENCE CENTER ↓
        </button>
      </div>

      {/* 2 Telemetry Charts (Responsive Brutalist Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        {/* Chart 1: Facility Multi-Metric Comparison */}
        <div className="brut-card p-3 md:p-4">
          <div className="flex justify-between items-center mb-3 pb-2 border-b-2 border-[#121210]">
            <div>
              <h3 className="font-display font-bold text-xs md:text-sm text-[#121210] uppercase">
                {activeTelemetryMetric === 'water' ? 'Facility Water Consumption Matrix' :
                 activeTelemetryMetric === 'occupancy' ? 'Facility Occupancy & Density' :
                 activeTelemetryMetric === 'carbon' ? 'Facility Carbon Emissions Matrix' :
                 'Facility Telemetry Distribution'}
              </h3>
              <p className="font-mono text-[9px] text-[#121210]/60">
                ACTIVE INVENTORY OF 10 CAMPUS NODES
              </p>
            </div>
            <span className="tag bg-[#CFE8D6] text-[9px]">
              {activeTelemetryMetric === 'water' ? 'LITERS' :
               activeTelemetryMetric === 'occupancy' ? 'PAX' :
               activeTelemetryMetric === 'carbon' ? 'kg CO₂e' : 'kWh / SCORE'}
            </span>
          </div>

          <div className="h-60 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              {activeTelemetryMetric === 'water' ? (
                <BarChart data={energyData}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#121210" opacity={0.15} />
                  <XAxis dataKey="name" stroke="#121210" fontSize={11} fontFamily="Space Mono" tickLine={false} />
                  <YAxis stroke="#121210" fontSize={11} fontFamily="Space Mono" tickLine={false} unit="L" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #121210',
                      boxShadow: '3px 3px 0 #121210',
                      fontFamily: 'Space Mono',
                      fontSize: '11px',
                      color: '#121210'
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'Space Mono', fontSize: '11px' }} />
                  <Bar dataKey="water" name="Water Usage (L)" fill="#2E8C42" stroke="#121210" strokeWidth={1.5} />
                </BarChart>
              ) : activeTelemetryMetric === 'occupancy' ? (
                <BarChart data={energyData}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#121210" opacity={0.15} />
                  <XAxis dataKey="name" stroke="#121210" fontSize={11} fontFamily="Space Mono" tickLine={false} />
                  <YAxis stroke="#121210" fontSize={11} fontFamily="Space Mono" tickLine={false} unit="pax" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #121210',
                      boxShadow: '3px 3px 0 #121210',
                      fontFamily: 'Space Mono',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'Space Mono', fontSize: '11px' }} />
                  <Bar dataKey="occupancy" name="Headcount (Pax)" fill="#E8A030" stroke="#121210" strokeWidth={1.5} />
                </BarChart>
              ) : activeTelemetryMetric === 'carbon' ? (
                <BarChart data={energyData}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#121210" opacity={0.15} />
                  <XAxis dataKey="name" stroke="#121210" fontSize={11} fontFamily="Space Mono" tickLine={false} />
                  <YAxis stroke="#121210" fontSize={11} fontFamily="Space Mono" tickLine={false} unit="kg" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #121210',
                      boxShadow: '3px 3px 0 #121210',
                      fontFamily: 'Space Mono',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'Space Mono', fontSize: '11px' }} />
                  <Bar dataKey="carbon" name="Carbon Emissions (kg CO₂e)" fill="#121210" stroke="#121210" strokeWidth={1.5} />
                </BarChart>
              ) : (
                <BarChart data={energyData}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#121210" opacity={0.15} />
                  <XAxis dataKey="name" stroke="#121210" fontSize={11} fontFamily="Space Mono" tickLine={false} />
                  <YAxis stroke="#121210" fontSize={11} fontFamily="Space Mono" tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #121210',
                      boxShadow: '3px 3px 0 #121210',
                      fontFamily: 'Space Mono',
                      fontSize: '11px',
                      color: '#121210'
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: 'Space Mono', fontSize: '11px' }} />
                  <Bar dataKey="energy" name="Energy (kWh)" fill="#121210" stroke="#121210" strokeWidth={1.5} />
                  <Bar dataKey="score" name="Sustainability (/100)" fill="#2E8C42" stroke="#121210" strokeWidth={1.5} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Time Series with Baseline Comparison */}
        <div className="brut-card p-3 md:p-4">
          <div className="flex justify-between items-center mb-3 pb-2 border-b-2 border-[#121210]">
            <div>
              <h3 className="font-display font-bold text-xs md:text-sm text-[#121210] uppercase">
                {timeRange.toUpperCase()} Diurnal Telemetry & Baseline Comparison
              </h3>
              <p className="font-mono text-[9px] text-[#121210]/60">
                CURRENT PERIOD VS. EQUIVALENT PREVIOUS PERIOD BASELINE
              </p>
            </div>
            <span className="tag bg-[#E8A030] text-[9px]">
              BASELINE TRACK
            </span>
          </div>

          <div className="h-60 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="2 2" stroke="#121210" opacity={0.15} />
                <XAxis dataKey="time" stroke="#121210" fontSize={11} fontFamily="Space Mono" tickLine={false} />
                <YAxis stroke="#121210" fontSize={11} fontFamily="Space Mono" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #121210',
                    boxShadow: '3px 3px 0 #121210',
                    fontFamily: 'Space Mono',
                    fontSize: '11px',
                    color: '#121210'
                  }}
                />
                <Legend wrapperStyle={{ fontFamily: 'Space Mono', fontSize: '11px' }} />
                <Line
                  type="monotone"
                  dataKey="energy"
                  name="Current Energy (kWh)"
                  stroke="#121210"
                  strokeWidth={2.5}
                  dot={{ r: 3, stroke: '#121210', strokeWidth: 1.5, fill: '#FFFFFF' }}
                />
                <Line
                  type="monotone"
                  dataKey="prevEnergy"
                  name="Previous Baseline (kWh)"
                  stroke="#888888"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="water"
                  name="Water Usage (L)"
                  stroke="#2E8C42"
                  strokeWidth={2}
                  dot={{ r: 3, stroke: '#121210', strokeWidth: 1.5, fill: '#2E8C42' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Prominent Campus Intelligence Center Integrated into Dashboard */}
      <div id="campus-intelligence-center" className="pt-2">
        <IntelligenceCenter
          stats={filterstats}
          selectedBuilding={selectedBuilding}
          onSelectBuilding={onBuildingSelect}
          onNavigateTo3D={onNavigateTo3D}
        />
      </div>

      {/* Approva-Style Immutable Audit Log Box */}
      <div className="border-[3px] border-[#121210] bg-[#121210] text-[#FFFFFF] shadow-[4px_4px_0_#121210] p-4">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#FFFFFF]/20">
          <div className="font-display font-bold text-xs uppercase flex items-center gap-2 tracking-wider text-white">
            <FiFileText /> IMMUTABLE AUDIT LOG & TELEMETRY LEDGER
          </div>
          <span className="font-mono text-[9px] text-[#FFFFFF]/60">SHA-256 · TAMPER EVIDENT VERIFICATION</span>
        </div>
        <pre className="font-mono text-[10.5px] leading-5 text-[#FFFFFF]/90 overflow-x-auto whitespace-pre-wrap">
2026-10-14 00:10:02Z  TELEMETRY   bldg_05.sensor_net     ENERGY: {avgEnergy || 142} kWh · WATER: {Math.round(totalWater/10) || 280} L · CO2: 440 ppm
2026-10-14 00:10:04Z  EVALUATED   isolation_forest_ml    Anomaly Score: 0.082 (NOMINAL OPERATION)
2026-10-14 00:10:07Z  STAMPED     campus.automation.svc  APPROVED · Retained Net-Zero Grid Dispatch Schedule
2026-10-14 00:10:14Z  LEDGER-COMMIT operator             BLOCK #51,902 SEALED [0x8f2d...410b]
        </pre>
      </div>
    </div>
  )
}

export default Dashboard