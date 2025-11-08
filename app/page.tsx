import { GameInfo } from '@/lib/types';
import GameCard from '@/components/common/GameCard';

const games: GameInfo[] = [
  {
    id: 'minesweeper',
    name: '지뢰찾기',
    description: '클릭하여 지뢰를 피하고 모든 안전한 셀을 열어보세요!',
    path: '/games/minesweeper',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            🎮 웹 게임 모음
          </h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            게임을 선택하세요
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            다양한 웹 게임을 즐겨보세요!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </main>
    </div>
  );
}
