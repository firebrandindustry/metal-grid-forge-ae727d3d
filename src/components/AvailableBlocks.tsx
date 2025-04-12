
import React from 'react';
import { motion } from 'framer-motion';
import DraggableBlock from './DraggableBlock';
import { useGame } from '@/context/GameContext';

const AvailableBlocks: React.FC<{
  onDragStart: (blockId: string) => void;
  onDragEnd: () => void;
}> = ({ onDragStart, onDragEnd }) => {
  const { state } = useGame();
  const { blocks } = state;
  
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full py-4 flex justify-center items-center gap-6 sm:gap-8"
    >
      {blocks.map((block) => (
        <div key={block.id} className="flex justify-center items-center">
          <DraggableBlock
            block={block}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        </div>
      ))}
    </motion.div>
  );
};

export default AvailableBlocks;
