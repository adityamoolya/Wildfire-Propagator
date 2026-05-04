import { useState, useEffect } from 'react';
import { Flame, Zap, Sun, Cigarette, Clock } from 'lucide-react';

export default function PyrolysisTab() {
  const [subTab, setSubTab] = useState('problem');
  const [phase, setPhase] = useState(1);
  const [activeSource, setActiveSource] = useState('cigarette');
  
  // Advanced Lightning Trigger Logic
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (activeSource === 'lightning') {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 150); // Much faster, sharper flash
      return () => clearTimeout(timer);
    }
  }, [activeSource]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* --- SUB-TAB NAVIGATION --- */}
      <div className="flex space-x-4 bg-slate-800 p-2 rounded-xl border border-slate-700 w-full justify-center shadow-lg">
        <button onClick={() => setSubTab('problem')} className={`px-6 py-2 rounded-lg font-bold transition-all ${subTab === 'problem' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50' : 'text-slate-400 hover:text-white'}`}>1. The Core Problem</button>
        <button onClick={() => setSubTab('reasons')} className={`px-6 py-2 rounded-lg font-bold transition-all ${subTab === 'reasons' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50' : 'text-slate-400 hover:text-white'}`}>2. Heat Sources</button>
        <button onClick={() => setSubTab('phases')} className={`px-6 py-2 rounded-lg font-bold transition-all ${subTab === 'phases' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50' : 'text-slate-400 hover:text-white'}`}>3. The Ignition Phases</button>
      </div>

      {/* ================= SECTION 1: THE PROBLEM ================= */}
      {subTab === 'problem' && (
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full animate-fade-in text-left shadow-2xl mt-4">
          <h2 className="text-3xl font-black text-orange-400 mb-6 border-b border-slate-700 pb-4">The "Dry Leaf" Myth</h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-6">
            A common misconception is that a single dry leaf catching fire instantly starts a forest fire. In forestry, a single leaf is a <span className="text-red-400 font-bold">Flash Fuel</span>. Because it has almost zero mass, it burns up instantly.
          </p>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-inner">
            <h3 className="text-xl font-bold text-emerald-400 mb-2">The Reality of Heavy Fuels</h3>
            <p className="text-slate-300">
              For a true forest fire to start, that tiny leaf has to ignite a <span className="text-emerald-400 font-bold">Heavy Fuel</span> (a thick branch, a tree trunk, or the deep duff layer). That thick tree trunk cannot catch fire instantly. It takes 10 to 30 minutes of being roasted before it can ignite. During those 30 minutes, that log is undergoing extreme pyrolysis, aggressively dumping CO and VOCs into the air. <span className="text-white font-bold block mt-4 text-lg">That is the exact 15-to-30 minute window our sensors exploit.</span>
            </p>
          </div>
        </div>
      )}

      {/* ================= SECTION 2: HEAT SOURCES (INTERACTIVE SIMULATOR) ================= */}
      {subTab === 'reasons' && (
        <div className="w-full flex flex-col items-center animate-fade-in space-y-6 mt-4">
          
          {/* Controls */}
          <div className="w-full max-w-3xl flex justify-between bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-lg relative z-50">
            <button onClick={() => setActiveSource('cigarette')} className={`flex items-center justify-center space-x-2 w-1/4 py-3 rounded-lg font-bold transition-all ${activeSource === 'cigarette' ? 'bg-slate-700 text-orange-400 border border-orange-500/50' : 'text-slate-500 hover:bg-slate-700/50'}`}><Cigarette size={18} /> <span>Cigarette</span></button>
            <button onClick={() => setActiveSource('lightning')} className={`flex items-center justify-center space-x-2 w-1/4 py-3 rounded-lg font-bold transition-all ${activeSource === 'lightning' ? 'bg-slate-700 text-yellow-400 border border-yellow-500/50' : 'text-slate-500 hover:bg-slate-700/50'}`}><Zap size={18} /> <span>Lightning</span></button>
            <button onClick={() => setActiveSource('coals')} className={`flex items-center justify-center space-x-2 w-1/4 py-3 rounded-lg font-bold transition-all ${activeSource === 'coals' ? 'bg-slate-700 text-red-500 border border-red-500/50' : 'text-slate-500 hover:bg-slate-700/50'}`}><Flame size={18} /> <span>Coals</span></button>
            <button onClick={() => setActiveSource('sun')} className={`flex items-center justify-center space-x-2 w-1/4 py-3 rounded-lg font-bold transition-all ${activeSource === 'sun' ? 'bg-slate-700 text-yellow-200 border border-yellow-200/50' : 'text-slate-500 hover:bg-slate-700/50'}`}><Sun size={18} /> <span>Sunlight</span></button>
          </div>

          {/* Visual Stage */}
          <div className="relative w-full max-w-3xl h-80 bg-[#0a0f1c] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col items-center justify-end">
            
            {/* The Ground (Shared) */}
            <div className="absolute bottom-0 w-full h-16 bg-stone-900 border-t-4 border-stone-800 z-30 shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)]"></div>

            {/* SCENARIO 1: CIGARETTE */}
            {activeSource === 'cigarette' && (
              <div className="absolute inset-0 flex justify-center items-end animate-fade-in z-40 pb-16">
                {/* Thick log */}
                <div className="w-56 h-16 bg-amber-900 rounded-lg border-b-4 border-amber-950 absolute bottom-14 right-[20%] shadow-2xl"></div>
                {/* Cigarette */}
                <div className="w-10 h-3 bg-slate-200 rounded-sm absolute bottom-28 right-[35%] rotate-[15deg] flex justify-end shadow-md">
                   {/* Burning cherry */}
                   <div className="w-3 h-full bg-red-500 rounded-r-sm flex justify-end items-center">
                      <div className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-ping"></div>
                   </div>
                </div>
                {/* Intense Heat Glow radiating into wood */}
                <div className="w-20 h-8 bg-red-500/40 blur-xl absolute bottom-24 right-[32%] rounded-full animate-pulse"></div>
                {/* Smoke stream */}
                <div className="absolute bottom-32 right-[33%] flex flex-col items-center">
                   <div className="w-2 h-12 bg-slate-300/40 blur-md rounded-t-full animate-pulse origin-bottom -rotate-12"></div>
                </div>
              </div>
            )}

            {/* SCENARIO 2: LIGHTNING (Sleeper Fire) */}
            {activeSource === 'lightning' && (
              <div className="absolute inset-0 flex justify-center items-end animate-fade-in z-20 pb-16">
                {/* Background Sky Flash - Violent & Fast */}
                <div className={`absolute inset-0 bg-white z-0 transition-opacity duration-75 ${flash ? 'opacity-90' : 'opacity-0'}`}></div>
                
                {/* Lightning Bolt - Strikes down dynamically */}
                <div className={`absolute top-0 flex justify-center w-full z-40 transition-transform duration-100 origin-top ${flash ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}>
                  <Zap size={140} className="text-yellow-300 drop-shadow-[0_0_40px_rgba(253,224,71,1)] fill-yellow-300" />
                </div>
                
                {/* Tree Trunk */}
                <div className="w-24 h-64 bg-stone-800 relative z-30 flex justify-center items-center overflow-hidden border-x-4 border-stone-900 shadow-2xl">
                  {/* Internal glowing core (Sleeper fire) - Activates after flash */}
                  <div className={`w-12 h-40 bg-orange-600/90 blur-xl rounded-full transition-all duration-1000 delay-150 ${flash ? 'opacity-0 scale-50' : 'opacity-100 scale-100 animate-pulse'}`}></div>
                  
                  {/* Glowing crack in the bark */}
                  <div className={`absolute top-20 w-2 h-24 bg-orange-400 blur-[2px] transition-opacity duration-1000 delay-300 ${flash ? 'opacity-0' : 'opacity-90'}`}></div>
                </div>
                
                {/* Smoke leaking from bark - delayed appearance */}
                {!flash && (
                  <div className="absolute bottom-40 z-40 flex space-x-12">
                     <div className="w-6 h-6 bg-slate-400/50 rounded-full blur-md animate-bounce translate-x-4"></div>
                     <div className="w-8 h-8 bg-slate-300/40 rounded-full blur-lg animate-pulse -translate-x-6"></div>
                  </div>
                )}
              </div>
            )}

            {/* SCENARIO 3: COALS (Underground roots) */}
            {activeSource === 'coals' && (
              <div className="absolute inset-0 flex justify-center items-end animate-fade-in z-40">
                {/* Tree Trunk & Roots */}
                <div className="w-20 h-32 bg-stone-800 absolute bottom-16 border-stone-900 border-x-2"></div>
                <div className="absolute bottom-12 flex space-x-8 z-20">
                   <div className="w-32 h-6 bg-stone-800 rotate-12 origin-left rounded-full border-b-2 border-stone-900"></div>
                   
                   {/* Root with creeping underground heat */}
                   <div className="w-32 h-6 bg-stone-800 -rotate-12 origin-right rounded-full relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-full h-full bg-gradient-to-l from-red-600/90 via-orange-500/50 to-transparent blur-sm animate-pulse"></div>
                   </div>
                </div>
                
                {/* Ash Pile above ground */}
                <div className="w-32 h-12 bg-slate-700/90 rounded-t-full absolute bottom-16 right-[20%] z-40 flex justify-center items-end pb-2 shadow-lg">
                   {/* Throbbing coals with intense drop shadows */}
                   <div className="w-4 h-3 bg-red-500 rounded-full animate-pulse mx-1 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                   <div className="w-3 h-2 bg-orange-400 rounded-full animate-pulse mx-1 delay-75 shadow-[0_0_8px_rgba(251,146,60,0.8)]"></div>
                   <div className="w-5 h-3 bg-red-600 rounded-full animate-pulse mx-1 delay-150 shadow-[0_0_12px_rgba(220,38,38,0.8)]"></div>
                </div>
                
                {/* Toxic Gas seeping up through the dirt */}
                <div className="absolute bottom-20 right-[25%] z-50 flex flex-col space-y-2">
                   <div className="w-8 h-8 bg-emerald-500/20 rounded-full blur-xl animate-bounce"></div>
                   <div className="w-12 h-12 bg-emerald-400/10 rounded-full blur-2xl animate-pulse delay-100"></div>
                </div>
              </div>
            )}

            {/* SCENARIO 4: MAGNIFYING GLASS */}
            {activeSource === 'sun' && (
              <div className="absolute inset-0 flex justify-center items-end animate-fade-in z-40 pb-16">
                {/* Massive Ambient Sun Ray */}
                <div className="absolute top-0 left-[10%] w-48 h-full bg-gradient-to-br from-yellow-100/30 via-yellow-200/10 to-transparent -rotate-[20deg] origin-top"></div>
                
                {/* Broken Glass / Bottle */}
                <div className="w-16 h-20 border-l-4 border-b-4 border-cyan-400/40 bg-cyan-300/20 rounded-bl-3xl rounded-tr-lg absolute bottom-16 right-[45%] backdrop-blur-md z-30 shadow-[inset_-5px_-5px_20px_rgba(34,211,238,0.2)]"></div>
                
                {/* Super Intense Focused Beam */}
                <div className="absolute bottom-16 right-[33%] w-24 h-1 bg-yellow-300 rotate-[18deg] origin-left shadow-[0_0_15px_rgba(253,224,71,1)] animate-pulse"></div>
                
                {/* Wood target */}
                <div className="w-40 h-10 bg-stone-700 rounded absolute bottom-14 right-[15%] z-20 border-t-2 border-stone-600 shadow-xl">
                   {/* Blinding Laser Point Heat */}
                   <div className="absolute -top-1 left-8 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,1),0_0_40px_rgba(250,204,21,1)] animate-ping"></div>
                   <div className="absolute top-0 left-8 w-2 h-2 bg-yellow-200 rounded-full"></div>
                   
                   {/* Pyrolysis off-gassing from the laser point */}
                   <div className="absolute -top-10 left-6 flex flex-col items-center">
                      <div className="w-4 h-12 bg-slate-300/50 blur-lg rounded-t-full animate-bounce"></div>
                   </div>
                </div>
              </div>
            )}

          </div>

          {/* Explanation Box */}
          <div className="h-40 w-full max-w-3xl bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg text-left flex flex-col justify-center">
            {activeSource === 'cigarette' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-orange-400 mb-2 flex items-center"><Cigarette className="mr-2"/> The Dropped Cigarette</h3>
                <p className="text-slate-300 text-sm leading-relaxed">A 400°C cigarette buried in dirt lacks the oxygen to create an instant flame. Instead, it acts like a miniature oven, slowly baking the heavy wood touching it to 200°C, causing massive invisible off-gassing (Pyrolysis) for hours before ignition.</p>
              </div>
            )}
            {activeSource === 'lightning' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-yellow-400 mb-2 flex items-center"><Zap className="mr-2"/> The "Sleeper Fire" (Lightning)</h3>
                <p className="text-slate-300 text-sm leading-relaxed">Lightning superheats the inner core of a living tree to 300°C. Because the heat is trapped inside solid wood, there is zero oxygen to create flames. It slowly bakes internally for days, leaking massive CO plumes through the bark before finally breaching the outside.</p>
              </div>
            )}
            {activeSource === 'coals' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-red-500 mb-2 flex items-center"><Flame className="mr-2"/> Buried Campfire Coals</h3>
                <p className="text-slate-300 text-sm leading-relaxed">Even after pouring water on a campfire, buried coals remain at 300°C. They slowly dry out buried root systems underground, causing subterranean pyrolysis. The invisible gases seep up through the soil until wind introduces oxygen and ignites them hours later.</p>
              </div>
            )}
            {activeSource === 'sun' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-yellow-200 mb-2 flex items-center"><Sun className="mr-2"/> The Magnifying Glass Effect</h3>
                <p className="text-slate-300 text-sm leading-relaxed">A discarded glass bottle or broken glass focuses the sun's ambient heat into a tiny, super-intense laser point on dry bark. That tiny dot reaches 200°C, initiating localized pyrolytic degradation without a single spark or ember.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= SECTION 3: THE PHASES & ANIMATION ================= */}
      {subTab === 'phases' && (
        <div className="w-full flex flex-col items-center animate-fade-in space-y-6 mt-4">
          
          {/* TIMELINE INDICATOR */}
          <div className="w-full max-w-2xl bg-slate-800 rounded-xl border border-slate-700 p-4 flex justify-between items-center shadow-lg">
            <div className="flex items-center space-x-3 text-orange-400">
               <Clock size={24} className="animate-pulse" />
               <span className="font-black text-lg uppercase tracking-wider">Time Until Fire:</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">
               {phase === 1 && <span className="text-blue-400">15 to 30 Minutes</span>}
               {phase === 2 && <span className="text-orange-500">1 to 5 Minutes</span>}
               {phase === 3 && <span className="text-red-500">0 Seconds (Too Late)</span>}
            </div>
          </div>

          {/* THE VISUAL SIMULATOR */}
          <div className="relative w-full max-w-2xl h-80 bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col items-center justify-end">
            
            {/* The Tree Trunk */}
            <div className={`w-16 h-40 z-20 transition-all duration-1000 ${phase === 1 ? 'bg-amber-900' : phase === 2 ? 'bg-stone-800' : 'bg-stone-950'}`}></div>
            
            {/* The Leaves */}
            <div className={`absolute bottom-32 w-48 h-48 rounded-full z-10 transition-all duration-1000 ${phase === 1 ? 'bg-green-800' : phase === 2 ? 'bg-yellow-900' : 'bg-stone-900'}`}></div>
            
            {/* The Ground */}
            <div className={`w-full h-12 z-30 transition-all duration-1000 ${phase === 1 ? 'bg-green-950' : 'bg-stone-900'}`}></div>

            {/* --- ANIMATIONS BASED ON PHASE --- */}
            
            {/* PHASE 1: PYROLYSIS (SMOKE/GAS) */}
            {phase === 1 && (
              <div className="absolute bottom-20 z-40 w-full flex justify-center space-x-8">
                <div className="w-6 h-6 bg-blue-500/40 rounded-full blur-md animate-smoke-fast delay-75"></div>
                <div className="w-8 h-8 bg-emerald-500/30 rounded-full blur-lg animate-smoke-slow delay-150"></div>
                <div className="w-5 h-5 bg-blue-400/50 rounded-full blur-sm animate-smoke-fast delay-300"></div>
                <div className="absolute -top-20 text-center animate-pulse">
                  <span className="text-blue-400 font-bold px-2">CO</span>
                  <span className="text-emerald-400 font-bold px-2">VOCs</span>
                </div>
              </div>
            )}

            {/* PHASE 2: SMOLDERING (THICK SMOKE & GLOW) */}
            {phase === 2 && (
              <div className="absolute bottom-10 z-40 w-full flex justify-center flex-col items-center">
                <div className="w-24 h-6 bg-red-600/60 rounded-full blur-xl animate-pulse absolute bottom-0 z-30"></div>
                <div className="flex space-x-2">
                   <div className="w-12 h-12 bg-slate-400/50 rounded-full blur-xl animate-smoke-slow"></div>
                   <div className="w-16 h-16 bg-slate-500/60 rounded-full blur-2xl animate-smoke-fast delay-100"></div>
                </div>
              </div>
            )}

            {/* PHASE 3: COMBUSTION (FIRE) */}
            {phase === 3 && (
              <div className="absolute bottom-12 z-40 w-full flex justify-center">
                <div className="relative w-32 h-32 flex justify-center items-end">
                   <div className="absolute bottom-0 w-24 h-32 bg-orange-600/80 rounded-t-full blur-md animate-fire-flicker"></div>
                   <div className="absolute bottom-0 w-16 h-24 bg-yellow-500/90 rounded-t-full blur-sm animate-fire-flicker delay-75"></div>
                   <div className="absolute bottom-0 w-8 h-16 bg-white/80 rounded-t-full blur-sm animate-fire-flicker delay-150"></div>
                </div>
              </div>
            )}
          </div>

          {/* THE TEXT EXPLANATION */}
          <div className="h-48 w-full max-w-2xl text-center bg-slate-800 p-4 rounded-xl border border-slate-700">
            {phase === 1 && (
              <div className="text-left">
                <h2 className="text-2xl font-black text-blue-400 mb-2">Phase A: Pre-Heating & Pyrolysis</h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-2">The wood bakes between 150°C and 300°C. It "sweats" out massive amounts of CO and VOCs, but <span className="text-white font-bold">there is zero fire and the wood is not actively burning.</span></p>
                <div className="bg-blue-900/30 p-2 rounded border border-blue-500/30">
                   <span className="text-blue-300 font-semibold text-sm">Our Action:</span> <span className="text-slate-300 text-sm">Sensors detect this anomaly, giving authorities 15 to 30 minutes to find the hot spot before ignition.</span>
                </div>
              </div>
            )}
            {phase === 2 && (
              <div className="text-left">
                <h2 className="text-2xl font-black text-orange-500 mb-2">Phase B: Smoldering</h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-2">Flameless combustion. The wood is now actively burning and destroying itself. It releases extremely thick CO/VOCs and smoke.</p>
                <div className="bg-orange-900/30 p-2 rounded border border-orange-500/30">
                   <span className="text-orange-300 font-semibold text-sm">Our Action:</span> <span className="text-slate-300 text-sm">While our sensors easily detect this, our goal is to trigger the alarm in Phase A, long before the wood begins to oxidize.</span>
                </div>
              </div>
            )}
            {phase === 3 && (
              <div className="text-left">
                <h2 className="text-2xl font-black text-red-500 mb-2">Phase C: Flaming Combustion</h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-2">The gases mix with oxygen, hit 300°C+, and ignite. Satellites and standard smoke detectors finally wake up.</p>
                <div className="bg-red-900/30 p-2 rounded border border-red-500/30">
                   <span className="text-red-300 font-semibold text-sm">Our Action:</span> <span className="text-slate-300 text-sm font-bold">The system has failed. If we wait for this stage, the forest is lost.</span>
                </div>
              </div>
            )}
          </div>

          {/* THE CONTROLS */}
          <div className="w-full max-w-2xl flex justify-between bg-slate-800 p-2 rounded-xl border border-slate-700 mt-4">
            <button onClick={() => setPhase(1)} className={`w-1/3 py-3 rounded-lg font-bold transition-all ${phase === 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-700'}`}>Phase A: Pyrolysis</button>
            <button onClick={() => setPhase(2)} className={`w-1/3 py-3 rounded-lg font-bold transition-all ${phase === 2 ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:bg-slate-700'}`}>Phase B: Smoldering</button>
            <button onClick={() => setPhase(3)} className={`w-1/3 py-3 rounded-lg font-bold transition-all ${phase === 3 ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'text-slate-400 hover:bg-slate-700'}`}>Phase C: Combustion</button>
          </div>
        </div>
      )}

    </div>
  );
}