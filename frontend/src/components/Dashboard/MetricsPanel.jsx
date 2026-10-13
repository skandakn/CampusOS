import { useState } from 'react'
import { FiZap, FiDroplet, FiUsers, FiThermometer, FiWind, FiSun, FiArrowRight } from 'react-icons/fi'

const MetricsPanel = () => {
  const [activeMetric, setActiveMetric] = useState('energy')
  
  const metrics = {
    energy: {
      icon: FiZap,
      name: 'Energy Consumption',
      unit: 'kWh',
      current: 15420,
      target: 12000,
      trend: 'down',
      change: -8.5,
      data: [200, 180, 220, 190, 210, 195, 205]
    },
    water: {
      icon: FiDroplet,
      name: 'Water Usage',
      unit: 'L',
      current: 45600,
      target: 40000,
      trend: 'up',
      change: 3.2,
      data: [400, 380, 420, 390, 410, 395, 405]
    },
    occupancy: {
      icon: FiUsers,
      name: 'Occupancy',
      unit: 'people',
      current: 1250,
      target: 1500,
      trend: 'stable',
      change: 0.5,
      data: [1200, 1250, 1300, 1220, 1280, 1240, 1260]
    },
    temperature: {
      icon: FiThermometer,
      name: 'Avg. Temperature',
      unit: '°C',
      current: 22.5,
      target: 21,
      trend: 'up',
      change: 1.5,
      data: [20, 21, 23, 22, 24, 23, 22]
    },
    co2: {
      icon: FiWind,
      name: 'CO2 Levels',
      unit: 'ppm',
      current: 650,
      target: 500,
      trend: 'down',
      change: -5.2,
      data: [700, 680, 650, 670, 640, 660, 650]
    }
  }

  const currentMetric = metrics[activeMetric]

  return (
    <div className="bg-white border-[3px] border-[#121210] shadow-[4px_4px_0_#121210] p-4 flex flex-col h-full overflow-y-auto">
      {/* Approva Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3.5 border-b-2 border-[#121210] shrink-0">
        <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#121210] flex items-center">
          <span className="w-2 h-2 bg-[#2E8C42] border border-[#121210] mr-2" />
          Sub-System Telemetry Specs
        </h3>
        <span className="text-[9px] font-mono font-bold bg-[#CFE8D6] border border-[#121210] px-1.5 py-0.2 text-[#121210]">
          SENSORS ACTIVE
        </span>
      </div>
      
      {/* Metric Selector Tabs */}
      <div className="flex space-x-1.5 mb-4 overflow-x-auto pb-1">
        {Object.entries(metrics).map(([key, metric]) => {
          const isSelected = activeMetric === key
          const Icon = metric.icon
          return (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`px-2.5 py-1 text-[11px] font-display font-bold uppercase tracking-tight flex items-center space-x-1.5 whitespace-nowrap border-2 border-[#121210] transition-all ${
                isSelected 
                  ? 'bg-[#CFE8D6] text-[#121210] shadow-[2px_2px_0_#121210]' 
                  : 'bg-[#FAFDFB] text-gray-700 hover:bg-[#F4F9F5]'
              }`}
            >
              <Icon className="text-xs" />
              <span>{metric.name.split(' ')[0]}</span>
            </button>
          )
        })}
      </div>
      
      {/* Current Metric Details */}
      <div className="space-y-4">
        {/* Metric Readout Card */}
        <div className="bg-[#FAFDFB] border-2 border-[#121210] p-3 text-center shadow-[2px_2px_0_#121210]">
          <span className="text-[10px] font-mono uppercase text-gray-500 font-bold block mb-1">
            {currentMetric.name} Telemetry
          </span>
          <div className="flex items-center justify-center space-x-2">
            <currentMetric.icon className="text-xl text-[#121210]" />
            <p className="text-2xl font-mono font-black text-[#121210]">
              {currentMetric.current.toLocaleString()}{' '}
              <span className="text-xs font-normal text-gray-600">{currentMetric.unit}</span>
            </p>
          </div>
        </div>
        
        {/* Target Comparison Bar */}
        <div className="bg-white border-2 border-[#121210] p-3">
          <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
            <span className="text-gray-700 text-[11px]">
              Threshold: <span className="font-bold text-[#121210]">{currentMetric.target.toLocaleString()} {currentMetric.unit}</span>
            </span>
            <span className={`text-[10px] font-black px-1.5 py-0.2 border border-[#121210] ${
              currentMetric.trend === 'down' ? 'bg-[#E8F5EC] text-[#2E8C42]' : 'bg-[#FADBD8] text-[#C03A3A]'
            }`}>
              {currentMetric.trend === 'down' ? '▼' : '▲'} {Math.abs(currentMetric.change)}%
            </span>
          </div>
          <div className="h-2.5 bg-white border border-[#121210] overflow-hidden p-0.2">
            <div 
              className={`h-full ${
                currentMetric.current <= currentMetric.target ? 'bg-[#2E8C42]' : 'bg-[#C03A3A]'
              }`}
              style={{ 
                width: `${Math.min(100, (currentMetric.current / currentMetric.target) * 100)}%` 
              }}
            ></div>
          </div>
          <div className="flex justify-between text-[9px] font-mono text-gray-500 mt-1">
            <span>0</span>
            <span>Target: {currentMetric.target.toLocaleString()}</span>
            <span>Ceiling: {currentMetric.target * 2}</span>
          </div>
        </div>
        
        {/* Weekly Trend Bar Chart */}
        <div className="bg-[#FAFDFB] border-2 border-[#121210] p-3">
          <div className="flex justify-between items-center mb-2 border-b border-[#121210]/20 pb-1">
            <h4 className="text-[10px] font-display font-black uppercase tracking-wider text-[#121210]">
              7-Day Variance Sample
            </h4>
            <span className="text-[9px] font-mono text-gray-600">HISTOGRAM</span>
          </div>
          <div className="h-20 flex items-end space-x-1.5 pt-1">
            {currentMetric.data.map((value, index) => {
              const maxValue = Math.max(...currentMetric.data)
              const height = (value / maxValue) * 100
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-[#121210] border border-[#121210] transition-all hover:bg-[#2E8C42]"
                    style={{ height: `${height}%` }}
                    title={`${value} ${currentMetric.unit}`}
                  ></div>
                  <span className="text-[9px] font-mono text-gray-700 mt-1">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Approva Style Policy / Optimization Rules */}
        <div className="bg-[#E8F5EC] border-2 border-[#121210] p-3 shadow-[2px_2px_0_#121210]">
          <div className="flex items-center space-x-1.5 mb-1.5">
            <span className="text-[9px] font-mono uppercase font-black px-1 py-0.2 bg-[#2E8C42] text-white border border-[#121210]">
              FACILITY POLICY
            </span>
            <span className="text-[10px] font-display font-bold uppercase text-[#121210]">Operational Protocol</span>
          </div>
          <ul className="text-xs font-sans text-gray-800 space-y-1">
            {activeMetric === 'energy' && (
              <>
                <li className="flex items-start">• Retrofit high-density wings to daylight harvesting</li>
                <li className="flex items-start">• Restrict chilled water loops after 21:00 hours</li>
              </>
            )}
            {activeMetric === 'water' && (
              <>
                <li className="flex items-start">• Aerator throttles enforced at 1.8 L/min</li>
                <li className="flex items-start">• Automated greywater purge cycle active</li>
              </>
            )}
            {activeMetric === 'co2' && (
              <>
                <li className="flex items-start">• Dynamic air dampers trigger at &gt; 800 ppm</li>
                <li className="flex items-start">• Continuous particulate air filtration verification</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MetricsPanel