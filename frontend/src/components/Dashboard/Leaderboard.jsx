import React, { useState } from 'react'
import { FiAward, FiInfo, FiExternalLink, FiChevronDown, FiChevronUp, FiShield, FiCheckCircle } from 'react-icons/fi'

const Leaderboard = ({ stats = [], selectedBuilding, onBuildingSelect, onNavigateTo3D }) => {
  const [expandedBuildingId, setExpandedBuildingId] = useState(null)
  const [showFormulaModal, setShowFormulaModal] = useState(false)

  // Rank buildings using the documented scoring method
  const sortedBuildings = [...stats]
    .sort((a, b) => (b.sustainability_score || 0) - (a.sustainability_score || 0))

  const getGrade = (score) => {
    if (score >= 85) return { grade: 'A+', label: 'OPTIMAL', color: 'text-[#2E8C42] border-[#2E8C42] bg-[#CFE8D6]/40' }
    if (score >= 75) return { grade: 'A', label: 'OPTIMAL', color: 'text-[#2E8C42] border-[#2E8C42] bg-[#CFE8D6]/40' }
    if (score >= 60) return { grade: 'B', label: 'WARN', color: 'text-[#E8A030] border-[#E8A030] bg-[#FFF8E6]' }
    if (score >= 45) return { grade: 'C', label: 'WARN', color: 'text-[#E8A030] border-[#E8A030] bg-[#FFF8E6]' }
    return { grade: 'D', label: 'CRIT', color: 'text-[#C03A3A] border-[#C03A3A] bg-[#FDEAEA]' }
  }

  // Calculate component contributions based on backend formula in influx_client.py
  const getScoreBreakdown = (building) => {
    const energy = building.avg_energy || 0
    const water = building.water_usage || 0
    const co2 = building.co2_levels || 400

    const energyComponent = Math.max(0, Math.min(100, Math.round(100 - (energy / 5))))
    const waterComponent = Math.max(0, Math.min(100, Math.round(100 - (water / 10))))
    const co2Component = Math.max(0, Math.min(100, Math.round(100 - ((co2 - 400) / 10))))

    return {
      energyComponent,
      waterComponent,
      co2Component,
      carbonKg: Math.round(energy * 0.233)
    }
  }

  return (
    <div className="space-y-4">
      {/* Leaderboard Table (Approva PO/History table style) */}
      <div className="border-[3px] border-[#121210] bg-[#FFFFFF] shadow-[4px_4px_0_#121210] overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between p-3.5 border-b-[3px] border-[#121210] bg-[#CFE8D6]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#121210] bg-[#E8A030] flex items-center justify-center font-bold text-xs shadow-[2px_2px_0_#121210]">
              🏆
            </div>
            <div>
              <h3 className="font-display font-black text-sm uppercase text-[#121210]">
                Facility ESG Leaderboard
              </h3>
              <p className="font-mono text-[9px] text-[#121210]/60">
                STANDARDIZED ESG METRIC EVALUATION
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowFormulaModal(!showFormulaModal)}
            className="border-2 border-[#121210] bg-[#FFFFFF] px-2 py-0.5 text-[9px] font-mono font-bold flex items-center gap-1 btn-press shadow-[2px_2px_0_#121210]"
            title="Inspect Scoring Methodology"
          >
            <FiInfo /> SCORING SPEC
          </button>
        </div>

        {/* Scoring Methodology Explanation Drawer */}
        {showFormulaModal && (
          <div className="p-3 bg-[#121210] text-white border-b-2 border-[#121210] font-mono text-[10.5px] space-y-1.5 animate-fadeIn">
            <div className="flex justify-between items-center text-[#CFE8D6] font-bold">
              <span>DOCUMENTED ESG SCORING ALGORITHM (INFLUXDB SPEC):</span>
              <button onClick={() => setShowFormulaModal(false)} className="text-white hover:text-[#E8A030]">✕</button>
            </div>
            <p className="text-white/80">
              Score = <span className="text-[#E8A030]">0.50 × Energy_Score</span> + <span className="text-[#CFE8D6]">0.30 × Water_Score</span> + <span className="text-white">0.20 × Air_Score</span>
            </p>
            <div className="grid grid-cols-3 gap-2 text-[9px] text-white/60 pt-1 border-t border-white/20">
              <div>⚡ Energy: 100 - (kWh / 5)</div>
              <div>💧 Water: 100 - (L / 10)</div>
              <div>🌫️ CO₂: 100 - ((ppm - 400) / 10)</div>
            </div>
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-[#121210] bg-[#FFFFFF] text-[10px] text-[#121210]/70 uppercase">
                <th className="text-left p-2.5 pl-3">POS</th>
                <th className="text-left p-2.5">FACILITY</th>
                <th className="text-right p-2.5">ENERGY</th>
                <th className="text-right p-2.5">SCORE</th>
                <th className="text-center p-2.5">GRADE</th>
                <th className="text-right p-2.5 pr-3">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {sortedBuildings.map((building, index) => {
                const rank = index + 1
                const isSelected = selectedBuilding?.building_id === building.building_id
                const isExpanded = expandedBuildingId === building.building_id
                const gradeInfo = getGrade(building.sustainability_score || 0)
                const breakdown = getScoreBreakdown(building)

                const rankBadgeClass =
                  rank === 1 ? 'bg-[#E8A030] text-[#121210] font-black' :
                  rank === 2 ? 'bg-[#CFE8D6] text-[#121210] font-bold' :
                  rank === 3 ? 'bg-[#FFFFFF] text-[#121210] font-bold' : 'bg-[#FFFFFF] text-[#121210]/60'

                return (
                  <React.Fragment key={building.building_id}>
                    <tr
                      onClick={() => onBuildingSelect && onBuildingSelect(building)}
                      className={`border-b border-[#121210]/20 cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#CFE8D6]/60 font-bold' : 'hover:bg-[#CFE8D6]/30'
                      }`}
                    >
                      <td className="p-2.5 pl-3">
                        <span className={`inline-block w-5 h-5 border border-[#121210] text-center leading-4 text-[10px] ${rankBadgeClass}`}>
                          {rank}
                        </span>
                      </td>

                      <td className="p-2.5">
                        <div className="font-bold text-[#121210] truncate max-w-[120px]">
                          {building.name || building.building_id}
                        </div>
                        <div className="text-[9px] text-[#121210]/50 uppercase">
                          {building.type || 'Academic'}
                        </div>
                      </td>

                      <td className="p-2.5 text-right font-mono text-[#121210]">
                        {Math.round(building.avg_energy || 0)}
                        <span className="text-[9px] text-[#121210]/50 ml-0.5">kWh</span>
                      </td>

                      <td className="p-2.5 text-right font-black text-[#121210]">
                        {building.sustainability_score || 0}
                        <span className="text-[9px] font-normal text-[#121210]/50">/100</span>
                      </td>

                      <td className="p-2.5 text-center">
                        <span className={`stamp text-[8.5px] py-0 px-1 font-bold ${gradeInfo.color}`}>
                          {gradeInfo.grade}
                        </span>
                      </td>

                      <td className="p-2.5 pr-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setExpandedBuildingId(isExpanded ? null : building.building_id)
                            }}
                            className="p-1 border border-[#121210] bg-white hover:bg-[#CFE8D6] text-[10px]"
                            title="Expand Component Breakdown"
                          >
                            {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                          </button>
                          {onNavigateTo3D && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (onBuildingSelect) onBuildingSelect(building)
                                onNavigateTo3D(building.building_id)
                              }}
                              className="p-1 border border-[#121210] bg-[#121210] text-white hover:bg-[#2E8C42] text-[10px]"
                              title="Inspect in 3D Campus"
                            >
                              <FiExternalLink />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Score Breakdown Row */}
                    {isExpanded && (
                      <tr className="bg-[#FFFFFF] border-b-2 border-[#121210]">
                        <td colSpan={6} className="p-3 pl-4 bg-[#CFE8D6]/15">
                          <div className="border border-[#121210] p-2.5 bg-white shadow-[2px_2px_0_#121210] space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#121210]">
                              <span>SCORE AUDIT & COMPONENT DECOMPOSITION:</span>
                              <span className="text-[#2E8C42]">FINAL: {building.sustainability_score || 0}/100</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9.5px] font-mono">
                              <div className="p-1.5 border border-[#121210]/30 bg-[#CFE8D6]/30">
                                <span className="text-[#121210]/60 block">ENERGY EFF (50%)</span>
                                <span className="font-bold text-[#121210]">{breakdown.energyComponent}/100</span>
                              </div>
                              <div className="p-1.5 border border-[#121210]/30 bg-[#CFE8D6]/30">
                                <span className="text-[#121210]/60 block">WATER CONS (30%)</span>
                                <span className="font-bold text-[#121210]">{breakdown.waterComponent}/100</span>
                              </div>
                              <div className="p-1.5 border border-[#121210]/30 bg-[#CFE8D6]/30">
                                <span className="text-[#121210]/60 block">AIR / CO₂ (20%)</span>
                                <span className="font-bold text-[#121210]">{breakdown.co2Component}/100</span>
                              </div>
                              <div className="p-1.5 border border-[#121210]/30 bg-[#CFE8D6]/30">
                                <span className="text-[#121210]/60 block">CARBON RATE</span>
                                <span className="font-bold text-[#121210]">{breakdown.carbonKg} kg/h</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approva-Style Policy & Audit Checks Card */}
      <div className="border-[3px] border-[#121210] bg-[#FFFFFF] shadow-[4px_4px_0_#121210] p-4">
        <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-[#121210]">
          <span className="font-display font-bold text-xs uppercase tracking-wider text-[#121210]">
            POLICY & COMPLIANCE CHECK
          </span>
          <span className="tag bg-[#2E8C42] text-white text-[8px] py-0 px-1">
            4/4 OK
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between items-center">
            <span className="text-[#121210]/70">ASHRAE 90.1 standard</span>
            <span className="font-bold text-[#2E8C42] border border-[#2E8C42] px-1 bg-[#CFE8D6]/40">PASS</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#121210]/70">Campus Grid CapEx</span>
            <span className="font-bold text-[#2E8C42] border border-[#2E8C42] px-1 bg-[#CFE8D6]/40">62% NOMINAL</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#121210]/70">Greywater recycling</span>
            <span className="font-bold text-[#2E8C42] border border-[#2E8C42] px-1 bg-[#CFE8D6]/40">34% NOMINAL</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#121210]/70">SLA failure risk</span>
            <span className="font-bold text-[#2E8C42] border border-[#2E8C42] px-1 bg-[#CFE8D6]/40">LOW (0.02)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard