import { useState, useEffect } from 'react'
import { 
  FiTrendingUp, FiActivity, FiBarChart2, FiAlertCircle, 
  FiSettings, FiSun, FiDroplet, FiCheckCircle
} from 'react-icons/fi'
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import mlService from '../../services/mlService'

const AIPredictions = ({ selectedBuilding }) => {
  const [trendData, setTrendData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dataType, setDataType] = useState('energy')
  
  const [maintenanceAlerts, setMaintenanceAlerts] = useState([])
  const [anomalies, setAnomalies] = useState([])
  const [peakForecast, setPeakForecast] = useState(null)

  useEffect(() => {
    if (selectedBuilding) {
      loadAllData()
    }
  }, [selectedBuilding, dataType])

  const loadAllData = async () => {
    setLoading(true)
    const buildingId = selectedBuilding.building_id || selectedBuilding.id || 'building_1'

    try {
      const [trendRes, maintenanceRes, anomaliesRes] = await Promise.all([
        mlService.makePrediction(buildingId, dataType, 24, true),
        mlService.getPredictiveMaintenance(buildingId),
        mlService.getAnomalies(buildingId)
      ])

      if (trendRes.chart_data) {
        setTrendData(trendRes.chart_data)
      }
      
      if (trendRes.peak_forecast) {
        const iconType = trendRes.peak_forecast.icon_type
        const peakIcon = iconType === 'energy' 
          ? <FiSun className="text-[#121210]"/> 
          : <FiDroplet className="text-[#121210]"/>
        
        setPeakForecast({ ...trendRes.peak_forecast, icon: peakIcon })
      } else {
        setPeakForecast(null)
      }

      if (maintenanceRes.alerts) {
        setMaintenanceAlerts(maintenanceRes.alerts)
      }

      if (anomaliesRes.anomalies) {
        setAnomalies(anomaliesRes.anomalies)
      }

    } catch (error) {
      console.error("Error fetching AI insights:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDataTypeLabel = (type) => {
    const labels = { energy: 'Energy Demand (kW)', water: 'Water Flow (L/h)', occupancy: 'Foot Traffic (pax)' }
    return labels[type] || type
  }

  return (
    <div className="bg-white border-[3px] border-[#121210] shadow-[4px_4px_0_#121210] p-5 flex flex-col h-full overflow-y-auto">
      
      {/* Approva Brutalist Header */}
      <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-[#121210] shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 bg-[#2E8C42] border border-[#121210]" />
          <h3 className="font-display font-black text-sm uppercase tracking-wider text-[#121210] flex items-center">
            <FiActivity className="mr-2 text-[#2E8C42]" />
            AI Forecast & Diagnostic Ledger
          </h3>
        </div>
        {selectedBuilding ? (
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 bg-[#CFE8D6] border border-[#121210] text-[#121210]">
              {selectedBuilding.name || selectedBuilding.building_id}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#121210] text-[#CFE8D6] font-bold">
              EST-MODEL v4.2
            </span>
          </div>
        ) : (
          <span className="text-[10px] font-mono uppercase text-gray-500 border border-dashed border-[#121210] px-2 py-0.5">
            Awaiting Target Selection
          </span>
        )}
      </div>

      {!selectedBuilding ? (
        <div className="flex-1 flex items-center justify-center text-center p-8 border-2 border-dashed border-[#121210]/30 bg-[#F4F9F5]">
          <div>
            <div className="w-12 h-12 bg-white border-2 border-[#121210] shadow-[3px_3px_0_#121210] flex items-center justify-center mx-auto mb-3">
              <FiBarChart2 className="text-xl text-[#121210]" />
            </div>
            <p className="font-display font-bold text-sm text-[#121210] uppercase tracking-wide">No Facility Selected</p>
            <p className="font-mono text-xs text-gray-600 mt-1">Select a building node from the queue to run inference pipelines</p>
          </div>
        </div>
      ) : loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16">
          <div className="w-8 h-8 border-[3px] border-[#121210] border-t-[#2E8C42] rounded-none animate-spin mb-3"></div>
          <span className="font-mono text-xs uppercase font-bold tracking-wider text-[#121210]">Computing Bayesian Forecasts...</span>
        </div>
      ) : (
        <div className="space-y-5">
          
          {/* Controls & Peak Forecast Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1 bg-[#F4F9F5] border-2 border-[#121210] p-3 shadow-[2px_2px_0_#121210]">
              <label className="block text-[10px] font-display uppercase tracking-widest font-black text-[#121210] mb-1.5">
                Forecast Parameter
              </label>
              <select
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
                className="w-full bg-white border-2 border-[#121210] px-2.5 py-1.5 text-xs font-mono font-bold text-[#121210] focus:outline-none focus:bg-[#CFE8D6] cursor-pointer"
              >
                <option value="energy">Energy Demand (kW)</option>
                <option value="water">Water Flow (L/h)</option>
                <option value="occupancy">Occupancy (Pax)</option>
              </select>
              <p className="text-[10px] font-mono text-gray-500 mt-1.5">
                Resolution: 1-hr steps · Horizon: 24h
              </p>
            </div>

            {/* Feature 1: Peak Load Forecasting (Approva Alert Card) */}
            {peakForecast ? (
              <div className="md:col-span-2 bg-[#FEF3E2] border-2 border-[#121210] p-3.5 shadow-[2px_2px_0_#121210] flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono uppercase font-black px-1.5 py-0.5 bg-[#E8A030] text-[#121210] border border-[#121210]">
                      PEAK LOAD WARNING
                    </span>
                    <span className="text-[10px] font-mono text-gray-700">Projected @ {peakForecast.time}</span>
                  </div>
                  <div className="flex items-baseline space-x-2 mt-1.5">
                    <p className="text-2xl font-mono font-black text-[#121210]">{peakForecast.value}</p>
                    <span className="text-xs font-mono font-bold text-gray-700">{getDataTypeLabel(dataType)}</span>
                  </div>
                  <p className="text-[11px] font-sans text-[#121210] mt-1 flex items-center">
                    <span className="mr-1.5 font-bold">Driver:</span> {peakForecast.reason}
                  </p>
                </div>
                <div className="w-11 h-11 bg-white border-2 border-[#121210] shadow-[2px_2px_0_#121210] flex items-center justify-center shrink-0 ml-3">
                  <FiAlertCircle className="text-2xl text-[#E8A030]" />
                </div>
              </div>
            ) : (
              <div className="md:col-span-2 bg-[#E8F5EC] border-2 border-[#121210] p-3.5 shadow-[2px_2px_0_#121210] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase font-black px-1.5 py-0.5 bg-[#2E8C42] text-white border border-[#121210]">
                    NOMINAL LOAD
                  </span>
                  <p className="font-display font-bold text-sm text-[#121210] mt-1">Within Safe Grid Envelopes</p>
                  <p className="text-[11px] font-mono text-gray-600">No surge surcharge predicted for next cycle</p>
                </div>
                <div className="w-10 h-10 bg-white border-2 border-[#121210] flex items-center justify-center">
                  <FiCheckCircle className="text-xl text-[#2E8C42]" />
                </div>
              </div>
            )}
          </div>

          {/* Chart Area: Brutalist Approva Grid */}
          <div className="bg-[#FAFDFB] border-2 border-[#121210] p-4 shadow-[2px_2px_0_#121210]">
            <div className="flex items-center justify-between mb-3 border-b border-[#121210]/20 pb-2">
              <h4 className="text-xs font-display font-black uppercase tracking-wider text-[#121210] flex items-center">
                <FiTrendingUp className="mr-1.5 text-[#2E8C42]" />
                24-Hour Predictive Model vs Historical Baseline
              </h4>
              <span className="text-[10px] font-mono bg-white border border-[#121210] px-2 py-0.5 text-[#121210]">
                CONFIDENCE: 94.6%
              </span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E8C42" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#2E8C42" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" stroke="#121210" strokeOpacity={0.15} vertical={false} />
                  <XAxis dataKey="time" stroke="#121210" fontSize={10} fontFamily="Space Mono, monospace" tickMargin={6} />
                  <YAxis stroke="#121210" fontSize={10} fontFamily="Space Mono, monospace" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      borderColor: '#121210', 
                      borderWidth: '2px', 
                      boxShadow: '3px 3px 0 #121210', 
                      borderRadius: '0px', 
                      fontFamily: 'Space Mono, monospace', 
                      fontSize: '11px' 
                    }}
                  />
                  <Legend 
                    iconType="rect" 
                    wrapperStyle={{ fontSize: '11px', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600, paddingTop: '6px' }}
                  />
                  <Area type="monotone" dataKey="predicted" name="AI Forecast (kW)" stroke="#2E8C42" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPredicted)" />
                  <Line type="monotone" dataKey="baseline" name="Historical Baseline (Avg)" stroke="#121210" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Diagnostics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Feature 2: Predictive Maintenance */}
            <div className="bg-white border-2 border-[#121210] p-3.5 shadow-[2px_2px_0_#121210]">
              <div className="flex items-center justify-between mb-3 border-b border-[#121210]/20 pb-2">
                <h4 className="text-[11px] font-display font-black uppercase tracking-wider text-[#121210] flex items-center">
                  <FiSettings className="mr-1.5" /> Predictive Maintenance Ledger
                </h4>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#F4F9F5] border border-[#121210] text-[#121210]">
                  {maintenanceAlerts.length} QUEUED
                </span>
              </div>
              <div className="space-y-2.5 max-h-56 overflow-y-auto">
                {maintenanceAlerts.map(alert => (
                  <div key={alert.id} className="bg-[#FAFDFB] p-2.5 border border-[#121210]">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-display font-black text-[#121210]">{alert.equipment}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 font-mono uppercase font-black border border-[#121210] ${
                        alert.status === 'critical' ? 'bg-[#FADBD8] text-[#C03A3A]' : 'bg-[#FEF3E2] text-[#8C5D00]'
                      }`}>
                        ETA: {alert.eta}
                      </span>
                    </div>
                    <p className="text-[11px] font-sans text-gray-700 mb-2">{alert.issue}</p>
                    
                    {/* Brutalist Health Bar */}
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-mono uppercase font-bold text-gray-500 w-12">Integrity</span>
                      <div className="flex-1 h-2 bg-white border border-[#121210] overflow-hidden">
                        <div 
                          className={`h-full ${alert.status === 'critical' ? 'bg-[#C03A3A]' : 'bg-[#E8A030]'}`} 
                          style={{ width: `${alert.health}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#121210]">{alert.health}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 3: Anomaly Detection */}
            <div className="bg-white border-2 border-[#121210] p-3.5 shadow-[2px_2px_0_#121210]">
              <div className="flex items-center justify-between mb-3 border-b border-[#121210]/20 pb-2">
                <h4 className="text-[11px] font-display font-black uppercase tracking-wider text-[#121210] flex items-center">
                  <FiActivity className="mr-1.5" /> Detected Anomalies & Mitigations
                </h4>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#CFE8D6] border border-[#121210] text-[#121210] font-bold">
                  AUTO-LOGGED
                </span>
              </div>
              <div className="space-y-2.5 max-h-56 overflow-y-auto">
                {anomalies.map(anomaly => (
                  <div key={anomaly.id} className="bg-[#FAFDFB] p-2.5 border-2 border-[#121210]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-display font-black text-[#121210]">{anomaly.event}</span>
                      <span className="text-[9px] font-mono text-gray-600 bg-white px-1 border border-[#121210]/40">{anomaly.time}</span>
                    </div>
                    <p className="text-[11px] font-sans text-gray-700 mb-2">{anomaly.insight}</p>
                    <button className="text-[10px] font-display font-black uppercase tracking-wider w-full py-1 bg-[#CFE8D6] hover:bg-[#b8dcc2] text-[#121210] border border-[#121210] shadow-[1px_1px_0_#121210] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                      {anomaly.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  )
}

export default AIPredictions