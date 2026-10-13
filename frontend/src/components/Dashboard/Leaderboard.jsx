import { FiAward, FiCheckCircle } from 'react-icons/fi'

const Leaderboard = ({ stats }) => {
  const sortedBuildings = [...stats]
    .sort((a, b) => (b.sustainability_score || 0) - (a.sustainability_score || 0))
    .slice(0, 8)

  return (
    <div className="space-y-4">
      {/* Leaderboard Table (Approva PO/History table style) */}
      <div className="border-[3px] border-[#121210] bg-[#FFFFFF] shadow-[4px_4px_0_#121210] overflow-hidden">
        <div className="flex items-center justify-between p-3.5 border-b-[3px] border-[#121210] bg-[#CFE8D6]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#121210] bg-[#E8A030] flex items-center justify-center font-bold text-xs shadow-[2px_2px_0_#121210]">
              🏆
            </div>
            <h3 className="font-display font-black text-sm uppercase text-[#121210]">
              Facility ESG Leaderboard
            </h3>
          </div>
          <span className="tag bg-[#FFFFFF] text-[9px] py-0 px-1 font-mono">
            RANKED 1-8
          </span>
        </div>

        <table className="w-full font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-[#121210] bg-[#FFFFFF] text-[10px] text-[#121210]/70 uppercase">
              <th className="text-left p-2.5 pl-3">POS</th>
              <th className="text-left p-2.5">FACILITY</th>
              <th className="text-right p-2.5">SCORE</th>
              <th className="text-right p-2.5 pr-3">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {sortedBuildings.map((building, index) => {
              const rank = index + 1
              const rankColor =
                rank === 1 ? 'bg-[#E8A030] text-[#121210]' :
                rank === 2 ? 'bg-[#CFE8D6] text-[#121210]' :
                rank === 3 ? 'bg-[#FFFFFF] text-[#121210]' : 'bg-[#FFFFFF] text-[#121210]/60'

              return (
                <tr
                  key={building.building_id}
                  className="border-b border-[#121210]/20 hover:bg-[#CFE8D6]/40 transition-colors"
                >
                  <td className="p-2.5 pl-3">
                    <span className={`inline-block w-5 h-5 border border-[#121210] text-center leading-4 font-bold text-[10px] ${rankColor}`}>
                      {rank}
                    </span>
                  </td>
                  <td className="p-2.5 font-bold text-[#121210] truncate max-w-[110px]">
                    {building.name || building.building_id}
                  </td>
                  <td className="p-2.5 text-right font-black text-[#121210]">
                    {building.sustainability_score || 0}
                    <span className="text-[9px] font-normal text-[#121210]/50">/100</span>
                  </td>
                  <td className="p-2.5 pr-3 text-right">
                    <span
                      className={`stamp text-[8.5px] py-0 px-1 ${
                        building.status === 'good'
                          ? 'text-[#2E8C42] border-[#2E8C42] bg-white'
                          : building.status === 'warning'
                          ? 'text-[#E8A030] border-[#E8A030] bg-white'
                          : 'text-[#C03A3A] border-[#C03A3A] bg-white'
                      }`}
                    >
                      {building.status === 'good' ? 'OPTIMAL' : building.status === 'warning' ? 'WARN' : 'CRIT'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
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
            <span className="font-bold text-[#2E8C42] border border-[#2E8C42] px-1 bg-[#CFE8D6]/40">98% COMPLIANT</span>
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