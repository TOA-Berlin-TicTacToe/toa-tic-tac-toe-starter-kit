# Building Tic-Tac-Toe With React

Welcome! As promised, we will guide you through building your own Tic-Tac-Toe client this evening. We have provided you with some code already, so that you can quickly get started. This document will briefly explain what React is, the code we provided you with and help you through implementing a fully working tic-tac-toe client that can play on our game server.

* [React Client](#react-client)
  * [And a table of contents](#and-a-table-of-contents)
  * [On the right](#on-the-right)

## React Client

### 1. A React.js Primer

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

### 2. Tic-Tac-Toe Boilerplate Project

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

### 3. Implementation

#### 3.1 Setup

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


#### 3.2 Already in the game? - Game and Lobby component

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


#### 3.3 The Lobby

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


#### 3.4 The Game

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

## AI

Congratulations! You made it to the second part of this event. This document briefly explains what AI is, explains the concepts you need for building an AI for Tic-Tac-Toe and finally guides you through how to implement your own AI and discusses the implementation.

### 1. Theory

Have you ever thought about what intelligence really is? We need some kind of idea of intelligence in order to build it. A core concept in artificial intelligence is the study of intelligent agents. This concept offers one simple way of looking at intelligence. An intelligent agent is defined as an entity which is perceiving the world and responding with rational actions, that is, actions that are favorable for some kind of goal. In the following sections you will learn how to define this goal and how to find the best actions for reaching it. For Tic-Tac-Toe a good start is building a game tree.

TODO IMAGE

Fig 1. Visualization of an intelligent agent. It is observing the environment and based on observations performs actions. Imagine a flower which turns it leaves towards the sun as it observes sunlight from a specific direction because it wants to be exposed to as much sunlight as possible.

#### 1.1 Game Tree

When computationally tractable one can create a tree of all possible outcomes of a game and the actions leading to these. This happens to be the case of Tic-Tac-Toe. Given a state (for example an empty tic-tac-toe board) we can produce all possible actions (player selecting any tile on the board) and transform them into new states. We can then repeat and repeat this for every produced state to calculate all possible paths the game can take. Given a board, we can also see whether we won, lost or it was a draw. Combining these abilities we can look at all possible outcomes of a game given an action (see fig. 2 for a partial game tree). However, seeing all possible outcomes is not so useful, we also need a way to predict the actions of our opponent and a way to choose the best actions for us.

A common technique for this is called Minimax. It is famous for being used to beat the world championship Garry Kasparov in chess 1997.

TODO IMAGE

Fig. 2. An example of a partial game tree. Note that given our state (the root) the game can evolve in different ways depending on our action. If we place our X in the middle we win. Any other action might lead to that we lose, since we give the opponent the possibility to win.

#### 1.2 Minimax

Imagine a game between two players, one called Max and the other Min. Max wants the highest possible score and Min wants the lowest possible score. You might have already thought: we don’t have scores in Tic-Tac-Toe. Well, we’re developers, let’s use our power and define scores:

```javascript
10: Max win
0: Draw
-10: Max lose (Min win)
```

We can now put these values on nodes in our game tree. For example, a node representing Max winning gets a 10. Now, think about it, if the current player is Max, then if the options are 10, 0 or -10, there’s no doubt, 10 will be chosen. If the current player is Min, -10 would be chosen without a doubt. This gives you the ability to predict your opponent's move, which is the basis for Minimax which you will soon implement.

### 2. Implementation

Time to get coding! Try to follow the instructions, do not put too much care into understanding everything from the start, we will discuss it in section 3. We can’t jump directly to implementing minimax, the algorithm requires a couple of functions. Let’s start with these now!

1. Open up `ai/index.js`, you will do all coding in this file.
2. Create a function `didPlayerWin(board, player)` which returns true if the player won, otherwise false.
hint: you might create the functions isDiagWin, isRowWin, isColWin and use them in this function.
3. Create a function getUtility(board, players) which returns 10 if players[0] won, -10 if players[1] won and 0 otherwise.
4. Create a function `createNode(board, action)` which just returns an object {board, action}.
5. Create a function `applyAction(board, action, player)` which creates a new board with the action performed. It might look like:

```javascript
function applyAction(board, action, player) {
    const newBoard = board.map(x => x.slice());
    newBoard[action.y][action.x] = player;
    return newBoard;
};
```

*Hint: `x.slice()` returns a shallow copy of the array referenced by x. This is one way of creating a new board rather than modifying the original board.*

6. Create a function `getSuccessors(board, player, players)` which returns a list of nodes. You need to support two cases in this function:

6.1. If players[0] or players[1] won, return an empty list.

6.2. Else: For every empty spot on the board (represented by empty string), create a new board where the empty spot has been filled with the value of player. eg. [[‘’, ‘’, ‘’], [‘’, ‘’, ‘’], [‘’, ‘’, ‘’]] would have nine successor boards, two of them being: [[‘X’, ‘’, ‘’], [‘’, ‘’, ‘’], [‘’, ‘’, ‘’]] and [[‘’, ‘X’, ‘’], [‘’, ‘’, ‘’], [‘’, ‘’, ‘’]].

```javascript
function getSuccessors(board, player, players) {
    if any player won, return []
    let successors := []
    for every free tile (x, y)
        let action := {x, y}
        successors.push(
            createNode(applyAction(board, action, player), action)
        )
    return successors
}
```

7. Create a function `minimax(board, isMaxPlayer, players)` which returns 10 if players[0] wins, -10 if players[1] wins and 0 the game ends with a draw. You might just try to implement it line by line for now (not trying to understand everything). We will discuss it more in section 3.

```
function minimax(board, isMaxPlayer, players) {
    let player := isMaxPlayer ? players[0] : players[1]
    let successors := getSuccessors(board, player, players)

    if no successors return getUtility(board, players)

    if isMaxPlayer then
        let bestValue := -9999
        for every successor in successors
            let value := minimax(successor.board, !isMaxPlayer, players)
            bestValue := Math.max(bestValue, value)
        return bestValue
    else
        let bestValue := 9999
        for every successor in successors
            let value := minimax(successor.board, !isMaxPlayer, players)
            bestValue := Math.min(bestValue, value)
        return bestValue
}
```

8. Create a function `getOtherPlayer(players, myPlayer)` which returns the other player in players.
9. Final step is to actually return an action. Go to `move(game)` which we provided you with.

In pseudo-code you get something like:

```javascript
function(game) {
    let players := [game.turn, getOtherPlayer(game.players, game.turn)]
    let successors := getSuccessors(game.board, game.turn, game.players)
    let bestSuccessor := {value: -9999, action: null}
    for every successor in successors
        let value := minimax(successor.board, false, players)
        if value > bestSuccessor.value then
            bestSuccessor := {value, action: successor.action}
    return bestSuccessor.action
}
```

*Hint: If you want to go fancy, note that you can break as soon as you found a winning move.*

Congratulations! You have built a working AI! If you still have some energy left, you might consider implementing a very powerful optimization called alpha-beta pruning.

#### 2.1 Alpha-Beta Pruning

In short, alpha-beta pruning prevents your minimax implementation from exploring actions that would never be picked anyway. We recommend you to focus on implementing it for now, we will discuss how alpha-beta pruning actually works later in section 3.1. The implementation is easy:

1. In `move(game)` replace the function call minimax(successor.board, false, players) with minimax(successor.board, false, players, -9999, 9999)
2. Update the function signature `minimax(board, isMaxPlayer, players)` to `minimax(board, isMaxPlayer, players, alpha, beta)`
3. In the function body of minimax, update according to the following pseudo-code (add the bold parts, do not change anything else):

```javascript
if isMaxPlayer then
    let bestValue := -9999
    for every successor in successors
        let value := minimax(successor.board, !isMaxPlayer, players)
        bestValue := Math.max(bestValue, value)
        alpha := Math.max(value, alpha);
        if (beta <= alpha) { break; }
    return bestValue
else
    let bestValue := 9999
    for every successor in successors
        let value := minimax(successor.board, !isMaxPlayer, players)
        bestValue := Math.min(bestValue, value)
        beta := Math.min(value, beta);
        if (beta <= alpha) { break; }
    return bestValue
```

Enjoy your significantly optimized implementation. For Tic-Tac-Toe, on a modern computer, you might not notice much of a difference, but if you count the number of times minimax is called you see a quite significant difference! The following section will explain this optimization. But let’s start by taking a step back and look at our AI from a high level, and then move on to the alpha-beta optimization.

### 3. Discussion

Phew! That’ was quite some code. By now you should have something working. Let’s start to think about what we have done, well, we wanted to implement minimax. You were given, to implement, the necessary parts for minimax, namely:

1. getUtility
2. getSuccessors

We then created a bunch of helper methods, like `didPlayerWin(board, player)` so that we could implement these. We didn’t really talk much about minimax itself. What is actually going on? Well, as mentioned in section 1, minimax is based on the Min will try to minimize the score while Max will try to maximize the score. This allows us to predict actions as the game goes on. If Min can chose, Min will always chose a path going towards a final state where the score is -10, 0 or as a last resort 10. Max will do the opposite. When considering the start (empty board) we can’t say much. But by simulating games (performing action after action) we can find all possible outcomes. Once we found an outcome where we win, we can see if this outcome is reachable by playing the game backwards. If not, we try another outcome where we win (or get the highest possible score). See fig. 4 for a visualization of leaf nodes and their associated scores.

TODO IMAGE

Fig. 4. A game tree with values attached to leaf nodes (states where someone won or there’s a draw). Min will try to get a state of -10, 0 and as a last resort 10. Max will go for 10, 0 and as a last resort -10. Knowing this allows us to predict actions for both Max and Min. We start at a leaf node and look at the previous player's turn to see if we would ever end up in this leaf node. You can think of this as the score bubbling up from the bottom to the root’s direct children.

We implemented this using recursion, the recursive part looks as following:

```javascript
minimax(board, isMaxPlayer, players) {
    ...
    for each successor
        value := minimax(successor.board, !isMaxPlayer, players)
        ...
}
```

Note how we alternate isMaxPlayer by negating it. This is our way of expressing who’s turn it is, which is important since Min and Max have different goals and thus use different strategies. In all recursive algorithms, you have a recursive step and a base case (or terminating case). Our terminating case is that we reached a leaf node, in which case we return the score (10, 0 or -10) for it.

A good way to understand a recursion is to unroll it. Let’s try that using pseudo-code:

A: One step before Max wins (it is max turn, only one possible action is left):
```javascript
let bestValue := -9999;
For the only successor:
    value := minimax(successor.board, !isMaxPlayer, players)
    bestValue := Math.max(bestValue, value);
```

B: Now let’s evaluate the minimax(successor.board):
```javascript
if no successors return getUtility(board, players)
```

Head back to A with our value:

```javascript
let bestValue := -9999;
For the only successor:
    value := 10 // since Max won
    bestValue := Math.max(bestValue, 10);
    [bestValue becomes 10]
```

Now our value of 10 will bubble up in the tree. But note that if we go one level up it is Min’s turn. It will then look like:

```javascript
let bestValue := 9999;
For each successor:
    value := minimax(successor.board, !isMaxPlayer, players)
    bestValue := Math.min(bestValue, value);
```

We know that one successor has a value of 10. However, if there is any option giving a value of less than 10, Min will pick this. We repeat this from the leaf node to the top, simulating a whole game play using our ability to predict what Max and Min will do, under the assumption that they are flawless and rational (always try to achieve their goal of winning).

Recall that when we had a working minimax implementation we optimized it using Alpha-Beta Pruning. Let’s know look at what we actually did.

#### 3.1 Alpha-Beta Pruning

A good way to understand Alpha-Beta Pruning is to simulate it: http://homepage.ufp.pt/jtorres/ensino/ia/alfabeta.html

Run through the simulation stepwise. Note that they keep track of Min’s (second level) best choice as β and Max’s (root) best choice as α. Once we get to the middle subtree’s first leaf node, we learn that Min will chose a node of at most 2. Since we already have an option which can give us (the player Max) 3, we do not explore this subtree anymore. Because even if both other options would give 1000, Min would choose 2. If they would give 1, it doesn’t matter, because we already know of a better option, namely the left subtree which gives us 3. If the leaf nodes of the middle subtree would be in a different order, namely 6, 4 and 2, we would have to evaluate all of them, since only the last option is worse than our know path for getting 3. See fig 5.

TODO IMAGE

Fig 5. The bold number at the bottom (in the leaf nodes) have been explored. Once we get to the middle subtree, we already know of a path of actions that will give us 3 (the leftmost subtree). So as we discover the 2 in the middle subtree, we already know that we (Max) would never chose the middle subtree, since the highest possible score there is 2 (since it is Min’s turn). So we do not explore the middle subtree more but move on to the rightmost subtree. Note that if the order of the nodes would be 6, 4 and 2 in the middle subtree, we would have to evaluate all of them, since only the last node would allow us to discard the subtree.

If you would like a good and thorough explanation of minimax, alpha-beta pruning and more, we encourage you to check out https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-034-artificial-intelligence-fall-2010/lecture-videos/lecture-6-search-games-minimax-and-alpha-beta/

Thank you for your participation, we hope you learned much and had a fun time!

Cheers,
Small Improvements

