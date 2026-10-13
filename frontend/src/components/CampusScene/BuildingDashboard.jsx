import React, { useMemo, useState, useEffect } from 'react';
import { 
  FiX, FiActivity, FiDroplet, FiZap, FiThermometer, 
  FiChevronRight, FiChevronLeft, FiCheck, FiTool 
} from 'react-icons/fi';

const BuildingDashboard = ({ building, onClose }) => {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (building) {
      setIsHidden(false);
    }
  }, [building?.building_id]);

  const floorData = useMemo(() => {
    if (!building) return [];
    const floors = building.floors || 4;
    const departments = ['Research Labs', 'Computer Science', 'Executive Offices', 'Library Stack', 'Student Hub'];
    
    return Array.from({ length: floors }).map((_, i) => ({
      level: floors - i,
      department: departments[i % departments.length],
      energyPct: Math.floor(Math.random() * 30) + 15,
      waterPct: Math.floor(Math.random() * 30) + 15,
    }));
  }, [building?.building_id, building?.floors]);

  if (!building) return null;

  const code = (building.building_id || 'BLDG-0').replace('_', '-').toUpperCase();

  return (
    <div 
      className={`absolute top-0 right-0 w-[420px] h-full bg-[#FFFFFF] border-l-[3px] border-[#121210] shadow-[-8px_0_0_#121210] flex flex-col transition-transform duration-300 ease-in-out z-50 text-[#121210] font-sans ${
        isHidden ? 'translate-x-full' : 'translate-x-0'
      }`}
    >
      {/* Drawer Toggle Handle */}
      <button
        onClick={() => setIsHidden(!isHidden)}
        className="absolute top-1/2 -left-8 transform -translate-y-1/2 bg-[#FFFFFF] border-y-2 border-l-2 border-[#121210] text-[#121210] p-1.5 shadow-[-3px_0_0_#121210] transition-colors z-50 flex items-center justify-center font-bold"
        title={isHidden ? "Reveal Specification" : "Hide Specification"}
      >
        {isHidden ? <FiChevronLeft className="text-xl" /> : <FiChevronRight className="text-xl" />}
      </button>

      {/* Header */}
      <div className="p-5 border-b-[3px] border-[#121210] bg-[#CFE8D6] flex justify-between items-start shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="tag bg-[#FFFFFF] text-[9.5px] py-0 px-1 font-mono">{code}</span>
            <span className={`stamp text-[9px] py-0 px-1 ${
              building.status === 'good' ? 'text-[#2E8C42] border-[#2E8C42] bg-white' :
              building.status === 'warning' ? 'text-[#E8A030] border-[#E8A030] bg-white' :
              'text-[#C03A3A] border-[#C03A3A] bg-white'
            }`}>
              {building.status.toUpperCase()}
            </span>
          </div>
          <h2 className="font-display font-black text-xl text-[#121210] uppercase">
            {building.name || building.building_id}
          </h2>
          <p className="text-[10px] font-mono text-[#121210]/60 uppercase mt-0.5">
            Operational Specification & Floor Plan
          </p>
        </div>

        <button 
          onClick={onClose} 
          className="w-7 h-7 border-2 border-[#121210] bg-white flex items-center justify-center btn-press shadow-[2px_2px_0_#121210]"
        >
          <FiX className="text-sm" />
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border-2 border-[#121210] p-3 bg-[#CFE8D6]/30 shadow-[3px_3px_0_#121210]">
            <span className="text-[9.5px] font-mono text-[#121210]/60 uppercase">ACTIVE POWER</span>
            <div className="font-mono font-bold text-xl mt-1 text-[#121210]">
              {Math.round(building.avg_energy || 0)} <span className="text-xs font-normal">kWh</span>
            </div>
          </div>
          <div className="border-2 border-[#121210] p-3 bg-[#CFE8D6]/30 shadow-[3px_3px_0_#121210]">
            <span className="text-[9.5px] font-mono text-[#121210]/60 uppercase">WATER DRAFT</span>
            <div className="font-mono font-bold text-xl mt-1 text-[#121210]">
              {Math.round(building.water_usage || 0)} <span className="text-xs font-normal">L</span>
            </div>
          </div>
          <div className="border-2 border-[#121210] p-3 bg-[#CFE8D6]/30 shadow-[3px_3px_0_#121210]">
            <span className="text-[9.5px] font-mono text-[#121210]/60 uppercase">ESG SCORE</span>
            <div className="font-mono font-bold text-xl mt-1 text-[#2E8C42]">
              {building.sustainability_score || 0}<span className="text-xs font-normal text-[#121210]/60">/100</span>
            </div>
          </div>
          <div className="border-2 border-[#121210] p-3 bg-[#CFE8D6]/30 shadow-[3px_3px_0_#121210]">
            <span className="text-[9.5px] font-mono text-[#121210]/60 uppercase">OCCUPANCY</span>
            <div className="font-mono font-bold text-xl mt-1 text-[#121210]">
              {building.occupancy || 0} <span className="text-xs font-normal">PPL</span>
            </div>
          </div>
        </div>

        {/* Floor Breakdown (Approva Line-Items Style) */}
        <div className="border-2 border-[#121210] shadow-[3px_3px_0_#121210] overflow-hidden">
          <div className="p-2.5 bg-[#CFE8D6] border-b-2 border-[#121210] font-display font-bold text-xs uppercase flex justify-between">
            <span>FLOOR TELEMETRY DISTRIBUTION</span>
            <span className="font-mono text-[9px] text-[#121210]/60">LINE-ITEMS</span>
          </div>
          <table className="w-full font-mono text-xs text-left">
            <thead>
              <tr className="border-b border-[#121210] bg-white text-[10px] text-[#121210]/60">
                <th className="p-2 pl-3">LVL</th>
                <th className="p-2">ZONE</th>
                <th className="p-2 text-right">ENERGY</th>
                <th className="p-2 pr-3 text-right">WATER</th>
              </tr>
            </thead>
            <tbody>
              {floorData.map((floor) => (
                <tr key={floor.level} className="border-b border-[#121210]/15 hover:bg-[#CFE8D6]/20">
                  <td className="p-2 pl-3 font-bold">L{floor.level}</td>
                  <td className="p-2 truncate max-w-[120px]">{floor.department}</td>
                  <td className="p-2 text-right">{floor.energyPct}%</td>
                  <td className="p-2 pr-3 text-right">{floor.waterPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons (Brutalist Stamping) */}
        <div className="pt-2 space-y-2">
          <button 
            onClick={() => alert(`Retrofit work-order initiated for ${building.name || building.building_id}`)}
            className="w-full border-2 border-[#121210] bg-[#2E8C42] text-white p-2.5 font-display font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0_#121210] btn-press flex items-center justify-center gap-2"
          >
            <FiCheck /> APPROVE FACILITY RETROFIT
          </button>
          <button 
            onClick={() => alert(`Diagnostics dispatched for ${building.name || building.building_id}`)}
            className="w-full border-2 border-[#121210] bg-white text-[#121210] p-2.5 font-display font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0_#121210] btn-press flex items-center justify-center gap-2 hover:bg-[#CFE8D6]"
          >
            <FiTool /> RUN FULL SENSOR DIAGNOSTIC
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildingDashboard;