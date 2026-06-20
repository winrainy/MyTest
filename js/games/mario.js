// 横版跳台游戏：移动跳跃、吃金币、踩怪、抵达旗杆通关。
class MarioGame extends BaseGame {
  static get title() {
    return "超级马里奥";
  }

  constructor() {
    super();
    this.levelWidth = 1600;
    this.reset();
  }

  reset() {
    super.reset();
    this.player = {
      x: 30, y: 180, w: 12, h: 14,
      vx: 0, vy: 0, onGround: false, facing: 1,
    };
    this.camX = 0;
    this.score = 0;
    this.lives = 3;
    this.solids = [
      { x: 0, y: 212, w: this.levelWidth, h: 28 },
      { x: 220, y: 170, w: 60, h: 10 },
      { x: 360, y: 140, w: 60, h: 10 },
      { x: 520, y: 170, w: 80, h: 10 },
      { x: 760, y: 150, w: 70, h: 10 },
      { x: 980, y: 175, w: 90, h: 10 },
      { x: 1200, y: 150, w: 80, h: 10 },
    ];
    this.coins = [
      { x: 240, y: 150, r: 5, got: false },
      { x: 380, y: 120, r: 5, got: false },
      { x: 545, y: 150, r: 5, got: false },
      { x: 790, y: 130, r: 5, got: false },
      { x: 1010, y: 155, r: 5, got: false },
      { x: 1230, y: 130, r: 5, got: false },
    ];
    this.enemies = [
      { x: 560, y: 198, w: 14, h: 14, vx: -22, alive: true, min: 520, max: 600 },
      { x: 1000, y: 198, w: 14, h: 14, vx: 25, alive: true, min: 980, max: 1070 },
    ];
    this.flag = { x: 1520, y: 120, w: 6, h: 92 };
  }

  update(dt, input) {
    if (this.done) return;
    const p = this.player;

    p.vx = 0;
    if (input.isDown(BTN.LEFT)) { p.vx = -80; p.facing = -1; }
    if (input.isDown(BTN.RIGHT)) { p.vx = 80; p.facing = 1; }
    if (input.pressed(BTN.A) && p.onGround) { p.vy = -185; p.onGround = false; }

    p.vy = Math.min(p.vy + 480 * dt, 260);

    p.x += p.vx * dt;
    this._resolve(p, "x");
    p.y += p.vy * dt;
    p.onGround = false;
    this._resolve(p, "y");
    p.x = Utils.clamp(p.x, 0, this.levelWidth - p.w);

    this.coins.forEach((c) => {
      const box = { x: c.x - c.r, y: c.y - c.r, w: c.r * 2, h: c.r * 2 };
      if (!c.got && Utils.aabb(p, box)) {
        c.got = true;
        this.score += 100;
      }
    });

    this.enemies.forEach((e) => {
      if (!e.alive) return;
      e.x += e.vx * dt;
      if (e.x < e.min) { e.x = e.min; e.vx *= -1; }
      if (e.x + e.w > e.max) { e.x = e.max - e.w; e.vx *= -1; }
      if (Utils.aabb(p, e)) {
        const stomp = p.vy > 0 && p.y + p.h - e.y < 8;
        if (stomp) { e.alive = false; this.score += 200; p.vy = -150; }
        else this._hurt();
      }
    });

    if (Utils.aabb(p, this.flag)) { this.done = true; this.win = true; }

    this.camX = Utils.clamp(p.x - 110, 0, this.levelWidth - NES.WIDTH);
  }

  _hurt() {
    this.lives -= 1;
    if (this.lives <= 0) { this.done = true; this.win = false; }
    else {
      const p = this.player;
      p.x = 30; p.y = 180; p.vx = 0; p.vy = 0;
    }
  }

  // 单轴碰撞解析：按移动方向把玩家推出实体方块。
  _resolve(p, axis) {
    for (const s of this.solids) {
      if (!Utils.aabb(p, s)) continue;
      if (axis === "x") {
        if (p.vx > 0) p.x = s.x - p.w;
        else if (p.vx < 0) p.x = s.x + s.w;
        p.vx = 0;
      } else {
        if (p.vy > 0) { p.y = s.y - p.h; p.onGround = true; }
        else if (p.vy < 0) p.y = s.y + s.h;
        p.vy = 0;
      }
    }
  }

  render(ctx) {
    ctx.fillStyle = "#5c94fc";
    ctx.fillRect(0, 0, NES.WIDTH, NES.HEIGHT);

    ctx.save();
    ctx.translate(-Math.round(this.camX), 0);

    this.solids.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? "#c84c0c" : "#e09040";
      ctx.fillRect(s.x, s.y, s.w, s.h);
      if (i === 0) {
        ctx.fillStyle = "#7cca3c";
        ctx.fillRect(s.x, s.y, s.w, 4);
      }
    });

    ctx.fillStyle = "#bbb";
    ctx.fillRect(this.flag.x, this.flag.y, this.flag.w, this.flag.h);
    ctx.fillStyle = "#00a800";
    ctx.fillRect(this.flag.x + this.flag.w, this.flag.y, 18, 12);

    this.coins.forEach((c) => {
      if (c.got) return;
      ctx.fillStyle = "#fcd800";
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, 7);
      ctx.fill();
    });

    this.enemies.forEach((e) => {
      if (!e.alive) return;
      ctx.fillStyle = "#8b4513";
      ctx.fillRect(e.x, e.y, e.w, e.h);
      ctx.fillStyle = "#fff";
      ctx.fillRect(e.x + 2, e.y + 3, 3, 3);
      ctx.fillRect(e.x + e.w - 5, e.y + 3, 3, 3);
    });

    const p = this.player;
    ctx.fillStyle = "#d82800";
    ctx.fillRect(p.x, p.y, p.w, 5);
    ctx.fillStyle = "#fcb070";
    ctx.fillRect(p.x + 2, p.y + 5, p.w - 4, 4);
    ctx.fillStyle = "#0058f8";
    ctx.fillRect(p.x, p.y + 9, p.w, p.h - 9);

    ctx.restore();

    this.drawHud(ctx, {
      score: this.score,
      lives: this.lives,
      right: "★ 抵达旗杆",
    });
  }
}
