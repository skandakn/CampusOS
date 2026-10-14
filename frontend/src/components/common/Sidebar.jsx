import { useState, useMemo } from 'react'
import { FiSearch, FiFilter, FiX, FiCheck, FiExternalLink, FiAlertTriangle, FiGrid, FiMap, FiSettings, FiEye } from 'react-icons/fi'
import { TbBuildingCommunity } from 'react-icons/tb'

const Sidebar = ({
  stats = [],
  selectedBuilding,
  onBuildingSelect,
  onNavigateTo3D,
  activeView = 'dashboard',
  onViewChange,
  activeTab = 'overview',
  onTabChange
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredBuildings = useMemo(() => {
    return stats.filter((building) => {
      const searchString = `${building.name || ''} ${building.building_id || ''} ${building.type || ''}`.toLowerCase()
      const matchesSearch = searchString.includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || building.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [stats, searchQuery, statusFilter])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'good':
        return <span className="stamp text-[#2E8C42] border-[#2E8C42] text-[9px] bg-white">OPTIMAL</span>
      case 'warning':
        return <span className="stamp text-[#E8A030] border-[#E8A030] text-[9px] bg-white">WARNING</span>
      case 'critical':
        return <span className="stamp text-[#C03A3A] border-[#C03A3A] text-[9px] bg-white">CRITICAL</span>
      default:
        return <span className="stamp text-[#121210]/60 border-[#121210]/60 text-[9px] bg-white">UNKNOWN</span>
    }
  }

  const optimalCount = stats.filter((b) => b.status === 'good').length
  const warningCount = stats.filter((b) => b.status === 'warning').length
  const criticalCount = stats.filter((b) => b.status === 'critical').length

  return (
    <aside className="w-[300px] shrink-0 bg-[#CFE8D6] border-r-[3px] border-[#121210] flex flex-col h-full z-20">
      {/* Primary Sidebar Navigation */}
      <div className="p-3.5 border-b-[3px] border-[#121210] bg-[#CFE8D6] shrink-0 space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <div className="text-[10px] font-mono tracking-widest text-[#121210]/70 uppercase font-bold">
            CAMPUS NAVIGATION
          </div>
          <span className="tag bg-[#2E8C42] text-white text-[8px] py-0 px-1 font-mono">
            SYS ONLINE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 font-sans">
          <button
            onClick={() => {
              if (onViewChange) onViewChange('dashboard')
              if (onTabChange) onTabChange('overview')
            }}
            className={`px-2.5 py-2 border-2 border-[#121210] font-display font-bold text-xs uppercase flex items-center justify-center gap-1.5 btn-press ${
              activeView === 'dashboard' && activeTab === 'overview'
                ? 'bg-[#121210] text-white shadow-[2px_2px_0_#121210]'
                : 'bg-white text-[#121210] shadow-[2px_2px_0_#121210] hover:bg-[#CFE8D6]'
            }`}
            title="Open Campus Analytics & Telemetry Dashboard"
          >
            <FiGrid className="text-xs shrink-0" />
            <span className="truncate">Dashboard</span>
          </button>

          <button
            onClick={() => {
              if (onViewChange) onViewChange('dashboard')
              if (onTabChange) onTabChange('intelligence')
            }}
            className={`px-2.5 py-2 border-2 border-[#121210] font-display font-bold text-xs uppercase flex items-center justify-center gap-1.5 btn-press ${
              activeView === 'dashboard' && activeTab === 'intelligence'
                ? 'bg-[#121210] text-white shadow-[2px_2px_0_#121210]'
                : 'bg-white text-[#121210] shadow-[2px_2px_0_#121210] hover:bg-[#CFE8D6]'
            }`}
            title="Open Campus Intelligence Center"
          >
            <FiEye className="text-xs shrink-0" />
            <span className="truncate">Intelligence</span>
          </button>

          <button
            onClick={() => {
              if (onViewChange) onViewChange('3d')
            }}
            className={`px-2.5 py-2 border-2 border-[#121210] font-display font-bold text-xs uppercase flex items-center justify-center gap-1.5 btn-press ${
              activeView === '3d'
                ? 'bg-[#121210] text-white shadow-[2px_2px_0_#121210]'
                : 'bg-white text-[#121210] shadow-[2px_2px_0_#121210] hover:bg-[#CFE8D6]'
            }`}
            title="Open 3D Campus Digital Twin"
          >
            <FiMap className="text-xs shrink-0" />
            <span className="truncate">3D Campus</span>
          </button>

          <button
            onClick={() => {
              if (onViewChange) onViewChange('operations')
            }}
            className={`px-2.5 py-2 border-2 border-[#121210] font-display font-bold text-xs uppercase flex items-center justify-center gap-1.5 btn-press ${
              activeView === 'operations'
                ? 'bg-[#121210] text-white shadow-[2px_2px_0_#121210]'
                : 'bg-white text-[#121210] shadow-[2px_2px_0_#121210] hover:bg-[#CFE8D6]'
            }`}
            title="Open Operations Command Center"
          >
            <FiSettings className="text-xs shrink-0" />
            <span className="truncate">Operations</span>
          </button>
        </div>
      </div>

      {/* Header section & Search */}
      <div className="p-4 border-b-[3px] border-[#121210] bg-[#CFE8D6] space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-mono tracking-widest text-[#121210]/70 uppercase font-bold">
            BUILDING QUEUE
          </div>
          <span className="tag bg-[#FFFFFF] text-[10px] py-0.5">
            {filteredBuildings.length} OF {stats.length}
          </span>
        </div>

        {/* Brutalist Search Bar */}
        <div className="relative">
          <div className="flex items-center border-2 border-[#121210] bg-[#FFFFFF] shadow-[3px_3px_0_#121210] px-2.5 py-1.5">
            <FiSearch className="text-[#121210] mr-2 text-sm shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter node or building..."
              className="w-full bg-transparent text-xs font-mono text-[#121210] placeholder-[#121210]/40 outline-none"
            />
            {searchQuery ? (
              <button onClick={() => setSearchQuery('')} className="text-[#121210]/60 hover:text-[#121210]">
                <FiX className="text-xs" />
              </button>
            ) : (
              <span className="text-[9px] font-mono border border-[#121210] px-1 py-0.2 bg-[#CFE8D6]">
                ⌘K
              </span>
            )}
          </div>
        </div>

        {/* Filter Filter Buttons */}
        <div className="flex items-center gap-1.5 font-mono text-[10.5px]">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2 py-0.5 border-2 border-[#121210] font-bold btn-press ${
              statusFilter === 'all'
                ? 'bg-[#121210] text-[#FFFFFF] shadow-[2px_2px_0_#121210]'
                : 'bg-[#FFFFFF] text-[#121210]'
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setStatusFilter('good')}
            className={`px-2 py-0.5 border-2 border-[#121210] font-bold btn-press ${
              statusFilter === 'good'
                ? 'bg-[#2E8C42] text-white shadow-[2px_2px_0_#121210]'
                : 'bg-[#FFFFFF] text-[#2E8C42]'
            }`}
          >
            OPT ({optimalCount})
          </button>
          <button
            onClick={() => setStatusFilter('warning')}
            className={`px-2 py-0.5 border-2 border-[#121210] font-bold btn-press ${
              statusFilter === 'warning'
                ? 'bg-[#E8A030] text-[#121210] shadow-[2px_2px_0_#121210]'
                : 'bg-[#FFFFFF] text-[#E8A030]'
            }`}
          >
            WARN ({warningCount})
          </button>
          <button
            onClick={() => setStatusFilter('critical')}
            className={`px-2 py-0.5 border-2 border-[#121210] font-bold btn-press ${
              statusFilter === 'critical'
                ? 'bg-[#C03A3A] text-white shadow-[2px_2px_0_#121210]'
                : 'bg-[#FFFFFF] text-[#C03A3A]'
            }`}
          >
            CRIT ({criticalCount})
          </button>
        </div>
      </div>

      {/* Buildings Cards List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#CFE8D6]">
        {filteredBuildings.map((building) => {
          const isSelected = selectedBuilding?.building_id === building.building_id
          const code = (building.building_id || 'BLDG-0').replace('_', '-').toUpperCase()

          return (
            <article
              key={building.building_id}
              onClick={() => onBuildingSelect(building)}
              className={`p-3.5 relative cursor-pointer border-[3px] border-[#121210] transition-all btn-press ${
                isSelected
                  ? 'bg-[#FFFFFF] shadow-[6px_6px_0_#121210] -translate-x-1 -translate-y-1'
                  : 'bg-[#FFFFFF] shadow-[4px_4px_0_#121210] hover:shadow-[6px_6px_0_#121210] hover:-translate-x-0.5 hover:-translate-y-0.5'
              }`}
            >
              {/* Corner Tag */}
              <span className="absolute -top-2.5 -left-2 bg-[#FFFFFF] border-2 border-[#121210] px-1.5 py-0.2 text-[9px] font-mono font-bold shadow-[2px_2px_0_#121210]">
                {code}
              </span>

              <div className="flex justify-between items-start mt-1">
                <div>
                  <h3 className="font-display font-bold text-sm text-[#121210] leading-tight">
                    {building.name || `Building ${building.building_id.split('_')[1]}`}
                  </h3>
                  <div className="text-[11px] font-mono text-[#121210]/60 capitalize mt-0.5">
                    {building.type || 'Academic Hub'}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-lg text-[#121210] leading-tight">
                    {building.sustainability_score || 0}
                    <span className="text-[10px] text-[#121210]/60 font-normal">/100</span>
                  </div>
                  <div className="mt-1">{getStatusBadge(building.status)}</div>
                </div>
              </div>

              {/* Metric tags */}
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                <span className="tag bg-[#CFE8D6] text-[9.5px] py-0.5 px-1.5">
                  ⚡ {Math.round(building.avg_energy || 0)} kWh
                </span>
                <span className="tag bg-[#FFFFFF] text-[9.5px] py-0.5 px-1.5">
                  💧 {Math.round(building.water_usage || 0)} L
                </span>
              </div>

              {/* Warning Reason Alert if in warning or critical */}
              {building.status !== 'good' && (
                <div className={`mt-2 p-1.5 border text-[9px] font-mono flex items-center justify-between ${
                  building.status === 'critical'
                    ? 'border-[#C03A3A] bg-[#C03A3A]/10 text-[#C03A3A]'
                    : 'border-[#E8A030] bg-[#E8A030]/10 text-[#121210]'
                }`}>
                  <span className="font-bold flex items-center gap-1">
                    <FiAlertTriangle className="text-xs" />
                    {building.avg_energy > 120 ? 'Energy draw > 120 kWh' :
                     building.water_usage > 280 ? 'Water draft > 280 L' :
                     'CO₂ air threshold alert'}
                  </span>
                  {onNavigateTo3D && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onBuildingSelect(building)
                        onNavigateTo3D(building.building_id)
                      }}
                      className="underline font-bold text-[8.5px] hover:text-[#2E8C42]"
                    >
                      3D TWIN ↗
                    </button>
                  )}
                </div>
              )}

              {/* Status Stepper / Indicators (Approva Chain Node style) */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#121210]/20">
                <div className="text-[9.5px] font-mono text-[#121210]/60">
                  OCC: <span className="font-bold text-[#121210]">{building.occupancy || 0}</span>
                </div>

                <div className="flex items-center gap-1">
                  <span
                    className={`chain-node ${
                      (building.avg_energy || 0) < 120
                        ? 'bg-[#2E8C42] text-white'
                        : 'bg-[#E8A030] text-[#121210]'
                    }`}
                    title="Energy Threshold"
                  >
                    E
                  </span>
                  <span className="chain-line"></span>
                  <span
                    className={`chain-node ${
                      (building.water_usage || 0) < 300
                        ? 'bg-[#2E8C42] text-white'
                        : 'bg-[#E8A030] text-[#121210]'
                    }`}
                    title="Water Conservation"
                  >
                    W
                  </span>
                  <span className="chain-line"></span>
                  <span
                    className={`chain-node ${
                      building.status === 'critical'
                        ? 'bg-[#C03A3A] text-white'
                        : 'bg-[#2E8C42] text-white'
                    }`}
                    title="Health Check"
                  >
                    {building.status === 'critical' ? '!' : '✓'}
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Sidebar Footer: Summary & Auditor info */}
      <div className="p-3.5 border-t-[3px] border-[#121210] bg-[#CFE8D6] space-y-3">
        <div className="border-2 border-[#121210] bg-[#FFFFFF] shadow-[3px_3px_0_#121210] p-2.5">
          <div className="text-[9px] font-mono tracking-widest text-[#121210]/60 uppercase">
            CAMPUS TELEMETRY · HEALTH
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono font-bold text-2xl text-[#121210]">
              {optimalCount}/{stats.length}
            </span>
            <span className="text-[10px] font-mono text-[#2E8C42] font-bold">
              {Math.round((optimalCount / (stats.length || 1)) * 100)}% OPTIMAL
            </span>
          </div>

          <div className="mt-2 h-2.5 border-2 border-[#121210] flex overflow-hidden">
            <div
              style={{ width: `${(optimalCount / (stats.length || 1)) * 100}%` }}
              className="bg-[#2E8C42]"
            ></div>
            <div
              style={{ width: `${(warningCount / (stats.length || 1)) * 100}%` }}
              className="bg-[#E8A030]"
            ></div>
            <div
              style={{ width: `${(criticalCount / (stats.length || 1)) * 100}%` }}
              className="bg-[#C03A3A]"
            ></div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-1">
          <div className="w-8 h-8 border-2 border-[#121210] bg-[#121210] text-[#FFFFFF] flex items-center justify-center font-display font-bold text-xs shadow-[2px_2px_0_#121210]">
            OP
          </div>
          <div>
            <div className="text-xs font-display font-bold leading-tight text-[#121210]">
              Chief Operations Officer
            </div>
            <div className="text-[9.5px] font-mono text-[#121210]/60">
              AUDIT VERIFIED · SHA-256
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar