import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import TicTacToe from './TicTacToe';
import * as ai from './ai';
import './index.css';
import { setSocketConfig } from 'react-with-socket';

const USERNAME = '[please provide your username]';

setSocketConfig({
    base: '35.189.249.30:8080',
    constructor: io
});

ReactDOM.render(
    <TicTacToe username={getUsername()} ai={ai} />,
    document.getElementById('root')
);

function getUsername() {
  const query = window.location.search;
  const match = query.match('username=(.+)');
  return match ? match[1] : USERNAME;
}
