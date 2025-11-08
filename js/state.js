// state.js
// 作用：集中管理游戏状态，避免分散全局变量难以维护。
// 概念说明："状态" 是指当前数据快照，例如棋盘内容、当前玩家、游戏是否结束等。
// 设计原则：所有渲染与逻辑基于此处的单一来源（Single Source of Truth）。

export const state = {
  board: Array(9).fill(null), // 井字棋 3x3 棋盘，使用一维数组存储，索引 0-8
  currentPlayer: 'X',         // 当前轮到的玩家符号
  gameStatus: 'playing',      // 'playing' | 'win' | 'draw'
  winner: null,               // 'X' | 'O' | null
  mode: 'pvp',                // 'pvp' (玩家对玩家) | 'pve' (玩家对 AI)
  difficulty: 'easy',         // AI 难度：'easy' | 'medium' | 'hard'
  scores: { X: 0, O: 0 },     // 可扩展：记录比分
};

// 重置状态的纯函数：返回一个全新初始状态对象（便于测试）。
export function createInitialState() {
  return {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    gameStatus: 'playing',
    winner: null,
    mode: state.mode,        // 保持当前模式不变，可根据需求重置
    difficulty: state.difficulty,
    scores: { ...state.scores },
  };
}

export function resetState() {
  const fresh = createInitialState();
  Object.assign(state, fresh); // 用新对象覆盖原对象的每个字段
}
