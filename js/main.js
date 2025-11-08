// main.js (入口模块)
// 作用：初始化应用、协调各模块调用。
// ES Module: 通过 import/export 组织代码，避免全局污染。

import { renderBoard, renderStatus, renderModeControls } from './renderer.js';
import { initEvents, handleCellClick } from './events.js';

// 页面加载后启动初始化逻辑
window.addEventListener('DOMContentLoaded', () => { // DOMContentLoaded：HTML 解析完成后触发（不等待图片等资源）
  initEvents();
  renderBoard(handleCellClick); // 初次渲染棋盘
  renderStatus();
  renderModeControls();
});
