// Model：只负责游戏状态与规则，不涉及任何渲染或输入。
class GameModel {
  constructor(config) {
    this.config = config;
    this.best = this._loadBest();
    this.reset();
  }

  reset() {
    const midX = Math.floor(this.config.cols / 2);
    const midY = Math.floor(this.config.rows / 2);
    this.snake = [
      { x: midX, y: midY },
      { x: midX - 1, y: midY },
      { x: midX - 2, y: midY },
    ];
    this.direction = Direction.RIGHT;
    this.pendingDirection = Direction.RIGHT;
    this.score = 0;
    this.gameOver = false;
    this.food = this._spawnFood();
  }

  // 缓存下一步方向，避免同一 tick 内连续转向导致直接反向自杀。
  queueDirection(dir) {
    if (!dir) return;
    const isReverse =
      dir.x === -this.direction.x && dir.y === -this.direction.y;
    if (!isReverse) {
      this.pendingDirection = dir;
    }
  }

  // 推进一帧；返回本帧发生的事件，交由上层决定如何反馈。
  step() {
    if (this.gameOver) {
      return { moved: false, ate: false, gameOver: true };
    }

    this.direction = this.pendingDirection;
    const head = this.snake[0];
    const next = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y,
    };

    if (this._isCollision(next)) {
      this.gameOver = true;
      this._saveBest();
      return { moved: false, ate: false, gameOver: true };
    }

    this.snake.unshift(next);

    const ate = next.x === this.food.x && next.y === this.food.y;
    if (ate) {
      this.score += 1;
      if (this.score > this.best) {
        this.best = this.score;
      }
      this.food = this._spawnFood();
    } else {
      this.snake.pop();
    }

    return { moved: true, ate, gameOver: false };
  }

  _isCollision(cell) {
    const outOfBounds =
      cell.x < 0 ||
      cell.y < 0 ||
      cell.x >= this.config.cols ||
      cell.y >= this.config.rows;
    if (outOfBounds) return true;
    return this.snake.some((s) => s.x === cell.x && s.y === cell.y);
  }

  _spawnFood() {
    const free = [];
    for (let y = 0; y < this.config.rows; y++) {
      for (let x = 0; x < this.config.cols; x++) {
        const occupied = this.snake.some((s) => s.x === x && s.y === y);
        if (!occupied) free.push({ x, y });
      }
    }
    if (free.length === 0) return null;
    return free[Math.floor(Math.random() * free.length)];
  }

  _loadBest() {
    const raw = window.localStorage.getItem(this.config.storageKey);
    const value = parseInt(raw, 10);
    return Number.isNaN(value) ? 0 : value;
  }

  _saveBest() {
    window.localStorage.setItem(this.config.storageKey, String(this.best));
  }
}
