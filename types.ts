
export interface Point {
  x: number;
  y: number;
}

export interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface Player extends Entity {
  velocity: number;
  scale: number; // For rhythmic bop animation
}

export interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
}

export interface Nebula {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
}

export type EnemyType = 'STANDARD' | 'SCAMMER' | 'WHALE';

export interface Enemy extends Entity {
  speed: number;
  label: string;
  type: EnemyType;
  hp: number;
  maxHp: number;
}

export interface Boss extends Entity {
  dy: number;       
  lifeTimer: number; 
  shootTimer: number;
  state: 'ENTERING' | 'ACTIVE' | 'LEAVING';
  hp: number;
  maxHp: number;
}

export type CollectibleType = 'SOL' | 'MEME' | 'BTC' | 'WIF' | 'PEPE' | 'POPCAT';

export interface Collectible extends Entity {
  type: CollectibleType;
  value: number;
  speed: number;
}

export interface RugPull extends Entity {
    speed: number;
}

export interface Meteor extends Entity {
    speed: number;
    vy: number;
}

export type PowerUpType = 'MOON' | 'MAGNET' | 'TRIPLE_SHOT' | 'BOMB' | 'LASER' | 'SHOTGUN' | 'RAPID' | 'SIDE';

export interface PowerUp extends Entity {
  type: PowerUpType;
  speed: number;
}

export interface ActiveEffects {
  invincible: number; 
  magnet: number;     
  tripleShot: number; 
  shotgun: number;    
  rapid: number;      
  side: number;       
  bomb: number;       
  laser: number;      
  shield: boolean;    
  hitInvincibility: number; 
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;     
  color: string;
  size: number;
}

export interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  vy: number;
}

export interface Projectile extends Entity {
  speed: number;
  vx?: number; 
  vy?: number;
  damage: number;
}

export interface Candle {
  x: number;
  open: number;
  close: number;
  high: number;
  low: number;
  width: number;
}

export interface Cosmetics {
  clownMask: boolean;
  hamterMask: boolean;
  pepeMask: boolean;
  rolex: boolean;
  lambo: boolean;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  timestamp: number;
}

export type MarketPhase = 'BULL' | 'BEAR';

export enum GameState {
  START,
  PLAYING,
  GAME_OVER,
}
