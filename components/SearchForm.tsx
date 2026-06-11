import React, { useState } from 'react';
import { SearchParams } from '../types';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

// Mock data for "Previous Inventions"
const previousInventions = [
  { from: 'PUNE', to: 'GOA', code: 'MAO' },
  { from: 'NDLS', to: 'KULLU', code: 'JAT' },
  { from: 'CSTM', to: 'BSB', code: 'BSB' },
  { from: 'SBC', to: 'MYS', code: 'MYS' },
];

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (source && destination && date) {
      onSearch({ source, destination, date });
    }
  };

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const minDate = `${year}-${month}-${day}`;

  return (
    <div>
      {/* The Drawing Board Card */}
      <div className="bg-jugaad-card border-2 border-jugaad-border rounded-lg p-6 mb-8 shadow-sketch relative overflow-hidden">
        {/* Decorative Screws */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full border border-black bg-gray-300 flex items-center justify-center text-[8px]">+</div>
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full border border-black bg-gray-300 flex items-center justify-center text-[8px]">+</div>
        <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full border border-black bg-gray-300 flex items-center justify-center text-[8px]">+</div>
        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full border border-black bg-gray-300 flex items-center justify-center text-[8px]">+</div>

        <h2 className="text-2xl font-display text-jugaad-text mb-6 text-center transform -rotate-1">
          THE DRAWING BOARD 📝
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="relative group">
            <label className="block text-xs font-bold mb-1 ml-1 uppercase">📍 Origin Dial</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. NDLS"
              className="w-full bg-white text-black p-3 border-2 border-black rounded-lg focus:ring-4 focus:ring-jugaad-accent/30 outline-none font-bold placeholder-gray-400 border-dashed"
              required
            />
          </div>
          
          <div className="relative group">
            <label className="block text-xs font-bold mb-1 ml-1 uppercase">📍 Dest Dial</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. CSTM"
              className="w-full bg-white text-black p-3 border-2 border-black rounded-lg focus:ring-4 focus:ring-jugaad-accent/30 outline-none font-bold placeholder-gray-400 border-dashed"
              required
            />
          </div>

          <div className="relative group">
            <label className="block text-xs font-bold mb-1 ml-1 uppercase">📅 Date Gadget</label>
            <input
              type="date"
              value={date}
              min={minDate}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white text-black p-3 border-2 border-black rounded-lg focus:ring-4 focus:ring-jugaad-accent/30 outline-none font-bold"
              required
            />
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 font-display text-white text-xl uppercase tracking-wider border-4 border-black transition-all transform hover:-translate-y-1 hover:rotate-1 hover:shadow-sketch active:translate-y-0 active:rotate-0 active:shadow-none rounded-[10px_35px_5px_40px] ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#FF5722]'
              }`}
            >
              {isLoading ? 'Invention in Progress...' : 'ACTIVATE JUGAAD-INATOR! ⚙️'}
            </button>
          </div>
        </form>
      </div>

      {/* Previous Inventions */}
      <div className="mb-6">
        <h3 className="text-white font-display text-lg mb-4 text-shadow-sm flex items-center gap-2">
          <span>📜</span> PREVIOUS INVENTIONS
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previousInventions.map((mix, idx) => (
             <div key={idx} className="bg-[#EFEFEF] p-3 rounded-lg border-2 border-black shadow-sm hover:shadow-sketch transition-all cursor-pointer transform hover:rotate-1">
                <div className="text-center mb-1">
                  <span className="text-2xl">📜</span>
                </div>
                <p className="text-xs font-bold text-center text-black uppercase">{mix.from} ➔ {mix.to}</p>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;