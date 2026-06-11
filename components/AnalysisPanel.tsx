import React from 'react';
import { AnalysisLogEntry } from '../types';

interface AnalysisPanelProps {
  logs: AnalysisLogEntry[];
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ logs }) => {
  return (
    <div className="relative bg-white border-2 border-black rounded-lg p-5 mb-6 shadow-sketch">
      {/* Corner Screws */}
      <div className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full border border-black bg-gray-200 flex items-center justify-center text-[6px] font-bold text-gray-600">+</div>
      <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full border border-black bg-gray-200 flex items-center justify-center text-[6px] font-bold text-gray-600">+</div>
      <div className="absolute bottom-1 left-1 w-2.5 h-2.5 rounded-full border border-black bg-gray-200 flex items-center justify-center text-[6px] font-bold text-gray-600">+</div>
      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-black bg-gray-200 flex items-center justify-center text-[6px] font-bold text-gray-600">+</div>

      <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-2">
        <h3 className="font-display text-sm text-black flex items-center gap-2 tracking-wide uppercase">
          <span className="w-2.5 h-2.5 bg-jugaad-accent border border-black rounded-full animate-pulse"></span>
          Graph Engine Computations
        </h3>
        <span className="px-2 py-0.5 bg-yellow-100 text-black text-[9px] font-mono font-bold rounded border-2 border-black shadow-[1px_1px_0px_rgba(0,0,0,1)]">v1.0.4-inator</span>
      </div>

      <div className="space-y-2.5 font-mono text-[10px] leading-relaxed max-h-60 overflow-y-auto pr-1">
        {logs.map((log, index) => (
          <div key={index} className="flex items-start gap-2 py-1.5 border-b border-dashed border-gray-300 last:border-0">
            <div className="min-w-[80px] font-bold text-jugaad-muted">
              &gt; {log.optionLabel}
            </div>
            
            <div className="flex-shrink-0">
               {log.status === 'APPROVED' && (
                 <span className="text-white bg-green-600 px-1.5 py-0.5 rounded border border-black text-[8px] font-extrabold shadow-[1px_1px_0px_rgba(0,0,0,1)]">PASS</span>
               )}
               {log.status === 'REJECTED' && (
                 <span className="text-white bg-jugaad-danger px-1.5 py-0.5 rounded border border-black text-[8px] font-extrabold shadow-[1px_1px_0px_rgba(0,0,0,1)]">FAIL</span>
               )}
               {log.status === 'WARNING' && (
                 <span className="text-black bg-yellow-400 px-1.5 py-0.5 rounded border border-black text-[8px] font-extrabold shadow-[1px_1px_0px_rgba(0,0,0,1)]">WARN</span>
               )}
            </div>

            <div className="flex-1 text-black font-semibold break-words whitespace-normal">
              {log.reason}
            </div>
            
             <div className="flex-shrink-0 pt-0.5">
               {log.riskLevel === 'GREEN' && <span className="w-2 h-2 block rounded-full border border-black bg-green-500 shadow-[1px_1px_0px_rgba(0,0,0,1)]"></span>}
               {log.riskLevel === 'YELLOW' && <span className="w-2 h-2 block rounded-full border border-black bg-yellow-400 shadow-[1px_1px_0px_rgba(0,0,0,1)]"></span>}
               {log.riskLevel === 'RED' && <span className="w-2 h-2 block rounded-full border border-black bg-red-500 shadow-[1px_1px_0px_rgba(0,0,0,1)]"></span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisPanel;