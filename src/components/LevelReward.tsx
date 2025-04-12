
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Gift } from 'lucide-react';

const LevelReward: React.FC = () => {
  const { state, dispatch } = useGame();
  const { currentReward, level } = state;
  
  // Hide reward after a delay
  useEffect(() => {
    if (currentReward) {
      const timer = setTimeout(() => {
        dispatch({ type: 'HIDE_REWARD' });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentReward, dispatch]);
  
  if (!currentReward) return null;
  
  const rewardTitle = {
    copper: 'Bag of Copper',
    silver: 'Bag of Silver',
    gold: 'Bag of Gold',
    platinum: 'Bag of Platinum'
  }[currentReward] || 'Special Reward';
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="bg-game-grid p-6 rounded-lg border border-white/10 shadow-xl max-w-xs w-full text-center"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mb-4"
          >
            <div className={`metal-block ${currentReward}-block metal-overlay rounded-full p-6 inline-flex`}>
              <Gift className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Level {level} Completed!</h2>
          
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-white/80 mb-3">You've earned a</p>
            <p className="text-xl font-bold text-white">{rewardTitle}</p>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-white/70 text-sm mt-4"
          >
            Get ready for the next challenge...
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LevelReward;
