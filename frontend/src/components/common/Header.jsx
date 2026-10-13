import React from 'react'
import { FiGrid, FiMap, FiSettings, FiBell, FiShield, FiCpu } from 'react-icons/fi'
import { TbBuildingCommunity } from 'react-icons/tb'
import SimulationControl from './SimulationControl'

const Header = ({ connected, onSimulate, activeView, onViewChange }) => {
  return (
    <header className="bg-[#CFE8D6] border-b-[3px] border-[#121210] px-6 py-3.5 shrink-0 z-30">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand & Badges */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[#2E8C42] border-2 border-[#121210] shadow-[3px_3px_0_#121210] flex items-center justify-center text-white">
              <TbBuildingCommunity className="text-2xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xl tracking-tight text-[#121210]">
                  CampusOS
                </span>
                <span className="tag bg-[#FFFFFF] text-[9.5px] py-0.5 px-1.5 font-mono">
                  v2.4 · OPS
                </span>
              </div>
              <div className="text-[10.5px] font-mono tracking-widest text-[#121210]/60 uppercase">
                Sustainable Campus Digital Twin
              </div>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2 ml-2">
            <span className="tag bg-[#FFFFFF]">
              <span className="w-2 h-2 rounded-full bg-[#2E8C42]"></span>
              10 NODES
            </span>
            <span className="tag bg-[#E8A030] text-[#121210]">
              <FiCpu className="text-xs" />
              AI FORECASTING
            </span>
          </div>
        </div>

        {/* Center: View Switcher Tabs (Approva style) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`font-display font-bold text-xs uppercase tracking-wider px-4 py-2 border-[3px] border-[#121210] flex items-center gap-1.5 btn-press ${
              activeView === 'dashboard'
                ? 'bg-[#121210] text-[#FFFFFF] shadow-[3px_3px_0_#121210]'
                : 'bg-[#FFFFFF] text-[#121210] shadow-[3px_3px_0_#121210] hover:bg-[#CFE8D6]'
            }`}
          >
            <FiGrid className="text-sm" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onViewChange('3d')}
            className={`font-display font-bold text-xs uppercase tracking-wider px-4 py-2 border-[3px] border-[#121210] flex items-center gap-1.5 btn-press ${
              activeView === '3d'
                ? 'bg-[#121210] text-[#FFFFFF] shadow-[3px_3px_0_#121210]'
                : 'bg-[#FFFFFF] text-[#121210] shadow-[3px_3px_0_#121210] hover:bg-[#CFE8D6]'
            }`}
          >
            <FiMap className="text-sm" />
            <span>3D Campus</span>
          </button>

          <button
            onClick={() => onViewChange('operations')}
            className={`font-display font-bold text-xs uppercase tracking-wider px-4 py-2 border-[3px] border-[#121210] flex items-center gap-1.5 btn-press ${
              activeView === 'operations'
                ? 'bg-[#121210] text-[#FFFFFF] shadow-[3px_3px_0_#121210]'
                : 'bg-[#FFFFFF] text-[#121210] shadow-[3px_3px_0_#121210] hover:bg-[#CFE8D6]'
            }`}
          >
            <FiSettings className="text-sm" />
            <span>Operations</span>
          </button>
        </div>

        {/* Right: Simulation Controller & Alerts */}
        <div className="flex items-center gap-3">
          <SimulationControl />
          <button 
            className="w-10 h-10 border-[3px] border-[#121210] bg-[#FFFFFF] shadow-[3px_3px_0_#121210] flex items-center justify-center text-[#121210] relative btn-press"
            title="System Alerts"
          >
            <FiBell className="text-lg" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#C03A3A] border-2 border-[#121210] rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header