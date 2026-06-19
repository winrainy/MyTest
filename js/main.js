// 入口：装配 MVC 各部分。
window.addEventListener("DOMContentLoaded", () => {
  const model = new GameModel(GameConfig);

  const view = new GameView(GameConfig, {
    canvas: document.getElementById("board"),
    score: document.getElementById("score"),
    best: document.getElementById("best"),
    overlay: document.getElementById("overlay"),
    overlayText: document.getElementById("overlay-text"),
  });

  // eslint-disable-next-line no-new
  new GameController(model, view, {
    start: document.getElementById("start-btn"),
    pause: document.getElementById("pause-btn"),
  });
});
