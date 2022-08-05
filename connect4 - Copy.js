/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Game {
  constructor(height, width) {
    this.width = width;
    this.height = height;
    this.colorPlayer1 = document.getElementById('color1');
    this.currPlayer1 = new Person(document.getElementById('color1').value); // active player: 1
    this.currPlayer2 = new Person(document.getElementById('color2').value); // active player: 2
    this.playerColor = this.currPlayer1.getColor();
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.#makeBoard();
    this.#makeHtmlBoard();
    this.compPlayer = new ComputerPlayer();
    this.btnNewGame = document
      .querySelector('#btnNewGame')
      .addEventListener('click', (evt) => {
        evt.preventDefault();
        this.#makeNewGame();
      });
    // alert(this.colorPlayer1.value);
  }

  // clears old board and starts a new Game
  #makeNewGame() {
    const gameBoard = document.querySelectorAll('tr');
    gameBoard.forEach((element) => {
      element.remove();
    });
    new Game(6, 7);
  }

  changeColor() {
    if (this.playerColor === this.currPlayer1.getColor()) {
      this.playerColor = this.currPlayer2.getColor();
    } else {
      this.playerColor = this.currPlayer1.getColor();
    }
    // alert(this.playerColor);
  }
  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */
  #makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  #makeHtmlBoard() {
    const gameBoard = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', (evt) => {
      // get x from ID of clicked cell
      const x = +evt.target.id;
      // get next spot in column (if none, ignore click)
      // console.log(this);
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }

      // // place piece in board and add to HTML table
      // this.board[y][x] = this.playerColor;
      // this.placeInTable(y, x);
      this.placeInBoard(y, x);
      // check for win
      if (this.checkForWin()) {
        return this.endGame(`Player ${this.playerColor} won!`);
      }

      // check for tie
      if (this.board.every((row) => row.every((cell) => cell))) {
        return this.endGame('Tie!');
      }

      // switch players
      this.changeColor();
    });

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    gameBoard.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      gameBoard.append(row);
    }
  }

  placeInBoard(y, x) {
    // place piece in board and add to HTML table
    this.board[y][x] = this.playerColor;
    this.placeInTable(y, x);
  }

  pcTurn() {
    this.compPlayer.getX();
    // this.placeInBoard(0, 0);
  }
  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.playerColor}`);
    piece.style.top = -50 * (y + 2);
    piece.style.backgroundColor = this.playerColor;

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
    if (this.playerColor === this.currPlayer2.getColor()) {
      this.pcTurn();
    }
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
    document.getElementById('column-top').style.pointerEvents = 'none';
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.playerColor
      );
    };

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Person {
  constructor(color) {
    this.color = color;
  }
  getColor() {
    return this.color;
  }
}

class ComputerPlayer {
  constructor() {
    this.x = Math.random() * 8;
  }
  getX() {
    alert('The random number is ' + this.x);
  }
}

new Game(6, 7);
