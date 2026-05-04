import { useState } from 'react'
import PyrolysisTab from './components/PyrolysisTab';
import HardwareTab from './components/HardwareTab';
import MeshNetworkTab from './components/MeshNetworkTab';
import SpreadPredictionTab from './components/SpreadPredictionTab';
import InnovationTab from './components/InnovationTab';

function App() {
  // This little memory box remembers which tab the professor clicked on (starts at Tab 1)
  const [activeTab, setActiveTab] = useState(1)

  return (
    // This creates our full-screen, dark-mode background
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      
      {/* ---------------- SIDEBAR (The Menu on the left) ---------------- */}
      <div className="w-72 bg-slate-800 border-r border-slate-700 p-6 flex flex-col">
        <h1 className="text-xl font-bold mb-8 text-orange-500">Wild-Fire Propagation</h1>
        
        <div className="flex flex-col space-y-3">
          <button 
            onClick={() => setActiveTab(1)}
            className={`p-3 text-left rounded-lg transition-colors ${activeTab === 1 ? 'bg-orange-600 font-semibold' : 'hover:bg-slate-700'}`}
          >
            1. The Problem (Pyrolysis)
          </button>
          
          <button 
            onClick={() => setActiveTab(2)}
            className={`p-3 text-left rounded-lg transition-colors ${activeTab === 2 ? 'bg-orange-600 font-semibold' : 'hover:bg-slate-700'}`}
          >
            2. Edge Hardware
          </button>

          <button 
            onClick={() => setActiveTab(3)}
            className={`p-3 text-left rounded-lg transition-colors ${activeTab === 3 ? 'bg-orange-600 font-semibold' : 'hover:bg-slate-700'}`}
          >
            3. The Mesh Network
          </button>

          <button 
            onClick={() => setActiveTab(4)}
            className={`p-3 text-left rounded-lg transition-colors ${activeTab === 4 ? 'bg-orange-600 font-semibold' : 'hover:bg-slate-700'}`}
          >
            4. Spread Prediction
          </button>

          {/* ADDED TAB 5 BUTTON */}
          <button 
            onClick={() => setActiveTab(5)}
            className={`p-3 text-left rounded-lg transition-colors ${activeTab === 5 ? 'bg-orange-600 font-semibold' : 'hover:bg-slate-700'}`}
          >
            5. Innovation Matrix
          </button>
        </div>
      </div>

      {/* ---------------- MAIN CONTENT AREA (The empty space on the right) ---------------- */}
      <div className="flex-1 p-10 overflow-y-auto flex flex-col items-center pt-20">
        
        {activeTab === 1 && (
          <PyrolysisTab />
        )}
        
        {activeTab === 2 && (
          <HardwareTab />
        )}

        {activeTab === 3 && (
          <MeshNetworkTab />
        )}

        {activeTab === 4 && (
          <SpreadPredictionTab />
        )}

        {/* ADDED TAB 5 RENDER */}
        {activeTab === 5 && (
          <InnovationTab />
        )}

      </div>
    </div>
  )
}

export default App