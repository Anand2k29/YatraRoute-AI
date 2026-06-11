import React, { useState, useEffect } from 'react';
import { RankedRoute } from '../types';

interface TatkalAlarmModalProps {
  route: RankedRoute;
  onClose: () => void;
}

export const TatkalAlarmModal: React.FC<TatkalAlarmModalProps> = ({ route, onClose }) => {
  const [alarmTime, setAlarmTime] = useState<string>('09:45'); // Default AC reminder
  const [phone, setPhone] = useState<string>('');
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<string>('');
  const [speedHacks, setSpeedHacks] = useState({
    masterList: false,
    walletLoaded: false,
    copyReady: false,
  });

  const leg = route.legs[0];
  const travelDateStr = leg.date; // e.g. "2026-06-15"
  
  // Calculate Tatkal opening details:
  // Tatkal opens 1 day prior to travel date.
  // AC opens at 10:00 AM, Sleeper at 11:00 AM.
  const isAcClass = leg.ticketClass.includes('3A') || leg.ticketClass.includes('2A') || leg.ticketClass.includes('1A');
  const tatkalOpenTime = isAcClass ? '10:00 AM' : '11:00 AM';
  const reminderDefaultTime = isAcClass ? '09:45 AM' : '10:45 AM';

  // Calculate simulated countdown timer
  useEffect(() => {
    if (!isScheduled) return;

    const interval = setInterval(() => {
      // For demonstration in a hackathon, we simulate a ticking countdown of minutes/seconds
      // starting at 14 minutes and counting down.
      const now = new Date();
      const target = new Date();
      target.setMinutes(target.getMinutes() + 14);
      target.setSeconds(target.getSeconds() + 30);
      
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown("00m 00s - INATOR TRIGGERED! 🔔");
        clearInterval(interval);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setCountdown(`${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isScheduled]);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduled(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-jugaad-card border-4 border-black p-5 rounded-lg shadow-sketch max-w-sm w-full relative max-h-[90vh] overflow-y-auto">
        {/* Decorative Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-yellow-200/90 transform rotate-1 border border-black/30 shadow-sm"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 font-display text-sm border-2 border-black bg-red-100 hover:bg-red-200 text-black px-2 py-0.5 rounded shadow-[1px_1px_0px_rgba(0,0,0,1)]"
        >
          X
        </button>

        <h3 className="font-display text-lg text-jugaad-primary uppercase tracking-tight text-center mt-3 mb-4">
          ⏰ The Tatkal Alarm-inator
        </h3>

        {!isScheduled ? (
          <form onSubmit={handleSchedule} className="space-y-4 text-xs text-left">
            <div className="bg-white border-2 border-black border-dashed p-3 rounded font-comic">
              <p className="font-bold text-black mb-1">📅 Target Window:</p>
              <p className="font-semibold text-jugaad-muted leading-relaxed">
                Tatkal booking for your trip on **{travelDateStr}** opens on **1 day prior** at **{tatkalOpenTime}**.
              </p>
            </div>

            <div>
              <label className="block font-bold uppercase mb-1">📞 Callback Number (For SMS/Alert)</label>
              <input 
                type="tel" 
                required
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white p-2 border-2 border-black rounded font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold uppercase mb-1">⏱️ Choose Reminder Alarm</label>
              <select 
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
                className="w-full bg-white p-2 border-2 border-black rounded font-bold"
              >
                <option value="09:45">{reminderDefaultTime} (15m before - Recommended)</option>
                <option value="09:55">09:55 AM (5m before - High risk)</option>
                <option value="09:59">09:59 AM (1m before - Dr. Doofenshmirtz style)</option>
              </select>
            </div>

            {/* Tatkal Checklist Hacks */}
            <div className="space-y-2 pt-2 border-t border-gray-300">
              <p className="font-display text-[10px] text-black uppercase">🚀 Alarm-inator Speed Hacks Checklist:</p>
              
              <label className="flex items-start gap-2 cursor-pointer font-bold font-comic">
                <input 
                  type="checkbox" 
                  checked={speedHacks.masterList}
                  onChange={(e) => setSpeedHacks({...speedHacks, masterList: e.target.checked})}
                  className="mt-0.5 accent-jugaad-primary"
                />
                <span>Add passenger to IRCTC Master List (Saves 30s)</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer font-bold font-comic">
                <input 
                  type="checkbox" 
                  checked={speedHacks.walletLoaded}
                  onChange={(e) => setSpeedHacks({...speedHacks, walletLoaded: e.target.checked})}
                  className="mt-0.5 accent-jugaad-primary"
                />
                <span>Pre-fund e-wallet/UPI ready (Saves 20s)</span>
              </label>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#FF5722] text-white font-display text-base py-2.5 px-4 border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all active:translate-y-1 rounded"
            >
              ENGAGE ALARM-INATOR! ⚙️
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4 animate-fade-in text-xs font-semibold">
            <div className="w-16 h-16 bg-green-100 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
              ⏰
            </div>
            
            <p className="font-display text-sm text-green-700">ALARM-INATOR ACTIVE!</p>
            
            <div className="bg-white border-2 border-black border-dashed p-4 rounded font-mono">
              <span className="text-[10px] text-gray-500 block uppercase">Time remaining to alert:</span>
              <span className="text-2xl font-extrabold text-black block my-1 font-mono tracking-wider">{countdown || "14m 30s"}</span>
              <span className="text-[9px] text-jugaad-muted block mt-1">Alerting {phone} at {alarmTime} AM</span>
            </div>

            <p className="font-comic text-gray-600 leading-normal text-[10px]">
              The Jugaad-inator will trigger a high-priority browser audio alarm and send an SMS alert to keep you ahead of the Tatkal booking rush.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-[9px] font-comic text-left">
              <strong>💡 Pro Tip:</strong> Keep this tab open. When the timer hits zero, the auto-fill clipboard details will flash on the HQ screen.
            </div>

            <button 
              onClick={() => setIsScheduled(false)}
              className="w-full bg-black text-white font-display text-xs py-2 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-800 transition-colors"
            >
              DISENGAGE ALARM 🔄
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
