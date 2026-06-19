// 全局游戏配置，供 Model / View / Controller 共用，避免魔法数字重复。
const GameConfig = {
  cols: 20,
  rows: 20,
  cellSize: 20,
  tickMs: 130,
  storageKey: "snake-best-score",
  colors: {
    snakeHead: "#22c55e",
    snakeBody: "#16a34a",
    food: "#f97316",
    grid: "#16213a",
  },
};

const Direction = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};
