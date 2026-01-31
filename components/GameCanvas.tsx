
import React, { useEffect, useRef, useCallback } from 'react';
import { GameState, ActiveFish, Bullet, CoinEffect, FishType } from '../types';
import { FISH_TEMPLATES, CANNON_CONFIGS, SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants';

interface GameCanvasProps {
  gameState: GameState;
  onShoot: (cost: number) => void;
  onReward: (amount: number) => void;
  updateGameState: (updates: Partial<GameState>) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, onShoot, onReward, updateGameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Entities management (mutable for performance)
  const fishes = useRef<ActiveFish[]>([]);
  const bullets = useRef<Bullet[]>([]);
  const effects = useRef<CoinEffect[]>([]);
  const mousePos = useRef({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 });
  const cannonAngle = useRef(0);

  // Spawn timing
  const nextSpawnTime = useRef(0);

  const spawnFish = () => {
    const templateIndex = Math.floor(Math.random() * FISH_TEMPLATES.length);
    const template = FISH_TEMPLATES[templateIndex];
    
    // Weighted boss spawn
    if (template.type === FishType.BOSS && Math.random() > 0.05) {
        return;
    }

    const side = Math.floor(Math.random() * 4);
    let x = 0, y = 0, angle = 0;

    switch(side) {
      case 0: // Left
        x = -template.radius;
        y = Math.random() * SCREEN_HEIGHT;
        angle = (Math.random() * Math.PI) - (Math.PI / 2);
        break;
      case 1: // Right
        x = SCREEN_WIDTH + template.radius;
        y = Math.random() * SCREEN_HEIGHT;
        angle = Math.PI + (Math.random() * Math.PI) - (Math.PI / 2);
        break;
      case 2: // Top
        x = Math.random() * SCREEN_WIDTH;
        y = -template.radius;
        angle = Math.random() * Math.PI;
        break;
      case 3: // Bottom
        x = Math.random() * SCREEN_WIDTH;
        y = SCREEN_HEIGHT + template.radius;
        angle = -Math.random() * Math.PI;
        break;
    }

    fishes.current.push({
      id: Math.random().toString(36).substr(2, 9),
      template,
      x,
      y,
      angle,
      currentHp: template.hp,
      distanceTraveled: 0
    });
  };

  const update = (time: number) => {
    const dt = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // 1. Spawning
    if (time > nextSpawnTime.current) {
      spawnFish();
      nextSpawnTime.current = time + 1000 + Math.random() * 2000;
    }

    // 2. Update Cannon Angle
    const dx = mousePos.current.x - SCREEN_WIDTH / 2;
    const dy = mousePos.current.y - (SCREEN_HEIGHT - 30);
    cannonAngle.current = Math.atan2(dy, dx);

    // 3. Update Fishes
    fishes.current.forEach(f => {
      f.x += Math.cos(f.angle) * f.template.speed;
      f.y += Math.sin(f.angle) * f.template.speed;
      f.distanceTraveled += f.template.speed;

      // Gentle movement oscillation
      f.angle += Math.sin(time * 0.001) * 0.005;
    });

    // Remove off-screen fishes
    fishes.current = fishes.current.filter(f => 
      f.x > -200 && f.x < SCREEN_WIDTH + 200 && f.y > -200 && f.y < SCREEN_HEIGHT + 200
    );

    // 4. Update Bullets
    bullets.current.forEach(b => {
      b.x += Math.cos(b.angle) * b.speed;
      b.y += Math.sin(b.angle) * b.speed;
    });

    // Collision Detection
    bullets.current.forEach((b, bulletIdx) => {
      for (let i = 0; i < fishes.current.length; i++) {
        const f = fishes.current[i];
        const dist = Math.sqrt((b.x - f.x) ** 2 + (b.y - f.y) ** 2);
        
        if (dist < f.template.radius + 10) {
          // Hit!
          f.currentHp -= b.power;
          bullets.current.splice(bulletIdx, 1); // Bullet disappears

          if (f.currentHp <= 0) {
            // Fish captured!
            onReward(f.template.reward);
            effects.current.push({
              id: Math.random().toString(),
              x: f.x,
              y: f.y,
              amount: f.template.reward,
              lifetime: 60
            });
            fishes.current.splice(i, 1);
          }
          break;
        }
      }
    });

    // Remove off-screen bullets
    bullets.current = bullets.current.filter(b => 
      b.x > 0 && b.x < SCREEN_WIDTH && b.y > 0 && b.y < SCREEN_HEIGHT
    );

    // 5. Update Effects
    effects.current.forEach(e => {
      e.y -= 1; // Float up
      e.lifetime -= 1;
    });
    effects.current = effects.current.filter(e => e.lifetime > 0);

    // 6. Draw
    draw();
    requestRef.current = requestAnimationFrame(update);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
    gradient.addColorStop(0, '#001a33');
    gradient.addColorStop(1, '#004d99');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Draw Particles/Bubbles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 50; i++) {
        const x = (Math.sin(i * 123.45) * 0.5 + 0.5) * SCREEN_WIDTH;
        const y = ((i * 54.32 + lastTimeRef.current * 0.05) % SCREEN_HEIGHT);
        ctx.beginPath();
        ctx.arc(x, SCREEN_HEIGHT - y, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw Fishes
    fishes.current.forEach(f => {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.angle);
      
      // Body
      ctx.fillStyle = f.template.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, f.template.radius, f.template.radius * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Tail
      ctx.beginPath();
      ctx.moveTo(-f.template.radius * 0.8, 0);
      ctx.lineTo(-f.template.radius * 1.3, -f.template.radius * 0.4);
      ctx.lineTo(-f.template.radius * 1.3, f.template.radius * 0.4);
      ctx.closePath();
      ctx.fill();

      // Eye
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(f.template.radius * 0.5, -f.template.radius * 0.2, f.template.radius * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(f.template.radius * 0.6, -f.template.radius * 0.2, f.template.radius * 0.08, 0, Math.PI * 2);
      ctx.fill();

      // HP bar for large fish
      if (f.template.hp > 10) {
        const hpPercent = f.currentHp / f.template.hp;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(-20, f.template.radius + 5, 40, 4);
        ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : '#ff0000';
        ctx.fillRect(-20, f.template.radius + 5, 40 * hpPercent, 4);
      }

      ctx.restore();
    });

    // Draw Bullets
    bullets.current.forEach(b => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle);
      const config = CANNON_CONFIGS[gameState.cannonLevel];
      ctx.fillStyle = config.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = config.color;
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Effects (Coins)
    effects.current.forEach(e => {
      ctx.save();
      ctx.globalAlpha = e.lifetime / 60;
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 24px Arial';
      ctx.shadowBlur = 5;
      ctx.shadowColor = 'black';
      ctx.fillText(`+${e.amount}`, e.x, e.y);
      ctx.restore();
    });

    // Draw Cannon
    ctx.save();
    ctx.translate(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 30);
    ctx.rotate(cannonAngle.current + Math.PI / 2);
    
    // Cannon Base
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI, true);
    ctx.fill();

    // Cannon Barrel
    const config = CANNON_CONFIGS[gameState.cannonLevel];
    ctx.fillStyle = config.color;
    ctx.fillRect(-15, -60, 30, 60);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(-15, -60, 30, 60);

    ctx.restore();
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = SCREEN_WIDTH / rect.width;
    const scaleY = SCREEN_HEIGHT / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    fireBullet(x, y);
  };

  const fireBullet = useCallback((targetX: number, targetY: number) => {
    const config = CANNON_CONFIGS[gameState.cannonLevel];
    if (gameState.coins < config.cost) return;

    onShoot(config.cost);

    const startX = SCREEN_WIDTH / 2;
    const startY = SCREEN_HEIGHT - 30;
    const angle = Math.atan2(targetY - startY, targetX - startX);

    bullets.current.push({
      id: Math.random().toString(),
      x: startX,
      y: startY,
      angle,
      speed: 8,
      power: config.power,
      ownerId: 'player1'
    });
  }, [gameState, onShoot]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = SCREEN_WIDTH / rect.width;
    const scaleY = SCREEN_HEIGHT / rect.height;
    
    mousePos.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  // Auto-fire logic
  useEffect(() => {
    let interval: number;
    if (gameState.isAutoFiring) {
      interval = window.setInterval(() => {
        fireBullet(mousePos.current.x, mousePos.current.y);
      }, 200);
    }
    return () => clearInterval(interval);
  }, [gameState.isAutoFiring, fireBullet]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={SCREEN_WIDTH}
      height={SCREEN_HEIGHT}
      onMouseDown={handleCanvasClick}
      onMouseMove={handleMouseMove}
      className="cursor-crosshair block w-full h-full"
    />
  );
};

export default GameCanvas;
