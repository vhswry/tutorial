import React from "react"

function Square(props) {
  return (
    <button className={"square" + (props.winnerIds.includes(props.cellId) ? " winner" : "")} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export default class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square key={i}
        winnerIds={this.props.winnerIds}
        cellId={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let counter = 0;
    let rows = Array(3).fill().map((el, eli) =>
      <div className="board-row" key={eli}>
        {Array(3).fill().map(_ => this.renderSquare(counter++))}
      </div>)

    return (
      <>{rows}</>
    );
  }
}