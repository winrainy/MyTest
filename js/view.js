// View：只负责把 Model 状态画到画布与 DOM 上，不修改任何状态。
class GameView {
  constructor(config, elements) {
    this.config = config;
    this.canvas = elements.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.scoreEl = elements.score;
    this.bestEl = elements.best;
    this.overlayEl = elements.overlay;
    this.overlayTextEl = elements.overlayText;
  }

  render(model) {
    this._clear();
    this._drawFood(model.food);
    this._drawSnake(model.snake);
    this.scoreEl.textContent = String(model.score);
    this.bestEl.textContent = String(model.best);
  }

  showOverlay(text) {
    this.overlayTextEl.textContent = text;
    this.overlayEl.classList.remove("hidden");
  }

  hideOverlay() {
    this.overlayEl.classList.add("hidden");
  }

  _clear() {
    const { cols, rows, cellSize, colors } = this.config;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = colors.grid;
    this.ctx.lineWidth = 1;
    for (let x = 0; x <= cols; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * cellSize, 0);
      this.ctx.lineTo(x * cellSize, rows * cellSize);
      this.ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * cellSize);
      this.ctx.lineTo(cols * cellSize, y * cellSize);
      this.ctx.stroke();
    }
  }

  _drawSnake(snake) {
    snake.forEach((cell, index) => {
      const color =
        index === 0 ? this.config.colors.snakeHead : this.config.colors.snakeBody;
      this._drawCell(cell, color);
    });
  }

  _drawFood(food) {
    if (food) {
      this._drawCell(food, this.config.colors.food, true);
    }
  }

  _drawCell(cell, color, round) {
    const size = this.config.cellSize;
    const pad = 2;
    const x = cell.x * size + pad;
    const y = cell.y * size + pad;
    const side = size - pad * 2;
    this.ctx.fillStyle = color;
    const radius = round ? side / 2 : 4;
    this._roundRect(x, y, side, side, radius);
    this.ctx.fill();
  }

  _roundRect(x, y, w, h, r) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.arcTo(x + w, y, x + w, y + h, r);
    this.ctx.arcTo(x + w, y + h, x, y + h, r);
    this.ctx.arcTo(x, y + h, x, y, r);
    this.ctx.arcTo(x, y, x + w, y, r);
    this.ctx.closePath();
  }
}
