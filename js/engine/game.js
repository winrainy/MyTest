// 游戏基类：定义控制台调用的统一接口。
// 子类需实现 reset / update / render，并维护 done(是否结束) 与 win(是否胜利)。
class BaseGame {
  constructor() {
    this.done = false;
    this.win = false;
  }

  reset() {
    this.done = false;
    this.win = false;
  }

  update(/* dt, input */) {}

  render(/* ctx */) {}

  // 各游戏统一的 HUD：左上角分数，可选生命与目标。
  drawHud(ctx, opts) {
    ctx.fillStyle = "#fff";
    ctx.font = FONT(8);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("分数 " + opts.score, 6, 12);
    if (opts.lives != null) ctx.fillText("生命 " + opts.lives, 6, 22);
    if (opts.right) {
      ctx.textAlign = "right";
      ctx.fillText(opts.right, NES.WIDTH - 6, 12);
    }
  }
}
