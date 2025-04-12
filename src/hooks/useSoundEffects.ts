
import { useEffect, useCallback, useRef } from 'react';
import { useGame } from '@/context/GameContext';

type SoundEffects = {
  placeBlock: () => void;
  clearRow: () => void;
  gameOver: () => void;
  levelUp: () => void;
  menuClick: () => void;
};

export const useSoundEffects = (): SoundEffects => {
  const { state } = useGame();
  const { soundEnabled } = state;
  
  // Create refs for audio elements
  const placeBlockSound = useRef<HTMLAudioElement | null>(null);
  const clearRowSound = useRef<HTMLAudioElement | null>(null);
  const gameOverSound = useRef<HTMLAudioElement | null>(null);
  const levelUpSound = useRef<HTMLAudioElement | null>(null);
  const menuClickSound = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio elements
  useEffect(() => {
    placeBlockSound.current = new Audio('/sounds/place-block.mp3');
    clearRowSound.current = new Audio('/sounds/clear-row.mp3');
    gameOverSound.current = new Audio('/sounds/game-over.mp3');
    levelUpSound.current = new Audio('/sounds/level-up.mp3');
    menuClickSound.current = new Audio('/sounds/menu-click.mp3');
    
    return () => {
      // Clean up audio elements
      placeBlockSound.current = null;
      clearRowSound.current = null;
      gameOverSound.current = null;
      levelUpSound.current = null;
      menuClickSound.current = null;
    };
  }, []);
  
  // Play sound if enabled
  const playSound = useCallback((sound: HTMLAudioElement | null) => {
    if (soundEnabled && sound) {
      sound.currentTime = 0;
      sound.play().catch(err => console.error('Error playing sound:', err));
    }
  }, [soundEnabled]);
  
  // Exposed sound functions
  const placeBlock = useCallback(() => {
    playSound(placeBlockSound.current);
  }, [playSound]);
  
  const clearRow = useCallback(() => {
    playSound(clearRowSound.current);
  }, [playSound]);
  
  const gameOver = useCallback(() => {
    playSound(gameOverSound.current);
  }, [playSound]);
  
  const levelUp = useCallback(() => {
    playSound(levelUpSound.current);
  }, [playSound]);
  
  const menuClick = useCallback(() => {
    playSound(menuClickSound.current);
  }, [playSound]);
  
  return {
    placeBlock,
    clearRow,
    gameOver,
    levelUp,
    menuClick,
  };
};
