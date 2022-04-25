import React from "react";
import Board from "./Board";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          lastMove: null
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      historyIsReverse: false
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          lastMove: i
        }
      ]),
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

  reverseHistory() {
    this.setState({
      historyIsReverse: !this.state.historyIsReverse
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const { winner, steps } = calculateWinner(current.squares);

    const moves = history.map(({ step, lastMove: cellId }, move) => {
      const desc = move ?
        `Go to move #${move}: ${cellId % 3} ${(cellId - (cellId % 3)) / 3}` :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    const movesRevesed = moves.slice().reverse();

    let status;

    if (winner) {
      status = "Winner: " + winner;
    } else if (this.state.stepNumber === this.state.history[0].squares.length) {
      status = "Ничья"
      console.log([
        this.state.stepNumber,
        this.state.history[0].squares.length,
        (this.state.stepNumber === this.state.history[0].squares.length)
      ])
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winnerIds={steps}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div onClick={() => this.reverseHistory()}>Reverse {this.state.historyIsReverse.toString()}</div>
          <ol>{this.state.historyIsReverse ? movesRevesed : moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {

      return { winner: squares[a], steps: [a, b, c] };
    }
  }
  return { winner: null, steps: [] };
}