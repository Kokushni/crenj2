import React from 'react';
import { NyanGame } from './components/game';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-slate-900">
      <h1 className="text-3xl md:text-5xl text-white mb-6 drop-shadow-md text-center font-bold">
        CRYPTO ENJOYER <span className="text-xs align-top text-yellow-500">v1.3</span>
      </h1>
      
      {/* Layout Grid */}
      <div className="flex flex-col xl:flex-row gap-6 w-full max-w-[1600px] items-start">
        
        {/* Left Column: Legend */}
        <div className="w-full xl:w-72 bg-slate-800/80 border border-blue-500/30 rounded-lg p-5 text-white text-xs md:text-sm shadow-2xl order-2 xl:order-1 backdrop-blur-sm">
          <h2 className="text-lg text-blue-400 mb-4 border-b border-blue-500/30 pb-2 font-bold tracking-wider flex items-center gap-2">
            <span>ℹ️</span> GAME MANUAL
          </h2>
          
          <div className="space-y-6">
            {/* Controls */}
            <div>
              <h3 className="text-yellow-400 font-bold mb-2 text-xs uppercase tracking-widest">🎮 Controls</h3>
              <div className="grid grid-cols-1 gap-2 text-[10px] text-gray-300">
                <div className="flex justify-between items-center bg-black/20 p-1.5 rounded">
                    <span>Move</span>
                    <span className="text-white font-bold">WASD/ARROWS</span>
                </div>
                <div className="flex justify-between items-center bg-black/20 p-1.5 rounded">
                    <span>Panic Sell</span>
                    <span className="text-white font-bold">SHIFT/R-CLK</span>
                </div>
                 <div className="flex justify-between items-center bg-black/20 p-1.5 rounded">
                    <span>Shop</span>
                    <span className="text-white font-bold">SPACE</span>
                </div>
              </div>
            </div>

            {/* Economy */}
            <div>
              <h3 className="text-green-400 font-bold mb-2 text-xs uppercase tracking-widest">💰 Economy</h3>
              <div className="space-y-2 text-[10px] text-gray-300">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FFD700] shadow-[0_0_5px_#FFD700]"></div>
                    <span>Collect <span className="text-white">Coins</span></span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500 border border-white"></div>
                    <span><span className="text-orange-400 font-bold">BTC</span> +1 Life</span>
                </div>
                <div className="flex items-center gap-2 text-[8px] text-gray-400 border-t border-white/10 pt-1 mt-1 leading-tight">
                    <span>⚠️ Shooting costs Gas. Empty wallet = slow fire.</span>
                </div>
              </div>
            </div>

            {/* Enemies */}
            <div>
              <h3 className="text-red-400 font-bold mb-2 text-xs uppercase tracking-widest">💀 Hazards</h3>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-300">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600 border border-red-400"></div>
                    <span>L2 Chains</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-red-600"></div>
                    <span>Rugs</span>
                 </div>
                 <div className="flex items-center gap-2 col-span-2">
                    <div className="w-3 h-3 bg-red-900 border border-red-500 flex items-center justify-center text-[6px]">B</div>
                    <span>Bogdanoff</span>
                 </div>
              </div>
            </div>

            {/* Powerups */}
            <div>
              <h3 className="text-purple-400 font-bold mb-2 text-xs uppercase tracking-widest">⚡ Powerups</h3>
              <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-[8px] text-gray-300">
                <div className="flex items-center gap-1.5"><span className="text-base">🚀</span> Moon Mode</div>
                <div className="flex items-center gap-1.5"><span className="text-base">🧲</span> Magnet</div>
                <div className="flex items-center gap-1.5"><span className="text-base">🔫</span> Triple</div>
                <div className="flex items-center gap-1.5"><span className="text-base">💣</span> Nuke</div>
                <div className="flex items-center gap-1.5"><span className="text-base">⚡</span> Laser</div>
                <div className="flex items-center gap-1.5"><span className="text-base">👯</span> Drones</div>
              </div>
            </div>
            
            <div className="bg-yellow-900/20 border border-yellow-700/30 p-2 rounded text-[8px] text-yellow-200/80 text-center leading-relaxed">
                "Buy high, sell low, and don't forget to pay your taxes."
            </div>
          </div>
        </div>

        {/* Center Column: Game */}
        <div className="flex-1 w-full order-1 xl:order-2 flex flex-col items-center">
          <div className="relative border-4 border-slate-700 rounded-lg shadow-2xl overflow-hidden bg-black w-full max-w-[1024px] aspect-[4/3]">
            <NyanGame />
          </div>
        </div>

        {/* Right Column: BNB Image */}
        <div className="w-full xl:w-64 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-xl order-3 min-h-[200px] xl:h-auto xl:self-stretch relative group">
            <img 
              src="https://i.ibb.co/Jjnfxd5g/bnb.png" 
              alt="BNB" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
             <div className="absolute bottom-0 w-full p-4 text-center">
                <p className="text-yellow-500 font-bold text-sm tracking-wider mb-1">FUNDS ARE SAFU</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default App;