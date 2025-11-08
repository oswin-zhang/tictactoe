# 井字棋网页游戏 (Tic Tac Toe)

## 项目简介
本项目是一个使用原生 HTML / CSS / JavaScript 构建的 3x3 井字棋网页游戏，支持本地双人对战以及多难度 AI（随机 / 启发式 / Minimax）。适配移动端显示，并包含基础动效与结构化代码设计。使用 GitHub Copilot 辅助加速开发与保持代码规范。

## 功能特性
- 回合提示：显示当前玩家 (X/O)
- 胜负判定：自动识别三连线胜利
- 平局判定：棋盘填满无胜者
- 重置：一键重新开始
- 人机对战：选择模式 PvE，并可设置 AI 难度
- 响应式布局：移动端良好显示
- 动效：落子缩放、高亮胜利线

## AI 难度说明
| 难度 | 策略 | 描述 |
|------|------|------|
| easy | 随机 | 从空格随机选择 |
| medium | 启发式 | 赢棋 > 阻挡 > 中心 > 角 > 边 |
| hard | Minimax | 穷举搜索最优，含 Alpha-Beta 剪枝 |

## 技术栈与设计
- 语言：HTML5 / CSS3 / 原生 ES Modules
- 模块划分：`state.js`, `logic.js`, `ai.js`, `renderer.js`, `events.js`, `main.js`
- 纯逻辑与渲染分离：便于测试与维护
- 可扩展：可添加比分、撤销功能、棋盘尺寸变更

## 目录结构
```
index.html
css/
  style.css
  animations.css
js/
  state.js
  logic.js
  ai.js
  renderer.js
  events.js
  main.js
assets/
  sounds/ (待添加音效文件)
  images/ (可选图像)
docs/
  COPILOT.md
screenshots/ (存放截图)
README.md
```

## 本地运行
直接使用浏览器打开 `index.html` 即可；或部署到 GitHub Pages。

## 后续可扩展建议
- 添加撤销/重做（保存历史快照）
- 增加比分持久化（localStorage）
- 支持 N x N 棋盘与可配置胜利长度
- 添加单元测试 (Jest + jsdom) 验证逻辑稳定性

## Copilot 使用说明概述
详见 `docs/COPILOT.md`。

## 许可
供学习与内部挑战赛使用。
