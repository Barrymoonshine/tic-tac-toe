const createGameBoard = (function () {
  const gameBoard = ['', '', '', '', '', '', '', '', ''];
  return {
    gameBoard,
  };
}());

const playerFactory = (name, selector) => ({ name, selector });

const playerOne = playerFactory('playerOne', 'X');

const playerTwo = playerFactory('playerTwo', 'O');

function renderGameBoard() {
  for (i = 0; i < 9; i++) {
    const boardSquare = document.createElement('div');
    boardSquare.className = 'boardSquares';
    boardSquare.id = i;
    boardSquare.textContent = createGameBoard.gameBoard[i];
    document.getElementById('container').appendChild(boardSquare);
  }
}

renderGameBoard();
