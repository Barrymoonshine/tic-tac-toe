const createGameBoard = (function () {
  const gameBoard = ['', '', '', '', '', '', '', '', ''];
  return {
    gameBoard,
  };
}());

const playerFactory = (name, selector) => ({ name, selector });

const playerOne = playerFactory('playerOne', 'X');

const playerTwo = playerFactory('playerTwo', 'O');

// for (i = 0; i < 9; i++) {
//     const boardSquare = document.createElement('div');
//     boardSquare.className = 'boardSquares';
//     boardSquare.style.border = '1px solid black';
//     boardSquare.id = i;
