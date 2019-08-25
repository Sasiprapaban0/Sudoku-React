import React, { Component } from "react";
import Cell from "./Cell";

const validate = board => {
    let isValid = true;
    for (let i = 0; i < 4; i++) {
      const horizontal = new Set();
      const vertical = new Set();
      const square = new Set();
      for (let j = 0; j < 4; j++) {
        horizontal.add(board[i][j]);
        vertical.add(board[j][i]);
        square.add(
          board[2 * (i % 2) + (j % 2)][2 * Math.floor(i / 2) + Math.floor(j / 2)]
        );
      }
      horizontal.delete(0);
      vertical.delete(0);
      square.delete(0);
      if (horizontal.size !== 4 || vertical.size !== 4 || square.size !== 4) {
        isValid = false;
      }
    }
    return isValid;
  };
class Board extends Component
{
    state = {
        // board: [[1, 2, 3, 4], [3, 4, 0, 0], [2, 0, 4, 0], [4, 0, 0, 2]],
        // initialFlags: [
        //   [true, true, true, true],
        //   [true, true, false, false],
        //   [true, false, true, false],
        //   [true, false, false, true]
        // ],
        complete: false,
        invalid: false,
        timer: 0,
        loading : true
      };
      componentDidMount() {
        this.interval =  setInterval(() => {
            this.setState({timer: this.state.timer + 1});
          }, 1000);
          this.restartBoard();

      }
      restartBoard = () => {
          this.setState({
              loading: true
          })
          // Where we're fetching data from
  fetch(`https://us-central1-skooldio-courses.cloudfunctions.net/react_01/random`)
  // We get the API response and receive data in JSON format...
  .then(response => {
    return response.json();
  })
  .then(jsonResponse =>
  {
    this.setState({
        board: jsonResponse.board,
        timer: 0,
         initialFlags: jsonResponse.board.map(row => row.map(item => item !== 0 )),
         loading : false
    });
  })
      }
      componentWillUnmount() {
          clearInterval();
      }
      submit = () => {
        const isValid = validate(this.state.board);
        if(isValid)
        {
            clearInterval(this.interval);
        }
        this.setState({
          invalid: !isValid,
          complete: isValid
        });
      };
      render() {
          return (
              <div>
                  <p className="timer">Elapsed Time: {this.state.timer} seconds</p>
                  <div className="board">
          { !this.state.loading && this.state.board.map((row, i) =>
            row.map((cell, j) => (
              <Cell
                key={`cell-${i}-${j}`}
                number={cell}
                isInitial={this.state.initialFlags[i][j]}
                onChange = {newNumber => {
                    const { board } = this.state;
                    board[i][j] = newNumber;
                    this.setState({
                        board
                    });
                }}
              />
            ))
          )}
        </div>
        <button onClick= {this.restartBoard} className="restart-button">Restart</button>
        <button onClick={this.submit}>Submit</button>
        {this.state.complete && (
          <p style={{ color: "green" }}>Board is complete!</p>
        )}
        {this.state.invalid && (
          <p style={{ color: "red" }}>Board is invalid!</p>
        )}            
          </div>
        )}
      
}
export default Board;