
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { BlockShape, Position } from '@/types/game';

type DraggableBlockProps = {
  block: BlockShape;
  onDragStart: (blockId: string) => void;
  onDragEnd: () => void;
};

const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  onDragStart,
  onDragEnd,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const cellSize = 40; // Size of each cell in the block
  
  const handleDragStart = () => {
    setIsDragging(true);
    onDragStart(block.id);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };
  
  return (
    <motion.div
      className={`relative draggable-block ${isDragging ? 'z-50' : 'z-10'}`}
      drag
      dragSnapToOrigin // We keep this as a fallback in case no valid position is found
      dragMomentum={false} // Disable momentum for more precise placement
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        width: block.width * cellSize,
        height: block.height * cellSize,
        touchAction: 'none',
        cursor: 'grab',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateRows: `repeat(${block.height}, 1fr)`,
          gridTemplateColumns: `repeat(${block.width}, 1fr)`,
          gap: '2px',
          width: '100%',
          height: '100%',
        }}
      >
        {block.shape.map((row, rowIndex) =>
          row.map((isActive, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`relative ${isActive ? `metal-block ${block.type}-block metal-overlay` : 'invisible'}`}
            >
              {isActive && (
                <>
                  <div className="block-highlight"></div>
                  <div className="block-shadow"></div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default DraggableBlock;
