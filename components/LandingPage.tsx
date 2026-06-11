import React, { useState, useEffect } from 'react';

interface LandingPageProps {
  onLaunch: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  // Simulator State Machine
  const [simStep, setSimStep] = useState<number>(0);
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [simText, setSimText] = useState<string>("Ready to calculate...");

  // Calculator State
  const [travelFrequency, setTravelFrequency] = useState<number>(4); // trips per year
  const [fareClass, setFareClass] = useState<'3A' | 'SL'>('3A');

  // Simulator step runner
  useEffect(() => {
    if (!simRunning) return;

    let timer: number;
    if (simStep === 1) {
      setSimText("Evaluating NDLS ➔ CSMT direct... Checking availability.");
      timer = window.setTimeout(() => setSimStep(2), 1500);
    } else if (simStep === 2) {
      setSimText("Direct search saturated! Waitlist 84% probability. [REJECTED] 🚫");
      timer = window.setTimeout(() => setSimStep(3), 2000);
    } else if (simStep === 3) {
      setSimText("Scanning Graph... Evaluating NDLS ➔ BPL segment. [AVAILABLE] ✅");
      timer = window.setTimeout(() => setSimStep(4), 1800);
    } else if (simStep === 4) {
      setSimText("Evaluating BPL ➔ CSMT segment... [AVAILABLE] ✅");
      timer = window.setTimeout(() => setSimStep(5), 1800);
    } else if (simStep === 5) {
      setSimText("Validating transfer time... 45m buffer. Same-Platform walk. [APPROVED] 🦆");
      timer = window.setTimeout(() => setSimStep(6), 2000);
    } else if (simStep === 6) {
      setSimText("Jugaad Route Resolved: NDLS ➔ BPL ➔ CSMT (100% Confirmed Split)!");
      setSimRunning(false);
    }

    return () => clearTimeout(timer);
  }, [simStep, simRunning]);

  const startSimulation = () => {
    setSimStep(1);
    setSimRunning(true);
  };

  const resetSimulation = () => {
    setSimStep(0);
    setSimRunning(false);
    setSimText("Ready to calculate...");
  };

  // Savings Calculations
  const averageDirectWlPrice = fareClass === '3A' ? 1200 : 450;
  const averageSplitPrice = fareClass === '3A' ? 1350 : 500;
  const tatkalPremiumPrice = fareClass === '3A' ? 1700 : 650;

  // Benefits
  const otaConvenienceSavings = travelFrequency * 40; // OTA convenience charge saved by custom routing
  const timeSavedFromTatkalScams = travelFrequency * 3; // hours
  const directWlAutoRefundsSaved = travelFrequency * 60; // money lost on auto-cancellations

  return (
    <div className="min-h-screen pb-24 text-jugaad-text animate-slide-up">
      
      {/* Hero Section - 2 Column Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto px-4 md:px-8 py-10">
        
        {/* Hero Left: Text & CTA */}
        <div className="lg:col-span-7 space-y-6">
          {/* Animated Phineas & Ferb Header */}
          <div className="relative inline-block bg-jugaad-card border-4 border-black p-6 rounded-lg shadow-sketch transform -rotate-1 w-full max-w-xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-40 h-6 bg-yellow-200/90 transform rotate-1 shadow-sm border border-black/30"></div>
            
            <h1 className="text-4xl sm:text-5xl font-display text-jugaad-primary uppercase tracking-tight leading-none mb-1">
              YatraRoute AI
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-jugaad-bg mb-4">
              "The Jugaad-inator" ⚡
            </p>
            <p className="font-comic font-bold text-xs text-jugaad-muted leading-relaxed">
              Ferb, I know what we are going to do today! We are going to build an in-memory Directed Acyclic Graph router to hack the Indian Railways waitlist!
            </p>
          </div>

          <h2 className="text-white text-xl md:text-2xl font-display leading-tight drop-shadow-md">
            Optimizing Indian Railways' unutilized quota networks via intelligent graph-routing.
          </h2>
          
          <p className="text-blue-100 text-sm font-semibold max-w-xl leading-relaxed">
            When direct train routes are waitlisted, our edge-driven Dijkstra algorithm automatically fragments your journey into high-availability splits—either swapping seats on the same train, or layover-optimized connections. Perry Approved!
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={onLaunch}
              className="bg-[#FF5722] text-white font-display text-lg py-4 px-8 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:-rotate-1 hover:shadow-none transition-all active:translate-y-1 rounded-[10px_35px_5px_45px]"
            >
              LAUNCH JUGAAD-INATOR! 🚀
            </button>
            <a 
              href="#problem"
              className="bg-white text-black font-display text-lg py-4 px-6 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all active:translate-y-1 rounded-[15px_10px_35px_5px] text-center"
            >
              READ BLUEPRINTS 📖
            </a>
          </div>
        </div>

        {/* Hero Right: Live Dijkstra Simulator Widget */}
        <div className="lg:col-span-5">
          <div className="relative bg-white border-4 border-black rounded-lg p-5 shadow-sketch">
            {/* Corner Screws */}
            <div className="absolute top-2 left-2 w-3 h-3 rounded-full border border-black bg-gray-200 flex items-center justify-center text-[8px] font-bold">+</div>
            <div className="absolute top-2 right-2 w-3 h-3 rounded-full border border-black bg-gray-200 flex items-center justify-center text-[8px] font-bold">+</div>
            <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full border border-black bg-gray-200 flex items-center justify-center text-[8px] font-bold">+</div>
            <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full border border-black bg-gray-200 flex items-center justify-center text-[8px] font-bold">+</div>

            <div className="border-b-2 border-black pb-2 mb-4 flex justify-between items-center">
              <span className="font-display text-xs uppercase tracking-wider text-black flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full bg-jugaad-accent border border-black ${simRunning ? 'animate-ping' : ''}`}></span>
                Dijkstra Simulator v1.0
              </span>
              <span className="font-mono text-[9px] font-bold text-gray-500 uppercase">Live Demo</span>
            </div>

            {/* Simulated Nodes & Edges Canvas */}
            <div className="h-44 bg-[#E0F7FA] border-2 border-black rounded relative overflow-hidden mb-4 shadow-inner flex items-center justify-center">
              {/* Blueprint Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,119,190,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,119,190,0.05)_1px,transparent_1px)] bg-[size:15px_15px]"></div>
              
              {/* Edge: NDLS ➔ CSMT Direct */}
              <svg className="absolute inset-0 w-full h-full">
                {/* Direct line */}
                <line 
                  x1="15%" y1="50%" x2="85%" y2="50%" 
                  stroke={simStep >= 2 ? '#D32F2F' : '#000000'} 
                  strokeWidth="3" 
                  strokeDasharray={simStep === 1 ? '4 4' : '0'}
                  className={simStep === 1 ? 'animate-pulse' : ''}
                />
                
                {/* Top split lines */}
                <path 
                  d="M 50 88 Q 175 25 300 88" 
                  fill="none" 
                  stroke={simStep >= 4 ? '#00E676' : '#000'} 
                  strokeWidth="3"
                  strokeDasharray={simStep === 3 ? '4 4' : '0'}
                />
                <path 
                  d="M 300 88 Q 425 25 550 88" 
                  fill="none" 
                  stroke={simStep >= 5 ? '#00E676' : '#000'} 
                  strokeWidth="3"
                  strokeDasharray={simStep === 4 ? '4 4' : '0'}
                />
              </svg>

              {/* Node 1: NDLS */}
              <div className={`absolute left-[15%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-black flex flex-col items-center justify-center shadow-md bg-white z-10`}>
                <span className="font-display text-[9px] leading-none">NDLS</span>
                <span className="text-[8px] font-mono font-bold text-gray-500 mt-0.5">Start</span>
              </div>

              {/* Node 2: BPL (Junction) */}
              <div className={`absolute left-1/2 top-1/4 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-black flex flex-col items-center justify-center shadow-md z-10 transition-colors duration-500 ${simStep >= 3 ? 'bg-green-100' : 'bg-white'}`}>
                <span className="font-display text-[9px] leading-none">BPL</span>
                <span className="text-[7px] font-bold text-jugaad-primary mt-0.5">PLAT 2</span>
              </div>

              {/* Node 3: CSMT */}
              <div className={`absolute right-[15%] top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 rounded-full border-2 border-black flex flex-col items-center justify-center shadow-md z-10 transition-colors duration-500 ${simStep >= 5 ? 'bg-green-100' : simStep === 2 ? 'bg-red-100' : 'bg-white'}`}>
                <span className="font-display text-[9px] leading-none">CSMT</span>
                <span className="text-[8px] font-mono font-bold text-gray-500 mt-0.5">Dest</span>
              </div>

              {/* Direct status flags */}
              {simStep === 2 && (
                <div className="absolute top-[58%] left-1/2 -translate-x-1/2 bg-red-500 border border-black text-white text-[7px] font-bold font-mono px-1.5 py-0.5 rounded shadow">
                  WL SATURATED (84%)
                </div>
              )}
              {simStep >= 5 && (
                <div className="absolute top-[32%] left-[20%] bg-green-500 border border-black text-white text-[7px] font-bold font-mono px-1.5 py-0.5 rounded shadow">
                  CONFIRMED SPLIT
                </div>
              )}
            </div>

            {/* Sim Info Box */}
            <div className="bg-yellow-50 border-2 border-black border-dashed p-3 rounded text-[10px] font-mono font-bold min-h-[50px] flex items-center justify-center text-center">
              &gt; {simText}
            </div>

            {/* Sim Controls */}
            <div className="mt-4 flex gap-2">
              <button 
                onClick={startSimulation}
                disabled={simRunning || simStep > 0}
                className={`flex-1 font-display text-xs uppercase py-2 px-4 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all rounded ${simRunning || simStep > 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-jugaad-accent text-white hover:bg-cyan-500'}`}
              >
                Run Dijkstra ⚡
              </button>
              <button 
                onClick={resetSimulation}
                className="font-display text-xs uppercase py-2 px-4 border-2 border-black bg-white text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-y-0.5 active:shadow-none transition-all rounded"
              >
                Reset 🔄
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* Main Grid: Problem & Solution Details */}
      <main id="problem" className="max-w-7xl mx-auto px-4 md:px-8 mt-10 space-y-12">
        
        {/* Section 1: Problem vs Solution (Side by Side) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: The Problem */}
          <div className="bg-white border-2 border-black rounded-lg p-6 shadow-sketch relative flex flex-col justify-between">
            <div className="absolute top-3 right-3 text-3xl">🚫</div>
            
            <div>
              <h3 className="font-display text-lg text-jugaad-danger uppercase mb-4 border-b border-gray-200 pb-2">
                1. The Waitlist Saturation Bottleneck
              </h3>
              
              <div className="space-y-4 text-xs font-semibold leading-relaxed text-gray-700">
                <p>
                  Linear search architectures fail to aggregate inventory correctly. When a traveler searches Delhi to Mumbai, booking engines query only that direct bucket. If it's waitlisted, the platform sells nothing, while thousands of seats are vacant on segments in-between (e.g. Delhi to Bhopal, Bhopal to Mumbai).
                </p>
                <p>
                  Travelers are forced to gamble on Tatkal quotas or look at expensive air tickets, leading to severe passenger friction and substantial revenue loss for operators.
                </p>
              </div>
            </div>

            {/* Linear Diagram */}
            <div className="mt-6 border-2 border-black border-dashed rounded p-3 bg-red-50 text-[10px] font-mono font-bold">
              <div className="flex justify-between items-center text-red-700 mb-1">
                <span>NDLS ➔ CSMT (Direct Query)</span>
                <span>STATUS: WAITLIST 48</span>
              </div>
              <div className="h-1 bg-red-400 w-full rounded relative mb-3">
                <div className="absolute top-[-4px] left-0 w-3 h-3 bg-red-600 rounded-full"></div>
                <div className="absolute top-[-4px] right-0 w-3 h-3 bg-red-600 rounded-full"></div>
              </div>
              <div className="text-[9px] font-comic font-normal text-jugaad-muted leading-snug">
                Linear query reads a single database index. Because there are no seats for the full 1400km journey, it flags the route as waitlisted—completely ignoring empty vacancies.
              </div>
            </div>
          </div>

          {/* Right Column: The Solution */}
          <div className="bg-jugaad-card border-2 border-black rounded-lg p-6 shadow-sketch relative flex flex-col justify-between">
            <div className="absolute top-3 right-3 text-3xl animate-float">💡</div>

            <div>
              <h3 className="font-display text-lg text-jugaad-bg uppercase mb-4 border-b-2 border-black pb-2">
                2. The Dynamic Graph Architecture
              </h3>

              <div className="space-y-4 text-xs font-bold leading-relaxed text-jugaad-muted">
                <p>
                  YatraRoute AI views the entire national railway network as a Directed Acyclic Graph (DAG). Nodes are railway stations, and edges are train legs weighted by timing schedules, platform distance, and seat availabilities.
                </p>
                <p>
                  Our engine instantly computes alternative split paths: Station Splits (linking two trains) and Seat Splits (swapping berths in the same train).
                </p>
              </div>
            </div>

            {/* Split Diagram */}
            <div className="mt-6 border-2 border-black border-dashed rounded p-3 bg-green-50 text-[10px] font-mono font-bold">
              <div className="flex justify-between items-center text-green-700 mb-1">
                <span>NDLS ➔ BPL (Train 1) ➔ CSMT (Train 2)</span>
                <span>STATUS: AVAILABLE (100%)</span>
              </div>
              <div className="h-1 bg-green-400 w-full rounded relative mb-3 flex justify-between">
                <div className="w-3 h-3 bg-green-600 rounded-full mt-[-4px]"></div>
                <div className="w-3.5 h-3.5 bg-jugaad-primary border border-black rounded-full mt-[-5px] flex items-center justify-center text-[7px] text-white">B</div>
                <div className="w-3 h-3 bg-green-600 rounded-full mt-[-4px]"></div>
              </div>
              <div className="text-[9px] font-comic font-normal text-jugaad-muted leading-snug">
                Graph query processes multi-index segments. Splits are optimized by platform proximity (same/adjacent platform layovers) to make transfers effortless.
              </div>
            </div>
          </div>

        </section>

        {/* Section 2: Market size & Interactive savings calculator */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Interactive Calculator Widget: Spans 7 columns */}
          <div className="lg:col-span-7 bg-white border-2 border-black rounded-lg p-6 shadow-sketch flex flex-col justify-between">
            <div>
              <h3 className="font-display text-lg text-black uppercase mb-4 border-b-2 border-black pb-2">
                💰 Travel Savings & Convenience Calculator
              </h3>
              <p className="text-xs font-bold leading-relaxed mb-6 text-gray-600">
                Adjust your travel habits below to estimate the annual savings and safety benefits generated by YatraRoute AI's automated routing:
              </p>

              <div className="space-y-6">
                {/* Inputs */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase mb-2">
                    ✈️ How many round trips do you make a year? ({travelFrequency} Trips)
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="12" 
                    value={travelFrequency}
                    onChange={(e) => setTravelFrequency(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 border-2 border-black rounded-lg appearance-none cursor-pointer accent-jugaad-primary"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-gray-400 mt-1 font-mono">
                    <span>1 TRIP</span>
                    <span>6 TRIPS</span>
                    <span>12 TRIPS</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase mb-2">
                    🎟️ What ticket class do you usually travel in?
                  </label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setFareClass('3A')}
                      className={`flex-1 font-display text-xs uppercase py-2 px-4 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all rounded ${fareClass === '3A' ? 'bg-jugaad-primary text-white' : 'bg-white text-black'}`}
                    >
                      3AC Class (AC Sleeper)
                    </button>
                    <button 
                      onClick={() => setFareClass('SL')}
                      className={`flex-1 font-display text-xs uppercase py-2 px-4 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all rounded ${fareClass === 'SL' ? 'bg-jugaad-primary text-white' : 'bg-white text-black'}`}
                    >
                      Sleeper Class (Non-AC)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculations Output */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-green-50 border-2 border-black p-3.5 rounded text-center shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <span className="text-[9px] font-extrabold uppercase text-green-800 block">Total Saved</span>
                <span className="text-xl font-display text-green-700 block my-1">₹{otaConvenienceSavings + directWlAutoRefundsSaved}</span>
                <span className="text-[8px] font-mono text-gray-500 block">Refunds & fees</span>
              </div>
              <div className="bg-orange-50 border-2 border-black p-3.5 rounded text-center shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <span className="text-[9px] font-extrabold uppercase text-orange-800 block">Boredom Saved</span>
                <span className="text-xl font-display text-jugaad-primary block my-1">{timeSavedFromTatkalScams} Hours</span>
                <span className="text-[8px] font-mono text-gray-500 block">In busy queues</span>
              </div>
              <div className="bg-blue-50 border-2 border-black p-3.5 rounded text-center shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <span className="text-[9px] font-extrabold uppercase text-blue-800 block">Seat Success</span>
                <span className="text-xl font-display text-jugaad-accent block my-1">98% vs 30%</span>
                <span className="text-[8px] font-mono text-gray-500 block">Confirmed splits</span>
              </div>
            </div>
          </div>

          {/* Market Stats Panel: Spans 5 columns */}
          <div className="lg:col-span-5 bg-jugaad-card border-2 border-black rounded-lg p-6 shadow-sketch flex flex-col justify-between">
            <div>
              <h3 className="font-display text-lg text-black uppercase mb-4 border-b-2 border-black pb-2">
                📈 Market Scale & Reach
              </h3>
              <ul className="space-y-4 text-xs font-bold leading-normal text-jugaad-muted font-comic">
                <li className="flex items-start gap-2.5">
                  <span className="text-lg">🚅</span>
                  <span><strong>22M+ Daily Passengers</strong> travel on Indian Railways—creating a massive, high-volume consumer booking market.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-lg">🎫</span>
                  <span><strong>Waitlist Panic</strong> is a major stress factor. Travelers are highly motivated to pay small convenience fees for verified confirmed seating alternatives.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-lg">💸</span>
                  <span><strong>B2B Partnerships</strong> enable zero-acquisition-cost growth by integrating directly into OTAs (like RedRail/MMT) as a waitlist insurance API plugin.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 bg-white border-2 border-black rounded p-3 text-[10px] italic font-semibold text-center border-dashed">
              "Building YatraRoute AI into travel search platforms unlocks up to 18% in incremental booking conversions!"
            </div>
          </div>

        </section>

        {/* Section 3: Business Model & Architecture (Side by side) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Business Model & Scaling */}
          <div className="bg-white border-2 border-black rounded-lg p-6 shadow-sketch flex flex-col justify-between">
            <div>
              <h3 className="font-display text-lg text-black uppercase mb-4 border-b-2 border-black pb-2">
                ⚙️ Technical Scale Strategy
              </h3>
              <p className="text-xs font-bold leading-relaxed text-gray-600 mb-4">
                Routing schedules on a massive railway network is computationally heavy. YatraRoute AI implements a multi-tier scaling strategy:
              </p>
              
              <div className="space-y-3.5 text-xs font-semibold leading-relaxed">
                <div>
                  <h4 className="font-display text-xs text-jugaad-primary uppercase">🛡️ Sub-Graph Sharding</h4>
                  <p className="text-[10px] text-gray-500 font-comic leading-normal mt-0.5">
                    Instead of processing a global network map, we partition railway grids by geographic zones (Northern, Western, etc.). Complex transfers are sharded by major interchange hubs.
                  </p>
                </div>
                <div>
                  <h4 className="font-display text-xs text-jugaad-accent uppercase">⚡ Redis Cache Layer</h4>
                  <p className="text-[10px] text-gray-500 font-comic leading-normal mt-0.5">
                    Static train routes change semi-annually. Computed paths are indexed and cached on Redis, returning instant results and offloading database strain during high-concurrency Tatkal booking hours.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#E0F7FA] border border-black p-3 rounded text-[10px] font-bold font-mono">
              ⚡ Edge Computing: Run Dijkstra calculations in-memory on the client frontend. Instant sub-second page loads.
            </div>
          </div>

          {/* Business Pitch Summary */}
          <div className="bg-jugaad-card border-2 border-black rounded-lg p-6 shadow-sketch flex flex-col justify-between">
            <div>
              <h3 className="font-display text-lg text-black uppercase mb-4 border-b-2 border-black pb-2">
                📊 Monetization & Value Prop
              </h3>
              <p className="text-xs font-bold leading-relaxed text-jugaad-muted mb-4">
                How YatraRoute AI captures value from the booking ecosystem:
              </p>

              <div className="space-y-4 text-xs font-bold font-comic leading-normal text-jugaad-muted">
                <div className="flex items-start gap-2">
                  <span className="text-sm">🎫</span>
                  <span><strong>Micro-Convenience Fee</strong>: Charging a flat ₹15-₹20 fee on successful split route bookings that rescue travelers from waitlist cancellation.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm">📈</span>
                  <span><strong>OTA Revenue Sharing</strong>: Splitting commission earnings on the double-ticket booking volume generated for aggregators (RedRail/ixigo).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm">🛡️</span>
                  <span><strong>Waitlist Insurance Upsell</strong>: Package splits as a premium "Confirmed Berth Guarantee" add-on during reservation checkouts.</span>
                </div>
              </div>
            </div>

            <button 
              onClick={onLaunch}
              className="mt-6 bg-[#FF5722] text-white font-display text-sm py-3 px-6 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all active:translate-y-1 rounded-[5px_20px_5px_25px]"
            >
              LAUNCH THE INVENTION NOW! 🎡
            </button>
          </div>

        </section>

      </main>

      {/* Team Footer Section */}
      <footer className="max-w-7xl mx-auto px-4 md:px-8 mt-16 pt-8 pb-12 border-t-2 border-black border-dashed flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3 bg-white border-2 border-black p-3.5 rounded-lg shadow-sketch transform -rotate-1">
          <span className="text-3xl">🛠️</span>
          <div className="text-left text-black">
            <h4 className="font-display text-sm uppercase leading-none">A2N Team</h4>
            <p className="text-[10px] text-gray-500 font-comic font-bold mt-1">Anand Minejes & Jyotasana</p>
          </div>
        </div>
        
        <div className="text-center md:text-right">
          <p className="font-display text-xs text-white drop-shadow-sm uppercase">YATRAROUTE AI</p>
          <p className="text-[10px] font-bold text-yellow-200 font-comic mt-0.5">Ferb, I know what we're gonna do today! © 2026</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
