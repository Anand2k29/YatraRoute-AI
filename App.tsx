import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import JugaadCard from './components/JugaadCard';
import AnalysisPanel from './components/AnalysisPanel';
import LandingPage from './components/LandingPage';
import { SearchParams, SearchResponse } from './types';
import { findRoutes } from './services/geminiService';

function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showBackpack, setShowBackpack] = useState(false);
  const [backpackMessage, setBackpackMessage] = useState<string | null>(null);

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await findRoutes(params.source, params.destination, params.date);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const toggleBackpack = () => {
    setShowBackpack(!showBackpack);
    setBackpackMessage(null); // Reset message when opening/closing
  };

  return (
    <div className="min-h-screen pb-36">
      {/* Header (Only show for search/app view, or styled minimally) */}
      {view === 'app' && (
        <header className="pt-8 pb-4 px-6 animate-slide-up">
          <div className="max-w-xl mx-auto text-center relative">
            {/* Nav Links */}
            <div className="flex justify-center gap-4 mb-2 text-xs font-bold uppercase tracking-wider text-yellow-200">
              <button 
                onClick={() => { setView('landing'); setData(null); }}
                className="hover:text-white transition-colors"
              >
                🏠 HQ Landing
              </button>
              <span>|</span>
              <button 
                onClick={() => { setView('app'); setData(null); }}
                className="text-white border-b border-white pb-0.5"
              >
                ⚙️ Jugaad-inator Board
              </button>
            </div>
            
            <h1 className="text-4xl text-white drop-shadow-md transform -rotate-2 cursor-pointer font-display tracking-tight" onClick={() => { setView('landing'); setData(null); }}>
                YATRAROUTE AI
            </h1>
            <p className="text-yellow-200 font-bold text-sm font-comic tracking-wide mt-1">
                Ferb, I know what we're gonna do today!
            </p>
            <p className="text-[10px] text-white/90 font-comic font-bold uppercase tracking-wider mt-1.5 bg-black/20 py-0.5 px-2 rounded-full inline-block">
                Developed by Team A2N (Anand Minejes & Jyotasana)
            </p>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`${view === 'landing' || data ? 'max-w-7xl' : 'max-w-xl'} mx-auto px-4 sm:px-6 mt-4`}>
        {view === 'landing' ? (
          <LandingPage onLaunch={() => setView('app')} />
        ) : (
          <div className="animate-slide-up">
            {!data && (
                <>
                    <div className="mb-6 text-center">
                        <h2 className="text-white font-display text-xl flex items-center justify-center gap-2">
                            <span>💡</span> Hey Student, ready for adventure?
                        </h2>
                    </div>
                    <SearchForm onSearch={handleSearch} isLoading={loading} />
                </>
            )}

            {error && (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-lg mb-6 text-center font-bold shadow-sketch">
                💥 {error}
              </div>
            )}

            {data && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in-up">
                    
                    {/* Left Column: New Search Form & Calculations Log */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Compact Search Trigger */}
                        <div className="bg-jugaad-card border-2 border-black rounded-lg p-5 shadow-sketch relative">
                            {/* Screw Accent */}
                            <div className="absolute top-1 left-1 w-2 h-2 rounded-full border border-black bg-gray-200 flex items-center justify-center text-[5px]">+</div>
                            <div className="absolute top-1 right-1 w-2 h-2 rounded-full border border-black bg-gray-200 flex items-center justify-center text-[5px]">+</div>
                            
                            <h3 className="font-display text-sm uppercase text-black mb-3 text-center transform -rotate-1">
                              ⚙️ NEW ROUTE BLUEPRINT
                            </h3>
                            <SearchForm onSearch={handleSearch} isLoading={loading} compact={true} />
                        </div>

                        {/* Engine logs */}
                        {data.logs && data.logs.length > 0 && (
                            <AnalysisPanel logs={data.logs} />
                        )}
                    </div>

                    {/* Right Column: Route Blueprints Results List */}
                    <div className="lg:col-span-7 space-y-4">
                        {/* Section Header */}
                        <div className="flex items-center gap-3 mb-2 px-2">
                            <div className="w-10 h-10 bg-jugaad-primary border-2 border-white rounded-full flex items-center justify-center shadow-lg text-white text-xl">
                                🎢
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase text-yellow-200">The Big Ideas</p>
                                <h2 className="text-2xl font-display text-white leading-none">TODAY'S BLUEPRINTS</h2>
                            </div>
                        </div>
                        
                        {/* Back Button */}
                        <div className="mb-4">
                            <button onClick={() => setData(null)} className="text-sm font-bold text-white hover:text-yellow-200 uppercase tracking-wider flex items-center gap-1">
                                <span>🔙</span> Back to Drawing Board
                            </button>
                        </div>

                        {/* Ranked List */}
                        <div className="space-y-4">
                            {data.routes.map((route) => (
                                <JugaadCard key={route.id} route={route} />
                            ))}
                        </div>
                    </div>

                </div>
            )}
          </div>
        )}
      </main>

      {/* Backpack Drawer Modal (Interactive Easter Egg) */}
      {showBackpack && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-jugaad-card border-4 border-black p-5 rounded-lg shadow-sketch max-w-sm w-full relative text-center">
            <h3 className="font-display text-lg text-jugaad-primary mb-3">🎒 INVENTOR'S BACKPACK</h3>
            
            {backpackMessage ? (
              <div className="bg-white border-2 border-black p-4 rounded mb-4 font-comic text-xs">
                <p className="font-bold text-black mb-3 leading-relaxed">{backpackMessage}</p>
                <button 
                  onClick={() => setBackpackMessage(null)}
                  className="bg-jugaad-accent text-white font-display text-[11px] py-1 px-4 border-2 border-black hover:bg-cyan-500 transition-colors rounded shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                >
                  🔙 Back to Bag
                </button>
              </div>
            ) : (
              <ul className="text-xs font-bold font-comic space-y-2.5 text-left bg-white border-2 border-black border-dashed p-3 rounded mb-4">
                <li 
                  onClick={() => setBackpackMessage("🔧 CLANK! You tweaked the Jugaad-inator's pathfinder gears. Search speed increased by 10%!")}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded border border-transparent hover:border-black flex items-center gap-2 transition-all"
                >
                  <span>🔧</span> <span>Standard Wrench-inator (Use tool)</span>
                </li>
                <li 
                  onClick={() => setBackpackMessage("📐 Unrolling paper... Behold! A blueprint for the 'Waitlist Bypass Jetpack'. Ready to build!")}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded border border-transparent hover:border-black flex items-center gap-2 transition-all"
                >
                  <span>📐</span> <span>Roll of Blueprint Paper (3x)</span>
                </li>
                <li 
                  onClick={() => setBackpackMessage("🍘 CHOMP! Agent P appeared from under the table, devoured the treat, tipped his fedora, and disappeared! 🦆")}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded border border-transparent hover:border-black flex items-center gap-2 transition-all"
                >
                  <span>🍘</span> <span>Platypus Treats (1x)</span>
                </li>
                <li 
                  onClick={() => setBackpackMessage("🌭 YUCK! It's a bit cold, but it looks like Pinky the Chinchilla took a bite out of it.")}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded border border-transparent hover:border-black flex items-center gap-2 transition-all"
                >
                  <span>🌭</span> <span>Half-eaten Corndog (2x)</span>
                </li>
                <li 
                  onClick={() => setBackpackMessage("🤖 PING! Signal dispatched to Major Monogram. Status: Waiting for debriefing...")}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded border border-transparent hover:border-black flex items-center gap-2 transition-all"
                >
                  <span>🤖</span> <span>Micro-agent GPS chip (1x)</span>
                </li>
              </ul>
            )}

            <button 
              onClick={toggleBackpack}
              className="bg-black text-white font-display text-sm py-2 px-6 border-2 border-black hover:bg-gray-800 transition-colors"
            >
              CLOSE BACKPACK
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-jugaad-primary border-t-2 border-black py-2 px-6 pb-6 z-40 shadow-[0_-4px_0px_rgba(0,0,0,0.2)]">
          <div className="max-w-xl mx-auto flex justify-between items-center text-white">
              <div 
                className={`flex flex-col items-center gap-1 cursor-pointer group ${view === 'landing' ? 'text-yellow-200' : ''}`}
                onClick={() => { setView('landing'); setData(null); }}
              >
                  <span className="text-2xl drop-shadow-sm group-hover:-translate-y-1 transition-transform">🏠</span>
                  <span className="text-[10px] font-bold uppercase">HQ</span>
              </div>
              <div 
                className={`flex flex-col items-center gap-1 cursor-pointer group ${view === 'app' ? 'text-yellow-200' : ''}`}
                onClick={() => { setView('app'); setData(null); }}
              >
                  <span className="text-2xl drop-shadow-sm group-hover:-translate-y-1 transition-transform">🔍</span>
                  <span className="text-[10px] font-bold uppercase">New Plan</span>
              </div>
              <div 
                className="flex flex-col items-center gap-1 cursor-pointer group"
                onClick={toggleBackpack}
              >
                  <span className="text-2xl drop-shadow-sm group-hover:-translate-y-1 transition-transform">🎒</span>
                  <span className="text-[10px] font-bold uppercase">Backpack</span>
              </div>
          </div>
      </nav>
    </div>
  );
}

export default App;