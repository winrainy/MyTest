# 贪吃蛇 Snake 🐍

一个零依赖的网页版贪吃蛇小游戏，使用原生 HTML / CSS / JavaScript 编写，按 MVC 模式组织。

## 玩法

- 方向键 或 `WASD` 控制移动方向
- `空格` 暂停 / 继续（游戏结束时按空格重新开始）
- 吃到橙色食物得分，撞墙或撞到自己则游戏结束
- 最高分会保存在浏览器 `localStorage` 中

## 运行

这是纯静态页面，用任意静态服务器打开即可：

```bash
python3 -m http.server 8000
# 然后浏览器访问 http://localhost:8000
```

## 目录结构（MVC）

```
index.html        页面骨架
css/style.css     样式
js/config.js      全局配置与方向常量
js/model.js       Model：游戏状态与规则
js/view.js        View：画布与 DOM 渲染
js/controller.js  Controller：输入处理与游戏循环
js/main.js        入口：装配 MVC
```
