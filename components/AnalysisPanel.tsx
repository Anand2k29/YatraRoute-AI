import React from 'react';
import { AnalysisLogEntry } from '../types';

interface AnalysisPanelProps {
  logs: AnalysisLogEntry[];
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ logs }) => {
  return (
    <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-900 font-bold text-sm tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          CORE ENGINE LOGS
        </h3>
        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-mono rounded border border-gray-200">v3.1.0-STABLE</span>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {logs.map((log, index) => (
          <div key={index} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className="min-w-[100px] font-semibold text-gray-500">
              {log.optionLabel}
            </div>
            
            <div className="flex-shrink-0">
               {log.status === 'APPROVED' && (
                 <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-[10px] font-bold border border-green-100">PASS</span>
               )}
               {log.status === 'REJECTED' && (
                 <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-[10px] font-bold border border-red-100">FAIL</span>
               )}
               {log.status === 'WARNING' && (
                 <span className="text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded text-[10px] font-bold border border-yellow-100">WARN</span>
               )}
            </div>

            <div className="flex-1 text-gray-600 truncate">
              {log.reason}
            </div>
            
             <div className="hidden sm:block">
               {log.riskLevel === 'GREEN' && <span className="w-2 h-2 block rounded-full bg-green-400"></span>}
               {log.riskLevel === 'YELLOW' && <span className="w-2 h-2 block rounded-full bg-yellow-400"></span>}
               {log.riskLevel === 'RED' && <span className="w-2 h-2 block rounded-full bg-red-400"></span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisPanel;