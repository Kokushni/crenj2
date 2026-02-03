import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  PLAYER_SIZE, 
  STAR_COUNT, 
  NEBULA_COUNT,
  BULL_MARKET_COLOR, 
  BEAR_MARKET_COLOR, 
  BOSS_BACKGROUND_COLOR,
  GAME_SPEED_START, 
  GAME_SPEED_MAX, 
  PLAYER_SPEED, 
  MAX_LIVES, 
  START_LIVES, 
  MARKET_CYCLE_DURATION, 
  COMBO_TIMEOUT, 
  PANIC_SELL_COST, 
  BASE_MAGNET_RADIUS, 
  L2_NAMES, 
  L2_COLOR, 
  WOJAK_SKIN_COLOR, 
  MCDONALDS_RED, 
  MCDONALDS_YELLOW, 
  SOL_GOLD, 
  SOL_IMAGE_URL,
  MEME_COLOR, 
  MEME_IMAGE_URL, 
  WIF_IMAGE_URL,
  PEPE_IMAGE_URL,
  POPCAT_IMAGE_URL,
  ENEMY_IMAGES, 
  POWERUP_DURATION, 
  TRIPLE_SHOT_DURATION, 
  SHOTGUN_DURATION, 
  RAPID_DURATION, 
  SIDE_DURATION, 
  BOMB_DURATION, 
  LASER_DURATION, 
  MAGNET_RADIUS, 
  HAMTER_MAGNET_RADIUS, 
  PROJECTILE_COST, 
  PROJECTILE_SPEED, 
  PROJECTILE_SIZE, 
  AUTO_SHOOT_RATE, 
  LOW_LIQUIDITY_RATE, 
  RAPID_FIRE_RATE, 
  BOSS_IMAGE_URL, 
  BOSS_WIDTH, 
  BOSS_HEIGHT, 
  BOSS_DURATION, 
  BOSS_SHOOT_RATE, 
  BOSS_PROJECTILE_SPEED, 
  BOSS_AIM_SPREAD, 
  COLLECTIBLE_VALUE, 
  COLLECTIBLE_SIZE, 
  COLLECTIBLE_SPAWN_INTERVAL, 
  BTC_SPAWN_RATE, 
  RUG_PULL_WIDTH, 
  METEOR_WIDTH, 
  METEOR_HEIGHT, 
  WHALE_HP, 
  WHALE_SIZE, 
  SCAMMER_SPEED, 
  POWERUP_SIZE, 
  POWERUP_SPAWN_RATE, 
  POWERUP_GLOW_COLOR, 
  BOSS_REWARD, 
  WHALE_REWARD, 
  ENEMY_REWARD, 
  BOSS_SPAWN_CHANCE, 
  BOSS_HP, 
  COST_CLOWN, 
  COST_HAMTER, 
  COST_PEPE, 
  COST_ROLEX, 
  COST_LAMBO, 
  COST_SHIELD, 
  COST_HEAL, 
  COST_BASE_MOON, 
  COST_BASE_MAGNET, 
  COST_BASE_GAS, 
  COST_BASE_TRIPLE, 
  COST_BASE_LASER, 
  SPAWN_RATE_START, 
  LUXURY_ITEMS, 
  TRADABLE_ASSETS, 
  RIDICULOUS_NEWS, 
  SHORT_REKT_NEWS,
  TRADING_WIN_CHANCE, 
  TRADING_WIN_MULTIPLIER 
} from '../constants';
import { GameState } from '../types';
import type { 
  Player, 
  Star, 
  Nebula, 
  Enemy, 
  RugPull, 
  Meteor, 
  Candle, 
  Collectible, 
  PowerUp, 
  ActiveEffects, 
  Particle, 
  Projectile, 
  Boss, 
  PowerUpType, 
  Cosmetics, 
  MarketPhase, 
  FloatingText, 
  LeaderboardEntry,
  CollectibleType
} from '../types';
import { StorageManager } from '../storage';

interface Upgrades {
  moonDuration: number; 
  magnetRange: number; 
  cheapGas: number;   
  tripleShotDuration: number;
  laserDuration: number;
}

type MaskType = 'none' | 'clown' | 'hamter' | 'pepe';

// C Minor Bass Pattern (Techno)
const BASS_PATTERN = [
    65.41, 65.41, 0, 65.41,  
    65.41, 65.41, 0, 77.78,  
    65.41, 65.41, 0, 65.41,  
    87.31, 77.78, 65.41, 0
];

// C Minor Arp (Techno)
const ARP_PATTERN = [
    130.8, 0, 155.6, 0, 
    196.0, 0, 261.6, 0,
    233.1, 0, 196.0, 0,
    155.6, 0, 130.8, 0
];

// Elevator Bossa Nova (Normie Life)
const NORMIE_BASS = [
    130.8, 0, 0, 0,  // C3
    0, 0, 130.8, 0,  
    98.0, 0, 0, 0,   // G2
    0, 0, 98.0, 0    
];

// Cheesy Elevator Melody
const NORMIE_MELODY = [
    523.25, 0, 0, 0, // C5
    0, 493.88, 0, 0, // B4
    440.00, 0, 0, 0, // A4
    0, 392.00, 0, 0  // G4
];

const OFFICE_TASKS = [
    "Q3_REPORT", "TAX_FORM_8B", "SYNERGY", "TPS_COVER", 
    "EXCEL.EXE", "DEBIT_CREDIT", "AUDIT_LOG", "DATA_ENTRY",
    "MEETING_11AM", "RE:FWD:RE:", "NO_REPLY", "ATTACHMENT",
    "EXPENSE_RPT", "COMPLIANCE", "HR_POLICY", "BLUE_PEN"
];

export const NyanGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // React state for UI overlays (score, game over screen)
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [marketPhase, setMarketPhase] = useState<MarketPhase>('BULL');
  const [, setCombo] = useState(0);
  
  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [inputName, setInputName] = useState('');
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  // Shop & Economy State
  const [wallet, setWallet] = useState(0); // Persistent money
  const [showShop, setShowShop] = useState(false);
  const [showLifestyle, setShowLifestyle] = useState(false);
  const [showTrading, setShowTrading] = useState(false); 
  const [showNormieLife, setShowNormieLife] = useState(false); 
  const [hasShield, setHasShield] = useState(false); 
  const [ownedLuxuries, setOwnedLuxuries] = useState<string[]>([]);
  
  // Trading State
  const [selectedAsset, setSelectedAsset] = useState(TRADABLE_ASSETS[0]);
  const [tradeDirection, setTradeDirection] = useState<'LONG' | 'SHORT'>('LONG');
  const [tradeResult, setTradeResult] = useState<{success: boolean; message: string; amount: number} | null>(null);

  // Normie Life State (Data Entry)
  const [officeTask, setOfficeTask] = useState('');
  const [officeInput, setOfficeInput] = useState('');
  const [shiftProgress, setShiftProgress] = useState(0);
  const [shiftMoney, setShiftMoney] = useState(0);
  const [shiftFeedback, setShiftFeedback] = useState('');
  const [shiftEnded, setShiftEnded] = useState(false);

  const [upgrades, setUpgrades] = useState<Upgrades>({
    moonDuration: 0,
    magnetRange: 0,
    cheapGas: 0,
    tripleShotDuration: 0,
    laserDuration: 0
  });
  
  const [cosmetics, setCosmetics] = useState<Cosmetics>({
    clownMask: false,
    hamterMask: false,
    pepeMask: false,
    rolex: false,
    lambo: false
  });
  
  const [equippedMask, setEquippedMask] = useState<MaskType>('none');

  // Mutable game state
  const requestRef = useRef<number>(0);
  const frameCountRef = useRef(0);
  const scoreRef = useRef(0);
  const gameSpeedRef = useRef(GAME_SPEED_START);
  const shakeRef = useRef(0); // Screen shake magnitude
  const livesRef = useRef(START_LIVES); // Sync ref for game loop
  const marketPhaseRef = useRef<MarketPhase>('BULL');
  const marketTimerRef = useRef(0);
  const comboRef = useRef(0);
  const comboTimerRef = useRef(0);
  
  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);
  const nextNoteTimeRef = useRef(0);
  const rhythmIndexRef = useRef(0);
  const musicStartTimeRef = useRef(0); // Tracks when the current track started

  // Image Assets Refs
  const solImgRef = useRef<HTMLImageElement | null>(null);
  const memeImgRef = useRef<HTMLImageElement | null>(null);
  const wifImgRef = useRef<HTMLImageElement | null>(null);
  const pepeImgRef = useRef<HTMLImageElement | null>(null);
  const popcatImgRef = useRef<HTMLImageElement | null>(null);
  const bossImgRef = useRef<HTMLImageElement | null>(null);
  const enemyImagesRef = useRef<Record<string, HTMLImageElement>>({});
  
  // Entities
  const playerRef = useRef<Player>({ 
    x: 100, 
    y: CANVAS_HEIGHT / 2, 
    width: PLAYER_SIZE, // Square for Wojak head/body
    height: PLAYER_SIZE + 10, 
    color: WOJAK_SKIN_COLOR,
    velocity: 0,
    scale: 1.0
  });
  
  const activeEffectsRef = useRef<ActiveEffects>({ invincible: 0, magnet: 0, tripleShot: 0, shotgun: 0, rapid: 0, side: 0, bomb: 0, laser: 0, shield: false, hitInvincibility: 0 });

  const starsRef = useRef<Star[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]); // Background clouds
  const enemiesRef = useRef<Enemy[]>([]);
  const rugsRef = useRef<RugPull[]>([]);
  const meteorsRef = useRef<Meteor[]>([]);
  const collectiblesRef = useRef<Collectible[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const enemyProjectilesRef = useRef<Projectile[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]); // New Ref for Floating Texts
  const bossRef = useRef<Boss | null>(null);
  
  // Market Candle Trail State
  const trailRef = useRef<Candle[]>([]);
  const currentCandleRef = useRef<{
    open: number;
    high: number;
    low: number;
    frameStart: number;
  }>({ open: CANVAS_HEIGHT / 2, high: CANVAS_HEIGHT / 2, low: CANVAS_HEIGHT / 2, frameStart: 0 });
  
  // Input state
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  // --- PERSISTENCE LOAD ---
  useEffect(() => {
    // Load initial data
    StorageManager.loadProgress().then(data => {
        setWallet(data.wallet);
        setUpgrades(data.upgrades);
        setCosmetics(data.cosmetics);
        setOwnedLuxuries(data.ownedLuxuries);
        setHasShield(data.hasShield);
        activeEffectsRef.current.shield = data.hasShield; // Sync physics ref
    });

    StorageManager.getLeaderboard().then(setLeaderboard);
  }, []);

  // --- SAVE HELPER ---
  // Trigger this when major economy events happen (Shop, Game Over)
  const saveUserData = useCallback(() => {
      StorageManager.saveProgress({
          wallet,
          upgrades,
          cosmetics,
          ownedLuxuries,
          hasShield
      });
  }, [wallet, upgrades, cosmetics, ownedLuxuries, hasShield]);

  // Save when wallet/inventory changes significantly
  useEffect(() => {
      // Auto-save debounce could be here, but for now we trust explicit calls or unmount
      // Actually, let's just save on every change to state to be safe, but debounced 1s?
      // For simplicity, we will stick to explicit saves in handlers + game over
      const timeout = setTimeout(saveUserData, 2000);
      return () => clearTimeout(timeout);
  }, [wallet, upgrades, cosmetics, ownedLuxuries, hasShield, saveUserData]);


  // --- ASSET LOADING & LEADERBOARD ---
  useEffect(() => {
    const loadImg = (url: any) => {
      if (typeof url !== 'string' || !url) return null;
      const img = new Image();
      img.src = url;
      return img;
    };

    solImgRef.current = loadImg(SOL_IMAGE_URL);
    memeImgRef.current = loadImg(MEME_IMAGE_URL);
    wifImgRef.current = loadImg(WIF_IMAGE_URL);
    pepeImgRef.current = loadImg(PEPE_IMAGE_URL);
    popcatImgRef.current = loadImg(POPCAT_IMAGE_URL);
    bossImgRef.current = loadImg(BOSS_IMAGE_URL);
    
    // Load Enemy Images
    Object.entries(ENEMY_IMAGES).forEach(([key, url]) => {
      const img = loadImg(url);
      if (img) {
        enemyImagesRef.current[key] = img;
      }
    });
  }, []);

  // --- AUDIO SYSTEM ---
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    
    // Create Noise Buffer for Hi-Hats & Claps
    if (audioCtxRef.current && !noiseBufferRef.current) {
        const bufferSize = audioCtxRef.current.sampleRate * 2; // 2 seconds
        const buffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        noiseBufferRef.current = buffer;
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playTone = useCallback((freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, []);

  // --- TECHNO INSTRUMENTS ---
  const playKick = useCallback((time: number, isSoft = false) => {
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.frequency.setValueAtTime(isSoft ? 120 : 150, time);
      osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
      
      // Punchy kick
      gain.gain.setValueAtTime(isSoft ? 0.5 : 0.7, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + 0.5);
  }, []);

  const playHiHat = useCallback((time: number, open: boolean = false, isSoft = false) => {
      if (!audioCtxRef.current || !noiseBufferRef.current) return;
      const ctx = audioCtxRef.current;
      const source = ctx.createBufferSource();
      source.buffer = noiseBufferRef.current;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = isSoft ? 6000 : 8000;
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(open ? (isSoft ? 0.15 : 0.2) : (isSoft ? 0.05 : 0.1), time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + (open ? 0.1 : 0.05));
      
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      source.start(time);
      source.stop(time + 0.2);
  }, []);

  const playClap = useCallback((time: number, isSoft = false) => {
      if (!audioCtxRef.current || !noiseBufferRef.current) return;
      const ctx = audioCtxRef.current;
      const source = ctx.createBufferSource();
      source.buffer = noiseBufferRef.current;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = isSoft ? 1000 : 1200;
      filter.Q.value = 1;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(isSoft ? 0.15 : 0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
      
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      source.start(time);
      source.stop(time + 0.2);
  }, []);

  const playBass = useCallback((time: number, freq: number, intensity: number = 0, isNormie = false) => {
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      // Normie: Sine/Triangle for bouncy feel, Techno: Sawtooth
      osc.type = isNormie ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      
      const baseFreq = isNormie ? 200 : (200 + (intensity * 800)); 
      filter.frequency.setValueAtTime(baseFreq, time);
      
      if (!isNormie) {
          filter.frequency.exponentialRampToValueAtTime(100, time + 0.2);
      } else {
          // Bouncier envelope for normie
          filter.frequency.exponentialRampToValueAtTime(50, time + 0.3);
      }
      filter.Q.value = isNormie ? 0 : 5;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(isNormie ? 0.2 : 0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + (isNormie ? 0.4 : 0.2));
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + 0.5);
  }, []);

  const playSynth = useCallback((time: number, freq: number, intensity: number = 0, isNormie = false) => {
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      osc.type = isNormie ? 'sine' : 'square';
      osc.frequency.setValueAtTime(freq, time);

      // Synth Detune for fatness
      const osc2 = ctx.createOscillator();
      osc2.type = isNormie ? 'sine' : 'sawtooth';
      osc2.frequency.setValueAtTime(freq * (isNormie ? 1.005 : 1.01), time); // Slight detune

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      
      const cutoff = isNormie ? 600 : (800 + (intensity * 4000)); 
      filter.frequency.setValueAtTime(cutoff, time);
      filter.frequency.exponentialRampToValueAtTime(isNormie ? 100 : 400, time + 0.15);
      filter.Q.value = 2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + (isNormie ? 0.3 : 0.15));

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc2.start(time);
      osc.stop(time + 0.3);
      osc2.stop(time + 0.3);
  }, []);

  // --- GAMEPLAY SOUNDS ---
  const playCollectSound = useCallback(() => {
    playTone(1046.50, 'square', 0.1, 0.05); // C6
    setTimeout(() => playTone(1567.98, 'square', 0.2, 0.05), 50); // G6
  }, [playTone]);

  const playPowerUpSound = useCallback(() => {
    playTone(440, 'sine', 0.1, 0.1);
    setTimeout(() => playTone(554, 'sine', 0.1, 0.1), 100);
    setTimeout(() => playTone(659, 'sine', 0.2, 0.1), 200);
  }, [playTone]);

  const playExplosionSound = useCallback(() => {
    playTone(100, 'sawtooth', 0.3, 0.1);
    playTone(80, 'sawtooth', 0.3, 0.1);
    setTimeout(() => playTone(50, 'square', 0.4, 0.1), 50);
  }, [playTone]);
  
  const playShieldBreakSound = useCallback(() => {
    playTone(800, 'sine', 0.1, 0.1);
    setTimeout(() => playTone(600, 'sawtooth', 0.1, 0.1), 50);
    setTimeout(() => playTone(400, 'square', 0.2, 0.1), 100);
  }, [playTone]);
  
  const playEatSound = useCallback(() => {
      playTone(300, 'square', 0.05, 0.1);
      setTimeout(() => playTone(400, 'square', 0.05, 0.1), 80);
      setTimeout(() => playTone(300, 'square', 0.05, 0.1), 160);
  }, [playTone]);

  const playSmashSound = useCallback(() => {
    playTone(150, 'square', 0.1, 0.1);
    setTimeout(() => playTone(100, 'square', 0.1, 0.1), 50);
  }, [playTone]);

  const playShootSound = useCallback(() => {
    playTone(800, 'sawtooth', 0.05, 0.03); 
    setTimeout(() => playTone(1200, 'square', 0.05, 0.03), 20);
  }, [playTone]);

  const playLowAmmoSound = useCallback(() => {
    playTone(200, 'triangle', 0.1, 0.05);
  }, [playTone]);

  const playLaserSound = useCallback(() => {
    playTone(200, 'sawtooth', 0.1, 0.05);
  }, [playTone]);
  
  const playHealSound = useCallback(() => {
      playTone(400, 'sine', 0.1, 0.1);
      setTimeout(() => playTone(600, 'sine', 0.2, 0.1), 100);
      setTimeout(() => playTone(800, 'sine', 0.3, 0.2), 200);
  }, [playTone]);
  
  const playTypingSound = useCallback(() => {
     playTone(800 + Math.random() * 200, 'square', 0.05, 0.05); 
  }, [playTone]);
  
  const playErrorSound = useCallback(() => {
      playTone(150, 'sawtooth', 0.2, 0.2);
      setTimeout(() => playTone(100, 'sawtooth', 0.3, 0.2), 100);
  }, [playTone]);

  // --- MUSIC SCHEDULER ---
  const scheduleAudio = useCallback(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    // Safety: If visual/audio desync happens or lag spike, reset scheduler
    if (nextNoteTimeRef.current < ctx.currentTime - 0.5) {
        nextNoteTimeRef.current = ctx.currentTime;
    }
    
    // DIFFERENT TEMPOS
    let tempo = 128;
    if (showNormieLife) tempo = 90;

    const secondsPerBeat = 60.0 / tempo;
    const lookahead = 0.1; // How far ahead to schedule (seconds)

    while (nextNoteTimeRef.current < ctx.currentTime + lookahead) {
       // Determine Song Progress
       let elapsedTime = nextNoteTimeRef.current - musicStartTimeRef.current;
       if (elapsedTime < 0) elapsedTime = 0;

       let intensity = 0; 
       let hasPercussion = false;
       let hasMelody = false;
       
       if (showNormieLife) {
           // Boring Elevator Music
           hasPercussion = false; // Minimal percussion
           hasMelody = true;
       } else {
           // Progressive Techno for Main Game
           if (elapsedTime >= 30) {
               hasPercussion = true;
               intensity = 0.2;
           }
           if (elapsedTime >= 60) {
               hasMelody = true;
               intensity = 0.5;
           }
           if (elapsedTime >= 120 && elapsedTime < 150) {
               intensity = 1.0;
           }
           if (elapsedTime >= 150) {
               hasPercussion = true;
               hasMelody = true;
               intensity = 0.8;
           }
       }
       
       const step = rhythmIndexRef.current % 16;
       const time = nextNoteTimeRef.current;
       
       // Sync Player Bop with Kick
       if (step % 4 === 0) {
           // Main Game: Hard Kick, Normie: Nothing or Soft Click
           if (!showNormieLife) {
             playKick(time, false);
           }
       }

       if (hasPercussion && !showNormieLife) {
           // TECHNO
           if (step % 4 === 2) {
               playHiHat(time, true); // Open hat
           } else if (step % 2 === 0) {
               playHiHat(time, false); 
           }

           if (step === 4 || step === 12) {
               playClap(time);
           }
       }

       if (showNormieLife) {
           // Elevator Music Pattern
           const bassNote = NORMIE_BASS[Math.floor(step / 4)]; // Change chord every beat
           if (bassNote > 0 && step % 4 === 0) {
               playBass(time, bassNote, 0, true);
           }
           
           if (hasMelody) {
               const melodyNote = NORMIE_MELODY[Math.floor(step/4)];
               if (melodyNote > 0 && step % 8 === 0) {
                   playSynth(time, melodyNote, 0, true);
               }
           }
       } else {
           // MAIN GAME
           const bassNote = BASS_PATTERN[step];
           if (bassNote > 0) {
               const pitchMod = activeEffectsRef.current.invincible > 0 ? 1.5 : 1.0;
               playBass(time, bassNote * pitchMod, intensity, false);
           }

           if (hasMelody) {
                const synthNote = ARP_PATTERN[step];
                if (synthNote > 0) {
                    const pitchMod = activeEffectsRef.current.invincible > 0 ? 1.5 : 1.0;
                    playSynth(time, synthNote * pitchMod, intensity, false);
                }
           }
       }

       const secondsPer16th = secondsPerBeat / 4;
       nextNoteTimeRef.current += secondsPer16th;
       rhythmIndexRef.current++;
    }
  }, [playKick, playHiHat, playClap, playBass, playSynth, showNormieLife]);

  // Background Music Loop
  useEffect(() => {
    let intervalId: number;
    
    // START LOOP IF PLAYING OR NORMIE LIFE IS OPEN
    if (gameState === GameState.PLAYING || showNormieLife) {
      if (audioCtxRef.current) {
          if (nextNoteTimeRef.current < audioCtxRef.current.currentTime) {
              nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.1;
              musicStartTimeRef.current = audioCtxRef.current.currentTime;
              rhythmIndexRef.current = 0;
          }
      }
      intervalId = window.setInterval(scheduleAudio, 25);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [gameState, scheduleAudio, showNormieLife]);


  // Initialize Stars & Nebulae
  const initStars = useCallback(() => {
    const stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 3 + 1
      });
    }
    starsRef.current = stars;
    
    // Initialize Nebulae for parallax
    const nebulae: Nebula[] = [];
    for(let i=0; i < NEBULA_COUNT; i++) {
        nebulae.push({
            x: Math.random() * CANVAS_WIDTH,
            y: Math.random() * CANVAS_HEIGHT,
            size: Math.random() * 200 + 100,
            color: `hsla(${Math.random() * 360}, 70%, 50%, 0.1)`,
            speed: Math.random() * 0.5 + 0.2 // Very slow moving
        });
    }
    nebulaeRef.current = nebulae;
  }, []);

  // Spawn Particles Helper
  const spawnParticles = useCallback((x: number, y: number, color: string, count: number = 10) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color: color,
        size: Math.random() * 4 + 2
      });
    }
  }, []);
  
  // Spawn Floating Text Helper
  const spawnFloatingText = useCallback((x: number, y: number, text: string, color: string = '#00FF00') => {
      floatingTextsRef.current.push({
          x,
          y,
          text,
          color,
          life: 1.0,
          vy: -2 // Move up
      });
  }, []);
  
  // Submit Score Function
  const submitScore = useCallback(() => {
      if (!inputName.trim()) return;
      
      const newEntry: LeaderboardEntry = {
          name: inputName.substring(0, 10).toUpperCase(),
          score: scoreRef.current,
          timestamp: Date.now()
      };
      
      StorageManager.submitScore(newEntry).then(() => {
          // Refresh leaderboard
          return StorageManager.getLeaderboard();
      }).then(setLeaderboard);

      setScoreSubmitted(true);
      setIsNewHigh(false);
  }, [inputName]);

  // Game Over Handler
  const handleGameOver = useCallback(() => {
      playExplosionSound();
      shakeRef.current = 30; // Massive shake
      const p = playerRef.current;
      spawnParticles(p.x + p.width/2, p.y + p.height/2, MCDONALDS_RED, 40);
      
      setGameState(GameState.GAME_OVER);
      setScoreSubmitted(false);
      setInputName('');
      
      const currentScore = scoreRef.current;
      const lowestScore = leaderboard.length < 10 ? 0 : Math.min(...leaderboard.map(e => e.score));
      
      if (currentScore > 0 && (leaderboard.length < 10 || currentScore > lowestScore)) {
          setIsNewHigh(true);
      } else {
          setIsNewHigh(false);
      }
      
      // Transfer score to persistent wallet
      setWallet(prev => {
          const newVal = prev + scoreRef.current;
          // Trigger save implicitly via effect or explicit here? 
          // Effect handles change, but explicit is safer for race conditions on close
          // We rely on effect for now
          return newVal;
      });
  }, [playExplosionSound, spawnParticles, leaderboard]);
  
  // Player Damage Handler
  const damagePlayer = useCallback(() => {
      if (activeEffectsRef.current.invincible > 0) return; // God mode
      if (activeEffectsRef.current.hitInvincibility > 0) return; // iFrames
      
      if (activeEffectsRef.current.shield) {
          playShieldBreakSound();
          activeEffectsRef.current.shield = false;
          setHasShield(false); // Update state to trigger save/UI update
          activeEffectsRef.current.hitInvincibility = 60; // 1s iframe
          shakeRef.current = 10;
          spawnParticles(playerRef.current.x, playerRef.current.y, '#00FFFF', 20);
          return;
      }
      
      // Reset combo on hit
      comboRef.current = 0;
      setCombo(0);
      
      // Take Damage
      livesRef.current -= 1;
      setLives(livesRef.current);
      
      if (livesRef.current <= 0) {
          handleGameOver();
      } else {
          // Survived hit
          playExplosionSound();
          shakeRef.current = 20;
          activeEffectsRef.current.hitInvincibility = 90; // 1.5s iframe
          spawnParticles(playerRef.current.x, playerRef.current.y, '#FF0000', 15);
      }
  }, [handleGameOver, playExplosionSound, playShieldBreakSound, spawnParticles]);

  const addScore = useCallback((amount: number) => {
      // Apply Combo Multiplier
      const multiplier = 1 + (comboRef.current * 0.1);
      const bonus = Math.floor(amount * multiplier);
      
      scoreRef.current += bonus;
      setScore(scoreRef.current);
      
      // Increment Combo
      comboRef.current += 1;
      comboTimerRef.current = COMBO_TIMEOUT;
      setCombo(comboRef.current);
      
      // Visual Bop on score
      playerRef.current.scale = 1.3;
  }, []);

  const panicSell = useCallback(() => {
      if (scoreRef.current >= PANIC_SELL_COST) {
          scoreRef.current -= PANIC_SELL_COST;
          setScore(scoreRef.current);
          
          playExplosionSound();
          shakeRef.current = 40;
          
          // Clear Screen
          enemiesRef.current = [];
          enemyProjectilesRef.current = [];
          meteorsRef.current = [];
          // Keep Boss but damage? No, just clear minions
          
          // Visual flare
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx) {
              ctx.fillStyle = 'white';
              ctx.fillRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
          }
      }
  }, [playExplosionSound]);

  // Reset Game
  const resetGame = useCallback(() => {
    initAudio(); 
    setGameState(GameState.PLAYING);
    setScore(0);
    scoreRef.current = 0;
    
    // Preserve purchased lives if starting from menu/gameover
    // If in-game restart (which shouldn't happen via buttons but for safety), reset to baseline
    const currentLives = lives; // Capture state
    const newLives = gameState === GameState.PLAYING ? START_LIVES : Math.max(currentLives, START_LIVES);
    
    livesRef.current = newLives;
    setLives(newLives);
    
    comboRef.current = 0;
    setCombo(0);
    
    marketPhaseRef.current = 'BULL';
    setMarketPhase('BULL');
    marketTimerRef.current = 0;
    
    frameCountRef.current = 0;
    gameSpeedRef.current = GAME_SPEED_START;
    shakeRef.current = 0;
    
    playerRef.current = {
      x: 100,
      y: CANVAS_HEIGHT / 2,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE + 10,
      color: WOJAK_SKIN_COLOR,
      velocity: 0,
      scale: 1.0
    };
    
    enemiesRef.current = [];
    collectiblesRef.current = [];
    powerUpsRef.current = [];
    particlesRef.current = [];
    projectilesRef.current = [];
    enemyProjectilesRef.current = [];
    rugsRef.current = [];
    meteorsRef.current = [];
    floatingTextsRef.current = [];
    
    activeEffectsRef.current = { 
        invincible: 0, 
        magnet: 0, 
        tripleShot: 0,
        shotgun: 0,
        rapid: 0,
        side: 0,
        bomb: 0, 
        laser: 0, 
        shield: hasShield,
        hitInvincibility: 0
    };
    
    if (audioCtxRef.current) {
        nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.1;
        musicStartTimeRef.current = audioCtxRef.current.currentTime;
        rhythmIndexRef.current = 0;
    }

    // Shield handled by state setHasShield from previous run
    // DO NOT RESET setHasShield(false) unless consumed!
    
    trailRef.current = [];
    bossRef.current = null;
    
    currentCandleRef.current = {
      open: CANVAS_HEIGHT / 2,
      high: CANVAS_HEIGHT / 2,
      low: CANVAS_HEIGHT / 2,
      frameStart: 0
    };

    mouseRef.current.x = null;
    mouseRef.current.y = null;
    initStars();
  }, [initStars, initAudio, hasShield, lives, gameState]);

  const attemptShoot = useCallback(() => {
    if (activeEffectsRef.current.laser > 0) return;

    const cost = Math.max(1, PROJECTILE_COST - (upgrades.cheapGas > 0 ? 1 : 0));
    const isLowLiquidity = scoreRef.current < cost;
    
    // Low Liquidity Logic: Free but weak
    if (isLowLiquidity) {
        playLowAmmoSound();
    } else {
        scoreRef.current -= cost;
        setScore(scoreRef.current);
        playShootSound();
    }
      
    const p = playerRef.current;
    const baseX = p.x + p.width;
    const baseY = p.y + p.height / 2 - 10;
    
    const sizeMod = equippedMask === 'pepe' ? 1.5 : 1.0;
    const baseSize = (isLowLiquidity ? PROJECTILE_SIZE * 0.5 : PROJECTILE_SIZE) * sizeMod;
    const height = (isLowLiquidity ? 10 : 15) * sizeMod;
    const speed = isLowLiquidity ? PROJECTILE_SPEED * 0.5 : PROJECTILE_SPEED;
    const color = isLowLiquidity ? '#555' : '#85bb65';
    const damage = isLowLiquidity ? 1 : 2; // Normal projectiles do 2 dmg, weak do 1
      
    const spawnBill = (x: number, y: number, vy: number = 0) => {
          projectilesRef.current.push({
            x: x,
            y: y,
            width: baseSize,
            height: height,
            color: color,
            speed: speed,
            vy: vy,
            damage: damage
          });
    };
      
    // Center shot
    spawnBill(baseX, baseY, 0);
    // Tiny recoil bop
    p.scale = 0.95;
      
    if (!isLowLiquidity) {
        if (activeEffectsRef.current.tripleShot > 0) {
            spawnBill(baseX, baseY - 10, -3);
            spawnBill(baseX, baseY + 10, 3);
        }
        
        if (activeEffectsRef.current.shotgun > 0) {
            spawnBill(baseX, baseY, -6);
            spawnBill(baseX, baseY, -3); 
            spawnBill(baseX, baseY, 0);  
            spawnBill(baseX, baseY, 3);
            spawnBill(baseX, baseY, 6);
        }
        
        if (activeEffectsRef.current.side > 0) {
            spawnBill(baseX, p.y - 10, 0);
            spawnBill(baseX, p.y + p.height + 10, 0);
        }
    }
  }, [playShootSound, playLowAmmoSound, upgrades.cheapGas, equippedMask]);

  // Handle Input Events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow typing without triggering game actions
      if (gameState === GameState.GAME_OVER && isNewHigh && !scoreSubmitted) {
          if (e.code === 'Enter') {
              submitScore();
          }
          return;
      }
      
      // If typing in Normie Life, prevent normal game controls
      if (showNormieLife) {
          return;
      }

      keysRef.current[e.code] = true;
      if ((e.code === 'Space' || e.code === 'Enter') && gameState !== GameState.PLAYING && !showShop && !showLifestyle && !showTrading && !showNormieLife) {
        resetGame();
      }
      if ((e.code === 'ShiftLeft' || e.code === 'ShiftRight') && gameState === GameState.PLAYING) {
          panicSell();
      }
    };
    
    const handleMouseDown = (e: MouseEvent) => {
        if (e.button === 2 && gameState === GameState.PLAYING) { // Right Click
            e.preventDefault();
            panicSell();
        }
    }
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };
    
    const handleContextMenu = (e: Event) => e.preventDefault();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [gameState, resetGame, showShop, showLifestyle, showTrading, showNormieLife, panicSell, isNewHigh, scoreSubmitted, submitScore]);

  // The Main Game Loop
  const update = useCallback(() => {
    if (gameState !== GameState.PLAYING) return;
    if (showNormieLife) return; // PAUSE GAME IF MINIGAMES OPEN

    frameCountRef.current++;
    marketTimerRef.current++;
    
    if (marketTimerRef.current > MARKET_CYCLE_DURATION) {
        marketTimerRef.current = 0;
        marketPhaseRef.current = marketPhaseRef.current === 'BULL' ? 'BEAR' : 'BULL';
        setMarketPhase(marketPhaseRef.current);
    }
    
    if (comboTimerRef.current > 0) {
        comboTimerRef.current--;
    } else {
        if (comboRef.current > 0) {
            comboRef.current = 0;
            setCombo(0);
        }
    }
    
    let currentFireRate = AUTO_SHOOT_RATE;
    if (activeEffectsRef.current.rapid > 0) {
        currentFireRate = RAPID_FIRE_RATE;
    }
    
    const cost = Math.max(1, PROJECTILE_COST - (upgrades.cheapGas > 0 ? 1 : 0));
    if (scoreRef.current < cost) {
        currentFireRate = LOW_LIQUIDITY_RATE;
    }
    
    if (frameCountRef.current % currentFireRate === 0) {
        attemptShoot();
    }
    
    if (activeEffectsRef.current.laser > 0 && frameCountRef.current % 10 === 0) {
        playLaserSound();
    }
    
    if (shakeRef.current > 0) {
      shakeRef.current *= 0.9;
      if (shakeRef.current < 0.5) shakeRef.current = 0;
    }
    
    if (activeEffectsRef.current.bomb > 0) {
        shakeRef.current = 20;
    }

    if (frameCountRef.current % 600 === 0) {
        if (gameSpeedRef.current < GAME_SPEED_MAX) {
             gameSpeedRef.current += 0.5;
        }
    }

    if (activeEffectsRef.current.invincible > 0) activeEffectsRef.current.invincible--;
    if (activeEffectsRef.current.magnet > 0) activeEffectsRef.current.magnet--;
    if (activeEffectsRef.current.tripleShot > 0) activeEffectsRef.current.tripleShot--;
    if (activeEffectsRef.current.laser > 0) activeEffectsRef.current.laser--;
    if (activeEffectsRef.current.shotgun > 0) activeEffectsRef.current.shotgun--;
    if (activeEffectsRef.current.rapid > 0) activeEffectsRef.current.rapid--;
    if (activeEffectsRef.current.side > 0) activeEffectsRef.current.side--;
    if (activeEffectsRef.current.hitInvincibility > 0) activeEffectsRef.current.hitInvincibility--;
    
    if (activeEffectsRef.current.bomb > 0) {
        activeEffectsRef.current.bomb--;
        enemiesRef.current = [];
        enemyProjectilesRef.current = [];
        meteorsRef.current = [];
        if (bossRef.current) {
             bossRef.current = null;
             addScore(BOSS_REWARD);
        }
    }

    const player = playerRef.current;
    
    // Smoothly restore scale to 1.0
    player.scale += (1.0 - player.scale) * 0.1;
    
    const playerCenterY = player.y + player.height / 2;
    
    if (mouseRef.current.y !== null && mouseRef.current.x !== null) {
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;
      player.x += (targetX - player.x) * 0.15;
      player.y += (targetY - player.y) * 0.15;
    } else {
      if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) player.y -= PLAYER_SPEED;
      if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) player.y += PLAYER_SPEED;
      if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) player.x -= PLAYER_SPEED;
      if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) player.x += PLAYER_SPEED;
    }

    if (player.x < 0) player.x = 0;
    if (player.x > CANVAS_WIDTH - player.width) player.x = CANVAS_WIDTH - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y > CANVAS_HEIGHT - player.height) player.y = CANVAS_HEIGHT - player.height;

    const cur = currentCandleRef.current;
    cur.high = Math.min(cur.high, playerCenterY);
    cur.low = Math.max(cur.low, playerCenterY);

    if (frameCountRef.current - cur.frameStart >= 8) {
      const candle: Candle = {
        x: player.x,
        open: cur.open,
        close: playerCenterY,
        high: cur.high,
        low: cur.low,
        width: 15
      };
      trailRef.current.unshift(candle);
      currentCandleRef.current = {
        open: playerCenterY,
        high: playerCenterY,
        low: playerCenterY,
        frameStart: frameCountRef.current
      };
    }

    for (let i = 0; i < trailRef.current.length; i++) {
      trailRef.current[i].x -= gameSpeedRef.current;
    }
    if (trailRef.current.length > 0 && trailRef.current[trailRef.current.length - 1].x < -50) {
      trailRef.current.pop();
    }

    starsRef.current.forEach(star => {
      const speedMod = activeEffectsRef.current.invincible > 0 ? 3 : 1;
      star.x -= star.speed * speedMod;
      if (star.x < 0) {
        star.x = CANVAS_WIDTH;
        star.y = Math.random() * CANVAS_HEIGHT;
      }
    });
    
    // Parallax Nebulae
    nebulaeRef.current.forEach(neb => {
        const speedMod = activeEffectsRef.current.invincible > 0 ? 2 : 1;
        neb.x -= neb.speed * speedMod;
        if(neb.x + neb.size < 0) {
            neb.x = CANVAS_WIDTH + neb.size;
            neb.y = Math.random() * CANVAS_HEIGHT;
        }
    });

    const currentSpawnRate = Math.max(20, SPAWN_RATE_START - (gameSpeedRef.current * 2));
    if (frameCountRef.current % Math.floor(currentSpawnRate) === 0) {
      const isWhale = Math.random() < 0.1;
      const isScammer = !isWhale && Math.random() < 0.2; 
      
      const enemyLabel = L2_NAMES[Math.floor(Math.random() * L2_NAMES.length)];
      
      let width = 60;
      let height = 60;
      let hp = 3;
      let type: 'STANDARD' | 'WHALE' | 'SCAMMER' = 'STANDARD';
      let speed = gameSpeedRef.current;
      
      if (isWhale) {
          width = WHALE_SIZE;
          height = WHALE_SIZE * 0.6;
          hp = WHALE_HP;
          type = 'WHALE';
          speed = gameSpeedRef.current * 0.5;
      } else if (isScammer) {
          type = 'SCAMMER';
          speed = gameSpeedRef.current + SCAMMER_SPEED;
      }

      enemiesRef.current.push({
        x: CANVAS_WIDTH,
        y: Math.random() * (CANVAS_HEIGHT - height),
        width: width,
        height: height,
        color: L2_COLOR,
        speed: speed,
        label: enemyLabel,
        type: type,
        hp: hp,
        maxHp: hp
      });
    }

    for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
      const enemy = enemiesRef.current[i];
      enemy.x -= enemy.speed * (activeEffectsRef.current.invincible > 0 ? 2 : 1);

      if (
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
      ) {
        if (activeEffectsRef.current.invincible > 0) {
            playSmashSound();
            spawnParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, L2_COLOR, 15);
            enemiesRef.current.splice(i, 1);
            addScore(20);
        } else {
            enemiesRef.current.splice(i, 1);
            damagePlayer();
        }
        continue;
      }

      if (enemy.x + enemy.width < 0) {
        enemiesRef.current.splice(i, 1);
      }
    }

    if (frameCountRef.current % COLLECTIBLE_SPAWN_INTERVAL === 0) {
       const isBtc = Math.random() < (1 / (BTC_SPAWN_RATE/60)); 
       let type: CollectibleType = 'MEME';
       
       if (isBtc) {
           type = 'BTC';
       } else {
           const rand = Math.random();
           // Distribute remaining probability among valid types
           if (rand < 0.25) type = 'MEME';
           else if (rand < 0.50) type = 'WIF';
           else if (rand < 0.75) type = 'PEPE';
           else type = 'POPCAT';
       }

       const size = type === 'BTC' ? 30 : COLLECTIBLE_SIZE;
       
       // Default color fallback
       let color = MEME_COLOR;
       if (type === 'BTC') color = '#fff';
       
       collectiblesRef.current.push({
           x: CANVAS_WIDTH,
           y: Math.random() * (CANVAS_HEIGHT - size),
           width: size,
           height: size,
           color: color,
           type: type,
           value: COLLECTIBLE_VALUE,
           speed: gameSpeedRef.current
       });
    }

    for (let i = collectiblesRef.current.length - 1; i >= 0; i--) {
        const item = collectiblesRef.current[i];
        let mx = 0;
        let my = 0;
        // Base magnetism + Bonuses
        const magnetRange = BASE_MAGNET_RADIUS + 
                            (equippedMask === 'hamter' ? HAMTER_MAGNET_RADIUS : 0) + 
                            (activeEffectsRef.current.magnet > 0 ? MAGNET_RADIUS * (1 + upgrades.magnetRange * 0.05) : 0);
        
        if (magnetRange > 0) {
            const dx = (player.x + player.width/2) - (item.x + item.width/2);
            const dy = (player.y + player.height/2) - (item.y + item.height/2);
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < magnetRange) {
                // Stronger pull when closer
                const force = (1 - dist / magnetRange) * 15;
                mx = dx * 0.05 * force;
                my = dy * 0.05 * force;
            }
        }
        item.x -= item.speed;
        item.x += mx;
        item.y += my;

        if (
            player.x < item.x + item.width &&
            player.x + player.width > item.x &&
            player.y < item.y + item.height &&
            player.y + player.height > item.y
        ) {
            if (item.type === 'BTC') {
                playEatSound();
                if (livesRef.current < MAX_LIVES) {
                    livesRef.current++;
                    setLives((prev: number) => prev + 1);
                } else {
                    addScore(50);
                    spawnFloatingText(item.x, item.y, "+$50");
                }
            } else {
                playCollectSound();
                addScore(item.value);
                spawnFloatingText(item.x, item.y, "+$" + item.value);
            }
            collectiblesRef.current.splice(i, 1);
            continue;
        }
        if (item.x + item.width < 0) {
            collectiblesRef.current.splice(i, 1);
        }
    }

    if (Math.random() < 0.002) { 
        rugsRef.current.push({
            x: CANVAS_WIDTH,
            y: 0,
            width: RUG_PULL_WIDTH,
            height: Math.random() * (CANVAS_HEIGHT * 0.8) + 100, 
            color: '#FF0000',
            speed: gameSpeedRef.current
        });
    }
    for (let i = rugsRef.current.length - 1; i >= 0; i--) {
        const rug = rugsRef.current[i];
        rug.x -= rug.speed;
        if (
            player.x < rug.x + rug.width &&
            player.x + player.width > rug.x &&
            player.y < rug.y + rug.height &&
            player.y + player.height > rug.y
        ) {
             if (activeEffectsRef.current.invincible > 0) {
             } else {
                 rugsRef.current.splice(i, 1);
                 damagePlayer();
                 continue;
             }
        }
        if (rug.x + rug.width < 0) rugsRef.current.splice(i, 1);
    }
    
    if (marketPhaseRef.current === 'BEAR' && Math.random() < 0.02) {
        meteorsRef.current.push({
            x: Math.random() * CANVAS_WIDTH,
            y: -50,
            width: METEOR_WIDTH,
            height: METEOR_HEIGHT,
            color: '#800000',
            speed: 0,
            vy: Math.random() * 5 + 5
        });
    }
    for (let i = meteorsRef.current.length - 1; i >= 0; i--) {
        const m = meteorsRef.current[i];
        m.y += m.vy;
        if (
            player.x < m.x + m.width &&
            player.x + player.width > m.x &&
            player.y < m.y + m.height &&
            player.y + player.height > m.y
        ) {
             if (activeEffectsRef.current.invincible > 0) {
                 spawnParticles(m.x, m.y, '#FFA500', 5);
                 meteorsRef.current.splice(i, 1);
             } else {
                 meteorsRef.current.splice(i, 1);
                 damagePlayer();
             }
             continue;
        }
        if (m.y > CANVAS_HEIGHT) meteorsRef.current.splice(i, 1);
    }

    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02; 
      p.size *= 0.95; 
      if (p.life <= 0) particlesRef.current.splice(i, 1);
    }
    
    // Update Floating Texts
    for (let i = floatingTextsRef.current.length - 1; i >= 0; i--) {
      const ft = floatingTextsRef.current[i];
      ft.y += ft.vy;
      ft.life -= 0.02;
      if (ft.life <= 0) {
          floatingTextsRef.current.splice(i, 1);
      }
    }
    
    if (activeEffectsRef.current.laser > 0) {
        const laserY = player.y + player.height / 2;
        const laserHeight = 20;
        
        for (let j = enemiesRef.current.length - 1; j >= 0; j--) {
            const enemy = enemiesRef.current[j];
            if (
               laserY + laserHeight/2 > enemy.y &&
               laserY - laserHeight/2 < enemy.y + enemy.height &&
               enemy.x > player.x
            ) {
                enemy.hp -= 2; 
                spawnParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#00FFFF', 5);
                if (enemy.hp <= 0) {
                    playSmashSound();
                    spawnParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#00FFFF', 25);
                    enemiesRef.current.splice(j, 1);
                    const reward = enemy.type === 'WHALE' ? WHALE_REWARD : ENEMY_REWARD;
                    addScore(reward);
                    spawnFloatingText(enemy.x, enemy.y, "+$" + reward);
                }
            }
        }
        
        if (bossRef.current && bossRef.current.state === 'ACTIVE') {
            const boss = bossRef.current;
             if (
               laserY + laserHeight/2 > boss.y &&
               laserY - laserHeight/2 < boss.y + boss.height &&
               boss.x > player.x
            ) {
                 playSmashSound();
                 spawnParticles(boss.x + boss.width/2, boss.y + boss.height/2, '#FF0000', 5);
                 
                 // Boss HP damage
                 boss.hp -= 2; // Laser damage per frame
                 if (boss.hp <= 0) {
                     bossRef.current = null;
                     addScore(BOSS_REWARD);
                     spawnFloatingText(boss.x, boss.y, "+$" + BOSS_REWARD, '#FFD700');
                     playExplosionSound();
                 }
            }
        }
    }

    for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
      const proj = projectilesRef.current[i];
      proj.x += proj.speed;
      if (proj.vy) proj.y += proj.vy; 

      let hit = false;
      for (let j = enemiesRef.current.length - 1; j >= 0; j--) {
        const enemy = enemiesRef.current[j];
        if (
          proj.x < enemy.x + enemy.width &&
          proj.x + proj.width > enemy.x &&
          proj.y < enemy.y + enemy.height &&
          proj.y + proj.height > enemy.y
        ) {
          playSmashSound();
          spawnParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#85bb65', 5);
          
          enemy.hp -= proj.damage;
          if (enemy.hp <= 0) {
              spawnParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#85bb65', 15);
              shakeRef.current = 5;
              enemiesRef.current.splice(j, 1);
              
              const reward = enemy.type === 'WHALE' ? WHALE_REWARD : ENEMY_REWARD;
              addScore(reward);
              spawnFloatingText(enemy.x, enemy.y, "+$" + reward);
              
              if (equippedMask === 'clown' && Math.random() < 0.05) { 
                  const types: PowerUpType[] = ['MOON', 'MAGNET', 'TRIPLE_SHOT', 'SHOTGUN', 'RAPID', 'SIDE', 'LASER'];
                  powerUpsRef.current.push({
                      x: enemy.x,
                      y: enemy.y,
                      width: POWERUP_SIZE,
                      height: POWERUP_SIZE,
                      color: '#FFF',
                      type: types[Math.floor(Math.random() * types.length)],
                      speed: gameSpeedRef.current
                  });
              }
          }
          
          hit = true;
          break;
        }
      }
      
      if (!hit && bossRef.current && bossRef.current.state === 'ACTIVE') {
          const boss = bossRef.current;
          if (
              proj.x < boss.x + boss.width &&
              proj.x + proj.width > boss.x &&
              proj.y < boss.y + boss.height &&
              proj.y + proj.height > boss.y
          ) {
              playSmashSound();
              spawnParticles(boss.x + boss.width/2, boss.y + boss.height/2, '#FF0000', 30);
              shakeRef.current = 10;
              hit = true;
              
              // Damage Boss HP
              boss.hp -= proj.damage;
              
              if (boss.hp <= 0) {
                  addScore(BOSS_REWARD);
                  spawnFloatingText(boss.x, boss.y, "+$" + BOSS_REWARD, '#FFD700');
                  bossRef.current = null;
                  playExplosionSound();
              }
          }
      }

      if (hit) {
        projectilesRef.current.splice(i, 1);
      } else if (proj.x > CANVAS_WIDTH || proj.y < 0 || proj.y > CANVAS_HEIGHT) {
        projectilesRef.current.splice(i, 1);
      }
    }
    
    for (let i = enemyProjectilesRef.current.length - 1; i >= 0; i--) {
        const proj = enemyProjectilesRef.current[i];
        if (proj.vx !== undefined && proj.vy !== undefined) {
            proj.x += proj.vx;
            proj.y += proj.vy;
        } else {
             proj.x -= proj.speed;
        }
        
        if (
            player.x < proj.x + proj.width &&
            player.x + player.width > proj.x &&
            player.y < proj.y + proj.height &&
            player.y + player.height > proj.y
        ) {
             enemyProjectilesRef.current.splice(i, 1);
             damagePlayer();
        } else if (proj.x + proj.width < 0 || proj.y < 0 || proj.y > CANVAS_HEIGHT) {
            enemyProjectilesRef.current.splice(i, 1);
        }
    }

    if (!bossRef.current) {
        if (Math.random() < BOSS_SPAWN_CHANCE) { 
            bossRef.current = {
                x: CANVAS_WIDTH, 
                y: Math.random() * (CANVAS_HEIGHT - BOSS_HEIGHT),
                width: BOSS_WIDTH,
                height: BOSS_HEIGHT,
                color: '#000',
                dy: (Math.random() > 0.5 ? 1 : -1) * 2,
                lifeTimer: BOSS_DURATION,
                shootTimer: BOSS_SHOOT_RATE,
                state: 'ENTERING',
                hp: BOSS_HP, // Initial HP
                maxHp: BOSS_HP
            };
        }
    } else {
        const boss = bossRef.current;
        if (boss.state === 'ENTERING') {
            boss.x -= 5;
            if (boss.x <= CANVAS_WIDTH - 200) {
                boss.state = 'ACTIVE';
            }
        } else if (boss.state === 'ACTIVE') {
            boss.y += boss.dy;
            if (boss.y <= 0 || boss.y + boss.height >= CANVAS_HEIGHT) {
                boss.dy *= -1;
            }
            boss.lifeTimer--;
            boss.shootTimer--;
            
            if (boss.shootTimer <= 0) {
                const dx = (player.x + player.width/2) - (boss.x + boss.width/2);
                const dy = (player.y + player.height/2) - (boss.y + boss.height/2);
                const angle = Math.atan2(dy, dx);
                const deviation = (Math.random() - 0.5) * BOSS_AIM_SPREAD;
                const finalAngle = angle + deviation;
                const vx = Math.cos(finalAngle) * BOSS_PROJECTILE_SPEED;
                const vy = Math.sin(finalAngle) * BOSS_PROJECTILE_SPEED;
                
                enemyProjectilesRef.current.push({
                    x: boss.x,
                    y: boss.y + boss.height/2,
                    width: 20,
                    height: 20,
                    color: '#FF0000',
                    speed: 0, 
                    vx: vx,
                    vy: vy,
                    damage: 1
                });
                
                playShootSound(); 
                boss.shootTimer = BOSS_SHOOT_RATE;
            }
            if (boss.lifeTimer <= 0) {
                boss.state = 'LEAVING';
            }
        } else if (boss.state === 'LEAVING') {
            boss.x += 5;
            if (boss.x > CANVAS_WIDTH) {
                bossRef.current = null;
            }
        }
    }

    if (frameCountRef.current % POWERUP_SPAWN_RATE === 0) { 
      const rand = Math.random();
      let type: PowerUpType = 'MOON';
      if (rand < 0.15) type = 'MAGNET';
      else if (rand < 0.30) type = 'TRIPLE_SHOT';
      else if (rand < 0.45) type = 'LASER';
      else if (rand < 0.60) type = 'SHOTGUN';
      else if (rand < 0.75) type = 'RAPID';
      else if (rand < 0.85) type = 'SIDE';
      else if (rand < 0.95) type = 'BOMB';
      
      powerUpsRef.current.push({
        x: CANVAS_WIDTH,
        y: Math.random() * (CANVAS_HEIGHT - 60),
        width: POWERUP_SIZE,
        height: POWERUP_SIZE,
        color: '#FFF',
        type: type,
        speed: gameSpeedRef.current
      });
    }

    for (let i = powerUpsRef.current.length - 1; i >= 0; i--) {
      const pUp = powerUpsRef.current[i];
      pUp.x -= pUp.speed;

      if (
        player.x < pUp.x + pUp.width &&
        player.x + player.width > pUp.x &&
        player.y < pUp.y + pUp.height &&
        player.y + player.height > pUp.y
      ) {
        playPowerUpSound();
        spawnParticles(pUp.x + pUp.width/2, pUp.y + pUp.height/2, '#FFFFFF', 15);
        
        if (pUp.type === 'MOON') {
          const multiplier = 1 + (upgrades.moonDuration * 0.05);
          activeEffectsRef.current.invincible = POWERUP_DURATION * multiplier;
          shakeRef.current = 5;
        } else if (pUp.type === 'MAGNET') {
          activeEffectsRef.current.magnet = POWERUP_DURATION;
          shakeRef.current = 5;
        } else if (pUp.type === 'TRIPLE_SHOT') {
           const multiplier = 1 + (upgrades.tripleShotDuration * 0.05);
           activeEffectsRef.current.tripleShot = TRIPLE_SHOT_DURATION * multiplier;
           shakeRef.current = 5;
        } else if (pUp.type === 'SHOTGUN') {
            activeEffectsRef.current.shotgun = SHOTGUN_DURATION;
            shakeRef.current = 5;
        } else if (pUp.type === 'RAPID') {
            activeEffectsRef.current.rapid = RAPID_DURATION;
            shakeRef.current = 5;
        } else if (pUp.type === 'SIDE') {
            activeEffectsRef.current.side = SIDE_DURATION;
            shakeRef.current = 5;
        } else if (pUp.type === 'BOMB') {
            activeEffectsRef.current.bomb = BOMB_DURATION;
            shakeRef.current = 30;
            playExplosionSound();
        } else if (pUp.type === 'LASER') {
            const multiplier = 1 + (upgrades.laserDuration * 0.05);
            activeEffectsRef.current.laser = LASER_DURATION * multiplier;
            shakeRef.current = 5;
        }
        powerUpsRef.current.splice(i, 1);
        continue;
      }

      if (pUp.x + pUp.width < 0) {
        powerUpsRef.current.splice(i, 1);
      }
    }

  }, [gameState, playCollectSound, playExplosionSound, playPowerUpSound, playSmashSound, playHealSound, spawnParticles, spawnFloatingText, attemptShoot, upgrades, playLaserSound, playShieldBreakSound, playEatSound, playKick, playHiHat, playClap, playBass, playSynth, damagePlayer, handleGameOver, equippedMask, addScore, playLowAmmoSound]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.save();
    if (shakeRef.current > 0) {
      const magnitude = shakeRef.current;
      const dx = (Math.random() - 0.5) * magnitude;
      const dy = (Math.random() - 0.5) * magnitude;
      ctx.translate(dx, dy);
    }

    if (bossRef.current) {
        ctx.fillStyle = BOSS_BACKGROUND_COLOR;
    } else {
        ctx.fillStyle = marketPhaseRef.current === 'BULL' ? BULL_MARKET_COLOR : BEAR_MARKET_COLOR;
    }
    ctx.fillRect(-20, -20, CANVAS_WIDTH + 40, CANVAS_HEIGHT + 40);

    // Draw Nebulae (Background)
    nebulaeRef.current.forEach(neb => {
        const gradient = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.size);
        gradient.addColorStop(0, neb.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(neb.x, neb.y, neb.size, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = '#FFFFFF';
    starsRef.current.forEach(star => {
      ctx.globalAlpha = Math.random() * 0.5 + 0.5;
      const sizeMod = activeEffectsRef.current.invincible > 0 ? 30 : 0; 
      ctx.fillRect(star.x, star.y, star.size + sizeMod, star.size);
    });
    ctx.globalAlpha = 1.0;
    
    // Draw trail (Classic Candlestick Style)
    trailRef.current.forEach(candle => {
      const isBullish = candle.close < candle.open;
      const isInvincible = activeEffectsRef.current.invincible > 0;
      let color = isBullish ? '#26a69a' : '#ef5350'; 
      if (isInvincible) color = SOL_GOLD;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.moveTo(candle.x + candle.width / 2, candle.high);
      ctx.lineTo(candle.x + candle.width / 2, candle.low);
      ctx.stroke();
      const bodyTop = Math.min(candle.open, candle.close);
      const bodyHeight = Math.max(Math.abs(candle.close - candle.open), 1);
      ctx.fillRect(candle.x, bodyTop, candle.width, bodyHeight);
    });

    // Draw Rug Pulls with Vertical Text
    rugsRef.current.forEach(rug => {
        ctx.save();
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 20px "Press Start 2P", cursive';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#8B0000';
        ctx.shadowBlur = 4;
        
        const text = "RUG PULL";
        const charSpacing = 30; // Spacing for vertical text
        
        // Center the text column within the width
        const cx = rug.x + rug.width / 2;
        
        // Draw text vertically
        let currentY = rug.y + 20; 
        while (currentY < rug.y + rug.height) {
            for (let i = 0; i < text.length; i++) {
                if (currentY > rug.y + rug.height) break;
                ctx.fillText(text[i], cx, currentY);
                currentY += charSpacing;
            }
            currentY += 20; // Gap between repetitions
        }
        ctx.restore();
    });
    
    meteorsRef.current.forEach(m => {
        ctx.fillStyle = '#800000'; 
        ctx.fillRect(m.x, m.y, m.width, m.height);
        ctx.strokeStyle = '#FF0000';
        ctx.beginPath();
        ctx.moveTo(m.x + m.width/2, m.y - 20);
        ctx.lineTo(m.x + m.width/2, m.y + m.height + 20);
        ctx.stroke();
    });

    particlesRef.current.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    projectilesRef.current.forEach(proj => {
      ctx.fillStyle = proj.color;
      ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
      if (proj.damage > 1) { 
          ctx.fillStyle = '#1e381b';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('$', proj.x + proj.width/2, proj.y + proj.height/2 + 1);
      }
    });
    
    enemyProjectilesRef.current.forEach(proj => {
      ctx.fillStyle = proj.color;
      ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
      ctx.shadowColor = '#FF0000';
      ctx.shadowBlur = 10;
      ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
      ctx.shadowBlur = 0;
    });
    
    if (activeEffectsRef.current.laser > 0) {
        const p = playerRef.current;
        const beamY = p.y + p.height / 2;
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 20;
        ctx.fillRect(p.x + p.width - 10, beamY - 5, CANVAS_WIDTH, 10);
        ctx.fillStyle = 'rgba(0, 255, 255, 0.4)';
        ctx.fillRect(p.x + p.width - 10, beamY - 15, CANVAS_WIDTH, 30);
        ctx.restore();
    }

    const p = playerRef.current;
    
    // PLAYER SCALE TRANSFORM
    ctx.save();
    // Move to center of player
    const pCenterX = p.x + p.width / 2;
    const pCenterY = p.y + p.height / 2;
    ctx.translate(pCenterX, pCenterY);
    ctx.scale(p.scale, p.scale);
    ctx.translate(-pCenterX, -pCenterY);

    if (!(activeEffectsRef.current.hitInvincibility > 0 && Math.floor(frameCountRef.current / 4) % 2 === 0)) {
        if (cosmetics.lambo) {
            ctx.fillStyle = '#FFD700'; 
            ctx.beginPath();
            ctx.moveTo(p.x - 20, p.y + p.height);
            ctx.lineTo(p.x + p.width + 20, p.y + p.height); 
            ctx.lineTo(p.x + p.width + 20, p.y + p.height - 15); 
            ctx.lineTo(p.x + p.width, p.y + p.height - 20); 
            ctx.lineTo(p.x + p.width - 10, p.y + p.height - 25); 
            ctx.lineTo(p.x - 10, p.y + p.height - 25); 
            ctx.lineTo(p.x - 20, p.y + p.height - 15); 
            ctx.fill();
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(p.x - 5, p.y + p.height, 8, 0, Math.PI * 2);
            ctx.arc(p.x + p.width + 5, p.y + p.height, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#AAA';
            ctx.beginPath();
            ctx.arc(p.x - 5, p.y + p.height, 4, 0, Math.PI * 2);
            ctx.arc(p.x + p.width + 5, p.y + p.height, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        if (activeEffectsRef.current.shield) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 3;
            ctx.arc(p.x + p.width/2, p.y + p.height/2, 50, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = `rgba(0, 255, 255, ${0.1 + Math.sin(frameCountRef.current * 0.2) * 0.1})`;
            ctx.fill();
            ctx.restore();
        }

        if (activeEffectsRef.current.magnet > 0) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 2;
          const effectiveRadius = MAGNET_RADIUS * (1 + upgrades.magnetRange * 0.05);
          ctx.arc(p.x + p.width/2, p.y + p.height/2, effectiveRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 215, 0, ${0.1 + Math.sin(frameCountRef.current * 0.1) * 0.05})`;
          ctx.arc(p.x + p.width/2, p.y + p.height/2, effectiveRadius * 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.fillStyle = MCDONALDS_RED;
        ctx.fillRect(p.x, p.y + p.height * 0.4, p.width, p.height * 0.6);
        
        if (cosmetics.rolex) {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(p.x + p.width - 10, p.y + p.height * 0.7, 6, 6);
            ctx.fillStyle = '#FFF';
            ctx.fillRect(p.x + p.width - 8, p.y + p.height * 0.7 + 2, 2, 2);
        }
        
        ctx.fillStyle = equippedMask === 'pepe' ? '#4C9F70' : WOJAK_SKIN_COLOR;
        ctx.fillRect(p.x + 5, p.y, p.width - 10, p.height * 0.4);

        if (equippedMask !== 'hamter') { 
            ctx.fillStyle = MCDONALDS_RED;
            ctx.fillRect(p.x + 5, p.y - 5, p.width - 10, 8);
            ctx.fillRect(p.x + p.width - 5, p.y - 2, 5, 3);
            ctx.fillStyle = MCDONALDS_YELLOW;
            ctx.font = '8px Arial';
            ctx.fillText('M', p.x + 18, p.y + 1);
        }

        ctx.fillStyle = '#000';
        if (activeEffectsRef.current.invincible > 0 || activeEffectsRef.current.laser > 0) {
           ctx.fillStyle = '#00FFFF'; 
           if (activeEffectsRef.current.invincible > 0) ctx.fillStyle = '#FF0000';
           ctx.fillRect(p.x + 12, p.y + 10, 4, 2);
           ctx.fillRect(p.x + 24, p.y + 10, 4, 2);
           ctx.beginPath();
           ctx.strokeStyle = '#000';
           ctx.lineWidth = 2;
           ctx.arc(p.x + 20, p.y + 18, 5, 0, Math.PI);
           ctx.stroke();
        } else {
          ctx.fillStyle = '#000';
          if (equippedMask === 'pepe') {
              ctx.fillStyle = '#FFF';
              ctx.fillRect(p.x + 10, p.y + 6, 8, 8);
              ctx.fillRect(p.x + 24, p.y + 6, 8, 8);
              ctx.fillStyle = '#000';
              ctx.fillRect(p.x + 13, p.y + 9, 2, 2);
              ctx.fillRect(p.x + 27, p.y + 9, 2, 2);
          } else {
              ctx.fillRect(p.x + 12, p.y + 10, 2, 2); 
              ctx.fillRect(p.x + 24, p.y + 10, 2, 2); 
          }
          
          ctx.beginPath();
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          
          if (equippedMask === 'pepe') {
              ctx.moveTo(p.x + 12, p.y + 22);
              ctx.quadraticCurveTo(p.x + 20, p.y + 18, p.x + 28, p.y + 22);
          } else {
              ctx.moveTo(p.x + 15, p.y + 20);
              ctx.quadraticCurveTo(p.x + 20, p.y + 15, p.x + 25, p.y + 20);
          }
          ctx.stroke();
        }

        if (equippedMask === 'clown') {
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(p.x + 20, p.y + 15, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(p.x + 8, p.y + 8, 24, 15);
        }
        
        if (equippedMask === 'hamter') {
            ctx.fillStyle = '#A0522D'; 
            ctx.beginPath();
            ctx.arc(p.x + 8, p.y, 5, 0, Math.PI * 2);
            ctx.arc(p.x + 32, p.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFC0CB'; 
            ctx.beginPath();
            ctx.ellipse(p.x + 20, p.y + 15, 4, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x + 16, p.y + 15);
            ctx.lineTo(p.x + 10, p.y + 14);
            ctx.moveTo(p.x + 16, p.y + 16);
            ctx.lineTo(p.x + 10, p.y + 17);
            ctx.moveTo(p.x + 24, p.y + 15);
            ctx.lineTo(p.x + 30, p.y + 14);
            ctx.moveTo(p.x + 24, p.y + 16);
            ctx.lineTo(p.x + 30, p.y + 17);
            ctx.stroke();
        }

        ctx.fillStyle = '#FFF';
        ctx.fillRect(p.x + 5, p.y + p.height * 0.6, 10, 4);
    }
    
    // Restore context to undo scale
    ctx.restore();

    if (bossRef.current) {
        const boss = bossRef.current;
        const img = bossImgRef.current;
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, boss.x, boss.y, boss.width, boss.height);
        } else {
            ctx.fillStyle = '#8B0000';
            ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
            ctx.strokeStyle = '#F00';
            ctx.lineWidth = 3;
            ctx.strokeRect(boss.x, boss.y, boss.width, boss.height);
            ctx.fillStyle = '#FFF';
            ctx.fillText("BOG", boss.x + boss.width/2, boss.y + boss.height/2);
        }
        
        // Health Bar Update: Now based on HP instead of time
        const pct = Math.max(0, boss.hp / boss.maxHp);
        ctx.fillStyle = '#555';
        ctx.fillRect(boss.x, boss.y - 10, boss.width, 5);
        ctx.fillStyle = '#F00'; // Red health bar
        ctx.fillRect(boss.x, boss.y - 10, boss.width * pct, 5);
        
        // Optional: Show HP text
        // ctx.fillStyle = '#FFF';
        // ctx.font = '10px Arial';
        // ctx.textAlign = 'center';
        // ctx.fillText(`${Math.ceil(boss.hp)}/${boss.maxHp}`, boss.x + boss.width/2, boss.y - 15);
    }

    enemiesRef.current.forEach(enemy => {
      if (enemy.type === 'WHALE') {
          ctx.save();
          ctx.font = '60px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = '#0000FF';
          ctx.shadowBlur = 10;
          ctx.fillText('🐋', enemy.x + enemy.width/2, enemy.y + enemy.height/2);
          const pct = enemy.hp / enemy.maxHp;
          ctx.fillStyle = '#333';
          ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 6);
          ctx.fillStyle = '#F00';
          ctx.fillRect(enemy.x, enemy.y - 10, enemy.width * pct, 6);
          ctx.restore();
          return;
      }
      const enemyImg = enemyImagesRef.current[enemy.label];
      if (enemyImg && enemyImg.complete && enemyImg.naturalWidth > 0) {
        ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
      } else {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px "Press Start 2P", cursive';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(enemy.label, enemy.x + enemy.width/2, enemy.y + enemy.height/2);
      }
    });

    ctx.save();
    ctx.shadowColor = POWERUP_GLOW_COLOR; 
    ctx.shadowBlur = 20;
    powerUpsRef.current.forEach(pUp => {
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (pUp.type === 'MOON') {
         ctx.fillText('🚀', pUp.x + pUp.width/2, pUp.y + pUp.height/2);
      } else if (pUp.type === 'MAGNET') {
         ctx.fillText('🧲', pUp.x + pUp.width/2, pUp.y + pUp.height/2);
      } else if (pUp.type === 'TRIPLE_SHOT') {
         ctx.fillText('🔫', pUp.x + pUp.width/2, pUp.y + pUp.height/2);
      } else if (pUp.type === 'BOMB') {
         ctx.fillText('💣', pUp.x + pUp.width/2, pUp.y + pUp.height/2);
      } else if (pUp.type === 'LASER') {
         ctx.fillText('⚡', pUp.x + pUp.width/2, pUp.y + pUp.height/2);
      } else if (pUp.type === 'SHOTGUN') {
         ctx.fillText('💥', pUp.x + pUp.width/2, pUp.y + pUp.height/2);
      } else if (pUp.type === 'RAPID') {
         ctx.fillText('💨', pUp.x + pUp.width/2, pUp.y + pUp.height/2);
      } else if (pUp.type === 'SIDE') {
         ctx.fillText('👯', pUp.x + pUp.width/2, pUp.y + pUp.height/2);
      }
    });
    ctx.restore();

    ctx.save();
    ctx.shadowColor = '#FFFF00'; 
    ctx.shadowBlur = 15;
    collectiblesRef.current.forEach(item => {
      if (item.type === 'BTC') {
           ctx.beginPath();
           ctx.fillStyle = '#F7931A'; 
           ctx.arc(item.x + item.width/2, item.y + item.height/2, item.width/2, 0, Math.PI * 2);
           ctx.fill();
           ctx.strokeStyle = '#FFFFFF';
           ctx.lineWidth = 2;
           ctx.stroke();
           ctx.fillStyle = '#FFFFFF';
           ctx.font = 'bold 20px Arial';
           ctx.textAlign = 'center';
           ctx.textBaseline = 'middle';
           ctx.fillText('₿', item.x + item.width/2, item.y + item.height/2);
           ctx.font = '10px Arial';
           ctx.fillText('❤️', item.x + item.width/2 + 10, item.y);
      } else {
          let img = null;
          if (item.type === 'SOL') img = solImgRef.current;
          else if (item.type === 'MEME') img = memeImgRef.current;
          else if (item.type === 'WIF') img = wifImgRef.current;
          else if (item.type === 'PEPE') img = pepeImgRef.current;
          else if (item.type === 'POPCAT') img = popcatImgRef.current;

          if (img && img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, item.x, item.y, item.width, item.height);
          } else {
            ctx.fillStyle = item.color;
            ctx.beginPath();
            ctx.arc(item.x + item.width/2, item.y + item.height/2, item.width/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#FFF';
            ctx.font = '8px "Press Start 2P", cursive';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.type, item.x + item.width/2, item.y + item.height/2);
          }
      }
    });
    ctx.restore();

    // Floating Texts Draw
    floatingTextsRef.current.forEach(ft => {
        ctx.globalAlpha = Math.max(0, ft.life);
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 20px "Press Start 2P", cursive';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 2;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.shadowBlur = 0;
    });
    ctx.globalAlpha = 1.0;

    ctx.restore();
    
    // UI Overlays
    let uiY = 50;
    const uiHeight = 10;
    const uiWidth = 200;
    const uiX = CANVAS_WIDTH / 2 - uiWidth / 2;
    
    if (comboRef.current > 1) {
        ctx.save();
        ctx.translate(CANVAS_WIDTH - 150, 50);
        ctx.rotate((Math.random() - 0.5) * 0.1);
        ctx.font = '30px "Press Start 2P", cursive';
        ctx.fillStyle = '#FFFF00';
        ctx.fillText(`x${comboRef.current}`, 0, 0);
        ctx.font = '10px "Press Start 2P", cursive';
        ctx.fillStyle = '#FFF';
        ctx.fillText("COMBO", 0, 15);
        ctx.restore();
    }
    
    ctx.save();
    ctx.font = '20px "Press Start 2P", cursive';
    ctx.fillStyle = marketPhaseRef.current === 'BULL' ? '#00FF00' : '#FF0000';
    ctx.fillText(marketPhaseRef.current === 'BULL' ? "BULL MARKET" : "BEAR MARKET", CANVAS_WIDTH/2, 30);
    ctx.restore();

    const heartsX = 20;
    const heartsY = 50;
    for (let i = 0; i < MAX_LIVES; i++) {
        const filled = i < lives;
        ctx.fillStyle = filled ? '#FF0000' : '#550000';
        ctx.font = '24px Arial';
        ctx.fillText('❤️', heartsX + i * 30, heartsY);
        if (!filled) {
             ctx.strokeStyle = '#FFFFFF';
             ctx.lineWidth = 2;
             ctx.beginPath();
             ctx.moveTo(heartsX + i * 30 - 10, heartsY - 10);
             ctx.lineTo(heartsX + i * 30 + 10, heartsY + 5);
             ctx.moveTo(heartsX + i * 30 + 10, heartsY - 10);
             ctx.lineTo(heartsX + i * 30 - 10, heartsY + 5);
             ctx.stroke();
        }
    }
    
    if (activeEffectsRef.current.shield) {
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(uiX - 30, 20, 260, 20);
        ctx.fillStyle = '#00FFFF';
        ctx.font = '12px "Press Start 2P", cursive';
        ctx.fillText("SHIELD ACTIVE", CANVAS_WIDTH / 2, 35);
        ctx.restore();
    }
    
    if (activeEffectsRef.current.invincible > 0) {
        const totalDuration = POWERUP_DURATION * (1 + upgrades.moonDuration * 0.05);
        const pct = activeEffectsRef.current.invincible / totalDuration;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(uiX, uiY, uiWidth, uiHeight);
        ctx.fillStyle = '#FFD700'; 
        ctx.fillRect(uiX, uiY, uiWidth * pct, uiHeight);
        ctx.font = '10px "Press Start 2P", cursive';
        ctx.fillStyle = '#FFF';
        ctx.fillText("MOON MODE", CANVAS_WIDTH / 2, uiY - 10);
        uiY += 30;
    }
    
    if (activeEffectsRef.current.magnet > 0) {
        const pct = activeEffectsRef.current.magnet / POWERUP_DURATION;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(uiX, uiY, uiWidth, uiHeight);
        ctx.fillStyle = '#00FFFF'; 
        ctx.fillRect(uiX, uiY, uiWidth * pct, uiHeight);
        ctx.font = '10px "Press Start 2P", cursive';
        ctx.fillStyle = '#FFF';
        ctx.fillText("MAGNET", CANVAS_WIDTH / 2, uiY - 10);
        uiY += 30;
    }
    
    if (activeEffectsRef.current.tripleShot > 0) {
        const totalDuration = TRIPLE_SHOT_DURATION * (1 + upgrades.tripleShotDuration * 0.05);
        const pct = activeEffectsRef.current.tripleShot / totalDuration;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(uiX, uiY, uiWidth, uiHeight);
        ctx.fillStyle = '#85bb65'; 
        ctx.fillRect(uiX, uiY, uiWidth * pct, uiHeight);
        ctx.font = '10px "Press Start 2P", cursive';
        ctx.fillStyle = '#FFF';
        ctx.fillText("TRIPLE SHOT", CANVAS_WIDTH / 2, uiY - 10);
        uiY += 30;
    }
    
    if (activeEffectsRef.current.shotgun > 0) {
        const pct = activeEffectsRef.current.shotgun / SHOTGUN_DURATION;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(uiX, uiY, uiWidth, uiHeight);
        ctx.fillStyle = '#FF4500'; 
        ctx.fillRect(uiX, uiY, uiWidth * pct, uiHeight);
        ctx.font = '10px "Press Start 2P", cursive';
        ctx.fillStyle = '#FFF';
        ctx.fillText("SHOTGUN", CANVAS_WIDTH / 2, uiY - 10);
        uiY += 30;
    }

    if (activeEffectsRef.current.rapid > 0) {
        const pct = activeEffectsRef.current.rapid / RAPID_DURATION;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(uiX, uiY, uiWidth, uiHeight);
        ctx.fillStyle = '#FFFF00'; 
        ctx.fillRect(uiX, uiY, uiWidth * pct, uiHeight);
        ctx.font = '10px "Press Start 2P", cursive';
        ctx.fillStyle = '#FFF';
        ctx.fillText("RAPID FIRE", CANVAS_WIDTH / 2, uiY - 10);
        uiY += 30;
    }
    
    if (activeEffectsRef.current.side > 0) {
        const pct = activeEffectsRef.current.side / SIDE_DURATION;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(uiX, uiY, uiWidth, uiHeight);
        ctx.fillStyle = '#FF00FF'; 
        ctx.fillRect(uiX, uiY, uiWidth * pct, uiHeight);
        ctx.font = '10px "Press Start 2P", cursive';
        ctx.fillStyle = '#FFF';
        ctx.fillText("DRONES", CANVAS_WIDTH / 2, uiY - 10);
        uiY += 30;
    }
    
    if (activeEffectsRef.current.laser > 0) {
        const totalDuration = LASER_DURATION * (1 + upgrades.laserDuration * 0.05);
        const pct = activeEffectsRef.current.laser / totalDuration;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(uiX, uiY, uiWidth, uiHeight);
        ctx.fillStyle = '#00FFFF'; 
        ctx.fillRect(uiX, uiY, uiWidth * pct, uiHeight);
        ctx.font = '10px "Press Start 2P", cursive';
        ctx.fillStyle = '#FFF';
        ctx.fillText("LASER BEAM", CANVAS_WIDTH / 2, uiY - 10);
        uiY += 30;
    }

    if (activeEffectsRef.current.bomb > 0) {
        const pct = activeEffectsRef.current.bomb / BOMB_DURATION;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(uiX, uiY, uiWidth, uiHeight);
        ctx.fillStyle = '#FF0000'; 
        ctx.fillRect(uiX, uiY, uiWidth * pct, uiHeight);
        ctx.font = '10px "Press Start 2P", cursive';
        ctx.fillStyle = '#FFF';
        ctx.fillText("NUKE ACTIVE", CANVAS_WIDTH / 2, uiY - 10);
    }
    
    if (bossRef.current && bossRef.current.state === 'ENTERING') {
        ctx.save();
        ctx.fillStyle = 'red';
        ctx.font = '20px "Press Start 2P", cursive';
        ctx.textAlign = 'center';
        ctx.fillText("DUMP IT!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        ctx.restore();
    }

  }, [attemptShoot, upgrades, cosmetics, equippedMask, hasShield, lives, marketPhase]);

  // Animation Frame Loop
  useEffect(() => {
    const loop = () => {
      update();
      draw();
      requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update, draw]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const canvas = canvasRef.current;
    if(canvas) {
       const scaleX = canvas.width / rect.width;
       const scaleY = canvas.height / rect.height;
       mouseRef.current.x = (e.clientX - rect.left) * scaleX;
       mouseRef.current.y = (e.clientY - rect.top) * scaleY;
    }
  };

  const handleCanvasMouseLeave = () => {
    mouseRef.current.x = null;
    mouseRef.current.y = null;
  };

  const buyUpgrade = (type: keyof Upgrades, cost: number) => {
    if (wallet >= cost) {
      setWallet(prev => prev - cost);
      setUpgrades(prev => ({
        ...prev,
        [type]: prev[type] + 1
      }));
      playPowerUpSound();
      saveUserData(); // Explicit save on purchase
    }
  };
  
  const buyCosmetic = (type: keyof Cosmetics, cost: number, maskType: MaskType | null) => {
      if (wallet >= cost && !cosmetics[type]) {
          setWallet(prev => prev - cost);
          setCosmetics(prev => ({
              ...prev,
              [type]: true
          }));
          if (maskType) {
              setEquippedMask(maskType); // Auto equip on buy
          }
          playPowerUpSound();
          saveUserData(); // Explicit save on purchase
      }
  };
  
  const buyShield = () => {
      if (wallet >= COST_SHIELD && !hasShield) {
          setWallet(prev => prev - COST_SHIELD);
          setHasShield(true);
          playPowerUpSound();
          saveUserData(); // Explicit save on purchase
      }
  };
  
  const buyHeal = () => {
      if (wallet >= COST_HEAL && lives < MAX_LIVES) {
          setWallet(prev => prev - COST_HEAL);
          setLives((prev: number) => prev + 1);
          livesRef.current += 1; // Sync ref
          playHealSound(); 
          saveUserData(); // Explicit save on purchase
      }
  };
  
  const buyLuxury = (id: string, cost: number) => {
      if (wallet >= cost && !ownedLuxuries.includes(id)) {
          setWallet(prev => prev - cost);
          setOwnedLuxuries(prev => [...prev, id]);
          playPowerUpSound();
          saveUserData(); // Explicit save on purchase
      }
  };
  
  const executeTrade = (amount: number) => {
      if (wallet < amount) return;
      
      setWallet(prev => prev - amount); // Deduct wager
      
      const isWin = Math.random() < TRADING_WIN_CHANCE;
      
      if (isWin) {
          const payout = amount * TRADING_WIN_MULTIPLIER;
          setWallet(prev => prev + payout);
          setTradeResult({
              success: true,
              message: `Your 50x ${tradeDirection} on ${selectedAsset} printed!`,
              amount: payout - amount
          });
          playCollectSound();
      } else {
          // Select failure message based on trade direction
          const newsList = tradeDirection === 'SHORT' ? SHORT_REKT_NEWS : RIDICULOUS_NEWS;
          const randomNews = newsList[Math.floor(Math.random() * newsList.length)];
          setTradeResult({
              success: false,
              message: `LIQUIDATED: ${randomNews}`,
              amount: amount
          });
          playExplosionSound();
      }
      saveUserData(); // Save after trade result
  };
  
  const equipMask = (type: MaskType) => {
      setEquippedMask(type);
      playCollectSound();
  };

  // --- NORMIE LIFE DATA ENTRY LOGIC ---
  const startNormieLife = () => {
      setShiftProgress(0);
      setShiftMoney(0);
      setOfficeInput("");
      setOfficeTask(OFFICE_TASKS[Math.floor(Math.random() * OFFICE_TASKS.length)]);
      setShowNormieLife(true);
      setShiftEnded(false); 
      initAudio(); // Starts the elevator music
  };

  const handleNormieInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setOfficeInput(e.target.value.toUpperCase());
      playTypingSound();
  };

  const submitNormieTask = (e: React.FormEvent) => {
      e.preventDefault();
      if (officeInput === officeTask) {
          // Success
          const reward = 5; // Low wage lol
          setShiftMoney(prev => prev + reward);
          setWallet(prev => prev + reward);
          setOfficeTask(OFFICE_TASKS[Math.floor(Math.random() * OFFICE_TASKS.length)]);
          setOfficeInput("");
          setShiftFeedback("PROCESSED");
          setTimeout(() => setShiftFeedback(""), 500);
          playCollectSound();
      } else {
          // Failure
          setShiftFeedback("ERROR: SYNTAX");
          playErrorSound();
          setTimeout(() => setShiftFeedback(""), 500);
      }
  };

  useEffect(() => {
      if (!showNormieLife || shiftEnded) return;
      
      const timer = setInterval(() => {
          setShiftProgress(prev => {
              if (prev >= 100) {
                  setShiftEnded(true); // Trigger end state
                  return 100;
              }
              return prev + 0.15; // Slow timer
          });
      }, 50);

      return () => clearInterval(timer);
  }, [showNormieLife, shiftEnded]);

  // Effect to close after shift ends
  useEffect(() => {
      if (shiftEnded) {
          const timeout = setTimeout(() => {
              setShowNormieLife(false);
              setShiftEnded(false);
              saveUserData(); // Save earnings after shift
          }, 3000); // 3 seconds delay
          return () => clearTimeout(timeout);
      }
  }, [shiftEnded, saveUserData]);

  const NormieLifeOverlay = () => (
    <div className="absolute inset-0 bg-slate-800 z-30 flex flex-col items-center justify-center text-black font-sans">
        <div className="bg-[#c0c0c0] p-1 rounded shadow-xl max-w-lg w-full border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 relative">
             {/* Window Title Bar */}
             <div className="bg-[#000080] text-white px-2 py-1 font-bold flex justify-between items-center mb-1">
                 <span className="text-sm">Spreadsheet Simulator 2000 - Shift Progress: {Math.floor(shiftProgress)}%</span>
                 <button onClick={() => setShowNormieLife(false)} className="bg-[#c0c0c0] text-black px-1 border border-white text-xs font-bold shadow-sm active:bg-gray-400">X</button>
             </div>

             {shiftEnded && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-blue-800 border-4 border-white p-6 text-center shadow-2xl animate-bounce">
                        <h2 className="text-3xl font-bold text-white font-mono mb-2">SHIFT ENDED</h2>
                        <p className="text-white font-mono text-lg">EARNINGS: <span className="text-green-400">${shiftMoney.toFixed(2)}</span></p>
                        <p className="text-gray-400 text-xs mt-2">Logging off...</p>
                    </div>
                </div>
             )}

             <div className="p-4 flex flex-col gap-4">
                 <div className="bg-white border-2 border-gray-600 border-b-white border-r-white p-4 h-32 flex flex-col items-center justify-center relative overflow-hidden">
                     <div className="text-gray-500 text-xs absolute top-2 left-2">TASK ID: {Math.floor(Math.random() * 9999)}</div>
                     <div className="text-4xl font-mono tracking-widest font-bold select-none">{officeTask}</div>
                     {shiftFeedback && (
                         <div className={`absolute bottom-2 font-bold ${shiftFeedback === 'PROCESSED' ? 'text-green-600' : 'text-red-600'}`}>
                             {shiftFeedback}
                         </div>
                     )}
                 </div>

                 <form onSubmit={submitNormieTask} className="flex gap-2">
                     <input 
                        autoFocus
                        value={officeInput}
                        onChange={handleNormieInput}
                        disabled={shiftEnded}
                        className="flex-1 border-2 border-gray-600 p-2 font-mono text-xl uppercase shadow-inner bg-white focus:outline-none disabled:bg-gray-200 disabled:text-gray-500"
                        placeholder="ENTER DATA..."
                     />
                     <button type="submit" disabled={shiftEnded} className="bg-[#c0c0c0] px-4 py-2 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 active:border-t-gray-800 active:border-l-gray-800 active:border-b-white active:border-r-white font-bold disabled:opacity-50">
                         SUBMIT
                     </button>
                 </form>

                 <div className="bg-gray-200 border-inset border-2 border-gray-400 p-2 text-sm font-mono flex justify-between">
                     <span>WAGE EARNED: <span className="text-green-700">${shiftMoney.toFixed(2)}</span></span>
                     <span>STATUS: <span className="text-blue-700">EMPLOYED</span></span>
                 </div>
                 
                 <div className="text-xs text-gray-500 text-center">
                     Do not leave your desk until shift completion. <br/>
                     Management is watching.
                 </div>
             </div>
        </div>
    </div>
  );

  // Trading Overlay Component
  const TradingOverlay = () => (
      <div className="absolute inset-0 bg-black/95 z-30 flex flex-col items-center justify-center text-white p-4">
          <div className="w-full max-w-lg bg-slate-900 border-4 border-red-600 p-6 rounded-lg shadow-[0_0_50px_rgba(220,38,38,0.5)] overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6 border-b border-gray-600 pb-4">
                  <h2 className="text-2xl text-red-500 font-bold uppercase animate-pulse">Degenerate Trading</h2>
                  <div className="text-right">
                      <div className="text-xs text-gray-400">LIQUIDITY</div>
                      <div className="text-xl text-green-400 font-bold">${wallet.toLocaleString()}</div>
                  </div>
              </div>

              {tradeResult ? (
                  <div className="text-center py-8">
                      <h3 className={`text-3xl font-bold mb-4 ${tradeResult.success ? 'text-green-400' : 'text-red-500 shake-text'}`}>
                          {tradeResult.success ? "GAINS SECURED" : "REKT"}
                      </h3>
                      <p className="text-lg mb-2">{tradeResult.message}</p>
                      <p className="text-xl font-bold mb-8">
                          {tradeResult.success ? `+ $${tradeResult.amount.toLocaleString()}` : `- $${tradeResult.amount.toLocaleString()}`}
                      </p>
                      <button
                          onClick={() => setTradeResult(null)}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded uppercase w-full"
                      >
                          Trade Again
                      </button>
                  </div>
              ) : (
                  <>
                      {/* Asset Selection */}
                      <div className="mb-6">
                          <label className="block text-gray-400 text-xs font-bold mb-2">SELECT ASSET</label>
                          <div className="grid grid-cols-2 gap-2">
                              {TRADABLE_ASSETS.map((asset: string) => (
                                  <button
                                      key={asset}
                                      onClick={() => setSelectedAsset(asset)}
                                      className={`p-2 text-sm font-bold border rounded ${selectedAsset === asset ? 'bg-yellow-600 border-yellow-400 text-white' : 'bg-slate-800 border-slate-600 text-gray-400 hover:bg-slate-700'}`}
                                  >
                                      {asset}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Direction */}
                      <div className="mb-6">
                          <label className="block text-gray-400 text-xs font-bold mb-2">DIRECTION (50x LEVERAGE)</label>
                          <div className="flex gap-4">
                              <button
                                  onClick={() => setTradeDirection('LONG')}
                                  className={`flex-1 py-3 font-bold border rounded ${tradeDirection === 'LONG' ? 'bg-green-700 border-green-400 text-white' : 'bg-slate-800 border-slate-600 text-gray-400'}`}
                              >
                                  LONG 🚀
                              </button>
                              <button
                                  onClick={() => setTradeDirection('SHORT')}
                                  className={`flex-1 py-3 font-bold border rounded ${tradeDirection === 'SHORT' ? 'bg-red-700 border-red-400 text-white' : 'bg-slate-800 border-slate-600 text-gray-400'}`}
                              >
                                  SHORT 📉
                              </button>
                          </div>
                      </div>

                      {/* Amount Selection */}
                      <div className="mb-8">
                          <label className="block text-gray-400 text-xs font-bold mb-2">POSITION SIZE</label>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                              <button onClick={() => executeTrade(1000)} disabled={wallet < 1000} className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 p-2 rounded text-sm font-bold">$1,000</button>
                              <button onClick={() => executeTrade(10000)} disabled={wallet < 10000} className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 p-2 rounded text-sm font-bold">$10,000</button>
                              <button onClick={() => executeTrade(wallet * 0.5)} disabled={wallet <= 0} className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 p-2 rounded text-sm font-bold">50%</button>
                              <button onClick={() => executeTrade(wallet)} disabled={wallet <= 0} className="bg-red-900/50 hover:bg-red-800 disabled:opacity-50 border border-red-500 p-2 rounded text-sm font-bold text-red-200">ALL IN</button>
                          </div>
                      </div>

                      <button
                          onClick={() => setShowTrading(false)}
                          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded border-b-4 border-slate-900 active:border-0 active:translate-y-1 uppercase"
                      >
                          Back to Safety
                      </button>
                  </>
              )}
          </div>
      </div>
  );

  // Lifestyle Shop Component
  const LifestyleShopOverlay = () => (
    <div className="absolute inset-0 bg-black/95 z-30 flex flex-col items-center justify-center text-white p-4">
        <div className="w-full max-w-4xl bg-slate-900 border-4 border-yellow-500 p-6 rounded-lg shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 border-b border-gray-600 pb-4">
              <h2 className="text-2xl text-yellow-400 font-bold uppercase">Lifestyle & Properties</h2>
              <div className="text-right">
                 <div className="text-xs text-gray-400">WALLET</div>
                 <div className="text-xl text-green-400 font-bold">${wallet.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {LUXURY_ITEMS.map((item: {id: string, name: string, cost: number, emoji: string}) => {
                    const isOwned = ownedLuxuries.includes(item.id);
                    const canAfford = wallet >= item.cost;
                    
                    return (
                        <div key={item.id} className={`p-4 rounded border-2 flex flex-col items-center justify-between h-40 ${isOwned ? 'bg-yellow-900/30 border-yellow-500' : 'bg-slate-800 border-slate-600'}`}>
                            <div className="text-4xl mb-2">{item.emoji}</div>
                            <div className="text-center">
                                <div className="font-bold text-sm mb-1">{item.name}</div>
                                {isOwned ? (
                                    <span className="text-green-400 font-bold text-xs">OWNED</span>
                                ) : (
                                    <button 
                                        onClick={() => buyLuxury(item.id, item.cost)}
                                        disabled={!canAfford}
                                        className={`px-3 py-1 rounded text-xs font-bold ${canAfford ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        ${item.cost.toLocaleString()}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <button 
              onClick={() => setShowLifestyle(false)}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded border-b-4 border-red-800 active:border-0 active:translate-y-1 uppercase"
            >
              Back to Game
            </button>
        </div>
    </div>
  );

  // Shop Component
  const ShopOverlay = () => (
    <div className="absolute inset-0 bg-black/90 z-20 flex flex-col items-center justify-center text-white p-4">
      <div className="w-full max-w-lg bg-slate-800 border-4 border-blue-400 p-6 rounded-lg shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 border-b border-gray-600 pb-4">
          <h2 className="text-2xl text-blue-300 font-bold">UPGRADES</h2>
          <div className="text-right">
             <div className="text-xs text-gray-400">WALLET</div>
             <div className="text-xl text-green-400 font-bold">${wallet.toLocaleString()}</div>
          </div>
        </div>
        
        {/* Consumables */}
        <div className="mb-6">
            <h3 className="text-lg text-blue-300 font-bold mb-3 border-b border-blue-800 pb-1">CONSUMABLES</h3>
            <div className="grid grid-cols-1 gap-3">
                 <div className="flex items-center justify-between bg-slate-700 p-3 rounded">
                    <div className="flex-1">
                       <div className="flex items-center gap-2 font-bold text-blue-200">
                          <span>🛡️</span> Rekt Shield
                       </div>
                       <div className="text-xs text-gray-300">Prevents 1 hit (One-time use)</div>
                     </div>
                     <button 
                        onClick={buyShield}
                        disabled={wallet < COST_SHIELD || hasShield}
                        className={`px-4 py-2 rounded text-xs font-bold ${hasShield ? 'bg-blue-900 text-blue-300' : 'bg-blue-600 hover:bg-blue-500'}`}
                     >
                       {hasShield ? "ACTIVE" : `$${COST_SHIELD}`}
                     </button>
                 </div>
                 
                 <div className="flex items-center justify-between bg-slate-700 p-3 rounded">
                    <div className="flex-1">
                       <div className="flex items-center gap-2 font-bold text-green-200">
                          <span>❤️</span> First Aid (+1 Life)
                       </div>
                       <div className="text-xs text-gray-300">Current: {lives}/{MAX_LIVES}</div>
                     </div>
                     <button 
                        onClick={buyHeal}
                        disabled={wallet < COST_HEAL || lives >= MAX_LIVES}
                        className={`px-4 py-2 rounded text-xs font-bold ${lives >= MAX_LIVES ? 'bg-green-900 text-green-300' : 'bg-green-600 hover:bg-green-500'}`}
                     >
                       {lives >= MAX_LIVES ? "FULL" : `$${COST_HEAL}`}
                     </button>
                 </div>
            </div>
        </div>
        
        {/* Cosmetics Section */}
        <div className="mb-6">
            <h3 className="text-lg text-purple-300 font-bold mb-3 border-b border-purple-800 pb-1">MASKS (PASSIVE ABILITIES)</h3>
            <div className="grid grid-cols-2 gap-3">
                {/* Clown Mask */}
                <button 
                    onClick={() => cosmetics.clownMask ? equipMask('clown') : buyCosmetic('clownMask', COST_CLOWN, 'clown')}
                    disabled={!cosmetics.clownMask && wallet < COST_CLOWN}
                    className={`p-3 rounded border text-left transition-colors ${
                        equippedMask === 'clown' 
                        ? 'bg-purple-900 border-purple-400' 
                        : cosmetics.clownMask 
                            ? 'bg-slate-700 hover:bg-slate-600 border-slate-500' 
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-600'
                    }`}
                >
                    <div className="text-2xl mb-1">🤡</div>
                    <div className="font-bold text-sm">Clown Mask</div>
                     <div className="text-[10px] text-gray-300 mb-1">EFFECT: Random Powerups on Kill</div>
                    <div className="text-xs text-yellow-300">
                        {equippedMask === 'clown' ? 'EQUIPPED' : cosmetics.clownMask ? 'EQUIP' : `$${COST_CLOWN}`}
                    </div>
                </button>
                
                {/* Hamter Mask */}
                <button 
                    onClick={() => cosmetics.hamterMask ? equipMask('hamter') : buyCosmetic('hamterMask', COST_HAMTER, 'hamter')}
                    disabled={!cosmetics.hamterMask && wallet < COST_HAMTER}
                    className={`p-3 rounded border text-left transition-colors ${
                        equippedMask === 'hamter' 
                        ? 'bg-purple-900 border-purple-400' 
                        : cosmetics.hamterMask 
                            ? 'bg-slate-700 hover:bg-slate-600 border-slate-500' 
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-600'
                    }`}
                >
                    <div className="text-2xl mb-1">🐹</div>
                    <div className="font-bold text-sm">Hamter Mask</div>
                    <div className="text-[10px] text-gray-300 mb-1">EFFECT: Passive Coin Magnet</div>
                    <div className="text-xs text-yellow-300">
                         {equippedMask === 'hamter' ? 'EQUIPPED' : cosmetics.hamterMask ? 'EQUIP' : `$${COST_HAMTER}`}
                    </div>
                </button>
                
                {/* Pepe Mask */}
                <button 
                    onClick={() => cosmetics.pepeMask ? equipMask('pepe') : buyCosmetic('pepeMask', COST_PEPE, 'pepe')}
                    disabled={!cosmetics.pepeMask && wallet < COST_PEPE}
                    className={`p-3 rounded border text-left transition-colors ${
                        equippedMask === 'pepe' 
                        ? 'bg-purple-900 border-purple-400' 
                        : cosmetics.pepeMask 
                            ? 'bg-slate-700 hover:bg-slate-600 border-slate-500' 
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-600'
                    }`}
                >
                    <div className="text-2xl mb-1">🐸</div>
                    <div className="font-bold text-sm">Pepe Mask</div>
                    <div className="text-[10px] text-gray-300 mb-1">EFFECT: Big Shot (Hitbox x1.5)</div>
                    <div className="text-xs text-yellow-300">
                         {equippedMask === 'pepe' ? 'EQUIPPED' : cosmetics.pepeMask ? 'EQUIP' : `$${COST_PEPE}`}
                    </div>
                </button>
                
                {/* Unequip Masks */}
                <button 
                    onClick={() => equipMask('none')}
                    className={`p-3 rounded border text-left transition-colors ${
                        equippedMask === 'none' 
                        ? 'bg-gray-700 border-gray-400' 
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-600'
                    }`}
                >
                    <div className="text-2xl mb-1">🚫</div>
                    <div className="font-bold text-sm">No Mask</div>
                    <div className="text-xs text-gray-300">
                         {equippedMask === 'none' ? 'EQUIPPED' : 'EQUIP'}
                    </div>
                </button>
                
                {/* Rolex (Passive) */}
                <button 
                    onClick={() => buyCosmetic('rolex', COST_ROLEX, null)}
                    disabled={wallet < COST_ROLEX || cosmetics.rolex}
                    className={`p-3 rounded border text-left ${cosmetics.rolex ? 'bg-purple-900/50 border-purple-500' : 'bg-slate-700 hover:bg-slate-600 border-slate-500'}`}
                >
                    <div className="text-2xl mb-1">⌚</div>
                    <div className="font-bold text-sm">Rolex</div>
                    <div className="text-xs text-yellow-300">{cosmetics.rolex ? 'OWNED' : `$${COST_ROLEX}`}</div>
                </button>
                
                {/* Lambo (Passive) */}
                <button 
                    onClick={() => buyCosmetic('lambo', COST_LAMBO, null)}
                    disabled={wallet < COST_LAMBO || cosmetics.lambo}
                    className={`p-3 rounded border text-left ${cosmetics.lambo ? 'bg-purple-900/50 border-purple-500' : 'bg-slate-700 hover:bg-slate-600 border-slate-500'}`}
                >
                    <div className="text-2xl mb-1">🏎️</div>
                    <div className="font-bold text-sm">Lambo</div>
                    <div className="text-xs text-yellow-300">{cosmetics.lambo ? 'OWNED' : `$${COST_LAMBO}`}</div>
                </button>
            </div>
        </div>

        <div className="space-y-4 mb-8">
            <h3 className="text-lg text-green-300 font-bold border-b border-green-800 pb-1">UPGRADES</h3>
           {/* Moon Duration */}
           <div className="flex items-center justify-between bg-slate-700 p-3 rounded">
             <div className="flex-1">
               <div className="flex items-center gap-2 font-bold text-yellow-200">
                  <span>🚀</span> Moon Hands
               </div>
               <div className="text-xs text-gray-300">Increase Moon Mode duration (+5%)</div>
             </div>
             <div className="flex flex-col items-end gap-1">
               <div className="flex gap-1">
                 {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i < upgrades.moonDuration ? 'bg-yellow-400' : 'bg-gray-600'}`} />
                 ))}
               </div>
               {upgrades.moonDuration < 5 ? (
                 <button 
                    onClick={() => buyUpgrade('moonDuration', COST_BASE_MOON * (upgrades.moonDuration + 1))}
                    disabled={wallet < COST_BASE_MOON * (upgrades.moonDuration + 1)}
                    className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-3 py-1 rounded text-xs font-bold mt-1"
                 >
                   ${COST_BASE_MOON * (upgrades.moonDuration + 1)}
                 </button>
               ) : <span className="text-xs text-green-400 font-bold">MAXED</span>}
             </div>
           </div>

           {/* Magnet Range */}
           <div className="flex items-center justify-between bg-slate-700 p-3 rounded">
             <div className="flex-1">
               <div className="flex items-center gap-2 font-bold text-cyan-200">
                  <span>🧲</span> Liquidity Magnet
               </div>
               <div className="text-xs text-gray-300">Increase Magnet range (+5%)</div>
             </div>
             <div className="flex flex-col items-end gap-1">
               <div className="flex gap-1">
                 {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i < upgrades.magnetRange ? 'bg-cyan-400' : 'bg-gray-600'}`} />
                 ))}
               </div>
               {upgrades.magnetRange < 5 ? (
                 <button 
                    onClick={() => buyUpgrade('magnetRange', COST_BASE_MAGNET * (upgrades.magnetRange + 1))}
                    disabled={wallet < COST_BASE_MAGNET * (upgrades.magnetRange + 1)}
                    className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-3 py-1 rounded text-xs font-bold mt-1"
                 >
                   ${COST_BASE_MAGNET * (upgrades.magnetRange + 1)}
                 </button>
               ) : <span className="text-xs text-green-400 font-bold">MAXED</span>}
             </div>
           </div>

           {/* Cheap Gas */}
           <div className="flex items-center justify-between bg-slate-700 p-3 rounded">
             <div className="flex-1">
               <div className="flex items-center gap-2 font-bold text-green-200">
                  <span>⛽</span> Low Gas Fees
               </div>
               <div className="text-xs text-gray-300">Reduce shooting cost (-$1)</div>
             </div>
             <div className="flex flex-col items-end gap-1">
               <div className="flex gap-1">
                 {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i < upgrades.cheapGas ? 'bg-green-400' : 'bg-gray-600'}`} />
                 ))}
               </div>
               {upgrades.cheapGas < 4 ? (
                 <button 
                    onClick={() => buyUpgrade('cheapGas', COST_BASE_GAS * (upgrades.cheapGas + 1))}
                    disabled={wallet < COST_BASE_GAS * (upgrades.cheapGas + 1)}
                    className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-3 py-1 rounded text-xs font-bold mt-1"
                 >
                   ${COST_BASE_GAS * (upgrades.cheapGas + 1)}
                 </button>
               ) : <span className="text-xs text-green-400 font-bold">MAXED</span>}
             </div>
           </div>
           
           {/* Triple Shot Duration */}
           <div className="flex items-center justify-between bg-slate-700 p-3 rounded">
             <div className="flex-1">
               <div className="flex items-center gap-2 font-bold text-green-400">
                  <span>🔫</span> Triple Shot
               </div>
               <div className="text-xs text-gray-300">Increase Triple Shot duration (+5%)</div>
             </div>
             <div className="flex flex-col items-end gap-1">
               <div className="flex gap-1">
                 {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i < upgrades.tripleShotDuration ? 'bg-green-400' : 'bg-gray-600'}`} />
                 ))}
               </div>
               {upgrades.tripleShotDuration < 5 ? (
                 <button 
                    onClick={() => buyUpgrade('tripleShotDuration', COST_BASE_TRIPLE * (upgrades.tripleShotDuration + 1))}
                    disabled={wallet < COST_BASE_TRIPLE * (upgrades.tripleShotDuration + 1)}
                    className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-3 py-1 rounded text-xs font-bold mt-1"
                 >
                   ${COST_BASE_TRIPLE * (upgrades.tripleShotDuration + 1)}
                 </button>
               ) : <span className="text-xs text-green-400 font-bold">MAXED</span>}
             </div>
           </div>
           
           {/* Laser Duration */}
           <div className="flex items-center justify-between bg-slate-700 p-3 rounded">
             <div className="flex-1">
               <div className="flex items-center gap-2 font-bold text-cyan-400">
                  <span>⚡</span> Laser Focus
               </div>
               <div className="text-xs text-gray-300">Increase Laser duration (+5%)</div>
             </div>
             <div className="flex flex-col items-end gap-1">
               <div className="flex gap-1">
                 {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i < upgrades.laserDuration ? 'bg-cyan-400' : 'bg-gray-600'}`} />
                 ))}
               </div>
               {upgrades.laserDuration < 5 ? (
                 <button 
                    onClick={() => buyUpgrade('laserDuration', COST_BASE_LASER * (upgrades.laserDuration + 1))}
                    disabled={wallet < COST_BASE_LASER * (upgrades.laserDuration + 1)}
                    className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-3 py-1 rounded text-xs font-bold mt-1"
                 >
                   ${COST_BASE_LASER * (upgrades.laserDuration + 1)}
                 </button>
               ) : <span className="text-xs text-green-400 font-bold">MAXED</span>}
             </div>
           </div>
        </div>

        <button 
          onClick={() => setShowShop(false)}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded border-b-4 border-red-800 active:border-0 active:translate-y-1"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
  
  // Leaderboard Display Component
  const LeaderboardDisplay = () => (
      <div className="bg-slate-800/80 p-4 rounded-lg border border-yellow-500/30 w-full max-w-sm mb-4">
          <h3 className="text-yellow-400 font-bold mb-3 text-center border-b border-yellow-500/30 pb-2">TOP WHALES</h3>
          {leaderboard.length === 0 ? (
              <div className="text-gray-400 text-center text-xs">No records yet</div>
          ) : (
              <table className="w-full text-xs">
                  <thead>
                      <tr className="text-gray-400 border-b border-white/10">
                          <th className="text-left pb-1">#</th>
                          <th className="text-left pb-1">NAME</th>
                          <th className="text-right pb-1">SCORE</th>
                      </tr>
                  </thead>
                  <tbody>
                      {leaderboard.map((entry, index) => (
                          <tr key={index} className="border-b border-white/5 last:border-0">
                              <td className="py-2 text-yellow-600 font-bold w-6">{index + 1}</td>
                              <td className="py-2 text-white">{entry.name}</td>
                              <td className="py-2 text-green-400 text-right font-mono">${entry.score.toLocaleString()}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          )}
      </div>
  );

  return (
    <div className="relative w-full">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="block cursor-none w-full h-auto bg-slate-900"
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={handleCanvasMouseLeave}
        onTouchMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const canvas = canvasRef.current;
          if(canvas && e.touches.length > 0) {
             const scaleX = canvas.width / rect.width;
             const scaleY = canvas.height / rect.height;
             mouseRef.current.x = (e.touches[0].clientX - rect.left) * scaleX;
             mouseRef.current.y = (e.touches[0].clientY - rect.top) * scaleY;
          }
        }}
      />
      <div className="absolute top-4 left-4 font-bold text-white text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        PORTFOLIO: ${score.toLocaleString()}
      </div>
      
      {showShop && <ShopOverlay />}
      {showLifestyle && <LifestyleShopOverlay />}
      {showTrading && <TradingOverlay />}
      {showNormieLife && <NormieLifeOverlay />}

      {gameState === GameState.START && !showShop && !showLifestyle && !showTrading && !showNormieLife && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 p-4 text-center overflow-y-auto">
          <h2 className="text-3xl md:text-4xl text-yellow-400 mb-4 animate-pulse uppercase">Crypto Enjoyer</h2>
          <p className="text-white mb-6 text-sm md:text-base max-w-md">
            Collect <span className="text-yellow-400">SOL</span> and <span className="text-fuchsia-400">MEME</span>. 
            <br/>Avoid the L2 Chains!
          </p>
           
           <LeaderboardDisplay />

           <div className="flex gap-4 mb-6 text-xs text-gray-300 justify-center flex-wrap">
             <div className="flex items-center gap-2"><span className="text-2xl">🚀</span> Moon</div>
             <div className="flex items-center gap-2"><span className="text-2xl">🧲</span> Magnet</div>
             <div className="flex items-center gap-2"><span className="text-2xl">🔫</span> Triple</div>
             <div className="flex items-center gap-2"><span className="text-2xl">💥</span> Shotgun</div>
             <div className="flex items-center gap-2"><span className="text-2xl">💨</span> Rapid</div>
             <div className="flex items-center gap-2"><span className="text-2xl">👯</span> Drones</div>
             <div className="flex items-center gap-2"><span className="text-2xl">⚡</span> Laser</div>
             <div className="flex items-center gap-2"><span className="text-2xl">💣</span> Nuke</div>
             {hasShield && <div className="flex items-center gap-2 text-cyan-400"><span className="text-2xl">🛡️</span> Shield Active</div>}
          </div>
          
          {ownedLuxuries.length > 0 && (
              <div className="mb-6 flex gap-2 flex-wrap justify-center max-w-lg bg-yellow-900/20 p-2 rounded border border-yellow-500/30">
                  {ownedLuxuries.map(id => {
                      const item = LUXURY_ITEMS.find(l => l.id === id);
                      return item ? <span key={id} title={item.name} className="text-2xl cursor-help">{item.emoji}</span> : null;
                  })}
              </div>
          )}

          <div className="flex flex-col gap-3 w-64">
            <button onClick={resetGame} className="w-full px-8 py-4 bg-red-600 text-white font-bold rounded hover:bg-red-500 transition-colors border-b-4 border-red-800 active:border-0 active:translate-y-1 uppercase">
              Clock In
            </button>
            <button onClick={() => setShowShop(true)} className="w-full px-8 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-500 transition-colors border-b-4 border-blue-800 active:border-0 active:translate-y-1 uppercase text-sm">
              Upgrades (${wallet.toLocaleString()})
            </button>
            <button onClick={() => setShowTrading(true)} className="w-full px-8 py-2 bg-red-800 text-white font-bold rounded hover:bg-red-700 transition-colors border-b-4 border-red-950 active:border-0 active:translate-y-1 uppercase text-sm">
              Trade (50x)
            </button>
            <button onClick={() => setShowLifestyle(true)} className="w-full px-8 py-2 bg-yellow-600 text-white font-bold rounded hover:bg-yellow-500 transition-colors border-b-4 border-yellow-800 active:border-0 active:translate-y-1 uppercase text-sm">
              Lifestyle
            </button>
            <div className="flex gap-2">
                <button 
                  onClick={startNormieLife}
                  className="w-full px-4 py-2 bg-gray-600 text-white font-bold rounded hover:bg-gray-500 transition-colors border-b-4 border-gray-800 active:border-0 active:translate-y-1 uppercase text-[10px]"
                >
                  Office Job
                </button>
            </div>
          </div>
        </div>
      )}
      
      {gameState === GameState.GAME_OVER && !showShop && !showLifestyle && !showTrading && !showNormieLife && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/90 z-10 overflow-y-auto">
          <h2 className="text-5xl text-white mb-2 font-bold shake-text">REKT</h2>
          <p className="text-xl text-yellow-300 mb-6">Portfolio Value: ${score.toLocaleString()}</p>
          
          {isNewHigh && !scoreSubmitted ? (
               <div className="bg-black/50 p-6 rounded-lg border border-yellow-500 mb-6 flex flex-col items-center animate-bounce-short">
                  <h3 className="text-yellow-400 font-bold mb-2">NEW HIGH SCORE!</h3>
                  <input 
                      type="text" 
                      maxLength={10}
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value.toUpperCase())}
                      placeholder="ENTER NAME"
                      className="bg-slate-800 text-white text-center p-2 rounded border border-white/20 mb-3 w-48 font-bold"
                      autoFocus
                  />
                  <button 
                      onClick={submitScore}
                      disabled={!inputName.trim()}
                      className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white px-4 py-2 rounded font-bold"
                  >
                      SUBMIT
                  </button>
               </div>
          ) : (
              <LeaderboardDisplay />
          )}

          <p className="text-sm text-gray-300 mb-8">Funds secured in Wallet.</p>
          <div className="flex flex-col gap-3 w-64 pb-8">
             <button onClick={resetGame} className="w-full px-8 py-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-500 transition-colors border-b-4 border-blue-800 active:border-0 active:translate-y-1 uppercase">
              Buy the Dip
            </button>
             <button onClick={() => setShowShop(true)} className="w-full px-8 py-2 bg-slate-700 text-white font-bold rounded hover:bg-slate-600 transition-colors border-b-4 border-slate-900 active:border-0 active:translate-y-1 uppercase text-sm">
              Upgrades (${wallet.toLocaleString()})
            </button>
            <button onClick={() => setShowTrading(true)} className="w-full px-8 py-2 bg-red-800 text-white font-bold rounded hover:bg-red-700 transition-colors border-b-4 border-red-950 active:border-0 active:translate-y-1 uppercase text-sm">
              Trade (50x)
            </button>
            <button onClick={() => setShowLifestyle(true)} className="w-full px-8 py-2 bg-yellow-600 text-white font-bold rounded hover:bg-yellow-500 transition-colors border-b-4 border-yellow-800 active:border-0 active:translate-y-1 uppercase text-sm">
              Lifestyle
            </button>
            <div className="flex gap-2">
                <button 
                  onClick={startNormieLife}
                  className="w-full px-4 py-2 bg-gray-600 text-white font-bold rounded hover:bg-gray-500 transition-colors border-b-4 border-gray-800 active:border-0 active:translate-y-1 uppercase text-[10px]"
                >
                  Office Job
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
