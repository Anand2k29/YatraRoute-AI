import React, { useState } from 'react';
import { RankedRoute } from '../types';
import { TatkalAlarmModal } from './TatkalAlarmModal';

interface JugaadCardProps {
  route: RankedRoute;
}

const JugaadCard: React.FC<JugaadCardProps> = ({ route }) => {
  const [showFares, setShowFares] = useState(false);
  const [showAlarmModal, setShowAlarmModal] = useState(false);

  // Cartoon Status Logic
  const getBadgeContent = (type: string) => {
    switch (type) {
      case 'SAFE': return { text: 'PERRY APPROVED', color: 'bg-jugaad-accent text-white', icon: '🦆' };
      case 'RISKY': return { text: 'BUSTED!', color: 'bg-jugaad-danger text-white', icon: '🚫' };
      default: return { text: 'EXPERIMENTAL', color: 'bg-yellow-300 text-black', icon: '🧪' };
    }
  };

  const getStatusColor = (status: string) => {
      const upper = status.toUpperCase();
      if (upper.includes('AVAILABLE') || upper.includes('AVL')) return 'text-green-700 font-extrabold';
      if (upper.includes('RAC')) return 'text-orange-600 font-bold';
      return 'text-red-600 font-bold';
  };

  const redRailPrice = route.fareAnalysis.prices.find(p => p.platformName.includes('RedRail'))?.finalPrice || 0;
  const irctcPrice = route.fareAnalysis.prices.find(p => p.platformName.includes('IRCTC'))?.finalPrice || 0;
  const savings = Math.max(0, irctcPrice - redRailPrice);
  
  const junctionCode = route.type === 'split' && route.stations[1] 
    ? route.stations[1].substring(0, 3) 
    : route.stations[route.stations.length-1].substring(0, 3);

  const isSeatSplit = route.id.startsWith("seat-split");

  const handleExportBlueprint = () => {
      const shareMessage = `Hey Ferb, I know what we're gonna do today! I found a waitlist-bypassing ticket blueprint using YatraRoute AI.
Route: ${route.legs[0].sourceStation} ➔ ${route.legs[route.legs.length-1].destinationStation}
Train details: ${route.legs[0].trainName} (${route.legs[0].trainNumber})
Check it out on YatraRoute AI!`;
      
      navigator.clipboard.writeText(shareMessage);
      alert("📐 Blueprint successfully exported to clipboard! Send it to Ferb or your co-traveler!");
  };

  return (
    <div className="relative bg-jugaad-card border-2 border-black rounded-lg p-5 mb-6 shadow-sketch transition-transform hover:-translate-y-0.5">
      {/* Tape Effect */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-yellow-200/80 transform -rotate-2 shadow-sm"></div>

      {/* Header Section */}
      <div className="flex items-start gap-4 mb-4 mt-2">
        {/* Gear Icon */}
        <div className="w-16 h-16 flex-shrink-0 bg-white border-2 border-black rounded-full flex items-center justify-center relative shadow-sm">
            <span className="font-display font-bold text-black text-lg">{junctionCode}</span>
            <div className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-full animate-spin-slow"></div>
            <span className="absolute -bottom-2 -right-2 text-2xl drop-shadow-sm">
              {isSeatSplit ? '🔄' : '⚙️'}
            </span>
        </div>

        {/* Title & Badges */}
        <div className="flex-grow">
            <h3 className="font-display text-xl text-black leading-tight mb-2">
                {route.title}
            </h3>
            <div className="flex items-center flex-wrap gap-2">
                 {route.badges.map((badge, idx) => {
                     const style = getBadgeContent(badge.type);
                     return (
                         <span key={idx} className={`inline-flex items-center gap-1 px-2 py-0.5 border-2 border-black rounded text-[9px] font-bold uppercase tracking-wide ${style.color} shadow-[2px_2px_0px_rgba(0,0,0,1)]`}>
                             <span>{style.icon}</span> {badge.label}
                         </span>
                     );
                 })}
                 <span className="text-[10px] font-bold bg-white border-2 border-black px-2 py-0.5 rounded shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    ⏱️ {route.totalDuration}
                 </span>
            </div>
        </div>
      </div>

      {/* The Schematic Path (Vertical Timeline) */}
      <div className="bg-white border-2 border-black border-dashed rounded p-4 mb-4 relative shadow-inner">
         {/* Corner Screws */}
         <div className="absolute top-1 left-1 w-2 h-2 rounded-full border border-gray-400 flex items-center justify-center text-[6px] text-gray-400">+</div>
         <div className="absolute top-1 right-1 w-2 h-2 rounded-full border border-gray-400 flex items-center justify-center text-[6px] text-gray-400">+</div>
         
         <div className="flex flex-col gap-0 relative">
            
            {/* Leg 1 */}
            <div className="flex items-center gap-3 relative z-10">
                <span className="text-2xl filter drop-shadow-sm">🚆</span>
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded p-2">
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm font-comic">
                            {route.legs[0].trainName} <span className="text-xs text-gray-500 font-mono">({route.legs[0].trainNumber})</span>
                        </span>
                        <span className={`text-xs ${getStatusColor(route.legs[0].status)}`}>{route.legs[0].status}</span>
                    </div>
                    <div className="text-xs font-mono text-gray-600 font-bold">
                        {route.legs[0].sourceStation} <span className="mx-1">➔</span> {route.legs[0].destinationStation}
                    </div>
                    <div className="text-[10px] text-gray-500">
                        {route.legs[0].departureTime} ➡️ {route.legs[0].arrivalTime}
                    </div>
                </div>
            </div>

            {/* Connecting Arrow */}
            {route.type === 'split' && (
                <div className="flex justify-center py-1">
                    <span className="text-xl font-bold text-jugaad-primary">⬇️</span>
                </div>
            )}

            {/* Transition Box (Seat Split or Station Split) */}
            {route.type === 'split' && (
                <div className="flex flex-col items-center gap-2 relative z-10">
                    <div className={`border-2 border-black px-4 py-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center transform rotate-1 shadow-sm max-w-[95%] text-center ${isSeatSplit ? 'bg-cyan-100' : 'bg-yellow-100'}`}>
                        <div className="flex items-center gap-1.5 mb-1 text-[11px]">
                            <span>{isSeatSplit ? '🔄' : '🛠️'}</span> 
                            <span className="uppercase tracking-wider">
                              {isSeatSplit ? 'SEAT SHIFT' : `PIT STOP: ${route.midDuration}`}
                            </span>
                        </div>
                        <span className="text-jugaad-muted font-comic text-[10px] leading-relaxed">
                            {route.layoverTip || "Grab some snacks!"}
                        </span>
                    </div>
                </div>
            )}

            {/* Connecting Arrow */}
            {route.legs[1] && (
                <div className="flex justify-center py-1">
                    <span className="text-xl font-bold text-jugaad-primary">⬇️</span>
                </div>
            )}

            {/* Leg 2 */}
            {route.legs[1] && (
                <div className="flex items-center gap-3 relative z-10">
                    <span className="text-2xl filter drop-shadow-sm">🚆</span>
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded p-2">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-sm font-comic">
                                {route.legs[1].trainName} <span className="text-xs text-gray-500 font-mono">({route.legs[1].trainNumber})</span>
                            </span>
                            <span className={`text-xs ${getStatusColor(route.legs[1].status)}`}>{route.legs[1].status}</span>
                        </div>
                        <div className="text-xs font-mono text-gray-600 font-bold">
                            {route.legs[1].sourceStation} <span className="mx-1">➔</span> {route.legs[1].destinationStation}
                        </div>
                        <div className="text-[10px] text-gray-500">
                            {route.legs[1].departureTime} ➡️ {route.legs[1].arrivalTime} 🏁
                        </div>
                    </div>
                </div>
            )}
         </div>
      </div>

      {/* Rationale explaining "Why this works" */}
      <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded p-3 text-xs italic font-comic text-black shadow-inner flex gap-2">
        <span>💡</span>
        <p className="leading-relaxed">{route.reason}</p>
      </div>

      {/* Tatkal Alarm-inator Button */}
      <button 
         onClick={() => setShowAlarmModal(true)}
         className="w-full bg-jugaad-accent text-white font-display text-base py-3 px-4 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:-rotate-1 hover:shadow-none transition-all flex items-center justify-center gap-2 mb-3 active:translate-y-1 active:shadow-none rounded-[30px_8px_25px_6px]"
      >
         <span>⏰</span> 
         <span>ACTIVATE TATKAL ALARM-INATOR</span>
      </button>

      {/* Export Blueprint Button */}
      <button 
         onClick={handleExportBlueprint}
         className="w-full bg-yellow-100 text-black font-display text-xs py-2 px-4 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2 mb-3 active:translate-y-1 active:shadow-none rounded"
      >
         <span>📐</span> 
         <span>EXPORT BLUEPRINT & SHARE</span>
      </button>

      {/* Fares Panel (Visible by default) */}
      <div className="mt-4 bg-white border-2 border-black rounded p-4 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center mb-3 border-b-2 border-black pb-1">
              <h4 className="font-display text-xs uppercase text-black">Ticket Price Comparison:</h4>
              {route.fareAnalysis.bestDealLabel && (
                  <span className="bg-green-600 text-white text-[9px] font-mono px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] uppercase font-bold animate-pulse">
                    Deal: {route.fareAnalysis.bestDealLabel}
                  </span>
              )}
          </div>
          
          <div className="mb-2">
              {(() => {
                  const maxPrice = Math.max(...route.fareAnalysis.prices.map(p => p.finalPrice));
                  return route.fareAnalysis.prices.map((price, idx) => {
                      const widthPercent = (price.finalPrice / maxPrice) * 100;
                      return (
                          <div key={idx} className={`p-3.5 rounded border-2 border-black mb-3 shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all ${price.isCheapest ? 'bg-green-50' : 'bg-gray-50'}`}>
                              <div className="flex justify-between items-center mb-1.5">
                                  <div className="flex items-center gap-1.5">
                                      {price.isCheapest && <span className="text-base animate-bounce inline-block">💰</span>}
                                      <div>
                                          <span className="font-display text-xs text-black block leading-none">{price.platformName}</span>
                                          <span className="text-[9px] text-jugaad-muted font-bold font-mono block mt-1">{price.breakdown}</span>
                                      </div>
                                  </div>
                                  <div className="text-right">
                                      <span className="font-mono text-xs font-extrabold block">₹{price.finalPrice}</span>
                                      {price.verdict && (
                                          <span className={`text-[8px] font-extrabold px-1 py-0.5 rounded border border-black uppercase tracking-wider ${price.isCheapest ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                              {price.verdict}
                                          </span>
                                      )}
                                  </div>
                              </div>
                              
                              {/* Animated Price Bar */}
                              <div className="w-full h-3.5 bg-white border-2 border-black rounded-full overflow-hidden relative shadow-inner">
                                  <div 
                                      className={`h-full border-r-2 border-black animate-grow-width rounded-full ${price.isCheapest ? 'bg-green-400' : price.finalPrice === maxPrice ? 'bg-red-400' : 'bg-yellow-400'}`}
                                      style={{ 
                                          '--target-width': `${widthPercent}%`,
                                          width: `${widthPercent}%` 
                                      } as React.CSSProperties}
                                  ></div>
                              </div>
                          </div>
                      );
                  });
              })()}
          </div>
          
          {/* Secret Tip */}
          {route.fareAnalysis.secretTip && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-2.5 flex items-start gap-2 text-[10px] font-comic">
                 <span className="text-sm">🤫</span>
                 <div>
                    <span className="font-bold text-blue-900 block uppercase text-[9px] tracking-wide">Jugaad Secret:</span>
                    <span className="text-blue-800 leading-normal">{route.fareAnalysis.secretTip}</span>
                 </div>
              </div>
          )}
      </div>

      {showAlarmModal && (
          <TatkalAlarmModal route={route} onClose={() => setShowAlarmModal(false)} />
      )}
    </div>
  );
};

export default JugaadCard;