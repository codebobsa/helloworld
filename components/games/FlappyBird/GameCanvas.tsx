'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { FlappyBirdGame } from './GameLogic';
import { FlappyBirdConfig, FlappyBirdGameStatus } from '@/lib/types';

const DEFAULT_CONFIG: FlappyBirdConfig = {
  canvasWidth: 400,
  canvasHeight: 600,
  gravity: 800, // 픽셀/초²
  jumpStrength: 300, // 픽셀/초
  pipeSpeed: 200, // 픽셀/초
  pipeWidth: 60,
  pipeGap: 150,
  pipeSpawnInterval: 2, // 초
};

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<FlappyBirdGame | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<FlappyBirdGameStatus>('idle');
  const [bestScore, setBestScore] = useState(0);

  // 렌더링 함수
  const render = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!gameRef.current) return;

    const { canvasWidth, canvasHeight } = DEFAULT_CONFIG;
    
    // 배경 그리기
    ctx.fillStyle = '#87CEEB'; // 하늘색
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 바닥 그리기
    ctx.fillStyle = '#8B4513'; // 갈색
    ctx.fillRect(0, canvasHeight - 20, canvasWidth, 20);

    // 새 그리기
    const bird = gameRef.current.getBird();
    ctx.fillStyle = '#FFD700'; // 금색
    ctx.beginPath();
    ctx.arc(
      bird.x + bird.width / 2,
      bird.y + bird.height / 2,
      bird.width / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // 새 눈 그리기
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(bird.x + bird.width / 2 + 5, bird.y + bird.height / 2 - 5, 3, 0, Math.PI * 2);
    ctx.fill();

    // 파이프 그리기
    const pipes = gameRef.current.getPipes();
    ctx.fillStyle = '#228B22'; // 녹색
    pipes.forEach((pipe) => {
      // 위쪽 파이프
      ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
      // 아래쪽 파이프
      ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, canvasHeight - pipe.bottomY);
    });
  }, []);

  // 게임 루프
  const gameLoop = useCallback((currentTime: number) => {
    if (!gameRef.current) return;

    const deltaTime = (currentTime - lastTimeRef.current) / 1000; // 초 단위
    lastTimeRef.current = currentTime;

    // 게임 업데이트
    gameRef.current.update(deltaTime);

    // 상태 업데이트
    const currentStatus = gameRef.current.getStatus();
    const currentScore = gameRef.current.getScore();
    
    setGameStatus(currentStatus);
    setScore(currentScore);

    // 최고 점수 업데이트
    if (currentScore > bestScore) {
      const newBestScore = currentScore;
      setBestScore(newBestScore);
      localStorage.setItem('flappyBirdBestScore', newBestScore.toString());
    }

    // 렌더링
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        render(ctx);
      }
    }

    // 게임 오버가 아니면 다음 프레임 요청
    if (currentStatus !== 'gameover') {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [bestScore, render]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 게임 인스턴스 생성
    gameRef.current = new FlappyBirdGame(DEFAULT_CONFIG);

    // 로컬 스토리지에서 최고 점수 불러오기
    const savedBestScore = localStorage.getItem('flappyBirdBestScore');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore, 10));
    }

    // 게임 시작/점프 함수
    const handleGameAction = () => {
      if (gameRef.current) {
        const status = gameRef.current.getStatus();
        if (status === 'idle') {
          gameRef.current.start();
          lastTimeRef.current = performance.now();
          animationFrameRef.current = requestAnimationFrame(gameLoop);
        } else if (status === 'playing') {
          gameRef.current.jump();
        }
      }
    };

    // 키보드 이벤트
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        handleGameAction();
      }
    };

    // 마우스 클릭 이벤트
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      handleGameAction();
    };

    // 터치 이벤트 (모바일)
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleGameAction();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // 이벤트 리스너 등록
    window.addEventListener('keydown', handleKeyPress);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // 모바일에서 스크롤 방지
    const preventScroll = (e: TouchEvent) => {
      if (canvas.contains(e.target as Node)) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventScroll, { passive: false });

    // 초기 렌더링
    render(ctx);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', preventScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop, render]);

  const handleRestart = () => {
    if (gameRef.current) {
      gameRef.current.reset();
      setScore(0);
      setGameStatus('idle');
      
      // 게임 루프 재시작
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          render(ctx);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 점수 표시 */}
      <div className="flex gap-6 text-2xl font-bold">
        <div className="text-gray-900 dark:text-gray-100">
          점수: {score}
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          최고: {bestScore}
        </div>
      </div>

      {/* 게임 캔버스 */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={DEFAULT_CONFIG.canvasWidth}
          height={DEFAULT_CONFIG.canvasHeight}
          className="border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-sky-300 cursor-pointer touch-none select-none"
          style={{ 
            maxWidth: '100%', 
            height: 'auto',
            touchAction: 'none',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        />
        
        {/* 시작 화면 */}
        {gameStatus === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <div className="text-white text-center p-6">
              <h2 className="text-3xl font-bold mb-4">플래피 버드</h2>
              <p className="text-lg mb-2">탭하거나 스페이스바를 눌러 시작하세요!</p>
              <p className="text-sm">탭/클릭/스페이스바: 점프</p>
            </div>
          </div>
        )}

        {/* 게임 오버 화면 */}
        {gameStatus === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 rounded-lg">
            <div className="text-white text-center p-6">
              <h2 className="text-3xl font-bold mb-4 text-red-400">게임 오버!</h2>
              <p className="text-xl mb-2">최종 점수: {score}</p>
              {score === bestScore && score > 0 && (
                <p className="text-lg text-yellow-400 mb-4">🎉 최고 기록! 🎉</p>
              )}
              <button
                onClick={handleRestart}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-bold touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              >
                다시 시작
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 게임 설명 */}
      <div className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
        <p>탭/클릭 또는 스페이스바: 새를 위로 올리기</p>
        <p>파이프를 피하며 최대한 많은 점수를 획득하세요!</p>
      </div>
    </div>
  );
}
