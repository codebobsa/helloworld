import GameCanvas from '@/components/games/FlappyBird/GameCanvas';
import Link from 'next/link';

export default function FlappyBirdPage() {
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
            플래피 버드
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            클릭하거나 스페이스바를 눌러 새를 조종하고 파이프를 피하세요!
          </p>
        </div>
        <GameCanvas />
      </main>
    </div>
  );
}

