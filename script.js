const startGameButton = document.getElementById('modal-button');
const selectGameTypeModal = document.getElementById('game-type-modal');
const twoPlayerModeButton = document.getElementById('2-player-mode');
const vsComputerModeButton = document.getElementById('vs-computer-mode');
const twoPlayerFormModal = document.getElementById('new-game-modal');
const playerNamesForm = document.getElementById('player-names-form');
const gameAreaContainer = document.getElementById('game-area-container');
const resetGameButton = document.getElementById('reset-button');
const playerNameDisplay = document.getElementById('player-name-display');
const boardSquares = document.getElementsByClassName('board-squares');

const generatePlayers = (() => {
  const playerOneName = '';
  const playerTwoName = '';
  return {
    playerOneName,
    playerTwoName,
  };
})();

const handleForm = (e) => {
  e.preventDefault();
  const nameOne = document.getElementById('player-one-name').value;
  const nameTwo = document.getElementById('player-two-name').value;
  generatePlayers.playerOneName = nameOne;
  generatePlayers.playerTwoName = nameTwo;
  playerNameDisplay.textContent = `${nameOne}'s turn`;
  gameBoard.generateNewBoard();
  gameAreaContainer.style.display = 'flex';
  twoPlayerFormModal.style.display = 'none';
};

playerNamesForm.addEventListener('submit', handleForm);

const gameBoard = (() => {
  const gameBoardArray = ['', '', '', '', '', '', '', '', ''];
  const generateNewBoard = () => {
    for (i of boardSquares) {
      i.innerText = '';
      i.style.cursor = `pointer`;
      i.addEventListener('click', handleGameListener);
    }
  };
  const placeMarker = (index, marker) => {
    gameBoardArray[index] = marker;
  };
  return {
    getPositions() {
      return gameBoardArray;
    },
    generateNewBoard,
    placeMarker,
  };
})();

const getPlayerTurn = (() => {
  let playerCount = 0;
  const changeBy = (val) => {
    playerCount += val;
  };
  return {
    switch() {
      changeBy(1);
    },
    resetCount() {
      playerCount = 0;
    },
    checkPlayer() {
      return playerCount;
    },
  };
})();

const handleGameListener = (e) => {
  handleGameFlow(e);
};

function handleGameFlow(e) {
  const currentPositions = gameBoard.getPositions();
  const indexPosition = e.target.getAttribute('data-index-number');
  // Places the players marker on the board and displays the next players name
  const playMove = () => {
    if (currentPositions[indexPosition] !== '') {
    } else if (getPlayerTurn.checkPlayer() % 2 === 0) {
      gameBoard.placeMarker(indexPosition, 'X');
      playerNameDisplay.textContent = `${generatePlayers.playerOneName}'s turn`;
    } else {
      gameBoard.placeMarker(indexPosition, 'O');
      playerNameDisplay.textContent = `${generatePlayers.playerTwoName}'s turn`;
    }
  };

  // Generates the board using the current players array positions
  const generateBoard = () => {
    gameBoard.getPositions().forEach((item, index) => {
      boardSquares[index].innerText = item;
    });
  };

  playMove();
  generateBoard();
  getPlayerTurn.switch();
  checkForGameOver(currentPositions);
}

function checkForGameOver(currentPositions) {
  const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // Returns each players positions in a separate nested array
  const returnIndexes = currentPositions.reduce(
    (array, element, index) => {
      if (element === 'X') {
        array[0].push(index);
      } else if (element === 'O') {
        array[1].push(index);
      }
      return array;
    },
    [[], []]
  );
  // Loops through each players positions to look for a winner or draw
  winningPatterns.forEach((array) => {
    if (checkPatterns(returnIndexes[0], array)) {
      playerNameDisplay.textContent = `${generatePlayers.playerOneName} has won!`;
      endGame();
    } else if (checkPatterns(returnIndexes[1], array)) {
      playerNameDisplay.textContent = `${generatePlayers.playerTwoName} has won!`;
      endGame();
    } else if (returnIndexes[0].length === 5) {
      playerNameDisplay.textContent = `It's a draw!`;
      endGame();
    }
  });
}

function checkPatterns(indexes, array) {
  // Checks if either player has made a winning move
  return array.every((value) => indexes.includes(value));
}

function endGame() {
  for (i of boardSquares) {
    i.removeEventListener('click', handleGameListener);
    i.style.cursor = `not-allowed`;
  }
}

function resetGame() {
  gameBoard.getPositions().forEach((item, index) => {
    gameBoard.placeMarker(index, '');
  });
  gameBoard.generateNewBoard();
  getPlayerTurn.resetCount();
  playerNameDisplay.textContent = `${generatePlayers.playerOneName}'s turn`;
}

resetGameButton.addEventListener('click', resetGame);

// Modal event listeners
startGameButton.addEventListener('click', () => {
  selectGameTypeModal.style.display = 'flex';
  startGameButton.style.display = 'none';
});

twoPlayerModeButton.addEventListener('click', () => {
  selectGameTypeModal.style.display = 'none';
  twoPlayerFormModal.style.display = 'flex';
});
