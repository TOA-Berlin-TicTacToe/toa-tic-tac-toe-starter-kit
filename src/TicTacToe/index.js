import React from 'react';
import withTicTacToe from '../withTicTacToe';

class TicTacToe extends React.Component {
  render() {
    const { game, games, isInGame, hasPendingGame, actions, username } = this.props;


    return (
      <div>
        <h1>Hello {username}!</h1>
      </div>
    );
  }
}

export default withTicTacToe(TicTacToe);
