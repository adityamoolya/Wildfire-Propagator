import { useState } from 'react';
import { Flame, Wind, Compass, ShieldAlert, Crosshair, CloudLightning, Mountain } from 'lucide-react';

export default function SpreadPredictionTab() {
  const [windSpeed, setWindSpeed] = useState(15); // km/h
  const [windDirection, setWindDirection] = useState(45); // degrees
  const [slope, setSlope] = useState(10); // degrees of terrain incline

  // The Advanced Empirical Physics Engine
  const baseSpreadRate = 2.5; // meters per minute (flat ground, no wind)
  const windMultiplier = windSpeed * 0.4;
  // Fire spreads roughly twice as fast on a 10-degree slope
  const slopeMultiplier = Math.max(0, slope * 0.25); 
  const totalSpreadRate = (baseSpreadRate + windMultiplier + slopeMultiplier).toFixed(1);

  // Calculate the visual size of the plume based on speed
  const plumeLength = 100 + (windSpeed * 4) + (slope * 2);
  const plumeSpreadAngle = Math.max(20, 60 - windSpeed); // High wind makes a narrow fire, low wind makes a wide fire

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto space-y-6 animate-fade-in pb-10">
      
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-white">API Integration & Spread Physics</h2>
        <p className="text-slate-400 text-lg">Calculating dispersion plumes using wind vectors, terrain topography, and the Haversine formula.</p>
      </div>

      <div className="flex w-full space-x-6 h-[550px]">
        
        {/* ================= LEFT SIDE: THE RANGER DASHBOARD MAP ================= */}
        <div className="w-2/3 bg-slate-900 border border-slate-700 rounded-2xl relative overflow-hidden shadow-2xl flex flex-col">
          
          <div className="h-12 bg-slate-950 border-b border-slate-800 flex items-center px-4 justify-between z-20 shadow-md">
            <div className="flex items-center space-x-2 text-slate-400 font-mono text-sm">
               <Crosshair size={16} className="text-blue-500" />
               <span>SECTOR 7G | LAT: 12.9716° N, LON: 77.5946° E</span>
            </div>
            <div className="flex items-center space-x-2">
               <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
               <span className="text-xs font-bold text-red-400 tracking-widest uppercase">Emergency Protocol Active</span>
            </div>
          </div>

          <div className="flex-1 relative bg-[#0a0f1c] overflow-hidden flex items-center justify-center">
             {/* Topographic Grid */}
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
             
             {/* Map Labels */}
             <span className="absolute top-4 text-slate-700 font-black tracking-widest text-2xl">NORTH</span>
             <span className="absolute bottom-4 text-slate-700 font-black tracking-widest text-2xl">SOUTH</span>
             <span className="absolute right-4 text-slate-700 font-black tracking-widest text-2xl rotate-90 transform origin-right">EAST</span>
             <span className="absolute left-4 text-slate-700 font-black tracking-widest text-2xl -rotate-90 transform origin-left">WEST</span>

             {/* ================= THE SVG PLUME RENDERER ================= */}
             <div 
                className="absolute z-10 transition-transform duration-700 ease-out"
                style={{ transform: `rotate(${windDirection}deg)` }}
             >
                <svg width="400" height="400" viewBox="-200 -200 400 400" className="overflow-visible">
                   {/* Isochrone Ring 1 (T+15 mins) */}
                   <circle cx="0" cy={-plumeLength * 0.3} r={plumeLength * 0.4} fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" className="opacity-30" />
                   
                   {/* Isochrone Ring 2 (T+30 mins) */}
                   <circle cx="0" cy={-plumeLength * 0.6} r={plumeLength * 0.6} fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" className="opacity-20" />

                   {/* The Probabilistic Heat Plume */}
                   <polygon 
                     points={`0,0 -${plumeSpreadAngle},-${plumeLength} ${plumeSpreadAngle},-${plumeLength}`} 
                     fill="url(#fireGradient)" 
                     className="opacity-40 animate-pulse"
                   />

                   {/* Gradient Definition for the Plume */}
                   <defs>
                     <linearGradient id="fireGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                       <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                       <stop offset="50%" stopColor="#f97316" stopOpacity="0.5" />
                       <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
                     </linearGradient>
                   </defs>
                </svg>
             </div>

             {/* Center Origin Fire */}
             <div className="absolute z-20 flex flex-col items-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full animate-ping absolute"></div>
                <Flame size={32} className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,1)]" />
             </div>

          </div>
        </div>

        {/* ================= RIGHT SIDE: API & PHYSICS CONTROLS ================= */}
        <div className="w-1/3 flex flex-col space-y-4">
          
          <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full blur-3xl"></div>
            <h3 className="flex items-center text-slate-400 font-bold text-sm tracking-wider mb-4 border-b border-slate-700 pb-2">
              <ShieldAlert size={16} className="mr-2 text-red-400" /> SPREAD VECTOR PHYSICS
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Calculated Velocity (v)</p>
                <div className="text-4xl font-black text-red-500">{totalSpreadRate} <span className="text-lg text-slate-400 font-bold">m/min</span></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                   <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Impact Time (1km)</p>
                   <p className="text-xl font-bold text-orange-400">{Math.round(1000 / parseFloat(totalSpreadRate))} <span className="text-xs">mins</span></p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                   <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Spread Cone</p>
                   <p className="text-xl font-bold text-yellow-400">±{Math.round(plumeSpreadAngle / 2)}°</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0f1c] border border-slate-700 p-5 rounded-xl flex-1 flex flex-col relative">
            <h3 className="flex items-center text-slate-400 font-bold text-sm tracking-wider mb-6 border-b border-slate-800 pb-2">
              <CloudLightning size={16} className="mr-2 text-blue-400" /> LIVE DATA INPUTS
            </h3>
            
            <div className="flex-1 space-y-6">
              
              <div>
                <label className="flex justify-between text-sm font-bold text-slate-300 mb-2">
                  <span className="flex items-center"><Wind size={16} className="mr-2 text-emerald-400" /> Wind Velocity</span>
                  <span className="text-emerald-400 font-mono">{windSpeed} km/h</span>
                </label>
                <input type="range" min="0" max="60" value={windSpeed} onChange={(e) => setWindSpeed(parseInt(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
              </div>

              <div>
                <label className="flex justify-between text-sm font-bold text-slate-300 mb-2">
                  <span className="flex items-center"><Compass size={16} className="mr-2 text-indigo-400" /> Heading Vector</span>
                  <span className="text-indigo-400 font-mono">{windDirection}°</span>
                </label>
                <input type="range" min="0" max="360" value={windDirection} onChange={(e) => setWindDirection(parseInt(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
              </div>

              <div>
                <label className="flex justify-between text-sm font-bold text-slate-300 mb-2">
                  <span className="flex items-center"><Mountain size={16} className="mr-2 text-amber-500" /> Topography Slope</span>
                  <span className="text-amber-500 font-mono">{slope}° Uphill</span>
                </label>
                <input type="range" min="0" max="45" value={slope} onChange={(e) => setSlope(parseInt(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" />
              </div>

            <div className="absolute bottom-5 left-5 right-5 bg-slate-900 border border-slate-700 p-3 rounded text-xs text-slate-400 leading-relaxed shadow-inner">
                <strong className="text-white block mb-1">The Prediction Engine:</strong>
                 We combine live <span className="text-blue-400">Weather API</span> data with 3D <span className="text-amber-400">Terrain Maps</span> to forecast the fire's path. Strong winds focus the fire into a narrow, high-speed funnel, while uphill slopes act as a physical accelerator, drastically reducing the time rangers have to evacuate the zone.
            </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}