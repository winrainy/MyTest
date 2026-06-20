// 横版跑射游戏：左右移动、跳跃躲避、横向射击，击杀指定数量敌兵获胜。
class ContraGame extends BaseGame {
  static get title() {
    return "魂斗罗";
  }

  constructor() {
    super();
    this.groundY = 200;
    this.reset();
  }

  reset() {
    super.reset();
    this.player = {
      x: 40, y: this.groundY - 18, w: 12, h: 18,
      vx: 0, vy: 0, onGround: true, facing: 1, cd: 0,
    };
    this.bullets = [];
    this.eBullets = [];
    this.enemies = [];
    this.score = 0;
    this.lives = 3;
    this.killed = 0;
    this.toWin = 15;
    this.spawnTimer = 1;
  }

  update(dt, input) {
    if (this.done) return;
    const p = this.player;

    p.vx = 0;
    if (input.isDown(BTN.LEFT)) { p.vx = -72; p.facing = -1; }
    if (input.isDown(BTN.RIGHT)) { p.vx = 72; p.facing = 1; }
    if (input.pressed(BTN.B) && p.onGround) { p.vy = -205; p.onGround = false; }

    p.vy += 520 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.y + p.h >= this.groundY) {
      p.y = this.groundY - p.h;
      p.vy = 0;
      p.onGround = true;
    }
    p.x = Utils.clamp(p.x, 0, NES.WIDTH - p.w);

    p.cd -= dt;
    if (input.isDown(BTN.A) && p.cd <= 0) {
      p.cd = 0.25;
      this.bullets.push({
        x: p.facing > 0 ? p.x + p.w : p.x - 4,
        y: p.y + 5,
        vx: p.facing * 220,
      });
    }

    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0 && this.killed + this.enemies.length < this.toWin) {
      this.spawnTimer = Utils.rand(1.0, 1.8);
      const fromLeft = Math.random() < 0.5;
      this.enemies.push({
        x: fromLeft ? -14 : NES.WIDTH + 2,
        y: this.groundY - 16,
        w: 12, h: 16,
        vx: fromLeft ? 32 : -32,
        facing: fromLeft ? 1 : -1,
        cd: Utils.rand(1, 2),
      });
    }

    this.bullets.forEach((b) => { b.x += b.vx * dt; });
    this.bullets = this.bullets.filter((b) => b.x > -4 && b.x < NES.WIDTH + 4);
    this.eBullets.forEach((b) => { b.x += b.vx * dt; });
    this.eBullets = this.eBullets.filter((b) => b.x > -4 && b.x < NES.WIDTH + 4);

    this.enemies.forEach((e) => {
      e.x += e.vx * dt;
      e.cd -= dt;
      if (e.cd <= 0 && e.x > 0 && e.x < NES.WIDTH) {
        e.cd = Utils.rand(1.2, 2.6);
        this.eBullets.push({ x: e.x + e.w / 2, y: e.y + 6, vx: e.facing * 150 });
      }
    });

    this.bullets = this.bullets.filter((b) => {
      const box = { x: b.x, y: b.y, w: 4, h: 2 };
      for (const e of this.enemies) {
        if (!e.dead && Utils.aabb(box, e)) {
          e.dead = true;
          this.score += 100;
          this.killed += 1;
          return false;
        }
      }
      return true;
    });

    this.eBullets = this.eBullets.filter((b) => {
      if (Utils.aabb({ x: b.x, y: b.y, w: 4, h: 2 }, this.player)) {
        this._hurt();
        return false;
      }
      return true;
    });

    this.enemies.forEach((e) => {
      if (!e.dead && Utils.aabb(this.player, e)) {
        this._hurt();
        e.dead = true;
      }
    });
    this.enemies = this.enemies.filter((e) => !e.dead && e.x > -20 && e.x < NES.WIDTH + 20);

    if (this.killed >= this.toWin) { this.done = true; this.win = true; }
  }

  _hurt() {
    this.lives -= 1;
    if (this.lives <= 0) { this.done = true; this.win = false; }
    else {
      const p = this.player;
      p.x = 40;
      p.y = this.groundY - p.h;
      p.vy = 0;
    }
  }

  render(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, NES.HEIGHT);
    g.addColorStop(0, "#102040");
    g.addColorStop(1, "#284070");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, NES.WIDTH, NES.HEIGHT);

    ctx.fillStyle = "#205020";
    ctx.fillRect(0, this.groundY, NES.WIDTH, NES.HEIGHT - this.groundY);
    ctx.fillStyle = "#308030";
    ctx.fillRect(0, this.groundY, NES.WIDTH, 4);

    const p = this.player;
    ctx.fillStyle = "#f0d0a0";
    ctx.fillRect(p.x, p.y, p.w, 6);
    ctx.fillStyle = "#1060d0";
    ctx.fillRect(p.x, p.y + 6, p.w, p.h - 6);
    ctx.fillStyle = "#f0d0a0";
    ctx.fillRect(p.facing > 0 ? p.x + p.w : p.x - 4, p.y + 7, 4, 2);

    this.enemies.forEach((e) => {
      ctx.fillStyle = "#c02020";
      ctx.fillRect(e.x, e.y, e.w, e.h);
      ctx.fillStyle = "#000";
      ctx.fillRect(e.x + 2, e.y + 2, e.w - 4, 3);
    });

    ctx.fillStyle = "#ffff80";
    this.bullets.forEach((b) => ctx.fillRect(b.x, b.y, 4, 2));
    ctx.fillStyle = "#ff6060";
    this.eBullets.forEach((b) => ctx.fillRect(b.x, b.y, 4, 2));

    this.drawHud(ctx, {
      score: this.score,
      lives: this.lives,
      right: "击杀 " + this.killed + "/" + this.toWin,
    });
  }
}
