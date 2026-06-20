// 输入管理：聚合键盘与屏幕手柄按钮，提供「按住」与「刚按下」两种查询。
class InputManager {
  constructor() {
    this.state = {};
    this.prev = {};
    Object.values(BTN).forEach((b) => {
      this.state[b] = false;
      this.prev[b] = false;
    });
    this._bindKeyboard();
  }

  _bindKeyboard() {
    window.addEventListener("keydown", (e) => {
      const b = KEY_MAP[e.code];
      if (b) {
        e.preventDefault();
        this.state[b] = true;
      }
    });
    window.addEventListener("keyup", (e) => {
      const b = KEY_MAP[e.code];
      if (b) {
        e.preventDefault();
        this.state[b] = false;
      }
    });
  }

  // 把一个 DOM 按钮绑定到逻辑按键（支持触屏与鼠标）。
  bindButton(el, btn) {
    const set = (v) => (e) => {
      e.preventDefault();
      this.state[btn] = v;
    };
    el.addEventListener("pointerdown", set(true));
    el.addEventListener("pointerup", set(false));
    el.addEventListener("pointerleave", set(false));
    el.addEventListener("pointercancel", set(false));
  }

  isDown(b) {
    return !!this.state[b];
  }

  // 仅在本帧由「未按」变为「按下」时为真，用于一次性触发。
  pressed(b) {
    return !!this.state[b] && !this.prev[b];
  }

  // 每帧末调用，保存上一帧状态以计算边沿。
  lateUpdate() {
    Object.keys(this.state).forEach((k) => {
      this.prev[k] = this.state[k];
    });
  }
}
