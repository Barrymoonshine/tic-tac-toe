const startGameButton = document.getElementById('modal-button');
const selectGameTypeModal = document.getElementById('game-type-modal');
const twoPlayerModeButton = document.getElementById('two-player-mode');
const vsComputerModeButton = document.getElementById('vs-computer-mode');
const twoPlayerFormModal = document.getElementById('new-game-modal');
const playerNamesForm = document.getElementById('player-names-form');
const gameAreaContainer = document.getElementById('game-area-container');
const resetGameButton = document.getElementById('reset-button');
const playerNameDisplay = document.getElementById('player-name-display');
const boardSquares = document.getElementsByClassName('board-squares');

const humanMarker = 'X';
const computerMarker = 'O';

const generatePlayers = (() => {
  const playerOneName = '';
  const playerTwoName = '';
  return {
    playerOneName,
    playerTwoName,
  };
})();

const startComputerMode = () => {
  generatePlayers.playerOneName = 'Human player';
  generatePlayers.playerTwoName = 'The Super Computer';
  playerNameDisplay.textContent = `${generatePlayers.playerOneName}'s turn`;
  selectGameTypeModal.style.display = 'none';
  gameAreaContainer.style.display = 'flex';
  gameBoard.generateNewBoard();
  getGameMode.activateComputerMode();
};

vsComputerModeButton.addEventListener('click', startComputerMode);

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

const getGameMode = (() => {
  let computerMode = false;
  const activateComputerMode = () => {
    computerMode = true;
  };
  return {
    activateComputerMode,
    checkMode() {
      return computerMode;
    },
  };
})();

const handleGameListener = (e) => {
  handleUserMove(e);
};

const handleUserMove = (e) => {
  const userMove = e.target.getAttribute('data-index-number');
  handleGameFlow(userMove);
};

// Generates a random move for the computer player
// const handleRandomComputerMove = () => {
//   const randomComputerMove = Math.round(Math.random() * 9);
//   if (gameBoard.getPositions()[randomComputerMove] !== '') {
//     handleComputerMove();
//   } else if (gameBoard.getPositions()[randomComputerMove] === '') {
//     handleGameFlow(randomComputerMove);
//   }
// };

const handleBestComputerMove = () => {
  const currentGameBoard = () => {
    const board = [];
    for (square of boardSquares) {
      board.push(square.innerText);
    }
    return board;
  };
  const bestMove = findBestMove(currentGameBoard());
  console.log(bestMove);
  handleGameFlow(bestMove);
};

function handleGameFlow(playerMove) {
  const currentPositions = gameBoard.getPositions();
  // Places the players marker on the board and displays the next players name
  const playMove = () => {
    if (currentPositions[playerMove] !== '') {
    } else if (getPlayerTurn.checkPlayer() % 2 === 0) {
      gameBoard.placeMarker(playerMove, 'X');
      playerNameDisplay.textContent = `${generatePlayers.playerTwoName}'s turn`;
    } else {
      gameBoard.placeMarker(playerMove, 'O');
      playerNameDisplay.textContent = `${generatePlayers.playerOneName}'s turn`;
    }
  };

  // Generates the board using the current players array positions
  const generateBoard = () => {
    currentPositions.forEach((item, index) => {
      boardSquares[index].innerText = item;
    });
  };

  // Generates the next player's turn
  const generateNextTurn = () => {
    getPlayerTurn.switch();
    if (
      playerNameDisplay.textContent.includes('won') ||
      playerNameDisplay.textContent.includes('draw') ||
      getGameMode.checkMode() === false ||
      getPlayerTurn.checkPlayer() % 2 === 0
    ) {
    } else {
      handleBestComputerMove();
    }
  };

  playMove();
  generateBoard();
  checkForGameOver(currentPositions);
  generateNextTurn();
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

// Unbeatable AI minimax algorithm

function minimax(board, depth, maximizingPlayer) {
  const playerScore = getScore(board, humanMarker);
  const computerScore = getScore(board, computerMarker);

  if (playerScore === 10) {
    return depth - playerScore;
  }
  if (computerScore === 10) {
    return computerScore - depth;
  }
  if (playerScore === 0 || computerScore === 0) {
    return 0;
  }

  if (maximizingPlayer) {
    let best = -Infinity;
    board.forEach((item, index) => {
      if (item === '') {
        board[index] = computerMarker;
        const score = minimax(board, depth - 1, false);
        best = Math.max(best, score);
        board[index] = '';
      }
    });
    return best;
  }
  let best = Infinity;
  board.forEach((item, index) => {
    if (item === '') {
      board[index] = humanMarker;
      const score = minimax(board, depth - 1, true);
      best = Math.min(best, score);
      board[index] = '';
    }
  });
  return best;
}

function findBestMove(currentBoard) {
  let bestVal = -Infinity;
  let bestMove;
  currentBoard.forEach((item, index) => {
    if (item === '') {
      currentBoard[index] = computerMarker;
      const score = minimax(currentBoard, 0, false);
      currentBoard[i] = '';
      if (score > bestVal) {
        bestVal = score;
        bestMove = index;
      }
    }
  });
  return bestMove;
}

function getScore(board, mark) {
  const returnIndexes = board.reduce(
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
  if (
    (board[0] === mark && board[1] === mark && board[2] === mark) ||
    (board[3] === mark && board[4] === mark && board[5] === mark) ||
    (board[6] === mark && board[7] === mark && board[8] === mark) ||
    (board[0] === mark && board[3] === mark && board[6] === mark) ||
    (board[1] === mark && board[4] === mark && board[7] === mark) ||
    (board[2] === mark && board[5] === mark && board[8] === mark) ||
    (board[0] === mark && board[4] === mark && board[8] === mark) ||
    (board[2] === mark && board[4] === mark && board[6] === mark)
  ) {
    return 10;
  }
  if (returnIndexes[0].length === 5) {
    return 0;
  }
}
