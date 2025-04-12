
import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Crown, Award } from 'lucide-react';

const ScoreDisplay: React.FC = () => {
  const { state } = useGame();
  const { score, highScore, level, rowsToNextLevel } = state;

  return (
    <div className="w-full flex justify-between items-center mb-4 px-2">
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center"
      >
        <Crown className="w-6 h-6 text-yellow-400 mr-2" />
        <div className="text-white text-lg font-semibold">{highScore}</div>
      </motion.div>
      
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="score-display"
      >
        {score}
      </motion.div>
      
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center"
      >
        <div className="level-indicator flex items-center">
          <Award className="w-5 h-5 text-yellow-400 mr-1" />
          <span>{level}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default ScoreDisplay;
