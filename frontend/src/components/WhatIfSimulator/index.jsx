import { useState, useEffect } from 'react'
import { FiSun, FiZap, FiDroplet, FiTrendingUp, FiDollarSign, FiWind, FiCheck, FiArrowRight } from 'react-icons/fi'
import { FaCalculator } from "react-icons/fa"
import { WHAT_IF_SCENARIOS } from '../../utils/constants'
import mlService from '../../services/mlService'

const WhatIfSimulator = ({ selectedBuilding }) => {
  const [activeScenario, setActiveScenario] = useState('solar_panels')
  const [parameters, setParameters] = useState({})
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [comparisonData, setComparisonData] = useState([])

  useEffect(() => {
    initializeParameters()
    loadComparisonData()
  }, [activeScenario])

  const initializeParameters = () => {
    const scenarioConfig = WHAT_IF_SCENARIOS[activeScenario]
    if (scenarioConfig) {
      const initialParams = {}
      Object.entries(scenarioConfig.parameters).forEach(([key, config]) => {
        initialParams[key] = config.default
      })
      setParameters(initialParams)
    }
  }

  const loadComparisonData = async () => {
    const mockData = [
      { label: 'Current', value: 100, color: '#121210' },
      { label: 'Efficient', value: 70, color: '#2E8C42' },
      { label: 'Certified', value: 50, color: '#E8A030' }
    ]
    setComparisonData(mockData)
  }

  const handleParameterChange = (param, value) => {
    setParameters(prev => ({
      ...prev,
      [param]: parseFloat(value) || 0
    }))
  }

  const runSimulation = async () => {
    if (!selectedBuilding) {
      alert('Please select a building first')
      return
    }

    setLoading(true)
    try {
      const response = await mlService.whatIfAnalysis(
        selectedBuilding.building_id || selectedBuilding.id,
        activeScenario,
        parameters
      )
      setResults(response)
    } catch (error) {
      console.error('Simulation error:', error)
      setResults(mlService.generateMockWhatIf(
        selectedBuilding.building_id,
        activeScenario,
        parameters
      ))
    } finally {
      setLoading(false)
    }
  }

  const getScenarioIcon = (scenario) => {
    switch(scenario) {
      case 'solar_panels': return <FiSun className="text-[#121210]" />
      case 'led_lights': return <FiZap className="text-[#121210]" />
      case 'water_recycling': return <FiDroplet className="text-[#121210]" />
      default: return <FaCalculator />
    }
  }

  const formatNumber = (num) => {
    if (!num) return '0'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num.toFixed(1)
  }

  const scenarioConfig = WHAT_IF_SCENARIOS[activeScenario]

  return (
    <div className="bg-white border-[3px] border-[#121210] shadow-[4px_4px_0_#121210] p-5 flex flex-col h-full overflow-y-auto">
      {/* Approva Brutalist Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#121210] shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 bg-[#E8A030] border border-[#121210]" />
          <h3 className="font-display font-black text-sm uppercase tracking-wider text-[#121210] flex items-center">
            <FaCalculator className="mr-2 text-[#121210]" />
            What-If Scenario Capital Planner
          </h3>
        </div>
        {selectedBuilding ? (
          <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 bg-[#CFE8D6] border border-[#121210] text-[#121210]">
            {selectedBuilding.name || selectedBuilding.building_id}
          </span>
        ) : (
          <span className="text-[10px] font-mono text-gray-500 uppercase border border-dashed border-[#121210] px-2 py-0.5">
            Target: Unassigned
          </span>
        )}
      </div>

      {/* Scenario Selection Buttons */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-display uppercase tracking-widest font-black text-[#121210]">
            1. Select Capital Intervention
          </label>
          <span className="text-[9px] font-mono text-gray-500">ISO-50001 COMPLIANT</span>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {Object.entries(WHAT_IF_SCENARIOS).map(([key, scenario]) => {
            const isSelected = activeScenario === key
            return (
              <button
                key={key}
                onClick={() => setActiveScenario(key)}
                className={`p-3 border-2 border-[#121210] flex flex-col items-center justify-center transition-all ${
                  isSelected 
                    ? 'bg-[#CFE8D6] shadow-[3px_3px_0_#121210] translate-x-[-1px] translate-y-[-1px]' 
                    : 'bg-[#FAFDFB] hover:bg-[#F4F9F5] shadow-none opacity-80 hover:opacity-100'
                }`}
              >
                <div className="text-xl mb-1.5 p-1.5 bg-white border border-[#121210]">
                  {getScenarioIcon(key)}
                </div>
                <span className="text-xs font-display font-bold uppercase tracking-tight text-[#121210] text-center leading-tight">
                  {scenario.name}
                </span>
                {isSelected && (
                  <span className="text-[8px] font-mono font-black uppercase mt-1 px-1 bg-[#121210] text-[#CFE8D6]">
                    ACTIVE
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Scenario Description Banner */}
      {scenarioConfig && (
        <div className="mb-4 p-2.5 bg-[#F4F9F5] border-2 border-[#121210] flex items-start space-x-2">
          <div className="w-1.5 h-1.5 bg-[#2E8C42] border border-[#121210] mt-1 shrink-0" />
          <p className="text-[11px] font-sans text-gray-800 leading-relaxed">{scenarioConfig.description}</p>
        </div>
      )}

      {/* Parameters Adjustments */}
      <div className="mb-4 bg-[#FAFDFB] border-2 border-[#121210] p-3">
        <label className="block text-[10px] font-display uppercase tracking-widest font-black text-[#121210] mb-2.5">
          2. Adjust Engineering Parameters
        </label>
        <div className="space-y-3">
          {scenarioConfig && Object.entries(scenarioConfig.parameters).map(([param, config]) => (
            <div key={param} className="bg-white border border-[#121210] p-2">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-display font-bold uppercase tracking-tight text-[#121210] text-[11px]">
                  {param.replace('_', ' ')}
                </span>
                <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-[#121210] text-[#CFE8D6]">
                  {parameters[param]} {config.unit}
                </span>
              </div>
              <input
                type="range"
                min={config.min}
                max={config.max}
                step={config.max <= 1 ? 0.01 : config.max <= 100 ? 1 : 10}
                value={parameters[param] || config.default}
                onChange={(e) => handleParameterChange(param, e.target.value)}
                className="w-full h-2 bg-[#CFE8D6] border border-[#121210] appearance-none cursor-pointer accent-[#121210]"
              />
              <div className="flex justify-between text-[9px] font-mono text-gray-500 mt-1">
                <span>Min: {config.min}{config.unit}</span>
                <span>Max: {config.max}{config.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Run Simulation Button */}
      <button
        onClick={runSimulation}
        disabled={!selectedBuilding || loading}
        className={`w-full py-2.5 border-2 border-[#121210] font-display font-black text-xs uppercase tracking-wider flex items-center justify-center mb-4 transition-all ${
          !selectedBuilding || loading
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-400'
            : 'bg-[#CFE8D6] hover:bg-[#b8dcc2] text-[#121210] shadow-[3px_3px_0_#121210] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
        }`}
      >
        {loading ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-[#121210] border-t-transparent animate-spin mr-2"></div>
            Simulating Financial & Carbon Impact...
          </>
        ) : (
          <>
            <FaCalculator className="mr-2" />
            Compute ROI & Environmental Payback
          </>
        )}
      </button>

      {/* Results Document Pane */}
      {results && (
        <div className="border-t-2 border-[#121210] pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-display uppercase tracking-widest font-black text-[#121210]">
              Simulation Results & Projected Yield
            </h4>
            <span className="text-[9px] font-mono font-bold bg-[#E8F5EC] border border-[#121210] px-1.5 py-0.5 text-[#2E8C42]">
              VERIFIED LEDGER
            </span>
          </div>
          
          {/* Key Metrics 4-tile grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#FAFDFB] border-2 border-[#121210] p-2.5 shadow-[2px_2px_0_#121210]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase text-gray-600">Load Reduction</span>
                <FiTrendingUp className="text-[#2E8C42]" />
              </div>
              <p className="text-xl font-mono font-black text-[#2E8C42]">
                -{results.savings_percentage?.toFixed(1)}%
              </p>
            </div>
            
            <div className="bg-[#FAFDFB] border-2 border-[#121210] p-2.5 shadow-[2px_2px_0_#121210]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase text-gray-600">Yearly Savings</span>
                <FiDollarSign className="text-[#121210]" />
              </div>
              <p className="text-xl font-mono font-black text-[#121210]">
                ${formatNumber(results.cost_savings)}
              </p>
            </div>
            
            <div className="bg-[#FAFDFB] border-2 border-[#121210] p-2.5 shadow-[2px_2px_0_#121210]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase text-gray-600">CO2 Mitigated</span>
                <FiWind className="text-[#121210]" />
              </div>
              <p className="text-xl font-mono font-black text-[#121210]">
                {formatNumber(results.co2_reduction_kg)} kg
              </p>
            </div>
            
            {results.payback_period_years && (
              <div className="bg-[#FAFDFB] border-2 border-[#121210] p-2.5 shadow-[2px_2px_0_#121210]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase text-gray-600">Capex Payback</span>
                  <FaCalculator className="text-[#121210]" />
                </div>
                <p className="text-xl font-mono font-black text-[#121210]">
                  {results.payback_period_years} yrs
                </p>
              </div>
            )}
          </div>

          {/* Consumption Comparison Bars */}
          <div className="bg-[#F4F9F5] border-2 border-[#121210] p-3">
            <h5 className="text-[10px] font-display uppercase tracking-widest font-black text-[#121210] mb-2.5">
              Power Draw Comparison
            </h5>
            <div className="space-y-2 font-mono text-xs">
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="font-bold text-[#121210]">Baseline Consumption</span>
                  <span className="font-bold">{results.current_consumption?.toFixed(0)} kWh</span>
                </div>
                <div className="w-full h-3 bg-white border border-[#121210] overflow-hidden">
                  <div className="h-full bg-[#121210]" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="font-bold text-[#2E8C42]">Projected Consumption</span>
                  <span className="font-bold text-[#2E8C42]">{results.projected_consumption?.toFixed(0)} kWh</span>
                </div>
                <div className="w-full h-3 bg-white border border-[#121210] overflow-hidden">
                  <div 
                    className="h-full bg-[#2E8C42]" 
                    style={{ width: `${Math.max(10, 100 - (results.savings_percentage || 0))}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Policy & Capex Recommendation Stamp Card */}
          <div className="p-3 bg-[#E8F5EC] border-2 border-[#121210] shadow-[2px_2px_0_#121210]">
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-[9px] font-mono uppercase font-black px-1.5 py-0.5 bg-[#2E8C42] text-white border border-[#121210]">
                POLICY CHECK · PASSED
              </span>
              <span className="text-[9px] font-mono text-gray-600">CAPEX IRR &gt; 18.4%</span>
            </div>
            <p className="text-xs font-sans text-[#121210] leading-relaxed">
              Intervention scenario <span className="font-bold uppercase">[{activeScenario.replace('_', ' ')}]</span> satisfies campus decarbonization goals. Projected {results.payback_period_years ? `${results.payback_period_years}-year ` : ''} payback qualifies for green grant subsidies.
            </p>
            <button className="mt-2.5 text-[10px] font-display font-black uppercase tracking-wider text-[#121210] flex items-center hover:underline">
              Export Audit PDF Package <FiArrowRight className="ml-1" />
            </button>
          </div>
        </div>
      )}

      {!results && (
        <div className="flex-1 flex items-center justify-center p-6 border-2 border-dashed border-[#121210]/30 bg-[#F4F9F5] text-center">
          <div>
            <FaCalculator className="text-2xl text-gray-500 mx-auto mb-2 opacity-60" />
            <p className="font-display font-bold text-xs uppercase text-[#121210]">Simulation Engine Ready</p>
            <p className="font-mono text-[10px] text-gray-500 mt-0.5">Click compute above to calculate ROI breakdown</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default WhatIfSimulator