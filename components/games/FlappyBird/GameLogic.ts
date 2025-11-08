import { Bird, Pipe, FlappyBirdConfig, FlappyBirdGameStatus } from '@/lib/types';

export class FlappyBirdGame {
  private config: FlappyBirdConfig;
  private bird: Bird;
  private pipes: Pipe[];
  private status: FlappyBirdGameStatus;
  private score: number;
  private lastPipeSpawn: number;
  private gameSpeed: number;

  constructor(config: FlappyBirdConfig) {
    this.config = config;
    this.status = 'idle';
    this.score = 0;
    this.gameSpeed = 0;
    this.lastPipeSpawn = 0;
    
    // 새 초기 위치 (화면 왼쪽 중앙)
    this.bird = {
      x: config.canvasWidth * 0.2,
      y: config.canvasHeight / 2,
      velocity: 0,
      width: 30,
      height: 30,
    };

    this.pipes = [];
  }

  start(): void {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.score = 0;
      this.gameSpeed = 0;
      this.lastPipeSpawn = 0;
      this.pipes = [];
      
      // 새 초기화
      this.bird.y = this.config.canvasHeight / 2;
      this.bird.velocity = 0;
    }
  }

  jump(): void {
    if (this.status === 'playing') {
      this.bird.velocity = -this.config.jumpStrength;
    } else if (this.status === 'idle') {
      this.start();
    }
  }

  update(deltaTime: number): void {
    if (this.status !== 'playing') {
      return;
    }

    this.gameSpeed += deltaTime;

    // 새 물리 업데이트
    this.bird.velocity += this.config.gravity * deltaTime;
    this.bird.y += this.bird.velocity * deltaTime;

    // 파이프 생성
    if (this.gameSpeed - this.lastPipeSpawn >= this.config.pipeSpawnInterval) {
      this.spawnPipe();
      this.lastPipeSpawn = this.gameSpeed;
    }

    // 파이프 이동 및 제거
    this.pipes.forEach((pipe) => {
      pipe.x -= this.config.pipeSpeed * deltaTime;

      // 점수 계산 (파이프를 통과했는지 확인)
      if (!pipe.passed && pipe.x + pipe.width < this.bird.x) {
        pipe.passed = true;
        this.score++;
      }
    });

    // 화면 밖으로 나간 파이프 제거
    this.pipes = this.pipes.filter((pipe) => pipe.x + pipe.width > 0);

    // 충돌 감지
    if (this.checkCollision()) {
      this.status = 'gameover';
    }
  }

  private spawnPipe(): void {
    const minTopHeight = 50;
    const maxTopHeight = this.config.canvasHeight - this.config.pipeGap - 50;
    const topHeight = Math.random() * (maxTopHeight - minTopHeight) + minTopHeight;

    const pipe: Pipe = {
      x: this.config.canvasWidth,
      topHeight,
      bottomY: topHeight + this.config.pipeGap,
      width: this.config.pipeWidth,
      gap: this.config.pipeGap,
      passed: false,
    };

    this.pipes.push(pipe);
  }

  private checkCollision(): boolean {
    // 천장/바닥 충돌
    if (
      this.bird.y <= 0 ||
      this.bird.y + this.bird.height >= this.config.canvasHeight
    ) {
      return true;
    }

    // 파이프 충돌
    for (const pipe of this.pipes) {
      const birdLeft = this.bird.x;
      const birdRight = this.bird.x + this.bird.width;
      const birdTop = this.bird.y;
      const birdBottom = this.bird.y + this.bird.height;

      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + pipe.width;

      // 새가 파이프의 x 범위에 있는지 확인
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // 위쪽 파이프 또는 아래쪽 파이프와 충돌
        if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
          return true;
        }
      }
    }

    return false;
  }

  reset(): void {
    this.status = 'idle';
    this.score = 0;
    this.gameSpeed = 0;
    this.lastPipeSpawn = 0;
    this.pipes = [];
    this.bird.y = this.config.canvasHeight / 2;
    this.bird.velocity = 0;
  }

  getBird(): Bird {
    return { ...this.bird };
  }

  getPipes(): Pipe[] {
    return [...this.pipes];
  }

  getStatus(): FlappyBirdGameStatus {
    return this.status;
  }

  getScore(): number {
    return this.score;
  }
}

