import styles from './styles'

export default class Main extends React.Component {
  render() {
    return (
      <div>
        <Game />
        <style jsx global>{styles}</style>
      </div>
    )
  }
}

function Square(props) {
return (
  <button className={`square ${props.winsquare ? " winner" : ""}`} onClick={props.onClick}>
    {props.value}
  </button>
)
}

class Board extends React.Component {
renderSquare(i) {
  return(
    <Square
      value={this.props.squares[i]}
      winsquare={this.props.winsquares.indexOf(i) !== -1}
      onClick={() => this.props.onClick(i)}
    />
  );
}

render() {
  return (
    <div>
      <div className="board-row">
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}
      </div>
      <div className="board-row">
        {this.renderSquare(3)}
        {this.renderSquare(4)}
        {this.renderSquare(5)}
      </div>
      <div className="board-row">
        {this.renderSquare(6)}
        {this.renderSquare(7)}
        {this.renderSquare(8)}
      </div>
    </div>
  );
}
}

class Game extends React.Component {
constructor() {
  super();
  this.state = {
    history: [{
      squares: Array(9).fill(null)
    }],
    stepNumber: 0,
    xIsNext: true
  };
}
handleClick(i) {
  const history = this.state.history.slice(0, this.state.stepNumber + 1);
  const current = history[history.length-1];
  const squares = current.squares.slice();
  if (calculateWinner(squares)['winner'] || squares[i]) {
    return;
  }
  squares[i] = this.state.xIsNext ? 'X' : 'O';
  this.setState({
    history: history.concat([{
      squares: squares
    }]),
    stepNumber: history.length,
    xIsNext: !this.state.xIsNext
  });
}

jumpTo(step) {
  this.setState({
    stepNumber: step,
    xIsNext: (step % 2) === 0
  });
}

render() {
  const history = this.state.history;
  const current = history[this.state.stepNumber];
  const winresults = calculateWinner(current.squares),
        winner = winresults['winner'],
        winsquares = winresults['winsquares'];
  const squaresTest = current.squares;
  const test = "squareObj: " + squaresTest;

  const moves = history.map((step, move) => {
    const desc = move ?
      'Move #' + move :
      'Game start';
    return (
      <li key={move}>
        {move === this.state.stepNumber && (<b><a href="#" onClick={() => this.jumpTo(move)}>{desc}</a></b>)}
        {move !== this.state.stepNumber && (<a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>)}
      </li>
    );
  });

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          winner={winner}
          winsquares={winsquares}
          onClick={(i) => this.handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{test}</div>
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
}

// ========================================

//ReactDOM.render(
//<Game />,
//document.getElementById('root')
//);

function calculateWinner(squares) {
const lines = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];
let ret = {
  'winner': null,
  'winsquares': []
}

for (let i = 0; i < lines.length; i++) {
  const [a,b,c] = lines[i];
  if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    ret['winner'] = squares[a];
    ret['winsquares'] = [a,b,c];
  }
}
return ret;
}
