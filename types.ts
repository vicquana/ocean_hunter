
export enum FishType {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  BOSS = 'BOSS',
  GOLDEN = 'GOLDEN'
}

export interface FishTemplate {
  type: FishType;
  name: string;
  reward: number;
  hp: number;
  speed: number;
  radius: number;
  color: string;
  imgUrl?: string;
}

export interface ActiveFish {
  id: string;
  template: FishTemplate;
  x: number;
  y: number;
  angle: number;
  currentHp: number;
  distanceTraveled: number;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  angle: number;
  speed: number;
  power: number;
  ownerId: string;
}

export interface CoinEffect {
  id: string;
  x: number;
  y: number;
  amount: number;
  lifetime: number;
}

export interface GameState {
  coins: number;
  cannonLevel: number;
  isAutoFiring: boolean;
  isLockedOn: boolean;
  score: number;
}
