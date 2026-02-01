
import { FishType, FishTemplate } from './types';

export const FISH_TEMPLATES: FishTemplate[] = [
  { type: FishType.SMALL, name: 'Clownfish', reward: 2, hp: 1, speed: 1.5, radius: 20, color: '#FF8C00', imgUrl: '/assets/clownfish.svg' },
  { type: FishType.SMALL, name: 'Blue Tang', reward: 5, hp: 2, speed: 2, radius: 22, color: '#4169E1', imgUrl: '/assets/blue_tang.svg' },
  { type: FishType.SMALL, name: 'Seahorse', reward: 8, hp: 3, speed: 1.2, radius: 18, color: '#FFD700', imgUrl: '/assets/seahorse.svg' },
  
  { type: FishType.MEDIUM, name: 'Butterfly Fish', reward: 10, hp: 5, speed: 1.2, radius: 30, color: '#FFFF00', imgUrl: '/assets/butterfly_fish.svg' },
  { type: FishType.MEDIUM, name: 'Angelfish', reward: 20, hp: 8, speed: 1, radius: 35, color: '#FF00FF', imgUrl: '/assets/angelfish.svg' },
  { type: FishType.MEDIUM, name: 'Jellyfish', reward: 15, hp: 6, speed: 0.5, radius: 25, color: '#FF69B4', imgUrl: '/assets/jellyfish.svg' },
  { type: FishType.MEDIUM, name: 'Crab', reward: 25, hp: 12, speed: 0.8, radius: 28, color: '#FF4500', imgUrl: '/assets/crab.svg' },
  
  { type: FishType.LARGE, name: 'Shark', reward: 50, hp: 20, speed: 0.8, radius: 60, color: '#708090', imgUrl: '/assets/shark.svg' },
  { type: FishType.LARGE, name: 'Turtle', reward: 100, hp: 40, speed: 0.5, radius: 70, color: '#228B22', imgUrl: '/assets/turtle.svg' },
  { type: FishType.LARGE, name: 'Orca', reward: 150, hp: 80, speed: 0.9, radius: 80, color: '#000000', imgUrl: '/assets/orca.svg' },
  
  { type: FishType.GOLDEN, name: 'Golden Fish', reward: 500, hp: 60, speed: 1.5, radius: 45, color: '#FFD700', imgUrl: '/assets/golden_fish.svg' },
  { type: FishType.GOLDEN, name: 'Mermaid', reward: 800, hp: 100, speed: 1.3, radius: 55, color: '#20B2AA', imgUrl: '/assets/mermaid.svg' },
  
  { type: FishType.BOSS, name: 'Kraken', reward: 2000, hp: 250, speed: 0.3, radius: 120, color: '#8B0000', imgUrl: '/assets/octopus.svg' },
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
