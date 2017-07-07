# Building Tic-Tac-Toe With React

Welcome! As promised, we will guide you through building your own Tic-Tac-Toe client this evening. We have provided you with some code already, so that you can quickly get started. This document will briefly explain what React is, the code we provided you with and help you through implementing a fully working tic-tac-toe client that can play on our game server.

## 1. A React.js Primer
(feel free to skip this part if you have React experience)

In this event you will use React in your client-side application to implement a Tic-Tac-Toe game. React is a view-layer library that simplifies the process of implementing an UI. It gives you all the necessary tools to build a web application for your browser. As many other view-layer libraries, React is a component driven library. Components are arranged in a tree hierarchy. You will start to implement a first root component but eventually will add more child components to it.

A React component looks basically like the following:

```javascript
class TicTacToe extends React.Component {
  render() {
    const username = ‘Peter’;
    return (
      <div>{username}</div>
    );
  }
}
```

A React component returns JSX. It is a syntax that allows you to mix HTML and JavaScript. The JavaScript ends up in curly braces between the HTML. That way you can make conditional renderings (e.g. with a ternary operator) too:

```javascript
class TicTacToe extends React.Component {
  render() {
    const username = ‘Peter’;
    
    return (
      <div>
        {
          username !== ‘’
            ? <span>{username}</span>
            : <span>No username!</span>
         }
       </div>
     );
  }
}
```

The JSX lives inside of a `render()` method. That’s only one of a few lifecycle methods that come with a React component. These lifecycle methods can be used in your class because you extend it with the `React.Component` class. However, the `render()` method is mandatory to display an output for the component instance. Perhaps you will not need any other React lifecycle method during this event, but you should be aware of them.

You can have multiple components arranged in a component hierarchy. When having a child component, you can pass properties as props to that component.

```javascript
class TicTacToe extends React.Component {
  render() {
    const usernameOne = ‘Peter’;
    const usernameTwo = Alison’;
    
    return (
      <div>
        <Username username={usernameOne} />
        <Username username={usernameTwo} />
       </div>
     );
  }
}

class Username extends React.Component {
  render() {
    const username = this.props.username;

    return (
      <div>
        {
          username !== ‘’
            ? <span>{username}</span>
            : <span>No username!</span>
         }
       </div>
     );
  }
}
```

Last but not least, when a React component only uses the `render()` method and doesn’t need to handle any other lifecycle methods or local component state, you can use it as functional stateless component too. It is only a function that receives the props in the function signature and returns JSX. 

```javascript
function Username(props) {
  return (
    <div>
      {
        props.username !== ‘’
          ? <span>{props.username}</span>
          : <span>No username!</span>
       }
     </div>
   );
}
```

The props in the function signature can be destructured by JavaScript ES6.

```javascript
function Username({ username }) {
  ...
}
```

That’s it. With that knowledge you can already start to build UIs with React.
## 2. Tic-Tac-Toe Boilerplate Project
During this event you will build a Tic-Tac-Toe client. Therefore we provide you with a boilerplate project that you can clone from GitHub. It should give you a proper starting point to begin immediately writing your first React component. 

In addition, we already provide you with the main functionalities of a Tic-Tac-Toe game to send and receive updates from our Tic-Tac-Toe game server. The game server is already up and running for you to play against each other later on.

To get started, you would have to checkout the GitHub repository on the command line:

```
git clone git@github.com:TOA-Berlin-TicTacToe/toa-tic-tac-toe-starter-kit.git
cd toa-tic-tac-toe-starter-kit
npm install
```

The second step would be to start your client application:

```
npm start
```

You can open the application in your browser to confirm that it is working. In addition, you can start to open the boilerplate project in your favorite editor. Basically you would start to write your application in `src/TicTacToe/index.js`. There you will implement your first React component.

As you can see, the React component with the name `TicTacToe` already receives props. These props are already provided by us by having a higher order component: `withTicTacToe`. It’s ok if you don’t know about higher order components. We only provide you with one to interact with the Tic-Tac-Toe game server and to receive updates from it.

By having the higher order component, you don’t need to care about how to update the game server, how to receive updates from it and how to store the client-sided game state. (If you are curious later on, you can checkout the `withTicTacToe` higher order component to see how it works.) Now you could start to implement your game.



## 3. Implementation

### 3.1 Setup

Before we start we need to provide a username. We provided you with a constant in `src/index.js`. Please go there and specify a username. 

*Hint: Later on you might want to simulate playing against yourself in another browser tab. Go to `http://localhost:3000?username=ANOTHER_USERNAME` to pretend to be someone else!*

Back in `src/TicTacToe/index.js` we find our root component, which already receives several properties:

- `username` (string) – This is the username we just provided in the `src/index.js` file.
- `game` (object) – The game object which holds all information about participating
  players, the current board state etc. We'll have a look at this object
in more detail later.
- `games` (array) – A list of games created by other users, which we can join to
  play against them
- `isInGame` (bool) – A boolean which tells us whether we're currently playing or
  not
- `hasPendingGame` (bool) – A boolean which tells us whether we are waiting for
  another player to join our game (also see `actions.create`)
- `actions` (object) – This is an object with functions which communicate with the
  server. It comes with the following capabilities
  - `reate()` -  Create a game for others to join. This also sets the
    boolean flag `hasPendingGame`
  - `oin(gameUid)` - Join another game, represented by a `gameUid`. If you
    do NOT pass a gameUid, you will join a random game
  - `leave()` - Leave the game you are currently in, which negates the `hasPendingGame` boolean flag
  - `move({ x, y })` - In a game, make a next move, represented by an
    object with x and y values. If you want to make your next move in
the center of the board, which is the second row and the second column,
you would call `move({ y: 1, x: 1 })`

With this information we can start to build our client step by step!

Let's start with something simple and just display our name:

```javascript
class TicTacToe extends React.Component {
  render() {
    const { game, games, isInGame, hasPendingGame, actions, username } = this.props;
    const { create, join, leave, move } = actions;

    return (
      <div>
        <div>Hello { username }</div>
      </div>
    );
  }
}
```


### 3.2 Already in the game? - Game and Lobby component

Based on whether we are currently playing a game or not, we need to
display a different component.

We can represent these two states with two components we call `Lobby`
and `Game`.

In the Lobby we will decide if we want to create a new game or join
another player's game. In the game we will actually display a Tic-Tac-Toe board to play the game.


```javascript
class TicTacToe extends React.Component {
  render() {
    const { game, games, isInGame, hasPendingGame, actions, username } = this.props;
    const { create, join, leave, move } = actions;

    return (
      <div>
        <div>Hello { username }</div>
        { isInGame ?
            <Game /> :
            <Lobby />
        }
      </div>
    );
  }
}

function Game() {
  return null;
}

function Lobby() {
  return null;
}
```

Components that just return `null` are not useful of course. Let's add some functionality to the Lobby and Game components.


### 3.3 The Lobby

In the `Lobby` we will be able to create a new game, which other players
can join and we will be able to join games other players have created.

Therefore we need to receive 3 properties:

```javascript
function Lobby({ games, onJoin, onCreate }) {
  // ...
}
```

In our `Tic-Tac-Toe` component we can pass these properties down to our
Lobby, like this:

```javascript
<Lobby games={games} onJoin={join} onCreate={create} />
```

To make our `Lobby` useful we need to do the following:

- Create a button, which calls `onCreate` when we click it to create a
  new game.
- Display a list of `games`. Each list item should be a button we can
  click to join a game by calling `onJoin(game.gameUid)`

*Hint: The game object contains a list of all participating players (`game.players`). All games, because they are joinable, have only one player in the list pof players.Use this to associate a name with the game (`game.players[0]`)*


### 3.4 The Game

In the `Game` we will make our moves on the Tic-Tac-Toe board. We will
need the following properties:

```javascript
function Game({ game, username, onMove, onLeave }) {
  // ...
}
```

And pass it from the `Tic-Tac-Toe component`:

```javascript
<Game username={username} game={game} onMove={move} onLeave={leave} />
```

Let's take a closer look at the `game` object:

- `gameUid (string)` - A unique identifier of the game, created by the server
- `players (array)` - List of the two participating players, identified by username
- `turn (string)` - A username revealing which player's turn it is
- `board (array)` - A list of 3 lists with 3 items, representing the rows and
  columns of the board. Empty tiles are marked by an empty string, used
tiles are identified by a username.
- `status (object)` - An object with a type field of 'WAITING', 'ONGOING' or 'FINISHED'
  and a winner field, which holds the username of the winning player
when a game is won.

Example of a board object:

```javascript
{
  gameUid: 'someId',
  players: ['max', 'moritz']
  turn: 'moritz',
  board: [
    ['max', 'moritz', ''],
    ['', 'max', ''],
    ['', '', '']
  ],
  status: {
    type: 'ONGOING',
    winner: null
  }
}
```

Now implement the following steps to get your `Game` component up and
running:

- Display a winning status, looking at `game.status`. Whenever a game is
  finished, show who was won or if the game ended in a tie.
- Tell the currently playing user if they are currently asked to make a
  move. Use the information in `game.turn` and `username` for this.
- Provide a button to allow leaving the game, using the `onLeave`
  function we passed down to our component.
- Represent the board and allow a user to interact with it.
  - Map over each row and in each row map over each column to render
    individual cells/tiles.
  - Represent the players with X and Os instead of their names.


Your board implementation will look something like this

```javascript
<div>
  { game.board.map((row, y) => {
    return (
      <div key={y} className="board-row">
        {
          row.map((col, x) => {
            let mark = '';
            if (game.players[0] === col) { mark = 'X'; }
            if (game.players[1] === col) { mark = 'O'; }
            const onClick = mark ? () => {} : () => onMove({ y, x });
            return (
              <div key={x} className="board-cell" onClick={onClick}>{ mark }</div>
            );
          })
        }
      </div>
    );
  })}
</div>
```

*Hint: You will need to add basic styling to layout the board tiles
properly. You will also want to give them a background color or a border
so that you can distinguish each tile visually. You can add your CSS
classes to `src/index.css`.*

With this code you should be ready to play and show your skills as a Tic
Tac Toe master!

