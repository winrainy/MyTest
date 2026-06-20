// 控制台：管理「卡带菜单 → 游戏 → 结算」状态机，并驱动主循环。
class GameConsole {
  constructor(canvas, input) {
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.input = input;
    this.games = [
      { title: MarioGame.title, factory: () => new MarioGame() },
      { title: TankGame.title, factory: () => new TankGame() },
      { title: ContraGame.title, factory: () => new ContraGame() },
    ];
    this.mode = "menu"; // menu | play | result
    this.menuIndex = 0;
    this.current = null;
    this.last = performance.now();
    this._loop = this._loop.bind(this);
  }

  start() {
    requestAnimationFrame(this._loop);
  }

  _loop(now) {
    let dt = (now - this.last) / 1000;
    this.last = now;
    if (dt > 0.05) dt = 0.05; // 防止切后台后大跳帧
    this._update(dt);
    this._render();
    this.input.lateUpdate();
    requestAnimationFrame(this._loop);
  }

  _update(dt) {
    const inp = this.input;
    if (this.mode === "menu") {
      if (inp.pressed(BTN.UP)) {
        this.menuIndex = (this.menuIndex + this.games.length - 1) % this.games.length;
      }
      if (inp.pressed(BTN.DOWN)) {
        this.menuIndex = (this.menuIndex + 1) % this.games.length;
      }
      if (inp.pressed(BTN.START) || inp.pressed(BTN.A)) {
        this.current = this.games[this.menuIndex].factory();
        this.mode = "play";
      }
    } else if (this.mode === "play") {
      this.current.update(dt, inp);
      if (this.current.done) this.mode = "result";
      else if (inp.pressed(BTN.SELECT)) this.mode = "menu";
    } else if (this.mode === "result") {
      if (inp.pressed(BTN.START) || inp.pressed(BTN.A)) {
        this.current.reset();
        this.mode = "play";
      } else if (inp.pressed(BTN.SELECT) || inp.pressed(BTN.B)) {
        this.mode = "menu";
      }
    }
  }

  _render() {
    const ctx = this.ctx;
    if (this.mode === "menu") {
      this._renderMenu(ctx);
      return;
    }
    this.current.render(ctx);
    if (this.mode === "result") this._renderResult(ctx);
  }

  _renderMenu(ctx) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, NES.WIDTH, NES.HEIGHT);
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "#e60012";
    ctx.font = FONT(18);
    ctx.fillText("红 白 机", NES.WIDTH / 2, 44);
    ctx.fillStyle = "#888";
    ctx.font = FONT(9);
    ctx.fillText("FC GAME CONSOLE", NES.WIDTH / 2, 60);

    this.games.forEach((g, i) => {
      const y = 100 + i * 26;
      const sel = i === this.menuIndex;
      ctx.fillStyle = sel ? "#fcd800" : "#fff";
      ctx.font = FONT(13);
      ctx.fillText((sel ? "▶ " : "   ") + (i + 1) + ". " + g.title, NES.WIDTH / 2, y);
    });

    ctx.fillStyle = "#888";
    ctx.font = FONT(8);
    ctx.fillText("方向键选择   A / START 开始", NES.WIDTH / 2, 208);
    ctx.fillText("游戏中 SELECT 返回菜单", NES.WIDTH / 2, 222);
  }

  _renderResult(ctx) {
    ctx.fillStyle = "rgba(0,0,0,0.72)";
    ctx.fillRect(0, 0, NES.WIDTH, NES.HEIGHT);
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = this.current.win ? "#fcd800" : "#e60012";
    ctx.font = FONT(18);
    ctx.fillText(this.current.win ? "通关胜利!" : "游戏结束", NES.WIDTH / 2, 108);

    ctx.fillStyle = "#fff";
    ctx.font = FONT(10);
    ctx.fillText("分数 " + this.current.score, NES.WIDTH / 2, 132);
    ctx.fillStyle = "#bbb";
    ctx.font = FONT(8);
    ctx.fillText("A / START 重玩     SELECT / B 返回菜单", NES.WIDTH / 2, 156);
  }
}
