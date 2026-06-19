// Controller：连接 Model 与 View，处理输入、驱动游戏循环。
class GameController {
  constructor(model, view, buttons) {
    this.model = model;
    this.view = view;
    this.startBtn = buttons.start;
    this.pauseBtn = buttons.pause;
    this.timer = null;
    this.running = false;

    this._bindEvents();
    this.view.render(this.model);
    this.view.showOverlay("准备好了吗？");
  }

  start() {
    this.model.reset();
    this.view.hideOverlay();
    this.view.render(this.model);
    this.running = true;
    this.pauseBtn.disabled = false;
    this.pauseBtn.textContent = "暂停";
    this._startTimer();
  }

  togglePause() {
    if (this.model.gameOver) return;
    if (this.running) {
      this.running = false;
      this._stopTimer();
      this.pauseBtn.textContent = "继续";
      this.view.showOverlay("已暂停");
    } else {
      this.running = true;
      this.view.hideOverlay();
      this.pauseBtn.textContent = "暂停";
      this._startTimer();
    }
  }

  _tick() {
    const result = this.model.step();
    this.view.render(this.model);
    if (result.gameOver) {
      this._endGame();
    }
  }

  _endGame() {
    this.running = false;
    this._stopTimer();
    this.pauseBtn.disabled = true;
    this.view.showOverlay(`游戏结束 · 得分 ${this.model.score}`);
  }

  _startTimer() {
    this._stopTimer();
    this.timer = window.setInterval(() => this._tick(), this.model.config.tickMs);
  }

  _stopTimer() {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  _bindEvents() {
    this.startBtn.addEventListener("click", () => this.start());
    this.pauseBtn.addEventListener("click", () => this.togglePause());
    window.addEventListener("keydown", (e) => this._onKeyDown(e));
  }

  _onKeyDown(event) {
    const dir = this._keyToDirection(event.key);
    if (dir) {
      event.preventDefault();
      this.model.queueDirection(dir);
      return;
    }
    if (event.key === " " || event.code === "Space") {
      event.preventDefault();
      if (this.model.gameOver || !this.timer) {
        this.start();
      } else {
        this.togglePause();
      }
    }
  }

  _keyToDirection(key) {
    switch (key) {
      case "ArrowUp":
      case "w":
      case "W":
        return Direction.UP;
      case "ArrowDown":
      case "s":
      case "S":
        return Direction.DOWN;
      case "ArrowLeft":
      case "a":
      case "A":
        return Direction.LEFT;
      case "ArrowRight":
      case "d":
      case "D":
        return Direction.RIGHT;
      default:
        return null;
    }
  }
}
