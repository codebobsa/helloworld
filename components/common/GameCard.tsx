import Link from 'next/link';
import { GameInfo } from '@/lib/types';

interface GameCardProps {
  game: GameInfo;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link
      href={game.path}
      className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:scale-105 dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {game.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {game.description}
        </p>
        <div className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
          플레이하기 →
        </div>
      </div>
    </Link>
  );
}

