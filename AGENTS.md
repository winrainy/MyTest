# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **zero-dependency static web app** (原生 HTML/CSS/JS,无构建、无包管理器、无 lint/测试框架)。一个网页版「红白机(FC)」,内置 3 个小游戏(超级马里奥 / 坦克大战 / 魂斗罗),按引擎 + MVC 思路组织。详见 `README.md`。

### 运行(开发模式)
- 任意静态服务器即可,标准命令见 `README.md`:`python3 -m http.server 8000`,浏览器访问 `http://localhost:8000`。
- 没有 build / lint / test 命令;CI 仅 `.github/workflows/deploy-pages.yml`,把仓库根目录部署到 GitHub Pages(push 到 `main` 时触发)。

### 非显而易见的注意点
- `index.html` 用一组**经典 `<script>` 标签按固定顺序**加载(无模块/打包器):`config → engine/utils → engine/input → engine/game → games/* → console → main`。各文件顶层的 `class` / `const`(如 `NES`、`BTN`、`Utils`、`BaseGame`、各游戏类)通过全局词法环境共享,**加载顺序不能乱**。新增脚本要同步加到 `index.html`。
- **自动化 GUI 工具难以驱动游戏**:移动需要按键在多帧(60fps)内"持续按住"(`input.isDown`),菜单用的是边沿检测(`input.pressed`)。发送瞬时 keydown/keyup 的自动化工具(computer use)只能确认单次按键,无法做持续移动/连跳。要做无头验证,直接用合成 input 对象(实现 `isDown`/`pressed`)去驱动游戏类的 `update()`/`render()` 即可(本次环境搭建即如此校验三处修复)。
- 画布坐标系沿用 NES 的 `256x240`(见 `js/config.js` 的 `NES`)。马里奥/魂斗罗用 `camX` + `ctx.translate(-camX)` 做横向滚动,世界坐标与屏幕坐标要区分。
