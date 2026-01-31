
import { FishType, FishTemplate } from './types';

export const FISH_TEMPLATES: FishTemplate[] = [
  { type: FishType.SMALL, name: 'Clownfish', reward: 2, hp: 1, speed: 1.5, radius: 15, color: '#FF8C00' },
  { type: FishType.SMALL, name: 'Blue Tang', reward: 5, hp: 2, speed: 2, radius: 18, color: '#4169E1' },
  { type: FishType.MEDIUM, name: 'Butterfly Fish', reward: 10, hp: 5, speed: 1.2, radius: 25, color: '#FFFF00' },
  { type: FishType.MEDIUM, name: 'Angelfish', reward: 20, hp: 8, speed: 1, radius: 30, color: '#FF00FF' },
  { type: FishType.LARGE, name: 'Shark', reward: 50, hp: 20, speed: 0.8, radius: 45, color: '#708090' },
  { type: FishType.LARGE, name: 'Turtle', reward: 100, hp: 40, speed: 0.5, radius: 55, color: '#228B22' },
  { type: FishType.GOLDEN, name: 'Golden Fish', reward: 500, hp: 60, speed: 1.5, radius: 35, color: '#FFD700' },
  { type: FishType.BOSS, name: 'Kraken', reward: 2000, hp: 250, speed: 0.3, radius: 90, color: '#8B0000' },
];

export const CANNON_CONFIGS = [
  { level: 1, power: 1, cost: 1, color: '#C0C0C0' },
  { level: 2, power: 2, cost: 2, color: '#808080' },
  { level: 3, power: 5, cost: 5, color: '#CD7F32' },
  { level: 4, power: 10, cost: 10, color: '#FFD700' },
  { level: 5, power: 25, cost: 25, color: '#E5E4E2' },
];

export const SCREEN_WIDTH = 1280;
export const SCREEN_HEIGHT = 720;
