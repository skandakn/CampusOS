import React, { useState } from 'react';
import { 
  FiAlertTriangle, FiCheckCircle, FiRadio, FiBattery, 
  FiDownload, FiFileText, FiFilter, FiTool, FiCheck, FiX,
  FiClock, FiShield, FiCpu, FiAlertOctagon
} from 'react-icons/fi';

const OpsCommandCenter = () => {
  const [activeTab, setActiveTab] = useState('incidents'); // incidents, sensors, reports
  const [selectedIncident, setSelectedIncident] = useState('INC-092');
  const [stampStatus, setStampStatus] = useState(null); // 'APPROVED', 'REJECTED', 'NEEDS_DETAIL'
  const [isExporting, setIsExporting] = useState(false);

  const [incidents, setIncidents] = useState([
    { 
      id: 'INC-092', 
      severity: 'critical', 
      title: 'HVAC Chiller Compressor Lockout', 
      building: 'Building 5 (Science Complex)', 
      time: '14m ago', 
      status: 'pending',
      details: 'Compressor bearing temperature exceeded 85°C threshold. Automated shutdown triggered.',
      estCost: '$4,850.00',
      slaRemaining: '45m'
    },
    { 
      id: 'INC-091', 
      severity: 'critical', 
      title: 'Potable Water Loop Pressure Drop', 
      building: 'Building 3 (Admin Hub)', 
      time: '1h ago', 
      status: 'investigating',
      details: 'Flow meter delta detected 42 L/min unmetered outflow. Potential subterranean leak.',
      estCost: '$1,200.00',
      slaRemaining: '2h 10m'
    },
    { 
      id: 'INC-090', 
      severity: 'warning', 
      title: 'Photovoltaic Inverter String Anomaly', 
      building: 'Building 4 (Library)', 
      time: '2h ago', 
      status: 'pending',
      details: 'Array 3 generating 28% below clear-sky model forecast. Panel inspection required.',
      estCost: '$350.00',
      slaRemaining: '6h'
    },
  ]);

  const sensors = [
    { id: 'SN-HV-501', type: 'HVAC Telemetry', building: 'Building 5', battery: 12, signal: 'offline', status: 'critical' },
    { id: 'SN-WT-302', type: 'Ultrasonic Flow', building: 'Building 3', battery: 45, signal: 'weak', status: 'warning' },
    { id: 'SN-LT-109', type: 'Lux / Ambient', building: 'Building 1', battery: 89, signal: 'strong', status: 'good' },
    { id: 'SN-AQ-704', type: 'Air Quality (CO₂)', building: 'Library', battery: 92, signal: 'strong', status: 'good' },
    { id: 'SN-HV-502', type: 'Chilled Water Loop', building: 'Building 5', battery: 8, signal: 'weak', status: 'critical' },
    { id: 'SN-OC-201', type: 'Thermal Occupancy', building: 'Building 2', battery: 100, signal: 'strong', status: 'good' },
  ];

  const currentInc = incidents.find(i => i.id === selectedIncident) || incidents[0];

  const handleDecision = (decision) => {
    setStampStatus(decision);
    setIncidents(prev => prev.map(inc => inc.id === currentInc.id ? { ...inc, status: decision.toLowerCase() } : inc));
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Official ESG Operational Compliance Audit PDF Generated.');
    }, 1200);
  };

  return (
    <div className="h-full w-full bg-[#CFE8D6] flex flex-col font-sans text-[#121210] overflow-hidden">
      {/* Top Bar */}
      <div className="p-4 border-b-[3px] border-[#121210] bg-[#FFFFFF] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#C03A3A] border-2 border-[#121210] shadow-[2px_2px_0_#121210] flex items-center justify-center text-white font-bold">
            <FiShield />
          </div>
          <div>
            <h1 className="font-display font-black text-lg uppercase text-[#121210] leading-tight">
              Facility Incident & Override Command
            </h1>
            <p className="text-[10px] font-mono text-[#121210]/60">
              AUDITABLE DECISION RAIL · FINTECH-GRADE DISPATCH
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {['incidents', 'sensors', 'reports'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 border-2 border-[#121210] font-mono text-xs font-bold uppercase btn-press ${
                activeTab === tab
                  ? 'bg-[#121210] text-white shadow-[2px_2px_0_#121210]'
                  : 'bg-white text-[#121210] hover:bg-[#CFE8D6]'
              }`}
            >
              {tab === 'incidents' ? `ALARMS (${incidents.filter(i => i.status !== 'approved').length})` :
               tab === 'sensors' ? 'IOT FLEET' : 'AUDIT REPORTS'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-hidden p-5 flex gap-5">
        {/* Left Pane: Queue & Document */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
          {activeTab === 'incidents' && (
            <>
              {/* Document Specification (Approva PO Document Style) */}
              <div className="bg-white border-[3px] border-[#121210] shadow-[6px_6px_0_#121210] p-6 relative">
                {/* Stamp Watermark Overlay */}
                {stampStatus && (
                  <div className="absolute top-8 right-8 pointer-events-none z-10">
                    <span 
                      className={`stamp text-2xl px-6 py-2 border-4 rotate-[-6deg] font-black ${
                        stampStatus === 'APPROVED' ? 'text-[#2E8C42] border-[#2E8C42]' :
                        stampStatus === 'ESCALATED' ? 'text-[#C03A3A] border-[#C03A3A]' :
                        'text-[#E8A030] border-[#E8A030]'
                      }`}
                    >
                      {stampStatus}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-start border-b-[3px] border-[#121210] pb-4">
                  <div>
                    <span className="tag bg-[#E8A030] mb-2">{currentInc.id}</span>
                    <h2 className="font-display font-black text-2xl text-[#121210] uppercase">
                      {currentInc.title}
                    </h2>
                    <p className="font-mono text-xs text-[#121210]/60 mt-1">
                      DISPATCH TICKET · ISSUED {currentInc.time.toUpperCase()}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-mono text-[#121210]/60 uppercase">TARGET FACILITY</div>
                    <div className="font-display font-bold text-base text-[#121210]">{currentInc.building}</div>
                    <div className="font-mono text-[10px] text-[#2E8C42] font-bold">CRITICAL ASSET #4802</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 my-4 font-mono text-xs">
                  <div className="border-2 border-[#121210] p-2.5 bg-[#CFE8D6]/30">
                    <div className="text-[9.5px] opacity-60 uppercase">INCIDENT SEVERITY</div>
                    <div className="font-bold text-sm text-[#C03A3A] uppercase mt-0.5">{currentInc.severity}</div>
                  </div>
                  <div className="border-2 border-[#121210] p-2.5 bg-[#CFE8D6]/30">
                    <div className="text-[9.5px] opacity-60 uppercase">SLA DEADLINE</div>
                    <div className="font-bold text-sm text-[#E8A030] uppercase mt-0.5">{currentInc.slaRemaining}</div>
                  </div>
                  <div className="border-2 border-[#121210] p-2.5 bg-[#CFE8D6]/30">
                    <div className="text-[9.5px] opacity-60 uppercase">EST. REMEDIATION</div>
                    <div className="font-bold text-sm text-[#121210] uppercase mt-0.5">{currentInc.estCost}</div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="border-t-2 border-[#121210] pt-4 font-mono text-xs space-y-2">
                  <div className="font-bold uppercase text-[10.5px] text-[#121210]/70">TELEMETRY DIAGNOSTIC PAYLOAD</div>
                  <p className="bg-[#CFE8D6]/40 p-3 border border-[#121210] leading-relaxed">
                    {currentInc.details}
                  </p>
                </div>

                {/* Approver Chain */}
                <div className="mt-5 border-t-[3px] border-[#121210] pt-3">
                  <div className="font-mono text-[9px] tracking-widest text-[#121210]/60 uppercase mb-2">
                    DISPATCH CHAIN OF CUSTODY
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="border-2 border-[#121210] bg-[#2E8C42] text-white px-2.5 py-1 text-[11px] font-mono font-bold shadow-[2px_2px_0_#121210]">
                      IoT Sensor ✓
                    </div>
                    <span className="font-bold">→</span>
                    <div className="border-2 border-[#121210] bg-[#2E8C42] text-white px-2.5 py-1 text-[11px] font-mono font-bold shadow-[2px_2px_0_#121210]">
                      ML Anomaly ✓
                    </div>
                    <span className="font-bold">→</span>
                    <div className="border-2 border-[#121210] bg-[#E8A030] text-[#121210] px-2.5 py-1 text-[11px] font-mono font-bold shadow-[2px_2px_0_#121210]">
                      YOU (CHIEF OPERATOR)
                    </div>
                    <span className="font-bold opacity-30">→</span>
                    <div className="border-2 border-dashed border-[#121210]/40 px-2.5 py-1 text-[11px] font-mono opacity-50">
                      Field Technician
                    </div>
                  </div>
                </div>
              </div>

              {/* Incidents Queue Mini-Table */}
              <div className="bg-white border-[3px] border-[#121210] shadow-[4px_4px_0_#121210] overflow-hidden">
                <div className="p-3 border-b-2 border-[#121210] bg-[#CFE8D6] font-display font-bold text-xs uppercase flex justify-between items-center">
                  <span>DISPATCH QUEUE ({incidents.length})</span>
                  <span className="font-mono text-[9px] text-[#121210]/60">CLICK ROW TO LOAD</span>
                </div>
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b-2 border-[#121210] text-[10px] text-[#121210]/60">
                      <th className="p-2.5 pl-3">ID</th>
                      <th className="p-2.5">ALARM TITLE</th>
                      <th className="p-2.5">FACILITY</th>
                      <th className="p-2.5">SLA</th>
                      <th className="p-2.5 pr-3 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidents.map(inc => (
                      <tr 
                        key={inc.id}
                        onClick={() => setSelectedIncident(inc.id)}
                        className={`border-b border-[#121210]/20 cursor-pointer hover:bg-[#CFE8D6]/50 transition-colors ${
                          selectedIncident === inc.id ? 'bg-[#CFE8D6]/70 font-bold' : ''
                        }`}
                      >
                        <td className="p-2.5 pl-3">{inc.id}</td>
                        <td className="p-2.5">{inc.title}</td>
                        <td className="p-2.5">{inc.building}</td>
                        <td className="p-2.5">{inc.slaRemaining}</td>
                        <td className="p-2.5 pr-3 text-right">
                          <span className={`stamp text-[8.5px] py-0 px-1 ${
                            inc.status === 'approved' ? 'text-[#2E8C42] border-[#2E8C42]' :
                            inc.status === 'escalated' ? 'text-[#C03A3A] border-[#C03A3A]' :
                            'text-[#E8A030] border-[#E8A030]'
                          }`}>
                            {inc.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'sensors' && (
            <div className="bg-white border-[3px] border-[#121210] shadow-[6px_6px_0_#121210] p-5">
              <h2 className="font-display font-bold text-lg uppercase mb-3 border-b-2 border-[#121210] pb-2">
                Connected IoT Hardware Inventory
              </h2>
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr className="border-b-2 border-[#121210] text-[10px] text-[#121210]/60 uppercase">
                    <th className="p-2.5">DEVICE ID</th>
                    <th className="p-2.5">SENSOR TYPE</th>
                    <th className="p-2.5">LOCATION</th>
                    <th className="p-2.5">BATTERY</th>
                    <th className="p-2.5 pr-3 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {sensors.map(sensor => (
                    <tr key={sensor.id} className="border-b border-[#121210]/20 hover:bg-[#CFE8D6]/30">
                      <td className="p-2.5 font-bold">{sensor.id}</td>
                      <td className="p-2.5">{sensor.type}</td>
                      <td className="p-2.5">{sensor.building}</td>
                      <td className="p-2.5">{sensor.battery}%</td>
                      <td className="p-2.5 pr-3 text-right">
                        <span className={`stamp text-[8.5px] py-0 px-1 ${
                          sensor.status === 'good' ? 'text-[#2E8C42] border-[#2E8C42]' :
                          sensor.status === 'warning' ? 'text-[#E8A030] border-[#E8A030]' :
                          'text-[#C03A3A] border-[#C03A3A]'
                        }`}>
                          {sensor.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white border-[3px] border-[#121210] shadow-[6px_6px_0_#121210] p-6 space-y-4">
              <h2 className="font-display font-bold text-xl uppercase border-b-2 border-[#121210] pb-2">
                Compliance & ESG Certification Exporter
              </h2>
              <p className="font-mono text-xs text-[#121210]/70">
                Generate tamper-evident ESG energy certificates and compliance manifests signed with SHA-256 telemetry hashing.
              </p>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="border-[3px] border-[#121210] bg-[#121210] text-white px-5 py-3 font-display font-bold text-xs uppercase btn-press shadow-[4px_4px_0_#121210] flex items-center gap-2"
              >
                <FiDownload />
                {isExporting ? 'COMPILING MANIFEST...' : 'DOWNLOAD AUDIT PACK (PDF + CSV)'}
              </button>
            </div>
          )}
        </div>

        {/* Right Action Rail (Approva Stamp Buttons Column) */}
        <aside className="w-56 shrink-0 space-y-3.5">
          <div className="font-mono text-[10px] tracking-widest text-[#121210]/70 uppercase font-bold px-1">
            EXECUTIVE DISPATCH
          </div>

          <button
            onClick={() => handleDecision('APPROVED')}
            className="w-full border-[3px] border-[#121210] bg-[#2E8C42] text-white p-4 flex flex-col items-center justify-center gap-1 shadow-[4px_4px_0_#121210] btn-press"
          >
            <FiCheck className="text-2xl stroke-[3]" />
            <span className="font-display font-black text-sm tracking-wider uppercase">APPROVE FIX</span>
            <span className="font-mono text-[9px] opacity-80">DISPATCH REPAIR</span>
          </button>

          <button
            onClick={() => handleDecision('ESCALATED')}
            className="w-full border-[3px] border-[#121210] bg-[#C03A3A] text-white p-4 flex flex-col items-center justify-center gap-1 shadow-[4px_4px_0_#121210] btn-press"
          >
            <FiAlertOctagon className="text-2xl stroke-[3]" />
            <span className="font-display font-black text-sm tracking-wider uppercase">ESCALATE</span>
            <span className="font-mono text-[9px] opacity-80">ALERT CHIEF ENG</span>
          </button>

          <button
            onClick={() => handleDecision('NEEDS_DETAIL')}
            className="w-full border-[3px] border-[#121210] bg-[#E8A030] text-[#121210] p-4 flex flex-col items-center justify-center gap-1 shadow-[4px_4px_0_#121210] btn-press"
          >
            <FiCpu className="text-2xl stroke-[3]" />
            <span className="font-display font-black text-sm tracking-wider uppercase">DIAGNOSTICS</span>
            <span className="font-mono text-[9px] opacity-80">RUN ML SWEEP</span>
          </button>

          {/* Policy Compliance Checklist (From Kombai Approva) */}
          <div className="border-[3px] border-[#121210] bg-white p-3.5 shadow-[4px_4px_0_#121210]">
            <div className="font-mono text-[9.5px] tracking-widest text-[#121210]/60 uppercase font-bold mb-2">
              FACILITY POLICY CHECK
            </div>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>OSHA Safety</span>
                <span className="font-bold text-[#2E8C42]">PASS</span>
              </div>
              <div className="flex justify-between">
                <span>NFPA 70E Arc</span>
                <span className="font-bold text-[#2E8C42]">OK</span>
              </div>
              <div className="flex justify-between">
                <span>SLA Risk Window</span>
                <span className="font-bold text-[#E8A030]">45m</span>
              </div>
              <div className="flex justify-between">
                <span>Redundancy N+1</span>
                <span className="font-bold text-[#2E8C42]">ACTIVE</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OpsCommandCenter;