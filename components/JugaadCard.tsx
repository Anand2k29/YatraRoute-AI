import React, { useState } from 'react';
import { RankedRoute } from '../types';

interface JugaadCardProps {
  route: RankedRoute;
}

const JugaadCard: React.FC<JugaadCardProps> = ({ route }) => {
  const [showFares, setShowFares] = useState(false);

  // Cartoon Status Logic
  const getBadgeContent = (type: string) => {
    switch (type) {
      case 'SAFE': return { text: 'PERRY APPROVED', color: 'bg-jugaad-accent text-white', icon: '🦆' };
      case 'RISKY': return { text: 'BUSTED!', color: 'bg-jugaad-danger text-white', icon: '🚫' };
      default: return { text: 'EXPERIMENTAL', color: 'bg-orange-300 text-black', icon: '🧪' };
    }
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'AVAILABLE': return 'text-green-700 font-extrabold';
          case 'RAC': return 'text-orange-600 font-bold';
          default: return 'text-red-600 font-bold';
      }
  };

  const redRailPrice = route.fareAnalysis.prices.find(p => p.platformName.includes('RedRail'))?.finalPrice || 0;
  const irctcPrice = route.fareAnalysis.prices.find(p => p.platformName.includes('IRCTC'))?.finalPrice || 0;
  const savings = Math.max(0, irctcPrice - redRailPrice + 18);
  
  const badge = getBadgeContent(route.badges[0]?.type || 'MODERATE');
  const junctionCode = route.type === 'split' && route.stations[1] ? route.stations[1].substring(0, 3) : route.stations[route.stations.length-1].substring(0, 3);

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
            <span className="absolute -bottom-2 -right-2 text-2xl drop-shadow-sm">⚙️</span>
        </div>

        {/* Title & Badge */}
        <div className="flex-grow">
            <h3 className="font-display text-xl text-black leading-tight mb-1">
                {route.title}
            </h3>
            <div className="flex items-center flex-wrap gap-2">
                 <span className={`inline-flex items-center gap-1 px-2 py-1 border-2 border-black rounded text-[10px] font-bold uppercase tracking-wide ${badge.color} shadow-[2px_2px_0px_rgba(0,0,0,1)]`}>
                    <span>{badge.icon}</span> {badge.text}
                 </span>
                 <span className="text-xs font-bold bg-white border-2 border-black px-2 py-1 rounded shadow-[2px_2px_0px_rgba(0,0,0,1)]">
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

            {/* Pit Stop (Split Only) */}
            {route.type === 'split' && (
                <div className="flex flex-col items-center gap-2 relative z-10">
                    <div className="bg-yellow-100 border-2 border-black px-4 py-2 rounded-full text-xs font-bold flex flex-col items-center justify-center transform rotate-1 shadow-sm max-w-[90%] text-center">
                        <div className="flex items-center gap-1 mb-1">
                            <span>🛠️</span> 
                            <span className="uppercase tracking-wider">PIT STOP: {route.midDuration}</span>
                        </div>
                        <span className="text-jugaad-muted font-comic text-[10px] italic">
                            Tip: {route.layoverTip || "Grab some snacks!"} 🥟 ☕
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

      {/* Action Button */}
      <button 
         onClick={() => setShowFares(!showFares)}
         className="w-full bg-jugaad-primary text-white font-display text-lg py-3 px-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:rotate-1 hover:shadow-none transition-all flex flex-col items-center justify-center gap-0.5 active:translate-y-1 active:shadow-none rounded-tl-2xl rounded-br-2xl rounded-tr-md rounded-bl-md"
      >
         <div className="flex items-center gap-2">
            <span>🔨</span> 
            <span>{showFares ? 'FOLD BLUEPRINT' : 'CLICK TO COMPARE FARES'}</span>
         </div>
         {!showFares && savings > 0 && (
            <span className="text-[10px] font-sans font-bold text-yellow-100 tracking-wide">
                (Click to view prices & save ₹{savings})
            </span>
         )}
      </button>

      {/* Fares Panel */}
      {showFares && (
          <div className="mt-4 bg-white border-2 border-black rounded p-3 animate-fade-in">
              <h4 className="font-bold text-xs uppercase mb-2 border-b-2 border-black pb-1">Cost Estimate:</h4>
              <div className="space-y-2">
                  {route.fareAnalysis.prices.map((price, idx) => (
                      <div key={idx} className={`flex justify-between items-center p-2 rounded border border-black ${price.isCheapest ? 'bg-green-100' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-2">
                              {price.isCheapest && <span className="text-lg">💰</span>}
                              <span className="font-bold text-sm">{price.platformName}</span>
                          </div>
                          <span className="font-mono font-bold">₹{price.finalPrice}</span>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default JugaadCard;