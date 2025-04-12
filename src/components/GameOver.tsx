
import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Button } from "@/components/ui/button";
import { Award, RotateCcw } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const GameOver: React.FC = () => {
  const { state, dispatch } = useGame();
  const { score, highScore } = state;
  const { menuClick } = useSoundEffects();
  
  const isNewHighScore = score === highScore && highScore > 0;
  
  const handleRestart = () => {
    menuClick();
    dispatch({ type: 'RESET_GAME' });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-game-grid p-6 rounded-lg border border-white/10 shadow-xl max-w-xs w-full text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-1">Game Over</h2>
        
        {isNewHighScore && (
          <motion.div 
            initial={{ scale: 0.5 }}
            animate={{ scale: [0.5, 1.2, 1] }}
            transition={{ delay: 0.5, times: [0, 0.5, 1] }}
            className="flex justify-center items-center gap-2 mb-4"
          >
            <Award className="text-yellow-400 w-6 h-6" />
            <span className="text-yellow-400 font-bold">New High Score!</span>
          </motion.div>
        )}
        
        <div className="flex flex-col gap-4 mb-6">
          <div className="text-white">
            <span className="block text-white/70 text-sm">Score</span>
            <span className="text-3xl font-bold">{score}</span>
          </div>
          
          <div className="text-white">
            <span className="block text-white/70 text-sm">High Score</span>
            <span className="text-xl font-semibold">{highScore}</span>
          </div>
        </div>
        
        <Button 
          onClick={handleRestart} 
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Play Again
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default GameOver;
