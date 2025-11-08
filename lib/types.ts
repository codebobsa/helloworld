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

