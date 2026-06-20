// 屏幕分辨率（沿用 NES 的 256x240）与按键定义，供全局共用。
const NES = { WIDTH: 256, HEIGHT: 240 };

const BTN = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
  A: "a",
  B: "b",
  START: "start",
  SELECT: "select",
};

// 物理键（event.code）到逻辑按键的映射。
const KEY_MAP = {
  ArrowUp: BTN.UP,
  KeyW: BTN.UP,
  ArrowDown: BTN.DOWN,
  KeyS: BTN.DOWN,
  ArrowLeft: BTN.LEFT,
  KeyA: BTN.LEFT,
  ArrowRight: BTN.RIGHT,
  KeyD: BTN.RIGHT,
  KeyJ: BTN.A,
  KeyZ: BTN.A,
  KeyK: BTN.B,
  KeyX: BTN.B,
  Enter: BTN.START,
  ShiftLeft: BTN.SELECT,
  ShiftRight: BTN.SELECT,
};

// 带 CJK 回退的画布字体，避免中文显示为方块。
const FONT = (px) =>
  `${px}px "Noto Sans CJK SC","WenQuanYi Micro Hei","Microsoft YaHei",sans-serif`;
