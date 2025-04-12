
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, BlockType, BlockShape, Position, GameSettings } from '@/types/game';
import { generateBlocks, checkForCompletedRows, isGameOver } from '@/utils/gameUtils';

type GameAction =
  | { type: 'PLACE_BLOCK'; blockId: string; positions: Position[] }
  | { type: 'CLEAR_ROWS'; rows: number[] }
  | { type: 'NEW_BLOCKS' }
  | { type: 'RESET_GAME' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'SET_HIGH_SCORE'; score: number }
  | { type: 'SHOW_REWARD'; reward: string }
  | { type: 'HIDE_REWARD' };

const DEFAULT_SETTINGS: GameSettings = {
  gridSize: 9,
  rowsPerLevel: 5,
  maxLevel: 10,
};

const initialGrid = Array(DEFAULT_SETTINGS.gridSize)
  .fill(null)
  .map(() => Array(DEFAULT_SETTINGS.gridSize).fill(null));

const initialState: GameState = {
  grid: initialGrid,
  score: 0,
  level: 1,
  highScore: 0,
  blocks: [],
  placedBlocks: [],
  gameOver: false,
  isPaused: false,
  soundEnabled: true,
  completedRows: 0,
  rowsToNextLevel: DEFAULT_SETTINGS.rowsPerLevel,
  currentReward: null,
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'PLACE_BLOCK': {
      const { blockId, positions } = action;
      const blockToPlace = state.blocks.find((block) => block.id === blockId);
      
      if (!blockToPlace) return state;
      
      // Create a new grid with the placed block
      const newGrid = [...state.grid.map(row => [...row])];
      positions.forEach(({ row, col }) => {
        if (row >= 0 && row < DEFAULT_SETTINGS.gridSize && 
            col >= 0 && col < DEFAULT_SETTINGS.gridSize) {
          newGrid[row][col] = blockToPlace.type;
        }
      });
      
      // Add to placed blocks
      const placedBlock = {
        id: blockId,
        type: blockToPlace.type,
        positions,
      };
      
      // Check for completed rows and columns
      const completedRows = checkForCompletedRows(newGrid);
      const clearedGrid = [...newGrid];
      let additionalScore = 0;
      let newCompletedRows = state.completedRows;
      
      // Clear completed rows and columns
      if (completedRows.rows.length > 0 || completedRows.cols.length > 0) {
        completedRows.rows.forEach(rowIndex => {
          clearedGrid[rowIndex] = Array(DEFAULT_SETTINGS.gridSize).fill(null);
          additionalScore += 10 * state.level;
          newCompletedRows += 1;
        });
        
        completedRows.cols.forEach(colIndex => {
          for (let i = 0; i < DEFAULT_SETTINGS.gridSize; i++) {
            clearedGrid[i][colIndex] = null;
          }
          additionalScore += 10 * state.level;
          newCompletedRows += 1;
        });
      }
      
      // Add points for placing the block
      const blockPoints = blockToPlace.shape.flat().filter(Boolean).length;
      const newScore = state.score + blockPoints + additionalScore;
      
      // Check if level up
      const rowsToNextLevel = state.rowsToNextLevel - (newCompletedRows - state.completedRows);
      let newLevel = state.level;
      let showReward = null;
      
      if (rowsToNextLevel <= 0 && newLevel < DEFAULT_SETTINGS.maxLevel) {
        newLevel += 1;
        
        // Determine reward
        if (newLevel === 2) showReward = 'copper';
        else if (newLevel === 3) showReward = 'silver';
        else if (newLevel === 5) showReward = 'gold';
        else if (newLevel === 7) showReward = 'platinum';
      }
      
      // Check if game over
      const gameOver = isGameOver(clearedGrid, state.blocks);
      
      // Filter out the placed block from available blocks
      const remainingBlocks = state.blocks.filter(block => block.id !== blockId);
      
      // Generate new blocks if all blocks have been placed
      const newBlocks = remainingBlocks.length === 0 ? generateBlocks(newLevel) : remainingBlocks;
      
      return {
        ...state,
        grid: clearedGrid,
        score: newScore,
        level: newLevel,
        highScore: Math.max(state.highScore, newScore),
        blocks: remainingBlocks.length === 0 ? newBlocks : remainingBlocks,
        placedBlocks: [...state.placedBlocks, placedBlock],
        gameOver,
        completedRows: newCompletedRows,
        rowsToNextLevel: rowsToNextLevel <= 0 ? DEFAULT_SETTINGS.rowsPerLevel : rowsToNextLevel,
        currentReward: showReward,
      };
    }

    case 'CLEAR_ROWS': {
      return state;
    }

    case 'NEW_BLOCKS': {
      return {
        ...state,
        blocks: generateBlocks(state.level),
      };
    }

    case 'RESET_GAME': {
      return {
        ...initialState,
        highScore: state.highScore,
        blocks: generateBlocks(1),
        soundEnabled: state.soundEnabled,
      };
    }

    case 'TOGGLE_PAUSE': {
      return {
        ...state,
        isPaused: !state.isPaused,
      };
    }

    case 'TOGGLE_SOUND': {
      return {
        ...state,
        soundEnabled: !state.soundEnabled,
      };
    }

    case 'SET_HIGH_SCORE': {
      return {
        ...state,
        highScore: action.score,
      };
    }

    case 'SHOW_REWARD': {
      return {
        ...state,
        currentReward: action.reward,
      };
    }

    case 'HIDE_REWARD': {
      return {
        ...state,
        currentReward: null,
      };
    }

    default:
      return state;
  }
};

type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  settings: GameSettings;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, {
    ...initialState,
    blocks: generateBlocks(1),
  });

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('metal-block-high-score');
    if (savedHighScore) {
      dispatch({ type: 'SET_HIGH_SCORE', score: parseInt(savedHighScore, 10) });
    }
  }, []);

  // Save high score to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('metal-block-high-score', state.highScore.toString());
  }, [state.highScore]);

  return (
    <GameContext.Provider value={{ state, dispatch, settings: DEFAULT_SETTINGS }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
