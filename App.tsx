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
  };

  return (
    <div className="min-h-screen pb-24">
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
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`${view === 'landing' ? 'max-w-7xl' : 'max-w-xl'} mx-auto px-4 sm:px-6 mt-4`}>
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
                <div className="animate-fade-in-up">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="w-10 h-10 bg-jugaad-primary border-2 border-white rounded-full flex items-center justify-center shadow-lg text-white text-xl">
                            🎢
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase text-yellow-200">The Big Ideas</p>
                            <h2 className="text-2xl font-display text-white leading-none">TODAY'S BLUEPRINTS</h2>
                        </div>
                    </div>
                    
                    {/* Back Button */}
                    <div className="mb-4 px-2">
                        <button onClick={() => setData(null)} className="text-sm font-bold text-white hover:text-yellow-200 uppercase tracking-wider flex items-center gap-1">
                            <span>🔙</span> Back to Drawing Board
                        </button>
                    </div>

                    {/* Engine logs */}
                    {data.logs && data.logs.length > 0 && (
                        <AnalysisPanel logs={data.logs} />
                    )}

                    {/* Ranked List */}
                    <div className="space-y-2">
                        {data.routes.map((route) => (
                            <JugaadCard key={route.id} route={route} />
                        ))}
                    </div>
                </div>
            )}
          </div>
        )}
      </main>

      {/* Backpack Drawer Modal (Easter Egg) */}
      {showBackpack && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-jugaad-card border-4 border-black p-5 rounded-lg shadow-sketch max-w-xs w-full relative text-center">
            <h3 className="font-display text-lg text-jugaad-primary mb-3">🎒 INVENTOR'S BACKPACK</h3>
            <ul className="text-xs font-bold font-comic space-y-2 text-left bg-white border-2 border-black border-dashed p-3 rounded mb-4">
              <li>🔧 1x Standard Wrench-inator</li>
              <li>📐 3x Roll of Blueprint Paper</li>
              <li>🍘 1x Bag of Platypus Treats</li>
              <li>🌭 2x Half-eaten Corndog</li>
              <li>🤖 1x Micro-agent GPS chip</li>
            </ul>
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