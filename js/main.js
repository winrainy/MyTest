// 入口：装配输入、绑定屏幕手柄、启动控制台主循环。
window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("screen");
  const input = new InputManager();

  const buttonMap = {
    "btn-up": BTN.UP,
    "btn-down": BTN.DOWN,
    "btn-left": BTN.LEFT,
    "btn-right": BTN.RIGHT,
    "btn-a": BTN.A,
    "btn-b": BTN.B,
    "btn-start": BTN.START,
    "btn-select": BTN.SELECT,
  };
  Object.entries(buttonMap).forEach(([id, btn]) => {
    const el = document.getElementById(id);
    if (el) input.bindButton(el, btn);
  });

  const fc = new GameConsole(canvas, input);
  fc.start();
});
