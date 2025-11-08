// 게임 타입 정의
export type GameInfo = {
  id: string;
  name: string;
  description: string;
  path: string;
  icon?: string;
};

// 지뢰찾기 관련 타입
export type Difficulty = 'beginner' | 'intermediate' | 'expert';

export type CellState = 'hidden' | 'revealed' | 'flagged' | 'mine';

export type Cell = {
  isMine: boolean;
  state: CellState;
  adjacentMines: number;
  row: number;
  col: number;
};

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type MinesweeperConfig = {
  rows: number;
  cols: number;
  mines: number;
};

// 플래피 버드 관련 타입
export type FlappyBirdGameStatus = 'idle' | 'playing' | 'gameover';

export type Bird = {
  x: number;
  y: number;
  velocity: number;
  width: number;
  height: number;
};

export type Pipe = {
  x: number;
  topHeight: number;
  bottomY: number;
  width: number;
  gap: number;
  passed: boolean;
};

export type FlappyBirdConfig = {
  canvasWidth: number;
  canvasHeight: number;
  gravity: number;
  jumpStrength: number;
  pipeSpeed: number;
  pipeWidth: number;
  pipeGap: number;
  pipeSpawnInterval: number;
};

