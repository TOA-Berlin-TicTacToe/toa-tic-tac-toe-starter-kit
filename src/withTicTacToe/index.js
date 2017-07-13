import withSocket from 'react-with-socket';

const logError = (msg) => console.error(msg); // eslint-disable-line no console

const isInGame = (game) => game && (game.status.type === 'ONGOING' || game.status.type === 'FINISHED');
const hasPendingGame = (game) => game && game.status.type === 'WAITING';

const initialState = {
  isInGame: false,
  games: []
};

const mapData = () => ({
  'client:init': (props, game) => ({ game, isInGame: isInGame(game), hasPendingGame: hasPendingGame(game) }),
  'client:move': (props, game) => ({ game }),
  'client:leave': () => ({ game: undefined, isInGame: false, hasPendingGame: false }),
  'client:lobby': (props, games) => ({ games: (games || []).filter(game => game.players[0] !== props.username) })
});

const mapEmit = (emit, { game, games, username, isInGame, hasPendingGame }) => ({
  actions: {
    create: () => {
      if (hasPendingGame) {
        logError('You already have a pending game created, cannot create a second one');
      } else {
        emit('create', { username });
      }
    },
    join: (gameUid) => {
      if (games.length) {
        emit('join', { username, gameUid });
      } else {
        logError('There are no games present for you to join');
      }
    },
    leave: () => {
      if (isInGame) {
        emit('leave', { gameUid: game.gameUid, username });
      } else {
        logError('You cannot leave, because you are not in a game!');
      }
    },
    move: ({ x, y }) => {
      if (!isInGame) {
        logError('Cannot make a move, because you are not in a game!');
        return;
      }
      if (game.turn === username) {
        emit('move', { username, gameUid: game.gameUid, position: { x, y } });
      } else {
        logError('Cannot make a move, because it is not your turn!');
      }
    }
  }
});

const tryAiMove = (props, game) => {
  const { ai, username } = props;
  if (ai && ai.move && username === game.turn) {
    // we could be nice and benchmark here, so that we immediately
    // report back to people how long their AI takes to make a move ;)
    const nextPosition = ai.move(game);
    if (nextPosition) {
      props.actions.move(nextPosition);
    }
  }
};

const callbacks = () => ({
  'client:move': tryAiMove,
  'client:init': tryAiMove
});

export default withSocket({ initialState, mapData, mapEmit, callbacks });
