
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import GameGrid from '@/components/GameGrid';
import AvailableBlocks from '@/components/AvailableBlocks';
import ScoreDisplay from '@/components/ScoreDisplay';
import GameControls from '@/components/GameControls';
import GameOver from '@/components/GameOver';
import LevelReward from '@/components/LevelReward';
import ParticleEffect from '@/components/ParticleEffect';
import { Position, BlockType } from '@/types/game';
import { isValidPlacement, calculatePositions } from '@/utils/gameUtils';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const Game: React.FC = () => {
  const { state, dispatch } = useGame();
  const { grid, blocks, gameOver } = state;
  const { placeBlock, clearRow } = useSoundEffects();
  const gridRef = useRef<HTMLDivElement>(null);
  
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [highlightPositions, setHighlightPositions] = useState<Position[]>([]);
  const [previewPosition, setPreviewPosition] = useState<{ row: number; col: number } | null>(null);
  const [nextBlockType, setNextBlockType] = useState<BlockType>('silver');
  
  // Handle block selection
  const handleBlockSelect = (blockId: string) => {
    setSelectedBlockId(blockId);
  };
  
  // Handle block drag end
  const handleDragEnd = () => {
    // If we have a valid preview position and selected block
    if (previewPosition && selectedBlockId) {
      const block = blocks.find(b => b.id === selectedBlockId);
      if (block) {
        const positions = calculatePositions(block.shape, previewPosition.row, previewPosition.col);
        
        // Dispatch action to place block
        dispatch({
          type: 'PLACE_BLOCK',
          blockId: selectedBlockId,
          positions,
        });
        
        // Update next block type in rotation (silver -> gold -> platinum -> copper -> silver)
        if (nextBlockType === 'silver') setNextBlockType('gold');
        else if (nextBlockType === 'gold') setNextBlockType('platinum');
        else if (nextBlockType === 'platinum') setNextBlockType('copper');
        else setNextBlockType('silver');
        
        // Play sound effect
        placeBlock();
      }
      
      // Reset state - Important to clear this AFTER block placement to prevent snapping back
      setSelectedBlockId(null);
      setHighlightPositions([]);
      setPreviewPosition(null);
    } else if (selectedBlockId) {
      // If no valid position found, manually snap back
      setSelectedBlockId(null);
      setHighlightPositions([]);
    }
  };
  
  // Handle clicking on the grid
  const handleCellClick = (row: number, col: number) => {
    if (!selectedBlockId || gameOver) return;
    
    const block = blocks.find(b => b.id === selectedBlockId);
    if (!block) return;
    
    if (isValidPlacement(grid, block.shape, row, col)) {
      const positions = calculatePositions(block.shape, row, col);
      
      // Dispatch action to place block
      dispatch({
        type: 'PLACE_BLOCK',
        blockId: selectedBlockId,
        positions,
      });
      
      // Update next block type in rotation
      if (nextBlockType === 'silver') setNextBlockType('gold');
      else if (nextBlockType === 'gold') setNextBlockType('platinum');
      else if (nextBlockType === 'platinum') setNextBlockType('copper');
      else setNextBlockType('silver');
      
      // Play sound effect
      placeBlock();
      
      // Reset state
      setSelectedBlockId(null);
      setHighlightPositions([]);
      setPreviewPosition(null);
    }
  };
  
  // Update highlight positions when mouse hovers over the grid
  const updateHighlightPositions = (row: number, col: number) => {
    if (!selectedBlockId) {
      setHighlightPositions([]);
      return;
    }
    
    const block = blocks.find(b => b.id === selectedBlockId);
    if (!block) return;
    
    const positions = calculatePositions(block.shape, row, col);
    setHighlightPositions(positions);
    
    // Store preview position if valid
    if (isValidPlacement(grid, block.shape, row, col)) {
      setPreviewPosition({ row, col });
    } else {
      setPreviewPosition(null);
    }
  };
  
  // Add event listener to track mouse movement over the grid
  useEffect(() => {
    const gridElement = gridRef.current;
    if (!gridElement) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!selectedBlockId || gameOver) return;
      
      const rect = gridElement.getBoundingClientRect();
      const cellSize = rect.width / state.grid.length;
      
      // Calculate the row and column based on mouse position
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;
      
      if (relativeX >= 0 && relativeX < rect.width && relativeY >= 0 && relativeY < rect.height) {
        const col = Math.floor(relativeX / cellSize);
        const row = Math.floor(relativeY / cellSize);
        updateHighlightPositions(row, col);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [selectedBlockId, gameOver, state.grid.length]);
  
  // Pass the next block type to the NEW_BLOCKS action
  useEffect(() => {
    if (blocks.length === 0 && !gameOver) {
      dispatch({ 
        type: 'NEW_BLOCKS',
        blockType: nextBlockType
      });
    }
  }, [blocks.length, gameOver, dispatch, nextBlockType]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-6 px-4 overflow-hidden">
      <ParticleEffect />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h1 className="game-title text-center">
          Metal Block <span className="text-yellow-400">2</span>
        </h1>
      </motion.div>
      
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
        <ScoreDisplay />
        
        <div ref={gridRef} className="w-full">
          <GameGrid 
            highlightPositions={highlightPositions}
            onCellClick={handleCellClick}
          />
        </div>
        
        <AvailableBlocks 
          onDragStart={handleBlockSelect}
          onDragEnd={handleDragEnd}
        />
      </div>
      
      <GameControls />
      
      {gameOver && <GameOver />}
      
      <LevelReward />
    </div>
  );
};

export default Game;
