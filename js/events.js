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

// 音效相关：获取音频元素
const bgAudio = document.getElementById('bgAudio');
const placeAudio = document.getElementById('placeAudio');
const winAudio = document.getElementById('winAudio');

// 初始化事件绑定，并自动播放背景音乐（需用户首次交互后触发）
export function initEvents() {
  modeSelectEl.addEventListener('change', onModeChange);
  difficultySelectEl.addEventListener('change', onDifficultyChange);
  resetBtnEl.addEventListener('click', onReset);
  // 用户首次点击页面时，自动播放背景音乐（移动端需交互）
  document.body.addEventListener('click', tryPlayBgAudio, { once: true });
}

function tryPlayBgAudio() {
  if (bgAudio) {
    bgAudio.volume = 0.25;
    bgAudio.play().catch(() => {}); // 某些浏览器需用户交互
  }
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
  // 重置时停止胜利音效，重置落子音效
  if (winAudio) winAudio.pause();
  if (winAudio) winAudio.currentTime = 0;
}

// 玩家点击格子
function handleCellClick(index) {
  if (aiThinking) return;
  if (state.gameStatus !== 'playing') return;
  if (state.board[index] !== null) return;

  // 玩家落子
  state.board = applyMove(state.board, index, state.currentPlayer);
  // 播放落子音效
  if (placeAudio) {
    placeAudio.currentTime = 0;
    placeAudio.play().catch(() => {});
  }
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
    renderBoard(() => {});
    renderStatus();
    renderResult(winner, line);
    // 播放胜利音效
    if (winAudio) {
      winAudio.currentTime = 0;
      winAudio.play().catch(() => {});
    }
    return;
  }
  if (checkDraw(state.board)) {
    state.gameStatus = 'draw';
    renderStatus();
    renderResult(null, []);
    return;
  }
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
