'use client';

import { useState } from 'react';
import Board from '@/components/games/Minesweeper/Board';
import { MinesweeperConfig, Difficulty } from '@/lib/types';
import Link from 'next/link';

const DIFFICULTY_CONFIGS: Record<Difficulty, MinesweeperConfig> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

export default function MinesweeperPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const config = DIFFICULTY_CONFIGS[difficulty];

  const handleGameEnd = (won: boolean, time: number) => {
    if (won) {
      console.log(`승리! 시간: ${time}초`);
      // 향후 리더보드에 저장할 수 있음
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 dark:text-gray-100"
            >
              🎮 웹 게임 모음
            </Link>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              ← 홈으로
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            지뢰찾기
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            클릭하여 지뢰를 피하고 모든 안전한 셀을 열어보세요!
          </p>
        </div>
        <Board config={config} onGameEnd={handleGameEnd} />
      </main>
    </div>
  );
}

