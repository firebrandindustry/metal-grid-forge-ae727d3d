
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, VolumeX, Volume2, RotateCcw, Info } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const GameControls: React.FC = () => {
  const { state, dispatch } = useGame();
  const { soundEnabled, gameOver } = state;
  const { menuClick } = useSoundEffects();
  
  const handleSoundToggle = () => {
    menuClick();
    dispatch({ type: 'TOGGLE_SOUND' });
  };
  
  const handleResetGame = () => {
    menuClick();
    dispatch({ type: 'RESET_GAME' });
  };
  
  return (
    <div className="fixed top-4 right-4 flex flex-col gap-3">
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        onClick={handleSoundToggle}
        className="game-icon-button"
        aria-label="Toggle sound"
      >
        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </motion.button>
      
      {gameOver && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={handleResetGame}
          className="game-icon-button"
          aria-label="Restart game"
        >
          <RotateCcw size={20} />
        </motion.button>
      )}
      
      <Dialog>
        <DialogTrigger asChild>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => menuClick()}
            className="game-icon-button"
            aria-label="Game settings"
          >
            <Info size={20} />
          </motion.button>
        </DialogTrigger>
        <DialogContent className="bg-game-grid border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-4">How to Play</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Game Rules:</h3>
              <p className="text-sm text-white/80">
                Drag and drop the metal blocks onto the grid. Try to complete rows or columns to clear them and earn points.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Blocks:</h3>
              <p className="text-sm text-white/80">
                You'll get different metal types: Silver, Gold, and Platinum. Each level introduces more complex shapes.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Levels:</h3>
              <p className="text-sm text-white/80">
                Complete rows to progress through levels. After each level, you'll receive a reward. The game gets more challenging as you progress!
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Game Over:</h3>
              <p className="text-sm text-white/80">
                The game ends when there's no space left to place any of your blocks.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameControls;
