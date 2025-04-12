
import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo, useMotionValue } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { BlockShape, Position } from '@/types/game';

type DraggableBlockProps = {
  block: BlockShape;
  onDragStart: (blockId: string) => void;
  onDragEnd: (x: number, y: number) => void;
};

const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  onDragStart,
  onDragEnd,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const cellSize = 40; // Size of each cell in the block
  
  const handleDragStart = () => {
    setIsDragging(true);
    onDragStart(block.id);
  };
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    // Get the final position
    const blockElement = blockRef.current;
    if (blockElement) {
      const rect = blockElement.getBoundingClientRect();
      onDragEnd(rect.left, rect.top);
    }
    
    // Reset position for next drag
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={blockRef}
      className={`relative draggable-block ${isDragging ? 'z-50' : 'z-10'}`}
      drag
      dragSnapToOrigin={true} // This will now ensure it snaps back if not properly placed
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        width: block.width * cellSize,
        height: block.height * cellSize,
        touchAction: 'none',
        cursor: 'grab',
        x,
        y,
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
