// logic.js
// 作用：纯逻辑函数（不与 DOM 交互），方便测试与复用。
// 概念："纯函数" 指无副作用、相同输入必然得到相同输出，利于单元测试。

// 所有赢的组合（行、列、对角线）索引集合
export const WIN_PATTERNS = [
  [0,1,2], [3,4,5], [6,7,8], // 行
  [0,3,6], [1,4,7], [2,5,8], // 列
  [0,4,8], [2,4,6],          // 对角线
];

// 棋盘是否某格可落子：为空且游戏状态仍在进行
export function isValidMove(board, index) {
  return board[index] === null && index >= 0 && index < board.length;
}

// 返回新的棋盘（不在原数组上修改），体现不可变数据思想
export function applyMove(board, index, player) {
  if (!isValidMove(board, index)) return board; // 非法则原样返回
  const next = board.slice(); // 创建浅拷贝
  next[index] = player;
  return next;
}

// 胜利检测：返回 { winner, line }；若无胜方则 winner=null
export function checkWinner(board) {
  for (const pattern of WIN_PATTERNS) {
    const [a,b,c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: pattern };
    }
  }
  return { winner: null, line: [] };
}

// 平局检测：无空位且无胜者
export function checkDraw(board) {
  return board.every(cell => cell !== null) && !checkWinner(board).winner;
}

export function getAvailableMoves(board) {
  return board.map((v,i) => v === null ? i : null).filter(v => v !== null);
}

// 切换玩家：X -> O / O -> X
export function togglePlayer(player) {
  return player === 'X' ? 'O' : 'X';
}
