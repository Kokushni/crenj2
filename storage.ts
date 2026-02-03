import { supabase } from './supabaseClient';
import type { LeaderboardEntry } from './types';

// Interfaces for saved data
export interface UserProgress {
  wallet: number;
  upgrades: {
    moonDuration: number; 
    magnetRange: number; 
    cheapGas: number;   
    tripleShotDuration: number;
    laserDuration: number;
  };
  cosmetics: {
    clownMask: boolean;
    hamterMask: boolean;
    pepeMask: boolean;
    rolex: boolean;
    lambo: boolean;
  };
  ownedLuxuries: string[];
  hasShield: boolean;
}

const DEFAULT_PROGRESS: UserProgress = {
  wallet: 0,
  upgrades: {
    moonDuration: 0,
    magnetRange: 0,
    cheapGas: 0,
    tripleShotDuration: 0,
    laserDuration: 0
  },
  cosmetics: {
    clownMask: false,
    hamterMask: false,
    pepeMask: false,
    rolex: false,
    lambo: false
  },
  ownedLuxuries: [],
  hasShield: false
};

// Helper to get or create a persistent User ID
const getUserId = (): string => {
  let id = localStorage.getItem('crypto_enjoyer_uuid');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('crypto_enjoyer_uuid', id);
  }
  return id;
};

export const StorageManager = {
  // --- LEADERBOARD ---
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);
      
      if (!error && data) {
        return data as LeaderboardEntry[];
      }
    }
    
    // Fallback to LocalStorage
    const saved = localStorage.getItem('crypto_enjoyer_leaderboard');
    return saved ? JSON.parse(saved) : [];
  },

  submitScore: async (entry: LeaderboardEntry): Promise<void> => {
    if (supabase) {
      await supabase.from('leaderboard').insert([
        { name: entry.name, score: entry.score }
      ]);
    }

    // Always update LocalStorage as backup/cache
    const current = await StorageManager.getLeaderboard();
    const newBoard = [...current, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    localStorage.setItem('crypto_enjoyer_leaderboard', JSON.stringify(newBoard));
  },

  // --- PROGRESS ---
  loadProgress: async (): Promise<UserProgress> => {
    const userId = getUserId();

    if (supabase) {
      const { data } = await supabase
        .from('player_progress')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (data) {
        return {
            wallet: data.wallet ?? 0,
            upgrades: data.upgrades ?? DEFAULT_PROGRESS.upgrades,
            cosmetics: data.cosmetics ?? DEFAULT_PROGRESS.cosmetics,
            ownedLuxuries: data.inventory?.luxuries ?? [], // Storing luxuries in generic inventory bucket
            hasShield: data.inventory?.hasShield ?? false
        };
      }
    }

    // Fallback LocalStorage
    const saved = localStorage.getItem('crypto_enjoyer_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_PROGRESS, ...parsed };
      } catch (e) {
        console.error("Failed to parse save", e);
      }
    }
    return DEFAULT_PROGRESS;
  },

  saveProgress: async (progress: UserProgress): Promise<void> => {
    const userId = getUserId();
    
    // Save Local
    localStorage.setItem('crypto_enjoyer_progress', JSON.stringify(progress));

    // Save Cloud
    if (supabase) {
        const payload = {
            user_id: userId,
            wallet: progress.wallet,
            upgrades: progress.upgrades,
            cosmetics: progress.cosmetics,
            inventory: {
                luxuries: progress.ownedLuxuries,
                hasShield: progress.hasShield
            },
            updated_at: new Date()
        };

        await supabase.from('player_progress').upsert(payload);
    }
  }
};
