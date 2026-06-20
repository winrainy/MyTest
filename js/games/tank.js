// 坦克大战：四向移动与射击，消灭指定数量敌方坦克获胜。
class TankGame extends BaseGame {
  static get title() {
    return "坦克大战";
  }

  constructor() {
    super();
    this.reset();
  }

  reset() {
    super.reset();
    this.player = {
      x: 120, y: 210, w: 16, h: 16,
      dir: { x: 0, y: -1 }, speed: 62, cd: 0,
    };
    this.bullets = [];
    this.enemies = [];
    this.walls = [
      { x: 40, y: 90, w: 16, h: 48 },
      { x: 120, y: 60, w: 16, h: 48 },
      { x: 200, y: 90, w: 16, h: 48 },
      { x: 70, y: 150, w: 48, h: 14 },
      { x: 140, y: 150, w: 48, h: 14 },
    ];
    this.score = 0;
    this.lives = 3;
    this.killed = 0;
    this.toWin = 8;
    this.spawnTimer = 0.5;
    this.maxEnemies = 4;
  }

  update(dt, input) {
    if (this.done) return;
    const p = this.player;

    let dx = 0;
    let dy = 0;
    if (input.isDown(BTN.UP)) dy = -1;
    else if (input.isDown(BTN.DOWN)) dy = 1;
    else if (input.isDown(BTN.LEFT)) dx = -1;
    else if (input.isDown(BTN.RIGHT)) dx = 1;

    if (dx || dy) {
      p.dir = { x: dx, y: dy };
      const nx = p.x + dx * p.speed * dt;
      const ny = p.y + dy * p.speed * dt;
      if (!this._blocked(nx, p.y, p, this.player)) p.x = nx;
      if (!this._blocked(p.x, ny, p, this.player)) p.y = ny;
      p.x = Utils.clamp(p.x, 0, NES.WIDTH - p.w);
      p.y = Utils.clamp(p.y, 16, NES.HEIGHT - p.h);
    }

    p.cd -= dt;
    if (input.isDown(BTN.A) && p.cd <= 0) {
      this._fire(p, "player");
      p.cd = 0.45;
    }

    this.spawnTimer -= dt;
    const onField = this.killed + this.enemies.length;
    if (this.spawnTimer <= 0 && this.enemies.length < this.maxEnemies && onField < this.toWin) {
      this.spawnTimer = 1.6;
      const spot = Utils.pick([{ x: 8, y: 20 }, { x: 120, y: 20 }, { x: 232, y: 20 }]);
      this.enemies.push({
        x: spot.x, y: spot.y, w: 16, h: 16,
        dir: { x: 0, y: 1 }, speed: 36, cd: Utils.rand(0.6, 1.6), think: 0,
      });
    }

    this.enemies.forEach((e) => {
      e.think -= dt;
      if (e.think <= 0) {
        e.think = Utils.rand(0.6, 1.6);
        e.dir = Utils.pick([{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }]);
      }
      const nx = e.x + e.dir.x * e.speed * dt;
      const ny = e.y + e.dir.y * e.speed * dt;
      if (!this._blocked(nx, e.y, e, e) && nx >= 0 && nx <= NES.WIDTH - e.w) e.x = nx;
      else e.think = 0;
      if (!this._blocked(e.x, ny, e, e) && ny >= 16 && ny <= NES.HEIGHT - e.h) e.y = ny;
      else e.think = 0;
      e.cd -= dt;
      if (e.cd <= 0) {
        e.cd = Utils.rand(1.2, 2.4);
        this._fire(e, "enemy");
      }
    });

    this.bullets.forEach((b) => {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
    });
    this.bullets = this.bullets.filter((b) => this._bulletAlive(b));

    this.enemies = this.enemies.filter((e) => !e.dead);
    if (this.killed >= this.toWin) { this.done = true; this.win = true; }
  }

  _bulletAlive(b) {
    if (b.x < 0 || b.x > NES.WIDTH || b.y < 0 || b.y > NES.HEIGHT) return false;
    const box = { x: b.x - 1, y: b.y - 1, w: 3, h: 3 };
    for (const w of this.walls) if (Utils.aabb(box, w)) return false;
    if (b.from === "player") {
      for (const e of this.enemies) {
        if (!e.dead && Utils.aabb(box, e)) {
          e.dead = true;
          this.score += 100;
          this.killed += 1;
          return false;
        }
      }
    } else if (Utils.aabb(box, this.player)) {
      this._hurt();
      return false;
    }
    return true;
  }

  _fire(t, from) {
    const speed = from === "player" ? 185 : 120;
    this.bullets.push({
      x: t.x + t.w / 2,
      y: t.y + t.h / 2,
      vx: t.dir.x * speed,
      vy: t.dir.y * speed,
      from,
    });
  }

  // 检测坦克移动到 (x,y) 是否被墙或其他坦克挡住。
  _blocked(x, y, size, self) {
    const r = { x, y, w: size.w, h: size.h };
    for (const w of this.walls) if (Utils.aabb(r, w)) return true;
    const others = [this.player, ...this.enemies].filter((o) => o !== self && !o.dead);
    for (const o of others) if (Utils.aabb(r, o)) return true;
    return false;
  }

  _hurt() {
    this.lives -= 1;
    if (this.lives <= 0) { this.done = true; this.win = false; }
    else { this.player.x = 120; this.player.y = 210; }
  }

  render(ctx) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, NES.WIDTH, NES.HEIGHT);

    this.walls.forEach((w) => {
      ctx.fillStyle = "#7d2b1c";
      ctx.fillRect(w.x, w.y, w.w, w.h);
      ctx.fillStyle = "#c46a4a";
      for (let i = 0; i < w.w; i += 8) {
        for (let j = 0; j < w.h; j += 8) {
          ctx.fillRect(w.x + i + 1, w.y + j + 1, 6, 6);
        }
      }
    });

    this._tank(ctx, this.player, "#f8d038", "#a86800");
    this.enemies.forEach((e) => this._tank(ctx, e, "#9aa0a8", "#4a4f57"));

    ctx.fillStyle = "#fff";
    this.bullets.forEach((b) => ctx.fillRect(b.x - 1, b.y - 1, 3, 3));

    this.drawHud(ctx, {
      score: this.score,
      lives: this.lives,
      right: "剩余敌人 " + (this.toWin - this.killed),
    });
  }

  _tank(ctx, t, body, track) {
    ctx.fillStyle = track;
    ctx.fillRect(t.x, t.y, t.w, t.h);
    ctx.fillStyle = body;
    ctx.fillRect(t.x + 3, t.y + 3, t.w - 6, t.h - 6);
    const cx = t.x + t.w / 2;
    const cy = t.y + t.h / 2;
    ctx.fillRect(cx - 2 + t.dir.x * 5, cy - 2 + t.dir.y * 5, 4, 4);
  }
}
