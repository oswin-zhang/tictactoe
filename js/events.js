// events.js
// 作用：集中管理事件绑定，事件与逻辑/渲染解耦。
// 事件(Event)：用户交互（点击、输入）或系统触发的动作，可监听并执行回调。

import { state, resetState } from './state.js';
import { applyMove, checkWinner, checkDraw, togglePlayer } from './logic.js';
import { renderBoard, renderStatus, renderResult, clearResult, renderModeControls } from './renderer.js';
import { getAIMove } from './ai.js';

const modeSelectEl = document.getElementById('modeSelect');
const difficultySelectEl = document.getElementById('difficultySelect');
const resetBtnEl = document.getElementById('resetBtn');

let aiThinking = false; // 防止重复点击期间 AI 仍在计算

export function initEvents() {
  modeSelectEl.addEventListener('change', onModeChange);
  difficultySelectEl.addEventListener('change', onDifficultyChange);
  resetBtnEl.addEventListener('click', onReset);
}

function onModeChange() {
  state.mode = modeSelectEl.value; // 更新模式
  if (state.mode === 'pve') {
    // 切到人机：保证玩家先手 X
    state.currentPlayer = 'X';
  }
  onReset(); // 模式切换时重置棋盘
  renderModeControls();
}

function onDifficultyChange() {
  state.difficulty = difficultySelectEl.value;
}

function onReset() {
  resetState();
  aiThinking = false;
  clearResult();
  renderBoard(handleCellClick);
  renderStatus();
  renderModeControls();
}

// 玩家点击格子
function handleCellClick(index) {
  if (aiThinking) return; // AI 正在思考则忽略
  if (state.gameStatus !== 'playing') return;
  if (state.board[index] !== null) return; // 已被占用

  // 玩家落子
  state.board = applyMove(state.board, index, state.currentPlayer);
  postMoveUpdate();

  // 若是人机模式且游戏未结束，则 AI 行动
  if (state.mode === 'pve' && state.gameStatus === 'playing') {
    aiMoveAsync();
  }
}

function postMoveUpdate() {
  const { winner, line } = checkWinner(state.board);
  if (winner) {
    state.gameStatus = 'win';
    state.winner = winner;
    state.scores[winner]++;
    renderBoard(() => {}); // 禁止继续点击
    renderStatus();
    renderResult(winner, line);
    return;
  }
  if (checkDraw(state.board)) {
    state.gameStatus = 'draw';
    renderStatus();
    renderResult(null, []);
    return;
  }
  // 切换玩家
  state.currentPlayer = togglePlayer(state.currentPlayer);
  renderBoard(handleCellClick);
  renderStatus();
}

// AI 异步行动：使用 setTimeout 模拟“思考”延迟，提升体验
async function aiMoveAsync() {
  aiThinking = true;
  // 延迟 300ms 模拟 AI 计算过程（真实 Minimax 对 3x3 几乎瞬间完成）
  await new Promise(r => setTimeout(r, 300));
  const aiPlayer = state.currentPlayer; // AI 总是在当前玩家轮到的时候执行
  const moveIndex = getAIMove(state.board, aiPlayer, state.difficulty);
  state.board = applyMove(state.board, moveIndex, aiPlayer);
  aiThinking = false;
  postMoveUpdate();
}

export { handleCellClick }; // 仅供 renderer 初次渲染绑定
