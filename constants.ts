
export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 768;

export const GAME_SPEED_START = 2.0; // Slower start for easier gameplay
export const GAME_SPEED_MAX = 6.0;   // Lower max speed
export const SPAWN_RATE_START = 100; // Higher number = slower spawning enemies

export const PLAYER_SIZE = 40;
export const PLAYER_SPEED = 8;
export const MAX_LIVES = 10; // Increased max lives
export const START_LIVES = 1; // Starting lives reduced to 1 per request

// Classic Nyan Cat Rainbow Colors
export const RAINBOW_COLORS = [
  '#FF0000', '#FF9900', '#FFFF00', '#33FF00', '#0099FF', '#6633FF',
];

export const STAR_COUNT = 70;
export const NEBULA_COUNT = 5; // New background element
export const BACKGROUND_COLOR = '#000000';
export const BULL_MARKET_COLOR = '#001a00'; // Dark Green
export const BEAR_MARKET_COLOR = '#1a0000'; // Dark Red
export const BOSS_BACKGROUND_COLOR = '#3d0000';
export const GAME_OVER_COLOR = '#ff0055';

export const WOJAK_SKIN_COLOR = '#F5CBA7';
export const MCDONALDS_RED = '#DA291C';
export const MCDONALDS_YELLOW = '#FFC72C';

export const L2_NAMES = ['BASE', 'STRK', 'BLAST', 'LINEA', 'AVAX', 'OP', 'ARB', 'TRUMP', 'SUI'];
export const L2_COLOR = '#EF4444'; 

export const SOL_COLOR = '#9945FF'; 
export const SOL_GOLD = '#FFD700'; 
export const MEME_COLOR = '#D946EF'; 

// Game Mechanics
export const MARKET_CYCLE_DURATION = 1800; // 30 seconds at 60fps
export const COMBO_TIMEOUT = 240; // 4 seconds to keep combo alive
export const PANIC_SELL_COST = 2000;
export const BASE_MAGNET_RADIUS = 100; // Intrinsic magnetism for better feel

// Power Ups
export const POWERUP_DURATION = 600; 
export const TRIPLE_SHOT_DURATION = 600; 
export const LASER_DURATION = 600;
export const SHOTGUN_DURATION = 600; 
export const RAPID_DURATION = 600;   
export const SIDE_DURATION = 600;    
export const BOMB_DURATION = 180; 
export const MAGNET_RADIUS = 300; 
export const HAMTER_MAGNET_RADIUS = 150; 
export const POWERUP_SIZE = 80; 
export const POWERUP_SPAWN_RATE = 500; 
export const POWERUP_GLOW_COLOR = '#8A2BE2'; 

// Projectile
export const PROJECTILE_COST = 1; 
export const PROJECTILE_SPEED = 15; 
export const PROJECTILE_SIZE = 30; 
export const AUTO_SHOOT_RATE = 15; 
export const LOW_LIQUIDITY_RATE = 30; // Slow fire when broke
export const RAPID_FIRE_RATE = 5;  

// Collectibles
export const COLLECTIBLE_VALUE = 10; // Reduced value (was 25)
export const COLLECTIBLE_SIZE = 60; 
export const COLLECTIBLE_SPAWN_INTERVAL = 150; // Much slower spawn (was 40)
export const BTC_SPAWN_RATE = 1200; // Replaces Burger

// Obstacles & Enemies
export const RUG_PULL_WIDTH = 30;
export const RUG_PULL_HEIGHT = 150;
export const METEOR_WIDTH = 20;
export const METEOR_HEIGHT = 60;

export const WHALE_HP = 15;
export const WHALE_SIZE = 100;
export const SCAMMER_SPEED = 3; // Slower scammer

// Rewards
export const BOSS_REWARD = 2500; 
export const WHALE_REWARD = 500; // Adjusted per request
export const ENEMY_REWARD = 20; // Adjusted per request

// Boss
export const BOSS_WIDTH = 80;
export const BOSS_HEIGHT = 80;
export const BOSS_DURATION = 1200; // Increased duration (was 300)
export const BOSS_HP = 100; // Added HP for endurance
export const BOSS_SHOOT_RATE = 120; 
export const BOSS_IMAGE_URL = 'https://i.ibb.co/Kjjr2vxS/enemy-0-3x.png';
export const BOSS_PROJECTILE_SPEED = 10; 
export const BOSS_AIM_SPREAD = 0.5; 
export const BOSS_SPAWN_CHANCE = 0.0007; 

// Cosmetics Costs
export const COST_SHIELD = 50;
export const COST_HEAL = 1000; // Updated to 1000
export const COST_CLOWN = 100; // Increased 10x
export const COST_HAMTER = 10000; // Increased 10x
export const COST_PEPE = 20000; // Increased 10x
export const COST_ROLEX = 20000;
export const COST_LAMBO = 100000;

// Upgrade Base Costs - Increased
export const COST_BASE_MOON = 3000; 
export const COST_BASE_MAGNET = 3000; 
export const COST_BASE_TRIPLE = 4000; 
export const COST_BASE_LASER = 5000; 
export const COST_BASE_GAS = 5000; 

// Contract Address - CHANGE THIS TO YOUR TOKEN ADDRESS
export const TOKEN_CONTRACT_ADDRESS = "CA_COMING_SOON_TO_PUMP_FUN";

// Trading Constants
export const TRADING_LEVERAGE = 50;
export const TRADING_WIN_CHANCE = 0.10;
export const TRADING_WIN_MULTIPLIER = 5; // 50x leverage roughly means a 10% move is a 500% gain (5x)
export const TRADABLE_ASSETS = ['BTC', 'ETH', 'SOL', 'MEME', 'Serious Hi-Tech L1'];

export const RIDICULOUS_NEWS = [
  "SEC declares your hamster a security.",
  "Dev clicked 'Remove Liquidity' instead of 'Update'.",
  "North Korean hackers stole the bridge... physically.",
  "CEO arrested for buying an island with user funds.",
  "Smart contract bug: only allows deposits, no withdrawals.",
  "Inflation glitch: Total supply increased by 1,000,000% overnight.",
  "Community voted to rug pull themselves.",
  "Exchange intern tripped over the server cable.",
  "Elon tweeted a poop emoji. Market crashed.",
  "Quantum computer cracked your private key.",
  "The blockchain was just an Excel spreadsheet all along.",
  "Miners went on strike demanding higher resolution pixels.",
  "Stablecoin depegged because 'math is hard'.",
  "Satoshi woke up and moved 1 BTC. Panic selling ensued.",
  "A dog ate the cold wallet.",
  "Discord mod banned the only developer.",
  "Solar flare erased the ledger.",
  "Serious Hi-Tech L1 turned out to be 3 raccoons in a trench coat."
];

export const SHORT_REKT_NEWS = [
  "Fed turned the money printer back on.",
  "God candle liquidates 99% of bears.",
  "Michael Saylor just bought another $1B.",
  "Your short stop-loss was hunted by a single wick.",
  "ETF approved. Number go up technology engaged.",
  "Vitalik donated to the burn address. Supply shock.",
  "Random billionaire tweeted 'Based'. Pump ensued.",
  "Short squeeze: Bears are now an endangered species.",
  "China un-banned crypto for the 50th time.",
  "The chart pattern was actually a 'Reverse Dragon'.",
  "Institutions are buying the dip. You sold the bottom.",
  "Satoshi moved 1000 BTC... to a buy order?",
  "A meme coin named after a rock did a 1000x.",
  "Infinite Tether glitch (real).",
  "The 'Bubble' was just the 'Pre-Pump'.",
  "You shorted into a supercycle.",
  "Market irrationality > Your solvency."
];

// Luxury Items (New)
export const LUXURY_ITEMS = [
  { id: 'civic', name: 'Used Civic', cost: 500, emoji: '🚗' },
  { id: 'studio', name: 'NY Studio', cost: 5000, emoji: '🏢' },
  { id: 'g_wagon', name: 'G-Wagon', cost: 15000, emoji: '🚙' },
  { id: 'lambo_green', name: 'Lambo Huracan', cost: 250000, emoji: '🏎️' },
  { id: 'yacht', name: 'Super Yacht', cost: 1000000, emoji: '🛥️' },
  { id: 'villa', name: 'Dubai Villa', cost: 5000000, emoji: '🕌' },
  { id: 'jet', name: 'Private Jet', cost: 15000000, emoji: '✈️' },
  { id: 'island', name: 'Private Island', cost: 100000000, emoji: '🏝️' }
];

// --- IMAGE ASSETS ---
export const SOL_IMAGE_URL = 'https://i.ibb.co/0VrrxvDw/solana-round-logo-png-0-3x.png';
export const MEME_IMAGE_URL = 'https://i.ibb.co/VcD3WTYz/doge-0-3x.png';
export const WIF_IMAGE_URL = 'https://i.ibb.co/v6P00cGF/wif.png';
export const PEPE_IMAGE_URL = 'https://i.ibb.co/67cxZYyD/pepe.png';
export const POPCAT_IMAGE_URL = 'https://i.ibb.co/mrJjwJr5/popcat.png';

export const ENEMY_IMAGES: Record<string, string> = {
  BASE: 'https://i.ibb.co/DDHkFRMd/base-0-3x.png',
  STRK: 'https://i.ibb.co/MDNW2STB/strk-0-3x.png',
  BLAST: 'https://i.ibb.co/BKrfq7MX/blast-0-3x.png',
  LINEA: 'https://i.ibb.co/GfrnH9q8/llinea-0-3x.png',
  AVAX: 'https://i.ibb.co/S4SvfssT/avax.png',
  OP: 'https://i.ibb.co/8JGgg04/op.png',
  ARB: 'https://i.ibb.co/KxjYsR2j/arb.png',
  TRUMP: 'https://i.ibb.co/5gW2BDXP/trump.png',
  SUI: 'https://i.ibb.co/Fq4QkbV7/sui.png',
};
