# FC 红白机游戏机 🎮

一个零依赖的网页版「红白机(FC)游戏机」,内置卡带选择菜单和 **3 个原创致敬版小游戏**:超级马里奥、坦克大战、魂斗罗。使用原生 HTML / CSS / JavaScript,按引擎 + MVC 思路组织。

> 说明:三款小游戏为**原创简化致敬版**(自绘像素方块画面、自写逻辑),并未使用任何原版素材或代码。

## 操作

界面上有仿 FC 手柄,也可用键盘:

| 操作 | 键盘 |
| --- | --- |
| 移动 / 菜单选择 | 方向键 或 `WASD` |
| A(射击 / 确认) | `J` 或 `Z` |
| B(跳跃 / 返回) | `K` 或 `X` |
| START(开始 / 重玩) | `Enter` |
| SELECT(返回菜单) | `Shift` |

## 三个游戏

- **超级马里奥**:左右移动 + `A` 跳跃,吃金币、踩扁敌人,抵达右侧旗杆通关。
- **坦克大战**:四向移动,`A` 射击,消灭 8 辆敌方坦克获胜。
- **魂斗罗**:`A` 横向射击、`B` 跳跃,击杀 15 名敌兵获胜。

## 运行

纯静态页面,任意静态服务器即可:

```bash
python3 -m http.server 8000
# 浏览器访问 http://localhost:8000
```

## 目录结构

```
index.html            FC 机身 + 屏幕(canvas) + 手柄
css/style.css         控制台与手柄样式
js/config.js          屏幕尺寸、按键映射、字体
js/engine/utils.js    碰撞/数学工具(共享复用)
js/engine/input.js    键盘 + 屏幕按钮输入管理
js/engine/game.js     游戏基类(统一接口与 HUD)
js/games/mario.js     超级马里奥
js/games/tank.js      坦克大战
js/games/contra.js    魂斗罗
js/console.js         控制台状态机 + 主循环
js/main.js            入口装配
```
