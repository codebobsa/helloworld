'use client';

import { useState, useEffect } from 'react';
import { MinesweeperGame } from './GameLogic';
import { MinesweeperConfig, Difficulty } from '@/lib/types';
import Cell from './Cell';

interface BoardProps {
  config: MinesweeperConfig;
  onGameEnd?: (won: boolean, time: number) => void;
}

const DIFFICULTY_CONFIGS: Record<Difficulty, MinesweeperConfig> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

export default function Board({ config: initialConfig, onGameEnd }: BoardProps) {
  const [currentConfig, setCurrentConfig] = useState<MinesweeperConfig>(initialConfig);
  const [game, setGame] = useState(() => new MinesweeperGame(initialConfig));
  const [board, setBoard] = useState(() => game.getBoard());
  const [time, setTime] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('beginner');
  const [gameStatus, setGameStatus] = useState(() => game.getStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameStatus === 'playing') {
        setTime(game.getElapsedTime());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStatus, game]);

  const updateGameState = () => {
    setBoard([...game.getBoard()]);
    setGameStatus(game.getStatus());
    setTime(game.getElapsedTime());
  };

  const handleReveal = (row: number, col: number) => {
    game.revealCell(row, col);
    updateGameState();

    const currentStatus = game.getStatus();
    if (currentStatus === 'won' || currentStatus === 'lost') {
      onGameEnd?.(currentStatus === 'won', game.getElapsedTime());
    }
  };

  const handleToggleFlag = (row: number, col: number) => {
    game.toggleFlag(row, col);
    updateGameState();
  };

  const handleReset = () => {
    const newGame = new MinesweeperGame(currentConfig);
    setGame(newGame);
    setBoard(newGame.getBoard());
    setGameStatus(newGame.getStatus());
    setTime(0);
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    const newConfig = DIFFICULTY_CONFIGS[difficulty];
    setCurrentConfig(newConfig);
    const newGame = new MinesweeperGame(newConfig);
    setGame(newGame);
    setBoard(newGame.getBoard());
    setGameStatus(newGame.getStatus());
    setTime(0);
    setSelectedDifficulty(difficulty);
  };

  const remainingMines = game.getRemainingMines();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 게임 정보 및 컨트롤 */}
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        {/* 난이도 선택 */}
        <div className="flex gap-2 justify-center">
          {(['beginner', 'intermediate', 'expert'] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => handleDifficultyChange(diff)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {diff === 'beginner' ? '초급' : diff === 'intermediate' ? '중급' : '고급'}
            </button>
          ))}
        </div>

        {/* 게임 상태 표시 */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-lg font-bold">
            지뢰: {remainingMines}
          </div>
          <div className="text-lg font-bold">
            시간: {time}초
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            새 게임
          </button>
        </div>

        {/* 게임 상태 메시지 */}
        {gameStatus === 'won' && (
          <div className="text-center text-2xl font-bold text-green-600 dark:text-green-400">
            🎉 승리했습니다! 🎉
          </div>
        )}
        {gameStatus === 'lost' && (
          <div className="text-center text-2xl font-bold text-red-600 dark:text-red-400">
            💥 게임 오버! 💥
          </div>
        )}
      </div>

      {/* 게임 보드 */}
      <div className="flex justify-center">
        <div
          className="inline-grid gap-1 p-2 bg-gray-300 dark:bg-gray-700 rounded-lg"
          style={{
            gridTemplateColumns: `repeat(${currentConfig.cols}, minmax(0, 1fr))`,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                onReveal={handleReveal}
                onToggleFlag={handleToggleFlag}
              />
            ))
          )}
        </div>
      </div>

      {/* 게임 설명 */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center max-w-2xl">
        <p>좌클릭: 셀 열기 | 우클릭: 깃발 표시/제거</p>
      </div>
    </div>
  );
}

