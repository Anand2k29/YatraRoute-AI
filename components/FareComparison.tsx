import React from 'react';
import { FareAnalysis } from '../types';

interface FareComparisonProps {
  analysis: FareAnalysis;
}

const FareComparison: React.FC<FareComparisonProps> = ({ analysis }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span>🏷️</span> Fare Comparator
        </h3>
        <span className="text-xs font-mono text-gray-500 bg-white border px-2 py-1 rounded">
          BASE: ₹{analysis.baseFare}
        </span>
      </div>

      <div className="p-2">
        {analysis.prices.map((price, index) => {
          const isCheapest = index === 0;
          return (
            <div 
              key={price.platformName} 
              className={`flex items-center justify-between p-3 rounded-xl transition-colors ${isCheapest ? 'bg-green-50/50 border border-green-100' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isCheapest ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {price.platformName.charAt(0)}
                 </div>
                 <div>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        {price.platformName}
                        {isCheapest && <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Best Deal</span>}
                    </p>
                    <p className="text-[10px] text-gray-500">{price.breakdown}</p>
                 </div>
              </div>
              <div className="text-right">
                <span className={`block font-bold ${isCheapest ? 'text-green-700' : 'text-gray-900'}`}>₹{price.finalPrice.toFixed(0)}</span>
                <span className="text-[10px] text-gray-400">{price.verdict}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secret Tip */}
      <div className="px-6 py-3 bg-blue-50/50 border-t border-blue-100/50 flex items-start gap-3">
         <span className="text-lg">🤫</span>
         <div>
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-0.5">RailLink Secret</p>
            <p className="text-xs text-blue-700 leading-relaxed">{analysis.secretTip}</p>
         </div>
      </div>
    </div>
  );
};

export default FareComparison;