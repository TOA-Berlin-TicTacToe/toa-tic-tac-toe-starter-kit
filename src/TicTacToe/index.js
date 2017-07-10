import React from 'react';
import withTicTacToe from '../withTicTacToe';
import './style.css';

// A sample game object that is received as props in the TicTacToe component
//
// {
//   gameUid: 'someId',
//   players: ['max', 'moritz']
//   turn: 'moritz',
//   board: [
//     ['max', 'moritz', ''],
//     ['', 'max', ''],
//     ['', '', '']
//   ],
//   status: {
//     type: 'ONGOING',
//     winner: null
//   }
// }

class TicTacToe extends React.Component {
  render() {
    const { game, games, isInGame, hasPendingGame, actions, username } = this.props;

    return (
      <div>
        <h1>Hello {username}!</h1>

        <p>
          <a href="https://github.com/TOA-Berlin-TicTacToe/toa-tic-tac-toe-starter-kit">Check out the instructions to get started!</a>
        </p>
      </div>
    );
  }
}

export default withTicTacToe(TicTacToe);
