
import React from 'react';
import { GameState } from '../types';
import { CANNON_CONFIGS } from '../constants';

interface UIOverlayProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ gameState, updateGameState }) => {
  const currentCannon = CANNON_CONFIGS[gameState.cannonLevel];

  const toggleAutoFire = () => {
    updateGameState({ isAutoFiring: !gameState.isAutoFiring });
  };

  const changeCannon = (delta: number) => {
    const nextLevel = (gameState.cannonLevel + delta + CANNON_CONFIGS.length) % CANNON_CONFIGS.length;
    updateGameState({ cannonLevel: nextLevel });
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 text-white font-bold select-none">
      
      {/* Top Bar: Stats */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
            <div className="bg-black/50 backdrop-blur-md border-2 border-yellow-500 rounded-full px-6 py-2 flex items-center gap-3 shadow-lg pointer-events-auto">
                <i className="fas fa-coins text-yellow-400 text-xl"></i>
                <span className="text-2xl coin-text tabular-nums">{gameState.coins.toLocaleString()}</span>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-1 text-sm border border-blue-400/30 flex items-center gap-2 pointer-events-auto">
                <i className="fas fa-trophy text-blue-300"></i>
                <span className="text-blue-100 uppercase tracking-widest">Score: {gameState.score}</span>
            </div>
        </div>

        <div className="flex flex-col gap-2 items-end">
            <button 
              onClick={() => updateGameState({ coins: gameState.coins + 1000 })}
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg border-b-4 border-green-800 pointer-events-auto active:translate-y-1 active:border-b-0 transition-all text-sm flex items-center gap-2"
            >
              <i className="fas fa-plus-circle"></i> FREE COINS
            </button>
            <div className="text-xs text-white/50">Arcade Mode V1.0.4</div>
        </div>
      </div>

      {/* Side Bar: Skills */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 pointer-events-auto">
        <SkillButton 
          icon="fa-bullseye" 
          label="LOCK" 
          active={gameState.isLockedOn} 
          onClick={() => updateGameState({ isLockedOn: !gameState.isLockedOn })}
          color="bg-red-600"
        />
        <SkillButton 
          icon="fa-bolt" 
          label="AUTO" 
          active={gameState.isAutoFiring} 
          onClick={toggleAutoFire}
          color="bg-orange-600"
        />
        <SkillButton 
          icon="fa-snowflake" 
          label="FREEZE" 
          active={false}
          onClick={() => alert('Skill unlocking soon!')}
          color="bg-blue-600"
        />
      </div>

      {/* Bottom Bar: Cannon Controls */}
      <div className="flex justify-center items-end pb-2">
        <div className="flex items-center gap-6 bg-black/60 backdrop-blur-xl border-t-2 border-blue-500 rounded-t-3xl px-12 py-4 pointer-events-auto shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
          <button 
            onClick={() => changeCannon(-1)}
            className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center border-b-4 border-blue-800 active:translate-y-1 active:border-b-0"
          >
            <i className="fas fa-minus"></i>
          </button>

          <div className="text-center min-w-[120px]">
            <div className="text-xs text-blue-300 uppercase tracking-tighter mb-1">CANNON LVL {currentCannon.level}</div>
            <div className="text-3xl font-black text-white italic drop-shadow-lg leading-none">
                {currentCannon.cost}
            </div>
            <div className="text-[10px] text-yellow-400 mt-1">COST PER SHOT</div>
          </div>

          <button 
            onClick={() => changeCannon(1)}
            className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center border-b-4 border-blue-800 active:translate-y-1 active:border-b-0"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>

      {/* Win Notifications (Floating) */}
      {gameState.score > 0 && gameState.score % 1000 < 50 && (
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-bounce">
             <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 p-1 rounded-xl shadow-2xl">
                 <div className="bg-slate-900 rounded-lg px-8 py-4 text-center">
                    <h2 className="text-3xl font-black text-yellow-400 animate-pulse">BIG WIN!</h2>
                    <p className="text-white text-xl">Keep Fishing!</p>
                 </div>
             </div>
          </div>
      )}
    </div>
  );
};

const SkillButton: React.FC<{ icon: string, label: string, active: boolean, onClick: () => void, color: string }> = ({ icon, label, active, onClick, color }) => (
  <button 
    onClick={onClick}
    className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 border-b-4 transition-all active:translate-y-1 active:border-b-0 shadow-lg ${active ? color + ' border-white' : 'bg-slate-700 border-slate-900 opacity-80'}`}
  >
    <i className={`fas ${icon} text-xl ${active ? 'animate-pulse' : ''}`}></i>
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

export default UIOverlay;
