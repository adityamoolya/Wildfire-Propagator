import { useState } from 'react';
import { Cpu, Network, Clock, Fingerprint, Globe, XCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export default function InnovationTab() {
  const [activePillar, setActivePillar] = useState('calibration');

  const pillars = {
    calibration: {
      id: 'calibration',
      title: 'Dynamic Micro-Climate Calibration',
      icon: <Fingerprint size={24} />,
      tagline: 'Self-adjusting thresholds for any biome on Earth.',
      tradition: {
        title: 'Pre-Trained Geographic AI',
        points: [
          'Relies on static ML models trained on distant environments (e.g., California Pines).',
          'Fails completely in Indian Deciduous forests due to different baseline humidity.',
          'Generates massive false alarms during local monsoon or dry seasons.'
        ]
      },
      innovation: {
        title: 'The 96-Hour Rule',
        points: [
          'Node spends its first 4 days passively logging local background data.',
          'Calculates a mathematically perfect localized Mean and Standard Deviation.',
          'Creates a dynamic Z-Score threshold, making the system 100% biome-agnostic.'
        ]
      }
    },
    architecture: {
      id: 'architecture',
      title: 'Hybrid Edge-Mesh Topology',
      icon: <Network size={24} />,
      tagline: 'Decentralized verification to save power and bandwidth.',
      tradition: {
        title: 'Dumb Node / Cloud Heavy',
        points: [
          'Sensors instantly blast every data spike to the Cloud via expensive 4G/LoRa.',
          'Drains battery in weeks due to constant heavy radio transmission.',
          'Fails instantly if the central cell tower or internet goes offline.'
        ]
      },
      innovation: {
        title: 'Cluster-Tree Computing',
        points: [
          'Nodes use zero-cost ESP-NOW to interrogate neighboring trees locally.',
          'Z-Score anomaly verification happens on the Edge (Sub-₹500 microcontroller).',
          'Only confirmed anomalies trigger a LoRa transmission, reducing radio use by 95%.'
        ]
      }
    },
    prevention: {
      id: 'prevention',
      title: 'Pre-Ignition Chemical Detection',
      icon: <Clock size={24} />,
      tagline: 'Exploiting the 30-minute Golden Window.',
      tradition: {
        title: 'Reactive Thermal/Optical',
        points: [
          'Satellites (MODIS) and watchtower cameras wait for visible flames or massive heat.',
          'By the time detection occurs, thermal runaway has started.',
          'Forest destruction is already guaranteed.'
        ]
      },
      innovation: {
        title: 'Proactive Pyrolysis Targeting',
        points: [
          'Targets the smoldering phase BEFORE oxidation (flames) occurs.',
          'Detects massive invisible Carbon Monoxide and VOC off-gassing.',
          'Gives rangers a 15-to-30 minute window to neutralize the heat source.'
        ]
      }
    },
    hardware: {
      id: 'hardware',
      title: 'Hardware-Agnostic Payload',
      icon: <Cpu size={24} />,
      tagline: 'The value is in the system, not the plastic.',
      tradition: {
        title: 'Proprietary Vendor Lock-In',
        points: [
          'Governments are forced to buy overpriced $5000 commercial sensor suites.',
          'Cannot upgrade individual parts without replacing the entire system.',
          'Prohibits mass-deployment in developing nations.'
        ]
      },
      innovation: {
        title: 'Modular Logic Framework',
        points: [
          'The core system architecture is completely decoupled from the physical sensor payload.',
          'The prototype utilizes ultra-affordable MQ sensors to demonstrate massive, low-cost scalability.',
          'Authorities can seamlessly hot-swap to high-end industrial sensors without altering the underlying system logic.'
        ]
      }
    },
    api: {
      id: 'api',
      title: 'Open Telemetry API',
      icon: <Globe size={24} />,
      tagline: 'Decentralizing disaster intelligence.',
      tradition: {
        title: 'Siloed & Lacking Infrastructure',
        points: [
          'Major mapping platforms (e.g., Google Maps) lack real-time fire detection features in India, unlike regions like Australia.',
          'Fire alerts remain hidden in siloed government department dashboards.',
          'Citizens must rely on slow public announcements or visual smoke.'
        ]
      },
      innovation: {
        title: 'The RESTful Ecosystem',
        points: [
          'Rolls out an external, open API to democratize real-time forest telemetry.',
          'Third-party developers and local map apps can subscribe to our feed to integrate fire data into their own platforms.',
          'Directly solves the geospatial blindspot for disaster tracking in India.'
        ]
      }
    }
  };

  const activeData = pillars[activePillar as keyof typeof pillars];

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-10">
      
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-white tracking-tight">The Innovation Matrix</h2>
        <p className="text-slate-400 text-lg">Five architectural pillars that redefine early-warning forestry systems.</p>
      </div>

      {/* --- TOP NAVIGATION BAR --- */}
      <div className="flex w-full bg-slate-900 rounded-2xl border border-slate-700 p-2 shadow-xl overflow-x-auto no-scrollbar">
        {Object.values(pillars).map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePillar(p.id)}
            className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 min-w-[150px] ${
              activePillar === p.id 
                ? 'bg-blue-600/20 border-b-4 border-blue-500 shadow-[inset_0_-10px_20px_rgba(59,130,246,0.1)]' 
                : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <div className={`${activePillar === p.id ? 'text-blue-400 animate-bounce' : 'text-slate-500'} mb-2`}>
              {p.icon}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider text-center ${activePillar === p.id ? 'text-white' : ''}`}>
              {p.title.split(' ')[0]} {p.title.split(' ')[1]}
            </span>
          </button>
        ))}
      </div>

      {/* --- THE COMPARISON STAGE --- */}
      <div className="w-full bg-[#0a0f1c] border border-slate-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-fade-in flex flex-col">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[200px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="text-center mb-10 relative z-10">
          <h3 className="text-3xl font-black text-white mb-3">{activeData.title}</h3>
          <p className="text-blue-400 font-mono text-sm tracking-widest uppercase">{activeData.tagline}</p>
        </div>

        <div className="flex w-full space-x-8 relative z-10">
          
          {/* LEFT: TRADITIONAL SYSTEMS */}
          <div className="w-1/2 bg-slate-900/80 border border-red-900/50 rounded-2xl p-8 relative overflow-hidden group hover:border-red-500/50 transition-colors duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-900"></div>
            
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-800 pb-4">
              <XCircle className="text-red-500" size={28} />
              <h4 className="text-xl font-bold text-slate-300">Traditional Systems</h4>
            </div>
            
            <h5 className="text-red-400 font-black text-lg mb-6 tracking-wide">{activeData.tradition.title}</h5>
            
            <ul className="space-y-5">
              {activeData.tradition.points.map((point, idx) => (
                <li key={idx} className="flex items-start text-slate-400 text-sm leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-900 mt-2 mr-3 flex-shrink-0"></div>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: YOUR INNOVATION */}
          <div className="w-1/2 bg-blue-950/20 border border-blue-500/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.1)] group hover:border-blue-400 transition-colors duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-400"></div>
            
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-800 pb-4">
              <CheckCircle2 className="text-blue-400" size={28} />
              <h4 className="text-xl font-bold text-white">Our Architecture</h4>
            </div>
            
            <h5 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-black text-lg mb-6 tracking-wide">
              {activeData.innovation.title}
            </h5>
            
            <ul className="space-y-5">
              {activeData.innovation.points.map((point, idx) => (
                <li key={idx} className="flex items-start text-slate-300 text-sm leading-relaxed font-medium">
                  <ChevronRight className="text-emerald-500 mr-2 flex-shrink-0" size={18} />
                  {point}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}