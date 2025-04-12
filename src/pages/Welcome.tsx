
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, Crown, Settings } from 'lucide-react';
import ParticleEffect from '@/components/ParticleEffect';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { menuClick } = useSoundEffects();
  
  const handleStart = () => {
    menuClick();
    navigate('/game');
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <ParticleEffect />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="game-title mb-2">
          Metal Block <span className="text-yellow-400">2</span>
        </h1>
        <p className="game-subtitle">Match. Clear. Shine.</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-xs mx-auto bg-game-grid/50 backdrop-blur-md rounded-lg p-6 border border-white/10 shadow-xl"
      >
        <div className="flex justify-center mb-8">
          <div className="relative grid grid-cols-2 grid-rows-2 gap-1">
            <div className="metal-block silver-block metal-overlay w-16 h-16"></div>
            <div className="metal-block gold-block metal-overlay w-16 h-16"></div>
            <div className="metal-block platinum-block metal-overlay w-16 h-16"></div>
            <div className="metal-block copper-block metal-overlay w-16 h-16"></div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={handleStart}
            className="game-button flex items-center justify-center gap-2 w-full"
          >
            <Play className="w-4 h-4" />
            Start Game
          </Button>
        </div>
        
        <div className="mt-8 text-white/70 text-sm">
          <p>
            Drag and drop metal blocks to clear rows and columns.
            Complete levels to earn metal rewards and challenge yourself!
          </p>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-white/50 text-xs text-center"
      >
        © 2025 Metal Block 2
      </motion.div>
    </div>
  );
};

export default Welcome;
