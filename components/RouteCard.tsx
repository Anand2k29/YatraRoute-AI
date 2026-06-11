import React from 'react';
import { DirectRoute, TrainStatus } from '../types';

interface RouteCardProps {
  route: DirectRoute;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case TrainStatus.AVL: return 'text-green-600 bg-green-50 border-green-200';
    case TrainStatus.RAC: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    default: return 'text-red-600 bg-red-50 border-red-200';
  }
};

const RouteCard: React.FC<RouteCardProps> = ({ route }) => {
  const { leg } = route;
  const statusStyle = getStatusColor(leg.status);

  return (
    <div className="bg-white rounded-lg p-5 mb-4 border border-gray-200 shadow-sm hover:shadow-md transition opacity-80 relative">
      <div className="absolute top-0 right-0 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-bl-lg font-bold">
        DIRECT
      </div>
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{leg.trainName} <span className="text-gray-500 font-normal">({leg.trainNumber})</span></h3>
          <p className="text-sm text-gray-500">{leg.ticketClass} Class</p>
        </div>
        <div className={`px-3 py-1 rounded-full border text-sm font-bold ${statusStyle}`}>
          {leg.status} {leg.status === TrainStatus.WL && leg.probability ? `(${leg.probability}%)` : ''}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-left">
          <p className="font-bold text-xl text-gray-800">{leg.departureTime}</p>
          <p className="text-gray-500 uppercase">{leg.sourceStation}</p>
          <p className="text-xs text-gray-400">{leg.date}</p>
        </div>

        <div className="flex-1 px-4 flex flex-col items-center">
          <p className="text-xs text-gray-400 mb-1">{leg.duration}</p>
          <div className="w-full h-0.5 bg-gray-300 relative">
            <div className="absolute left-0 -top-1 w-2 h-2 rounded-full bg-gray-400"></div>
            <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-gray-400"></div>
          </div>
        </div>

        <div className="text-right">
          <p className="font-bold text-xl text-gray-800">{leg.arrivalTime}</p>
          <p className="text-gray-500 uppercase">{leg.destinationStation}</p>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;