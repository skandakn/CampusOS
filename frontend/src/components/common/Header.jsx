import { FiMenu, FiGrid, FiMap, FiSettings, FiBell } from 'react-icons/fi'
import { TbBuildingEstate } from 'react-icons/tb'
import SimulationControl from './SimulationControl'

const Header = ({ connected, onSimulate, activeView, onViewChange }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side: Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <TbBuildingEstate className="text-3xl text-blue-500" />
            <div>
              <h1 className="text-xl font-bold text-white">Smart Campus Digital Twin</h1>
              <p className="text-sm text-gray-400">Real-time Sustainability Monitoring</p>
            </div>
          </div>
        </div>
        
        {/* Center: View Toggle */}
        <div className="flex items-center space-x-2 bg-gray-900 rounded-lg p-1">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`px-3 py-2 rounded-md flex items-center space-x-1 transition ${activeView === 'dashboard' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <FiGrid />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => onViewChange('3d')}
            className={`px-3 py-2 rounded-md flex items-center space-x-1 transition ${activeView === '3d' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <FiMap />
            <span>3D Campus</span>
          </button>
          <button
            onClick={() => onViewChange('operations')}
            className={`px-3 py-2 rounded-md flex items-center space-x-1 transition ${activeView === 'operations' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <FiSettings />
            <span>Operations</span>
          </button>
        </div>
        
        {/* Right side: Actions */}
        <div className="flex items-center space-x-4">
          <SimulationControl/>
          <button className="p-2 hover:bg-gray-700 rounded-lg transition relative">
            <FiBell className="text-xl" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
        </div>
      </div>
    </header>
  )
}

export default Header