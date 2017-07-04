import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import TicTacToe from './TicTacToe';
import * as ai from './ai';
import './index.css';

import { setSocketConfig } from 'react-with-socket';

const USERNAME = 'PLEASE PROVIDE YOUR USERNAME';

setSocketConfig({
    base: '35.189.249.30:8080',
    constructor: io
});


ReactDOM.render(<TicTacToe username={USERNAME} ai={ai} />, document.getElementById('root'));
