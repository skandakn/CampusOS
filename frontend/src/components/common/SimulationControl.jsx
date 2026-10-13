import React, { useState, useEffect } from 'react';
import { FiDatabase, FiPlay, FiPause, FiServer } from 'react-icons/fi';
import { dataAPI } from '../../services/api';

const SimulationControl = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [buildingsTracked, setBuildingsTracked] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await dataAPI.getStatus();
        if (data) {
          setIsRunning(Boolean(data.is_running));
          if (data.buildings_tracked) setBuildingsTracked(data.buildings_tracked);
        }
      } catch (err) {
        // Fallback default
      }
    };
    checkStatus();
  }, []);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const result = await dataAPI.toggleSimulation();
      setIsRunning(result.status === 'running');
    } catch (error) {
      setIsRunning(!isRunning);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF] border-[3px] border-[#121210] shadow-[3px_3px_0_#121210] px-3 py-1.5 flex items-center gap-3">
      {/* Stream Status */}
      <div className="flex items-center gap-2">
        <div className="relative flex h-3 w-3">
          {isRunning && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E8C42] opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-3 w-3 border border-[#121210] ${
              isRunning ? 'bg-[#2E8C42]' : 'bg-[#E8A030]'
            }`}
          ></span>
        </div>

        <div>
          <h4 className="text-[11px] font-display font-bold text-[#121210] uppercase leading-none">
            DATA STREAM
          </h4>
          <p className="text-[9px] font-mono tracking-wider text-[#121210]/60 mt-0.5">
            {isRunning ? 'SYNTHESIS ON' : 'PAUSED'}
          </p>
        </div>
      </div>

      {/* Node Count & Toggle Button */}
      <div className="flex items-center gap-2 border-l-2 border-[#121210] pl-2.5">
        <div className="text-right">
          <p className="text-[8.5px] font-mono text-[#121210]/60 uppercase">NODES</p>
          <p className="text-[11px] font-mono font-bold text-[#121210] leading-none">
            {buildingsTracked}
          </p>
        </div>

        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`w-7 h-7 border-2 border-[#121210] shadow-[2px_2px_0_#121210] flex items-center justify-center btn-press font-bold transition-all ${
            isLoading
              ? 'opacity-50 cursor-not-allowed bg-gray-200'
              : isRunning
              ? 'bg-[#C03A3A] text-white'
              : 'bg-[#2E8C42] text-white'
          }`}
          title={isRunning ? 'Pause Telemetry Simulation' : 'Start Telemetry Simulation'}
        >
          {isLoading ? (
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isRunning ? (
            <FiPause className="text-xs" />
          ) : (
            <FiPlay className="text-xs ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default SimulationControl;