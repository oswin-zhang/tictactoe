// ai.js
// 作用：封装 AI 不同难度的落子策略，暴露统一接口。
// 难度说明：
// easy   - 随机选择一个空位
// medium - 启发式：优先赢棋 > 阻挡对方赢 > 中心 > 角 > 边
// hard   - Minimax：穷举搜索最佳结果，适用于井字棋小规模
// 术语："启发式(Heuristic)" 指经验规则；"Minimax" 是经典博弈搜索算法；"剪枝" 减少不必要搜索分支。

import { WIN_PATTERNS, getAvailableMoves, applyMove, checkWinner, checkDraw, togglePlayer } from './logic.js';

export function getAIMove(board, aiPlayer, difficulty) {
  switch (difficulty) {
    case 'easy': return randomMove(board);
    case 'medium': return heuristicMove(board, aiPlayer);
    case 'hard': return minimaxRoot(board, aiPlayer).index;
    default: return randomMove(board);
  }
}

function randomMove(board) { // 低级：随机
  const moves = getAvailableMoves(board);
  return moves[Math.floor(Math.random() * moves.length)];
}

function heuristicMove(board, aiPlayer) { // 中级：启发式
  const opponent = togglePlayer(aiPlayer);
  const avail = getAvailableMoves(board);
  for (const idx of avail) { // AI 能赢
    const test = applyMove(board, idx, aiPlayer);
    if (checkWinner(test).winner === aiPlayer) return idx;
  }
  for (const idx of avail) { // 阻挡对方
    const test = applyMove(board, idx, opponent);
    if (checkWinner(test).winner === opponent) return idx;
  }
  if (avail.includes(4)) return 4; // 中心
  const corners = [0,2,6,8].filter(c => avail.includes(c));
  if (corners.length) return corners[Math.floor(Math.random()*corners.length)];
  return avail[Math.floor(Math.random()*avail.length)]; // 边
}

function minimaxRoot(board, aiPlayer) { // 高级：Minimax 根节点
  const avail = getAvailableMoves(board);
  let bestScore = -Infinity;
  let bestIndex = avail[0];
  for (const idx of avail) {
    const newBoard = applyMove(board, idx, aiPlayer);
    const score = minimax(newBoard, false, aiPlayer, togglePlayer(aiPlayer), 0, -Infinity, Infinity);
    if (score > bestScore) { bestScore = score; bestIndex = idx; }
  }
  return { index: bestIndex, score: bestScore };
}

function minimax(board, isMax, aiPlayer, currentPlayer, depth, alpha, beta) { // 递归搜索
  const winInfo = checkWinner(board);
  if (winInfo.winner) {
    if (winInfo.winner === aiPlayer) return 10 - depth; // 深度越浅，优势越大
    return depth - 10; // AI 输
  }
  if (checkDraw(board)) return 0; // 平局

  const avail = getAvailableMoves(board);
  if (isMax) { // 最大化层：AI 回合
    let best = -Infinity;
    for (const idx of avail) {
      const newBoard = applyMove(board, idx, aiPlayer);
      const score = minimax(newBoard, false, aiPlayer, togglePlayer(aiPlayer), depth+1, alpha, beta);
      best = Math.max(best, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break; // Beta 剪枝
    }
    return best;
  } else { // 最小化层：对手回合
    let best = Infinity;
    for (const idx of avail) {
      const newBoard = applyMove(board, idx, currentPlayer);
      const score = minimax(newBoard, true, aiPlayer, togglePlayer(currentPlayer), depth+1, alpha, beta);
      best = Math.min(best, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break; // Alpha 剪枝
    }
    return best;
  }
}
