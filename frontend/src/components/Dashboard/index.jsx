import { useState, useEffect } from 'react'
import { FiBarChart2, FiTrendingUp, FiTrendingDown, FiClock, FiFileText } from 'react-icons/fi'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { dataAPI } from '../../services/api'

const Dashboard = ({ stats }) => {
  const [timeRange, setTimeRange] = useState('24h')
  const [filterstats, setfilterStats] = useState(stats)

  const getHoursFromRange = (range) => {
    switch (range) {
      case '24h': return 24
      case '7d': return 168
      case '30d': return 720
      default: return 24
    }
  }

  const fetchfilterData = async (currentRange) => {
    try {
      const hours = getHoursFromRange(currentRange)
      const data = await dataAPI.getBuildingStats({ hours })
      const buildings = data.buildings || data.data || []
      setfilterStats(buildings)
    } catch (error) {
      // Keep existing stats
    }
  }

  useEffect(() => {
    if (stats && stats.length) {
      setfilterStats(stats)
    }
  }, [stats])

  useEffect(() => {
    fetchfilterData(timeRange)
  }, [timeRange])

  const energyData = (filterstats.length ? filterstats : stats).map(building => ({
    name: (building.name || building.building_id).replace('Campus Hub ', 'B-').replace('Building ', 'B-'),
    energy: building.avg_energy || 0,
    score: building.sustainability_score || 0,
    water: building.water_usage || 0
  })).slice(0, 8)

  const timeSeriesData = [
    { hour: '00:00', energy: 120, water: 280, baseline: 150 },
    { hour: '04:00', energy: 75, water: 120, baseline: 150 },
    { hour: '08:00', energy: 195, water: 420, baseline: 150 },
    { hour: '12:00', energy: 230, water: 390, baseline: 150 },
    { hour: '16:00', energy: 185, water: 340, baseline: 150 },
    { hour: '20:00', energy: 140, water: 230, baseline: 150 },
    { hour: '23:00', energy: 95, water: 170, baseline: 150 },
  ]

  const avgEnergy = Math.round(
    filterstats.reduce((sum, b) => sum + (b.avg_energy || 0), 0) / (filterstats.length || 1)
  )
  const peakOccupancy = Math.max(...filterstats.map(b => b.occupancy || 0), 180)
  const totalCarbon = Math.round(
    filterstats.reduce((sum, b) => sum + (b.avg_energy || 0) * 0.233, 0)
  )

  return (
    <div className="space-y-4">
      {/* Time Range Selector & Title */}
      <div className="flex justify-between items-center bg-[#FFFFFF] border-[3px] border-[#121210] shadow-[4px_4px_0_#121210] p-3 px-4">
        <div>
          <h2 className="font-display font-black text-lg text-[#121210] uppercase tracking-tight">
            CAMPUS TELEMETRY & CONSUMPTION AUDIT
          </h2>
          <p className="font-mono text-[10px] text-[#121210]/60">
            AGGREGATED INTERVAL: {timeRange.toUpperCase()} · AUDITED TELEMETRY SPEC
          </p>
        </div>

        <div className="flex gap-1.5 font-mono text-xs">
          {['24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
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

      {/* 3 Stat Cards (Brutalist PO/Invoice Spec) */}
      <div className="grid grid-cols-3 gap-4">
        <div className="brut-card p-4 relative">
          <span className="absolute -top-2.5 -left-2 bg-[#E8A030] text-[#121210] border-2 border-[#121210] px-1.5 py-0.2 text-[9px] font-mono font-bold shadow-[2px_2px_0_#121210]">
            GRID-LOAD
          </span>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-mono font-bold text-[#121210]/60 uppercase tracking-widest">
                MEAN ENERGY CONSUMPTION
              </p>
              <p className="font-mono font-black text-2xl text-[#121210] mt-1">
                {avgEnergy} <span className="text-xs font-normal text-[#121210]/60">kWh/node</span>
              </p>
            </div>
            <span className="stamp text-[#2E8C42] border-[#2E8C42] text-[9px]">
              -5.2%
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#121210]/20 flex justify-between text-[10.5px] font-mono">
            <span className="text-[#121210]/60">SLA TARGET: 150 kWh</span>
            <span className="font-bold text-[#2E8C42]">COMPLIANT</span>
          </div>
        </div>

        <div className="brut-card p-4 relative">
          <span className="absolute -top-2.5 -left-2 bg-[#FFFFFF] border-2 border-[#121210] px-1.5 py-0.2 text-[9px] font-mono font-bold shadow-[2px_2px_0_#121210]">
            SENSOR-PEAK
          </span>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-mono font-bold text-[#121210]/60 uppercase tracking-widest">
                PEAK POPULATION / OCCUPANCY
              </p>
              <p className="font-mono font-black text-2xl text-[#121210] mt-1">
                {peakOccupancy} <span className="text-xs font-normal text-[#121210]/60">PEOPLE</span>
              </p>
            </div>
            <span className="stamp text-[#E8A030] border-[#E8A030] text-[9px]">
              PEAK LOAD
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#121210]/20 flex justify-between text-[10.5px] font-mono">
            <span className="text-[#121210]/60">DENSITY LIMIT: 250</span>
            <span className="font-bold text-[#121210]">68% CAP</span>
          </div>
        </div>

        <div className="brut-card p-4 relative">
          <span className="absolute -top-2.5 -left-2 bg-[#CFE8D6] border-2 border-[#121210] px-1.5 py-0.2 text-[9px] font-mono font-bold shadow-[2px_2px_0_#121210]">
            EMISSIONS
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
            <span className="stamp text-[#2E8C42] border-[#2E8C42] text-[9px]">
              -8.4%
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#121210]/20 flex justify-between text-[10.5px] font-mono">
            <span className="text-[#121210]/60">OFFSET STATUS</span>
            <span className="font-bold text-[#2E8C42]">CERTIFIED</span>
          </div>
        </div>
      </div>

      {/* 2 Brutalist Charts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Chart 1 */}
        <div className="brut-card p-4">
          <div className="flex justify-between items-center mb-3 pb-2 border-b-2 border-[#121210]">
            <div>
              <h3 className="font-display font-bold text-sm text-[#121210] uppercase">
                Facility Energy & Score Matrix
              </h3>
              <p className="font-mono text-[9px] text-[#121210]/60">RANKED BY CONSUMPTION</p>
            </div>
            <span className="tag bg-[#CFE8D6] text-[9px]">kWh / SCORE</span>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
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
                <Legend wrapperStyle={{ fontFamily: 'Space Mono', fontSize: '11px', color: '#121210' }} />
                <Bar dataKey="energy" name="Energy (kWh)" fill="#121210" stroke="#121210" strokeWidth={1.5} />
                <Bar dataKey="score" name="Score (/100)" fill="#2E8C42" stroke="#121210" strokeWidth={1.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="brut-card p-4">
          <div className="flex justify-between items-center mb-3 pb-2 border-b-2 border-[#121210]">
            <div>
              <h3 className="font-display font-bold text-sm text-[#121210] uppercase">
                24-Hour Diurnal Telemetry
              </h3>
              <p className="font-mono text-[9px] text-[#121210]/60">ENERGY VS. WATER PROFILE</p>
            </div>
            <span className="tag bg-[#E8A030] text-[9px]">DIURNAL CYCLE</span>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="2 2" stroke="#121210" opacity={0.15} />
                <XAxis dataKey="hour" stroke="#121210" fontSize={11} fontFamily="Space Mono" tickLine={false} />
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
                <Legend wrapperStyle={{ fontFamily: 'Space Mono', fontSize: '11px', color: '#121210' }} />
                <Line
                  type="stepAfter"
                  dataKey="energy"
                  name="Energy (kWh)"
                  stroke="#121210"
                  strokeWidth={3}
                  dot={{ r: 4, stroke: '#121210', strokeWidth: 2, fill: '#FFFFFF' }}
                />
                <Line
                  type="monotone"
                  dataKey="water"
                  name="Water (Liters)"
                  stroke="#2E8C42"
                  strokeWidth={2.5}
                  dot={{ r: 4, stroke: '#121210', strokeWidth: 2, fill: '#2E8C42' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Approva-Style Immutable Audit Log Box */}
      <div className="border-[3px] border-[#121210] bg-[#121210] text-[#FFFFFF] shadow-[4px_4px_0_#121210] p-4">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#FFFFFF]/20">
          <div className="font-display font-bold text-xs uppercase flex items-center gap-2 tracking-wider text-white">
            <FiFileText /> IMMUTABLE AUDIT LOG & TELEMETRY LEDGER
          </div>
          <span className="font-mono text-[9px] text-[#FFFFFF]/60">SHA-256 · TAMPER EVIDENT</span>
        </div>
        <pre className="font-mono text-[10.5px] leading-5 text-[#FFFFFF]/90 overflow-x-auto whitespace-pre-wrap">
2026-10-14 00:10:02Z  TELEMETRY   bldg_05.sensor_net     ENERGY: 142.4 kWh · WATER: 310 L · CO2: 440 ppm
2026-10-14 00:10:04Z  EVALUATED   isolation_forest_ml    Anomaly Score: 0.082 (NOMINAL OPERATION)
2026-10-14 00:10:07Z  STAMPED     campus.automation.svc  APPROVED · Retained Net-Zero Grid Dispatch Schedule
2026-10-14 00:10:14Z  LEDGER-COMMIT operator             BLOCK #51,902 SEALED [0x8f2d...410b]
        </pre>
      </div>
    </div>
  )
}

export default Dashboard