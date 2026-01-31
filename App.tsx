
import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameCanvas from './components/GameCanvas';
import UIOverlay from './components/UIOverlay';
import { GameState } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    coins: 1000,
    cannonLevel: 0,
    isAutoFiring: false,
    isLockedOn: false,
    score: 0,
  });

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleShoot = useCallback((cost: number) => {
    setGameState(prev => {
      if (prev.coins < cost) return prev;
      return { ...prev, coins: prev.coins - cost };
    });
  }, []);

  const handleReward = useCallback((amount: number) => {
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + amount,
      score: prev.score + amount
    }));
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 flex items-center justify-center">
      {/* Aspect Ratio Container for Game */}
      <div 
        className="relative bg-blue-900 shadow-2xl overflow-hidden" 
        style={{ 
          width: 'min(100vw, (100vh * 16 / 9))', 
          height: 'min(100vh, (100vw * 9 / 16))',
          maxHeight: '720px',
          maxWidth: '1280px'
        }}
      >
        <GameCanvas 
          gameState={gameState} 
          onShoot={handleShoot}
          onReward={handleReward}
          updateGameState={updateGameState}
        />
        
        <UIOverlay 
          gameState={gameState} 
          updateGameState={updateGameState} 
        />
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
    </div>
  );
};

export default App;
