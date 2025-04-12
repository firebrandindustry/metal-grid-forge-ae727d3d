
export type BlockType = 'silver' | 'gold' | 'platinum' | 'copper';

export type BlockShape = {
  id: string;
  type: BlockType;
  shape: boolean[][];
  width: number;
  height: number;
};

export type Position = {
  row: number;
  col: number;
};

export type PlacedBlock = {
  id: string;
  type: BlockType;
  positions: Position[];
};

export type GameState = {
  grid: (BlockType | null)[][];
  score: number;
  level: number;
  highScore: number;
  blocks: BlockShape[];
  placedBlocks: PlacedBlock[];
  gameOver: boolean;
  isPaused: boolean;
  soundEnabled: boolean;
  completedRows: number;
  rowsToNextLevel: number;
  currentReward: string | null;
};

export type GameSettings = {
  gridSize: number;
  rowsPerLevel: number;
  maxLevel: number;
};
