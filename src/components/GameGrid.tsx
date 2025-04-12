
import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Position } from '@/types/game';
import { isValidPlacement, calculatePositions } from '@/utils/gameUtils';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const GameGrid: React.FC<{
  highlightPositions: Position[];
  onCellClick: (row: number, col: number) => void;
}> = ({ highlightPositions, onCellClick }) => {
  const { state, settings } = useGame();
  const { grid } = state;
  const { gridSize } = settings;
  
  const isHighlighted = (row: number, col: number) => {
    return highlightPositions.some(pos => pos.row === row && pos.col === col);
  };

  return (
    <div 
      className="w-full aspect-square bg-game-grid rounded-lg p-1 sm:p-2 border border-white/10 shadow-lg relative overflow-hidden"
      style={{ 
        display: 'grid',
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gap: '2px',
      }}
    >
      {/* Background particles effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
      </div>
      
      {/* Grid cells */}
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            onClick={() => onCellClick(rowIndex, colIndex)}
            className={`grid-cell ${isHighlighted(rowIndex, colIndex) ? 'grid-cell-highlight' : ''} relative`}
          >
            {cell && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`absolute inset-0 metal-block ${cell}-block metal-overlay`}
              >
                <div className="block-highlight"></div>
                <div className="block-shadow"></div>
              </motion.div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default GameGrid;
