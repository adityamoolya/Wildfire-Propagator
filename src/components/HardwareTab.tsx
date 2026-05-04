import { useState } from 'react';
import { Cpu, Wind, Battery, Radio, Activity } from 'lucide-react';

export default function HardwareTab() {
  // This memory box remembers which part of the hardware the professor clicked on
  const [activePart, setActivePart] = useState('casing');

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-8 animate-fade-in pb-10">
      
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-white">The Edge Node Blueprint</h2>
        <p className="text-slate-400 text-lg"> Architecture optimized for deep-forest longevity.</p>
      </div>

      <div className="flex w-full space-x-8 bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">
        
        {/* === LEFT SIDE: THE INTERACTIVE DIAGRAM === */}
        <div className="w-1/2 flex justify-center items-center relative">
          
          {/* Background Glow */}
          <div className="absolute w-64 h-96 bg-blue-500/10 blur-3xl rounded-full"></div>

          {/* The Main Device Body */}
          <div className="relative w-48 h-96 flex flex-col items-center justify-between py-4">
            
            {/* Part 1: Power/Solar (Top) */}
            <button 
              onClick={() => setActivePart('power')}
              className={`w-40 h-16 rounded-t-xl border-2 transition-all z-20 flex items-center justify-center bg-slate-800 ${activePart === 'power' ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'border-slate-600 hover:border-yellow-400/50'}`}
            >
              <Battery className={`${activePart === 'power' ? 'text-yellow-400 animate-pulse' : 'text-slate-400'}`} />
            </button>

            {/* Part 2: The Chimney Casing & Sensors (Middle) */}
            <button 
              onClick={() => setActivePart('casing')}
              className={`w-32 h-32 border-x-2 border-dashed transition-all z-10 flex flex-col items-center justify-center relative ${activePart === 'casing' || activePart === 'sensors' ? 'border-emerald-400 bg-slate-800/50' : 'border-slate-600 bg-slate-800/20 hover:border-emerald-400/50'}`}
            >
              {/* Airflow Animation inside Chimney */}
              <div className="absolute w-full h-full overflow-hidden flex justify-center items-end opacity-50">
                 <div className="w-2 h-10 bg-emerald-400/50 rounded-full blur-sm animate-smoke-fast"></div>
                 <div className="w-2 h-8 bg-blue-400/50 rounded-full blur-sm animate-smoke-slow mx-2"></div>
              </div>
              
              <Wind className={`z-20 mb-2 ${activePart === 'casing' ? 'text-emerald-400 animate-bounce' : 'text-slate-500'}`} />
              
              {/* Sensor Nodes inside */}
              <div 
                onClick={(e) => { e.stopPropagation(); setActivePart('sensors'); }}
                className={`w-20 h-8 rounded border-2 z-30 transition-all flex items-center justify-center bg-slate-900 ${activePart === 'sensors' ? 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'border-slate-500 hover:border-orange-400'}`}
              >
                <span className={`text-xs font-bold ${activePart === 'sensors' ? 'text-orange-400' : 'text-slate-400'}`}>MQ Array</span>
              </div>
            </button>

            {/* Part 3: The Brain & Radio (Bottom) */}
            <button 
              onClick={() => setActivePart('brain')}
              className={`w-40 h-24 rounded-b-xl border-2 transition-all z-20 flex flex-col items-center justify-center bg-slate-800 space-y-2 ${activePart === 'brain' ? 'border-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.4)]' : 'border-slate-600 hover:border-blue-400/50'}`}
            >
              <Cpu className={`${activePart === 'brain' ? 'text-blue-400 animate-pulse' : 'text-slate-400'}`} />
              <div className="flex space-x-4">
                <Radio size={16} className={`${activePart === 'brain' ? 'text-indigo-400' : 'text-slate-500'}`} />
                <Activity size={16} className={`${activePart === 'brain' ? 'text-pink-400' : 'text-slate-500'}`} />
              </div>
            </button>

          </div>
        </div>

        {/* === RIGHT SIDE: THE EXPLANATION PANEL === */}
        <div className="w-1/2 flex flex-col justify-center">
          
          {activePart === 'casing' && (
            <div className="bg-slate-800 border border-emerald-500/30 p-6 rounded-xl shadow-lg shadow-emerald-900/20 animate-fade-in">
              <div className="flex items-center space-x-3 mb-4 text-emerald-400">
                <Wind size={32} />
                <h3 className="text-2xl font-bold text-white">Chimney-Effect Casing</h3>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                Instead of exposing sensors directly to the wind where gases dilute instantly, our custom 3D-printed casing uses passive aerodynamics. 
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center"><div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div> Naturally funnels rising hot gases upward into the sensor chamber.</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div> Protects sensitive MQ elements from direct rain and harsh sunlight.</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div> Increases chemical concentration for faster detection.</li>
              </ul>
            </div>
          )}

          {activePart === 'sensors' && (
            <div className="bg-slate-800 border border-orange-500/30 p-6 rounded-xl shadow-lg shadow-orange-900/20 animate-fade-in">
              <div className="flex items-center space-x-3 mb-4 text-orange-400">
                <Activity size={32} />
                <h3 className="text-2xl font-bold text-white">The Pyrolysis Array</h3>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                We use commercial-grade but extremely cheap metal-oxide (MOS) sensors explicitly calibrated for pre-fire off-gassing.
              </p>
              <div className="space-y-3">
                <div className="bg-slate-900 p-3 rounded border border-slate-700">
                  <span className="font-bold text-blue-400">MQ-7 Sensor:</span> <span className="text-slate-300 text-sm">Targets Carbon Monoxide (CO). The primary byproduct of wood pyrolysis.</span>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-slate-700">
                  <span className="font-bold text-emerald-400">MQ-135 Sensor:</span> <span className="text-slate-300 text-sm">Targets Volatile Organic Compounds (VOCs). Confirms the CO spike isn't just a passing vehicle.</span>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-slate-700">
                  <span className="font-bold text-pink-400">DHT22 Sensor:</span> <span className="text-slate-300 text-sm">Tracks micro-climate temperature and humidity to filter out false alarms like morning fog.</span>
                </div>
              </div>
            </div>
          )}

          {activePart === 'brain' && (
            <div className="bg-slate-800 border border-blue-500/30 p-6 rounded-xl shadow-lg shadow-blue-900/20 animate-fade-in">
              <div className="flex items-center space-x-3 mb-4 text-blue-400">
                <Cpu size={32} />
                <h3 className="text-2xl font-bold text-white">The ESP32 Edge Brain</h3>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                This is where we beat expensive commercial systems. We push the heavy math directly onto a sub-₹500 microcontroller.
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center"><div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div> <span className="font-bold text-white mr-1">Edge Computing:</span> Calculates statistical Z-Scores locally, neutralizing sensor drift without cloud AI.</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div> <span className="font-bold text-white mr-1">Deep Sleep:</span> Wakes up every 5 minutes, checks the air, calculates, and goes back to sleep.</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div> <span className="font-bold text-white mr-1">ESP-NOW Protocol:</span> Uses a free, fast radio protocol to talk to neighboring trees silently.</li>
              </ul>
            </div>
          )}

          {activePart === 'power' && (
            <div className="bg-slate-800 border border-yellow-500/30 p-6 rounded-xl shadow-lg shadow-yellow-900/20 animate-fade-in">
              <div className="flex items-center space-x-3 mb-4 text-yellow-400">
                <Battery size={32} />
                <h3 className="text-2xl font-bold text-white">Solar Sustainability</h3>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                A forest sensor is useless if a ranger has to change its battery every month. Our system is designed to live indefinitely.
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center"><div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div> <span className="font-bold text-white mr-1">5V Mini Solar Panel:</span> Constantly trickle-charges the unit using ambient canopy light.</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div> <span className="font-bold text-white mr-1">18650 Lithium Battery:</span> Holds enough charge to power the ESP32 through weeks of cloudy weather.</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div> <span className="font-bold text-white mr-1">Transmission Saving:</span> By not transmitting data when the forest is "normal," we save 95% of battery life.</li>
              </ul>
            </div>
          )}

        </div>
      </div>
      
      <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-8 animate-pulse">Click the blueprint components to inspect</p>

    </div>
  );
}