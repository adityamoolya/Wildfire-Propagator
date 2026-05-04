import { useState, useEffect } from 'react';
import { TreePine, Radio, Server, Car, CloudFog, Flame, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function MeshNetworkTab() {
  const [activeSim, setActiveSim] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // The Simulation Logic Engine - Updated to reflect Base Station processing
  useEffect(() => {
    if (!activeSim) return;

    let timers: ReturnType<typeof setTimeout>[] = [];

    if (activeSim === 'vehicle') {
      setLogs(['> Node 1 detects sudden CO spike...']);
      timers.push(setTimeout(() => { setStep(1); setLogs(prev => [...prev, '> Node 1 Z-Score = 2.1 (Anomaly!).']); }, 1000));
      timers.push(setTimeout(() => { setStep(2); setLogs(prev => [...prev, '> ESP-NOW Ping sent to Gateway...']); }, 2500));
      timers.push(setTimeout(() => { setStep(3); setLogs(prev => [...prev, '> Gateway forwards packet via LoRa to Base Station...']); }, 4000));
      timers.push(setTimeout(() => { setStep(4); setLogs(prev => [...prev, '> Base Station interrogates Nodes 2 & 3...']); }, 5500));
      timers.push(setTimeout(() => { setStep(5); setLogs(prev => [...prev, '> Nodes 2 & 3 report Z-Score = 0.1 (Normal).']); }, 7000));
      timers.push(setTimeout(() => { setStep(6); setLogs(prev => [...prev, 'STATUS: DISMISSED. Base Station isolated passing vehicle.']); }, 8500));
    }

    if (activeSim === 'fog') {
      setLogs(['> All Nodes detect sudden humidity & VOC spike...']);
      timers.push(setTimeout(() => { setStep(1); setLogs(prev => [...prev, '> Z-Scores elevated across entire mesh.']); }, 1000));
      timers.push(setTimeout(() => { setStep(2); setLogs(prev => [...prev, '> ESP-NOW Ping sent to Gateway...']); }, 2500));
      timers.push(setTimeout(() => { setStep(3); setLogs(prev => [...prev, '> Gateway forwards multi-node array via LoRa...']); }, 4000));
      timers.push(setTimeout(() => { setStep(4); setLogs(prev => [...prev, '> Base Station analyzing spatial data...']); }, 5500));
      timers.push(setTimeout(() => { setStep(5); setLogs(prev => [...prev, '> Base Station Rule Matched: [High Humidity + Distributed VOC = Fog].']); }, 7000));
      timers.push(setTimeout(() => { setStep(6); setLogs(prev => [...prev, 'STATUS: DISMISSED. Weather pattern verified by Base Station.']); }, 8500));
    }

    if (activeSim === 'fire') {
      setLogs(['> Node 1 detects slow, steady CO & VOC rise...']);
      timers.push(setTimeout(() => { setStep(1); setLogs(prev => [...prev, '> Node 1 Z-Score = 1.8. Humidity normal.']); }, 1000));
      timers.push(setTimeout(() => { setStep(2); setLogs(prev => [...prev, '> ESP-NOW Ping sent to Gateway...']); }, 2500));
      timers.push(setTimeout(() => { setStep(3); setLogs(prev => [...prev, '> Gateway forwards packet via LoRa to Base Station...']); }, 4000));
      timers.push(setTimeout(() => { setStep(4); setLogs(prev => [...prev, '> Base Station interrogates network. Validates anomaly shape.']); }, 5500));
      timers.push(setTimeout(() => { setStep(5); setLogs(prev => [...prev, '> Base Station feeds data into Random Forest ML...']); }, 7000));
      timers.push(setTimeout(() => { setStep(6); setLogs(prev => [...prev, '> ML Fire Probability = 0.82. STATUS: FIRE CONFIRMED!']); }, 8500));
    }

    return () => timers.forEach(clearTimeout);
  }, [activeSim]);

  const runSim = (type: string) => {
    setActiveSim(null);
    setStep(0);
    setLogs([]);
    setTimeout(() => setActiveSim(type), 100);
  };

  // --- THE VISUAL INTERROGATION LOGIC ---
  const isInterrogatingVehicle = activeSim === 'vehicle' && step >= 4 && step <= 5;
  const isInterrogatingFire = activeSim === 'fire' && step >= 4 && step <= 5;
  const isFogging = activeSim === 'fog' && step >= 1;
  const showNode23Active = isFogging || isInterrogatingVehicle || isInterrogatingFire;

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto space-y-6 animate-fade-in pb-10">
      
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-white">Hybrid Mesh & Z-Score Verification</h2>
        <p className="text-slate-400 text-lg">Base Station filters false alarms to preserve battery and prevent panic.</p>
      </div>

      <div className="flex w-full space-x-6">
        
        {/* ================= LEFT SIDE: THE NETWORK MAP ================= */}
        <div className="w-2/3 bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl relative overflow-hidden h-[500px]">
          
          {/* Base Station */}
          <div className="absolute top-8 right-8 flex flex-col items-center z-20">
            <div className={`w-24 h-24 rounded-xl flex items-center justify-center border-4 transition-all duration-500 
              ${activeSim === 'fire' && step >= 6 ? 'bg-red-900/50 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse' : 
              step >= 3 ? 'bg-blue-900/50 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.4)]' : 
              'bg-slate-800 border-slate-600'}`}>
              <Server size={48} className={activeSim === 'fire' && step >= 6 ? 'text-red-500' : step >= 3 ? 'text-blue-400 animate-pulse' : 'text-slate-400'} />
            </div>
            <span className="mt-2 font-bold text-slate-300">Base Station</span>
          </div>

          {/* Gateway Node */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= 2 ? 'bg-indigo-900/50 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'bg-slate-800 border-slate-600'}`}>
              <Radio size={32} className={step >= 2 ? 'text-indigo-400' : 'text-slate-400'} />
            </div>
            <span className="mt-2 font-bold text-indigo-300 text-sm bg-slate-900/80 px-2 rounded">Gateway Node</span>
          </div>

          {/* Edge Node 1 */}
          <div className="absolute bottom-12 left-12 flex flex-col items-center z-20">
            <div className={`relative w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= 1 && (activeSim === 'vehicle' || activeSim === 'fire') ? 'bg-orange-900/50 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.5)]' : isFogging ? 'bg-blue-900/50 border-blue-500' : 'bg-slate-800 border-slate-600'}`}>
              <TreePine size={32} className={step >= 1 && (activeSim === 'vehicle' || activeSim === 'fire') ? 'text-orange-400' : 'text-green-500'} />
              {activeSim === 'vehicle' && step >= 0 && <Car className="absolute -top-6 -left-6 text-yellow-400 animate-bounce" size={24} />}
              {activeSim === 'fog' && step >= 0 && <CloudFog className="absolute -top-6 -left-6 text-blue-300 animate-pulse" size={24} />}
              {activeSim === 'fire' && step >= 0 && <Flame className="absolute -top-6 -left-6 text-red-500 animate-pulse" size={24} />}
            </div>
            <span className="mt-2 font-bold text-slate-400 text-sm">Edge Node 1</span>
          </div>

          {/* Edge Node 2 */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${showNode23Active ? 'bg-indigo-900/50 border-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.5)]' : 'bg-slate-800 border-slate-600'} ${isInterrogatingVehicle || isInterrogatingFire ? 'animate-pulse' : ''}`}>
              <TreePine size={32} className={showNode23Active ? 'text-indigo-300' : 'text-green-500'} />
            </div>
            <span className="mt-2 font-bold text-slate-400 text-sm">Edge Node 2</span>
          </div>

          {/* Edge Node 3 */}
          <div className="absolute bottom-24 right-1/4 flex flex-col items-center z-20">
             <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${showNode23Active ? 'bg-indigo-900/50 border-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.5)]' : 'bg-slate-800 border-slate-600'} ${isInterrogatingVehicle || isInterrogatingFire ? 'animate-pulse' : ''}`}>
              <TreePine size={32} className={showNode23Active ? 'text-indigo-300' : 'text-green-500'} />
            </div>
            <span className="mt-2 font-bold text-slate-400 text-sm">Edge Node 3</span>
          </div>

          {/* --- ANIMATED CONNECTION LINES --- */}
          <svg className="absolute top-0 left-0 w-full h-full z-10" pointerEvents="none">
            
            {/* Node 1 to Gateway */}
            <line x1="12%" y1="80%" x2="48%" y2="52%" stroke={step >= 2 ? "#818cf8" : "#334155"} strokeWidth={step >= 2 ? "4" : "2"} strokeDasharray="8,8" className={step >= 2 ? "animate-[pulse_1s_ease-in-out_infinite]" : ""} />
            
            {/* Nodes 2 & 3 to Gateway */}
            <line x1="50%" y1="80%" x2="50%" y2="55%" stroke={showNode23Active && step >= 2 ? "#818cf8" : "#334155"} strokeWidth={showNode23Active && step >= 2 ? "4" : "2"} strokeDasharray="8,8" className={showNode23Active && step >= 2 ? "animate-[pulse_1s_ease-in-out_infinite]" : ""} />
            <line x1="75%" y1="65%" x2="52%" y2="52%" stroke={showNode23Active && step >= 2 ? "#818cf8" : "#334155"} strokeWidth={showNode23Active && step >= 2 ? "4" : "2"} strokeDasharray="8,8" className={showNode23Active && step >= 2 ? "animate-[pulse_1s_ease-in-out_infinite]" : ""} />

            {/* Gateway to Base Station (LoRa) */}
            <line 
              x1="52%" y1="48%" x2="85%" y2="20%" 
              stroke={activeSim === 'fire' && step >= 6 ? "#ef4444" : step >= 3 ? "#3b82f6" : "#334155"} 
              strokeWidth={activeSim === 'fire' && step >= 6 ? "8" : step >= 3 ? "4" : "2"} 
              className={step >= 3 ? "animate-[pulse_0.5s_ease-in-out_infinite]" : ""} 
            />
            
            {/* Dynamic LoRa Text */}
            {step >= 3 && (
              <text x="60%" y="32%" fill={activeSim === 'fire' && step >= 6 ? "#ef4444" : "#60a5fa"} fontSize="13" fontWeight="bold" transform="rotate(-25 350 150)">
                {activeSim === 'fire' && step >= 6 ? "EMERGENCY ALARM" : "LORA DATA LINK"}
              </text>
            )}
            
            {(isInterrogatingVehicle || isInterrogatingFire) && (
              <text x="55%" y="65%" fill="#818cf8" fontSize="12" fontWeight="bold">INTERROGATING...</text>
            )}
          </svg>
        </div>

        {/* ================= RIGHT SIDE: CONTROLS & LOGS ================= */}
        <div className="w-1/3 flex flex-col space-y-4">
          
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl space-y-3">
            <h3 className="font-bold text-white mb-2 uppercase tracking-wider text-sm text-center">Run Network Simulation</h3>
            
            <button onClick={() => runSim('vehicle')} className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-between transition-all ${activeSim === 'vehicle' ? 'bg-yellow-600 text-white border-2 border-yellow-400' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
              <div className="flex items-center space-x-2"><Car size={20} /> <span>Passing Jeep</span></div>
              <span className="text-xs opacity-70">Single-Node Spike</span>
            </button>

            <button onClick={() => runSim('fog')} className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-between transition-all ${activeSim === 'fog' ? 'bg-blue-600 text-white border-2 border-blue-400' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
              <div className="flex items-center space-x-2"><CloudFog size={20} /> <span>Heavy Fog</span></div>
              <span className="text-xs opacity-70">Multi-Node Weather</span>
            </button>

            <button onClick={() => runSim('fire')} className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-between transition-all ${activeSim === 'fire' ? 'bg-red-600 text-white border-2 border-red-400' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
              <div className="flex items-center space-x-2"><Flame size={20} /> <span>Real Pyrolysis</span></div>
              <span className="text-xs opacity-70">True Anomaly</span>
            </button>
          </div>

          <div className="flex-1 bg-[#0a0f1c] border border-slate-700 p-4 rounded-xl flex flex-col font-mono text-sm relative overflow-hidden">
            <div className="flex items-center space-x-2 mb-4 border-b border-slate-800 pb-2">
              <Activity size={16} className="text-blue-500" />
              <span className="text-slate-400 font-bold uppercase tracking-widest">Base Station Server</span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 text-slate-300 flex flex-col justify-end">
              {logs.length === 0 && <span className="text-slate-600 italic">Waiting for telemetry... Select a simulation above.</span>}
              {logs.map((log, index) => (
                <div key={index} className={`animate-fade-in ${log.includes('STATUS: DISMISSED') ? 'text-green-400 font-bold' : log.includes('FIRE CONFIRMED') ? 'text-red-500 font-bold text-base' : log.includes('ML Fire') ? 'text-purple-400' : ''}`}>
                  {log}
                </div>
              ))}
            </div>

            {activeSim && step >= 6 && logs[logs.length-1].includes('DISMISSED') && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-green-500 text-green-500 bg-green-950/90 px-6 py-4 rounded-xl font-black text-2xl rotate-[-10deg] animate-fade-in flex items-center shadow-2xl backdrop-blur-sm">
                <CheckCircle2 size={32} className="mr-2" /> DISMISSED
              </div>
            )}
            
            {activeSim === 'fire' && step >= 6 && (
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-red-500 text-red-500 bg-red-950/90 px-6 py-4 rounded-xl font-black text-2xl rotate-[-10deg] animate-fade-in flex items-center shadow-2xl backdrop-blur-sm">
                 <ShieldAlert size={32} className="mr-2 animate-pulse" /> FIRE ALERT
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}