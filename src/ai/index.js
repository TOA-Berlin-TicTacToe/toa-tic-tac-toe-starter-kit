const WINNING_PATTERNS = [
  [
    true, true, true,
    false, false, false,
    false, false, false
  ],
  [
    false, false, false,
    true, true, true,
    false, false, false
  ],
  [
    false, false, false,
    false, false, false,
    true, true, true
  ],
  [
    true, false, false,
    true, false, false,
    true, false, false
  ],
  [
    false, true, false,
    false, true, false,
    false, true, false
  ],
  [
    false, false, true,
    false, false, true,
    false, false, true,
  ],
  [
    true, false, false,
    false, true, false,
    false, false, true
  ],
  [
    false, false, true,
    false, true, false,
    true, false, false
  ]
];

export const isWinningPattern = (board, currentPlayer) => {
  return !!WINNING_PATTERNS.find((p) => {
    for (let i = p.length - 1; i >= 0; i--) {
      if (p[i] && board[i] !== currentPlayer) {
        return false;
      }
    }
    return true;
  });
};

const isDone = (b) => b.reduce((mem, el) => el && mem, true);

export const getNextMoves = (b, players) => {
  if (
    isWinningPattern(b, players[0]) ||
    isWinningPattern(b, players[1]) ||
    isDone(b)
  ) {
    return [];
  }
  return b.reduce((mem, el, i) => [...mem, ...(el ? [] : [i])], []);
};


export const evaluateScore = (b, currentPlayer, otherPlayer) => {
  if (isWinningPattern(b, currentPlayer)) { return 10; }
  if (isWinningPattern(b, otherPlayer)) { return -10; }
  return 0;
};

export const applyMove = (board, m, player) => {
  const b = [...board];
  b[m] = player;
  return b;
};

export const getNextMove = (b, currentPlayer, otherPlayer) => {
  if (isDone(b)) { return null; }

  const best = { value: -Infinity, i: -1 };
  const nextMoves = getNextMoves(b, [currentPlayer, otherPlayer]);
  const scores = nextMoves.map((m) => minimax(applyMove(b, m, currentPlayer), otherPlayer, currentPlayer, false));
  for (let i = 0; i < scores.length; i++) {
    const score = scores[i];
    if (score > best.value) {
      best.i = i;
      best.value = score;
    }
  }
  return nextMoves[best.i];
};

function minimax(board, currentPlayer, otherPlayer, isMax) {
  const nextMoves = getNextMoves(board, [currentPlayer, otherPlayer]);
  if (!nextMoves.length) {
    return isMax ?
      evaluateScore(board, currentPlayer, otherPlayer) :
      evaluateScore(board, otherPlayer, currentPlayer);
  }
  const scores = nextMoves.map((m) => minimax(applyMove(board, m, currentPlayer), otherPlayer, currentPlayer, !isMax));
  return isMax ? Math.max(...scores) : Math.min(...scores);
}

const flatten = (args) => args.reduce((mem, arg) => [...mem, ...arg], []);

export const move = (game) => {
  const { players, turn, board } = game;
  const flatBoard = flatten(board);
  const otherPlayer = players[0] === turn ? players[0] : players[1];
  const moveI = getNextMove(flatBoard, turn, otherPlayer);
  return moveI === null ? null : { y: Math.round(moveI / 3), x: moveI % 3 };
};


