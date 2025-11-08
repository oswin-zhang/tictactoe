// renderer.js
// 作用：负责 DOM 更新（渲染）。逻辑与视图分离，提高可维护性。
// DOM(Document Object Model)：浏览器中页面元素的对象表示，允许 JS 操作节点。

import { state } from './state.js';

const boardEl = document.getElementById('board');
const turnIndicatorEl = document.getElementById('turnIndicator');
const resultPanelEl = document.getElementById('resultPanel');
const resultMessageEl = document.getElementById('resultMessage');
const difficultyGroupEl = document.getElementById('difficultyGroup');

// 渲染棋盘：根据 state.board 创建或更新格子
export function renderBoard(onCellClick) {
  boardEl.innerHTML = ''; // 清空
  state.board.forEach((value, index) => {
    const btn = document.createElement('button');
    btn.className = 'cell';
    btn.setAttribute('role', 'gridcell'); // 辅助可访问性
    btn.setAttribute('aria-label', `格子 ${index}`);
    if (value) {
      btn.textContent = value;
      btn.classList.add('filled', 'scale-pop');
      // 根据 X/O 添加不同颜色类
      if (value === 'X') btn.classList.add('x');
      if (value === 'O') btn.classList.add('o');
    }
    if (state.gameStatus !== 'playing' || value) {
      // 游戏结束或已被占用：禁用点击
      btn.disabled = true;
    }
    btn.addEventListener('click', () => onCellClick(index));
    boardEl.appendChild(btn);
  });
}

// 回合与状态指示
export function renderStatus() {
  if (state.gameStatus === 'playing') {
    turnIndicatorEl.textContent = `当前玩家：${state.currentPlayer}`;
  } else if (state.gameStatus === 'win') {
    turnIndicatorEl.textContent = `胜利者：${state.winner}`;
  } else if (state.gameStatus === 'draw') {
    turnIndicatorEl.textContent = '平局';
  }
}

// 显示结果
export function renderResult(winner, line) {
  if (state.gameStatus === 'win') {
    resultMessageEl.textContent = `玩家 ${winner} 获胜！`;
    resultPanelEl.hidden = false;
    highlightWin(line);
  } else if (state.gameStatus === 'draw') {
    resultMessageEl.textContent = '平局，无剩余可落子。';
    resultPanelEl.hidden = false;
  } else {
    resultPanelEl.hidden = true;
  }
}

// 高亮获胜组合
function highlightWin(line) {
  if (!line || line.length === 0) return;
  const cells = [...boardEl.children];
  line.forEach(i => {
    const cell = cells[i];
    if (cell) cell.classList.add('win');
  });
}

// 模式 / 难度 可见性控制
export function renderModeControls() {
  if (state.mode === 'pve') {
    difficultyGroupEl.style.display = 'flex';
  } else {
    difficultyGroupEl.style.display = 'none';
  }
}

// 重置结果区域
export function clearResult() {
  resultPanelEl.hidden = true;
  resultMessageEl.textContent = '';
}
