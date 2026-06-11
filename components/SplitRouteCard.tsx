import React from 'react';
import { SplitRoute, TrainStatus } from '../types';

interface SplitRouteCardProps {
  route: SplitRoute;
  isRecommended?: boolean;
}

const getStatusColor = (status: string) => {
  if (status === TrainStatus.AVL) return 'text-green-600 bg-green-50';
  if (status === TrainStatus.RAC) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
};

const SplitRouteCard: React.FC<SplitRouteCardProps> = ({ route, isRecommended }) => {
  return (
    <div className={`bg-white rounded-2xl mb-8 overflow-hidden transition-all duration-300 ${isRecommended ? 'shadow-lg ring-1 ring-black/5' : 'shadow-sm border border-gray-100 opacity-90'}`}>
      
      {/* Minimalist Header */}
      <div className={`px-6 py-4 flex justify-between items-center ${isRecommended ? 'bg-gray-50/50 backdrop-blur-sm' : ''}`}>
        <div className="flex items-center gap-3">
          {isRecommended && (
             <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white text-xs">★</span>
          )}
          <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
             Via {route.junctionStation}
          </h3>
          {route.tags?.includes('High Cost') && (
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wide">⚠️ High Cost</span>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Time</p>
          <p className="text-sm font-bold text-gray-900">{route.totalDuration}</p>
        </div>
      </div>

      <div className="p-6 pt-2">
        
        {/* The Journey Line Visualization */}
        <div className="mt-4 mb-8 relative">
             <div className="flex items-center justify-between text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                <span>{route.leg1.sourceStation}</span>
                <span className="text-center">{route.junctionStation}</span>
                <span>{route.leg2.destinationStation}</span>
             </div>

             <div className="relative flex items-center justify-between">
                {/* Line Background */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 rounded-full"></div>

                {/* Node A */}
                <div className="w-3 h-3 bg-gray-900 rounded-full ring-4 ring-white"></div>
                
                {/* Leg 1 Info */}
                <div className="bg-white px-2 py-1 border border-gray-200 rounded shadow-sm text-[10px] font-medium text-gray-600 flex items-center gap-1">
                    <span>🚂</span> {route.leg1.trainNumber}
                </div>

                {/* Junction Node (Buffer) */}
                <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-orange-500 rounded-full ring-4 ring-white shadow-sm flex items-center justify-center text-[8px] text-white font-bold">
                       B
                    </div>
                    <div className="absolute top-6 flex flex-col items-center">
                        <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-orange-100 shadow-sm flex items-center gap-1 whitespace-nowrap">
                            ⏳ {route.layoverDuration} Break
                        </span>
                    </div>
                </div>

                {/* Leg 2 Info */}
                 <div className="bg-white px-2 py-1 border border-gray-200 rounded shadow-sm text-[10px] font-medium text-gray-600 flex items-center gap-1">
                    <span>🚂</span> {route.leg2.trainNumber}
                </div>

                {/* Node C */}
                <div className="w-3 h-3 bg-gray-900 rounded-full ring-4 ring-white"></div>
             </div>
        </div>

        {/* Detailed Legs (Minimal) */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Leg 1 Card */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{route.leg1.trainName}</p>
                        <p className="text-xs text-gray-500">{route.leg1.departureTime} ➔ {route.leg1.arrivalTime}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(route.leg1.status)}`}>
                        {route.leg1.status}
                    </span>
                </div>
                <div className="flex justify-between items-end">
                     <span className="text-xs text-gray-400">{route.leg1.ticketClass}</span>
                </div>
            </div>

            {/* Leg 2 Card */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{route.leg2.trainName}</p>
                        <p className="text-xs text-gray-500">{route.leg2.departureTime} ➔ {route.leg2.arrivalTime}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(route.leg2.status)}`}>
                        {route.leg2.status}
                    </span>
                </div>
                <div className="flex justify-between items-end">
                     <span className="text-xs text-gray-400">{route.leg2.ticketClass}</span>
                     {route.leg2.date !== route.leg1.date && (
                         <span className="text-[10px] text-gray-400 bg-white px-1.5 rounded border">Next Day</span>
                     )}
                </div>
            </div>
        </div>
        
        {/* Reasoning Footer */}
        <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 italic">
            <span>💡</span>
            <p>{route.reasoning}</p>
        </div>

      </div>
    </div>
  );
};

export default SplitRouteCard;