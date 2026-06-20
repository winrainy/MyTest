// 共享工具函数：碰撞检测与数学辅助，全部游戏复用（DRY）。
const Utils = {
  clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  },

  // 轴对齐包围盒碰撞，参数为 {x,y,w,h}。
  aabb(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  },

  rand(min, max) {
    return Math.random() * (max - min) + min;
  },

  randInt(min, max) {
    return Math.floor(Utils.rand(min, max + 1));
  },

  pick(arr) {
    return arr[Utils.randInt(0, arr.length - 1)];
  },
};
