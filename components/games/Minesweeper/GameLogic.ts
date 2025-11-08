import { Cell, CellState, MinesweeperConfig, GameStatus } from '@/lib/types';

export class MinesweeperGame {
  private board: Cell[][];
  private config: MinesweeperConfig;
  private status: GameStatus;
  private revealedCount: number;
  private flaggedCount: number;
  private startTime: number | null;
  private endTime: number | null;

  constructor(config: MinesweeperConfig) {
    this.config = config;
    this.status = 'idle';
    this.revealedCount = 0;
    this.flaggedCount = 0;
    this.startTime = null;
    this.endTime = null;
    this.board = this.initializeBoard();
  }

  private initializeBoard(): Cell[][] {
    const board: Cell[][] = [];
    
    // 빈 보드 생성
    for (let row = 0; row < this.config.rows; row++) {
      board[row] = [];
      for (let col = 0; col < this.config.cols; col++) {
        board[row][col] = {
          isMine: false,
          state: 'hidden',
          adjacentMines: 0,
          row,
          col,
        };
      }
    }

    return board;
  }

  startGame(firstClickRow: number, firstClickCol: number): void {
    // 첫 클릭 위치 주변에는 지뢰를 배치하지 않음
    const safeCells = this.getAdjacentCells(firstClickRow, firstClickCol);
    safeCells.push({ row: firstClickRow, col: firstClickCol });

    // 지뢰 배치
    let minesPlaced = 0;
    while (minesPlaced < this.config.mines) {
      const row = Math.floor(Math.random() * this.config.rows);
      const col = Math.floor(Math.random() * this.config.cols);
      
      // 첫 클릭 위치와 인접한 셀에는 지뢰 배치하지 않음
      const isSafe = safeCells.some(cell => cell.row === row && cell.col === col);
      if (!this.board[row][col].isMine && !isSafe) {
        this.board[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // 인접 지뢰 수 계산
    this.calculateAdjacentMines();
    
    this.status = 'playing';
    this.startTime = Date.now();
  }

  private calculateAdjacentMines(): void {
    for (let row = 0; row < this.config.rows; row++) {
      for (let col = 0; col < this.config.cols; col++) {
        if (!this.board[row][col].isMine) {
          let count = 0;
          const adjacent = this.getAdjacentCells(row, col);
          adjacent.forEach(cell => {
            if (this.board[cell.row][cell.col].isMine) {
              count++;
            }
          });
          this.board[row][col].adjacentMines = count;
        }
      }
    }
  }

  private getAdjacentCells(row: number, col: number): Array<{ row: number; col: number }> {
    const adjacent: Array<{ row: number; col: number }> = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const newRow = row + dr;
        const newCol = col + dc;
        if (
          newRow >= 0 &&
          newRow < this.config.rows &&
          newCol >= 0 &&
          newCol < this.config.cols
        ) {
          adjacent.push({ row: newRow, col: newCol });
        }
      }
    }
    return adjacent;
  }

  revealCell(row: number, col: number): boolean {
    if (this.status !== 'playing') {
      if (this.status === 'idle') {
        this.startGame(row, col);
      } else {
        return false;
      }
    }

    const cell = this.board[row][col];
    
    if (cell.state !== 'hidden') {
      return false;
    }

    if (cell.isMine) {
      cell.state = 'revealed';
      this.status = 'lost';
      this.endTime = Date.now();
      this.revealAllMines();
      return true;
    }

    this.revealCellRecursive(row, col);
    
    const totalCells = this.config.rows * this.config.cols;
    const safeCells = totalCells - this.config.mines;
    
    if (this.revealedCount >= safeCells) {
      this.status = 'won';
      this.endTime = Date.now();
      this.flagAllMines();
    }

    return true;
  }

  private revealCellRecursive(row: number, col: number): void {
    const cell = this.board[row][col];
    
    if (cell.state !== 'hidden' || cell.isMine) {
      return;
    }

    cell.state = 'revealed';
    this.revealedCount++;

    // 인접 지뢰가 없으면 인접 셀도 자동으로 열기
    if (cell.adjacentMines === 0) {
      const adjacent = this.getAdjacentCells(row, col);
      adjacent.forEach(adj => {
        this.revealCellRecursive(adj.row, adj.col);
      });
    }
  }

  toggleFlag(row: number, col: number): void {
    if (this.status !== 'playing' && this.status !== 'idle') {
      return;
    }

    const cell = this.board[row][col];
    
    if (cell.state === 'hidden') {
      cell.state = 'flagged';
      this.flaggedCount++;
    } else if (cell.state === 'flagged') {
      cell.state = 'hidden';
      this.flaggedCount--;
    }
  }

  private revealAllMines(): void {
    for (let row = 0; row < this.config.rows; row++) {
      for (let col = 0; col < this.config.cols; col++) {
        const cell = this.board[row][col];
        if (cell.isMine && cell.state !== 'flagged') {
          cell.state = 'revealed';
        }
      }
    }
  }

  private flagAllMines(): void {
    for (let row = 0; row < this.config.rows; row++) {
      for (let col = 0; col < this.config.cols; col++) {
        const cell = this.board[row][col];
        if (cell.isMine && cell.state === 'hidden') {
          cell.state = 'flagged';
          this.flaggedCount++;
        }
      }
    }
  }

  reset(): void {
    this.status = 'idle';
    this.revealedCount = 0;
    this.flaggedCount = 0;
    this.startTime = null;
    this.endTime = null;
    this.board = this.initializeBoard();
  }

  getBoard(): Cell[][] {
    return this.board;
  }

  getStatus(): GameStatus {
    return this.status;
  }

  getRemainingMines(): number {
    return this.config.mines - this.flaggedCount;
  }

  getElapsedTime(): number {
    if (!this.startTime) return 0;
    if (this.endTime) return Math.floor((this.endTime - this.startTime) / 1000);
    return Math.floor((Date.now() - this.startTime) / 1000);
  }
}

