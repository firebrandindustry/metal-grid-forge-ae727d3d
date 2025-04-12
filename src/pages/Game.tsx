
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
  const { state, dispatch, settings } = useGame();
  const { grid, blocks, gameOver } = state;
  const { gridSize } = settings;
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
  
  // Function to get grid position from screen coordinates
  const getGridPositionFromCoords = (x: number, y: number) => {
    if (!gridRef.current) return null;
    
    const gridRect = gridRef.current.getBoundingClientRect();
    const cellSize = gridRect.width / gridSize;
    
    // Check if point is within grid bounds
    if (
      x < gridRect.left || 
      x > gridRect.right || 
      y < gridRect.top || 
      y > gridRect.bottom
    ) {
      return null;
    }
    
    // Calculate cell position
    const relX = x - gridRect.left;
    const relY = y - gridRect.top;
    
    const col = Math.floor(relX / cellSize);
    const row = Math.floor(relY / cellSize);
    
    // Ensure we're within grid bounds
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
      return null;
    }
    
    return { row, col };
  };
  
  // Handle block drag end - modified to use coordinates
  const handleDragEnd = (x: number, y: number) => {
    if (!selectedBlockId) return;
    
    const gridPosition = getGridPositionFromCoords(x, y);
    const block = blocks.find(b => b.id === selectedBlockId);
    
    if (gridPosition && block) {
      const { row, col } = gridPosition;
      
      // Calculate positions based on block shape
      const positions = calculatePositions(block.shape, row, col);
      
      // Make sure block doesn't extend past grid edge
      const isWithinBounds = positions.every(pos => 
        pos.row >= 0 && pos.row < gridSize && 
        pos.col >= 0 && pos.col < gridSize
      );
      
      // Check if placement is valid
      const isValid = isWithinBounds && isValidPlacement(grid, block.shape, row, col);
      
      if (isValid) {
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
      }
    }
    
    // Reset state
    setSelectedBlockId(null);
    setHighlightPositions([]);
    setPreviewPosition(null);
  };
  
  // Handle clicking on the grid
  const handleCellClick = (row: number, col: number) => {
    if (!selectedBlockId || gameOver) return;
    
    const block = blocks.find(b => b.id === selectedBlockId);
    if (!block) return;
    
    // Check if placement is valid and within bounds
    if (isValidPlacement(grid, block.shape, row, col)) {
      const positions = calculatePositions(block.shape, row, col);
      
      // Make sure block doesn't extend past grid edge
      const isWithinBounds = positions.every(pos => 
        pos.row >= 0 && pos.row < gridSize && 
        pos.col >= 0 && pos.col < gridSize
      );
      
      if (isWithinBounds) {
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
      }
      
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
    
    // Check if all positions are within grid bounds
    const isWithinBounds = positions.every(pos => 
      pos.row >= 0 && pos.row < gridSize && 
      pos.col >= 0 && pos.col < gridSize
    );
    
    // Only set highlights if within bounds
    if (isWithinBounds) {
      setHighlightPositions(positions);
      
      // Store preview position if valid
      if (isValidPlacement(grid, block.shape, row, col)) {
        setPreviewPosition({ row, col });
      } else {
        setPreviewPosition(null);
      }
    } else {
      setHighlightPositions([]);
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
      const cellSize = rect.width / gridSize;
      
      // Calculate the row and column based on mouse position
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;
      
      if (relativeX >= 0 && relativeX < rect.width && relativeY >= 0 && relativeY < rect.height) {
        const col = Math.floor(relativeX / cellSize);
        const row = Math.floor(relativeY / cellSize);
        updateHighlightPositions(row, col);
      } else {
        // Mouse is outside the grid
        setHighlightPositions([]);
        setPreviewPosition(null);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [selectedBlockId, gameOver, gridSize]);
  
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
