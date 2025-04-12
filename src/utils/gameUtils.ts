
import { v4 as uuidv4 } from 'uuid';
import { BlockType, BlockShape, GameState } from '@/types/game';

// Define the block shapes as matrices
const blockShapes = {
  // 1x1 block
  single: [
    [true],
  ],
  
  // 2x1 horizontal block
  horizontal2: [
    [true, true],
  ],
  
  // 1x2 vertical block
  vertical2: [
    [true],
    [true],
  ],
  
  // 2x2 square block
  square: [
    [true, true],
    [true, true],
  ],
  
  // L-shaped block
  lShape: [
    [true, false],
    [true, true],
  ],
  
  // Reverse L-shaped block
  reverseLShape: [
    [false, true],
    [true, true],
  ],
  
  // T-shaped block
  tShape: [
    [true, true, true],
    [false, true, false],
  ],
  
  // Horizontal 3 block
  horizontal3: [
    [true, true, true],
  ],
  
  // Vertical 3 block
  vertical3: [
    [true],
    [true],
    [true],
  ],
};

// Get all available block shapes based on the level
const getAvailableShapes = (level: number) => {
  // Start with simple shapes
  if (level === 1) {
    return ['single', 'horizontal2', 'vertical2'];
  }
  
  // Add more complex shapes as levels progress
  if (level === 2) {
    return ['single', 'horizontal2', 'vertical2', 'square'];
  }
  
  if (level === 3) {
    return ['horizontal2', 'vertical2', 'square', 'lShape', 'reverseLShape'];
  }
  
  // More complex shapes for higher levels
  return Object.keys(blockShapes);
};

// Get available block types based on the level
const getAvailableTypes = (level: number): BlockType[] => {
  // Start with silver only
  if (level === 1) {
    return ['silver'];
  }
  
  // Add gold at level 2
  if (level === 2) {
    return ['silver', 'gold'];
  }
  
  // Add platinum at level 3
  if (level >= 3) {
    return ['silver', 'gold', 'platinum'];
  }
  
  return ['silver', 'gold', 'platinum'];
};

// Generate a set of random blocks for the player
export const generateBlocks = (level: number): BlockShape[] => {
  const availableShapes = getAvailableShapes(level);
  const availableTypes = getAvailableTypes(level);
  
  // Determine how many blocks to generate based on level
  const blockCount = Math.min(3, level);
  
  const blocks: BlockShape[] = [];
  
  for (let i = 0; i < blockCount; i++) {
    // Pick a random shape
    const shapeKey = availableShapes[Math.floor(Math.random() * availableShapes.length)];
    // @ts-ignore - We know these keys exist in the blockShapes object
    const shapeMatrix = blockShapes[shapeKey];
    
    // Pick a random type
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    blocks.push({
      id: uuidv4(),
      type,
      shape: shapeMatrix,
      width: shapeMatrix[0].length,
      height: shapeMatrix.length,
    });
  }
  
  return blocks;
};

// Check if a position is valid for placement
export const isValidPlacement = (
  grid: (BlockType | null)[][],
  shape: boolean[][],
  row: number,
  col: number
): boolean => {
  const gridSize = grid.length;
  
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j]) {
        const newRow = row + i;
        const newCol = col + j;
        
        // Check if position is within grid bounds
        if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
          return false;
        }
        
        // Check if position is already occupied
        if (grid[newRow][newCol] !== null) {
          return false;
        }
      }
    }
  }
  
  return true;
};

// Check for completed rows and columns
export const checkForCompletedRows = (grid: (BlockType | null)[][]) => {
  const completedRows: number[] = [];
  const completedCols: number[] = [];
  
  // Check rows
  for (let row = 0; row < grid.length; row++) {
    const isRowComplete = grid[row].every(cell => cell !== null);
    if (isRowComplete) {
      completedRows.push(row);
    }
  }
  
  // Check columns
  for (let col = 0; col < grid[0].length; col++) {
    let isColComplete = true;
    for (let row = 0; row < grid.length; row++) {
      if (grid[row][col] === null) {
        isColComplete = false;
        break;
      }
    }
    if (isColComplete) {
      completedCols.push(col);
    }
  }
  
  return { rows: completedRows, cols: completedCols };
};

// Check if game is over (no valid moves)
export const isGameOver = (grid: (BlockType | null)[][], blocks: BlockShape[]): boolean => {
  if (blocks.length === 0) return false;
  
  const gridSize = grid.length;
  
  // Check if any block can be placed anywhere on the grid
  for (const block of blocks) {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (isValidPlacement(grid, block.shape, row, col)) {
          return false; // Found a valid placement, game is not over
        }
      }
    }
  }
  
  return true; // No valid placements found, game is over
};

// Calculate positions from a shape and starting position
export const calculatePositions = (shape: boolean[][], startRow: number, startCol: number) => {
  const positions = [];
  
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j]) {
        positions.push({
          row: startRow + i,
          col: startCol + j,
        });
      }
    }
  }
  
  return positions;
};
