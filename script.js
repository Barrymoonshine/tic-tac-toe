const startGameButton = document.getElementById('modal-button');
const selectGameTypeModal = document.getElementById('game-type-modal');
const twoPlayerModeButton = document.getElementById('two-player-mode');
const vsComputerModeButton = document.getElementById('vs-computer-mode');
const twoPlayerFormModal = document.getElementById('new-game-modal');
const playerNamesForm = document.getElementById('player-names-form');
const gameAreaContainer = document.getElementById('game-area-container');
const resetGameButton = document.getElementById('reset-button');
const gameStatusDisplay = document.getElementById('game-status-display');
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
  gameStatusDisplay.textContent = `${generatePlayers.playerOneName}'s turn`;
  selectGameTypeModal.style.display = 'none';
  gameAreaContainer.style.display = 'flex';
  gameBoard.generateNewBoard();
  getGameMode.activateComputerMode();
};

const startTwoPlayerMode = (e) => {
  e.preventDefault();
  const nameOne = document.getElementById('player-one-name').value;
  const nameTwo = document.getElementById('player-two-name').value;
  generatePlayers.playerOneName = nameOne;
  generatePlayers.playerTwoName = nameTwo;
  gameStatusDisplay.textContent = `${nameOne}'s turn`;
  gameBoard.generateNewBoard();
  gameAreaContainer.style.display = 'flex';
  twoPlayerFormModal.style.display = 'none';
};

// Module function to control changes to display elements
const displayController = (() => {
  startGameButton.addEventListener('click', () => {
    selectGameTypeModal.style.display = 'flex';
    startGameButton.style.display = 'none';
  });
  twoPlayerModeButton.addEventListener('click', () => {
    selectGameTypeModal.style.display = 'none';
    twoPlayerFormModal.style.display = 'flex';
  });
  vsComputerModeButton.addEventListener('click', startComputerMode);
  playerNamesForm.addEventListener('submit', startTwoPlayerMode);
  const changePlayerDisplay = () => {
    if (getPlayerTurn.checkPlayer() % 2 === 0) {
      gameStatusDisplay.textContent = `${generatePlayers.playerTwoName}'s turn`;
    } else {
      gameStatusDisplay.textContent = `${generatePlayers.playerOneName}'s turn`;
    }
  };
  const displayWinner = () => {
    if (getPlayerTurn.checkPlayer() % 2 === 0) {
      gameStatusDisplay.textContent = `${generatePlayers.playerOneName} has won!`;
    } else {
      gameStatusDisplay.textContent = `${generatePlayers.playerTwoName} has won!`;
    }
  };
  const displayDraw = () => {
    gameStatusDisplay.textContent = `It's a draw!`;
  };
  return { changePlayerDisplay, displayWinner, displayDraw };
})();

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
    checkForComputerMode() {
      return computerMode;
    },
  };
})();

const handleGameListener = (e) => {
  handleUserMove(e);
};

const handleUserMove = (e) => {
  const userMove = e.target.getAttribute('data-index-number');
  if (getPlayerTurn.checkPlayer() % 2 === 0) handleGameFlow(userMove, 'X');
  else {
    handleGameFlow(userMove, 'O');
  }
};

const handleBestComputerMove = () => {
  const currentGameBoard = () => {
    const board = [];
    for (square of boardSquares) {
      board.push(square.innerText);
    }
    return board;
  };
  const bestMove = findBestMove(currentGameBoard());
  handleGameFlow(bestMove, 'O');
};

function handleGameFlow(playerMove, playerMarker) {
  const currentPositions = gameBoard.getPositions();

  // Places the players marker on the board and displays the next players name
  const playMove = () => {
    if (currentPositions[playerMove] !== '') {
    } else {
      gameBoard.placeMarker(playerMove, playerMarker);
      displayController.changePlayerDisplay();
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
      getScore(currentPositions, playerMarker) === 10 ||
      getScore(currentPositions, playerMarker) === 0 ||
      getGameMode.checkForComputerMode() === false ||
      getPlayerTurn.checkPlayer() % 2 === 0
    ) {
    } else {
      handleBestComputerMove();
    }
  };

  // Checks for an end game state
  const checkEndGame = () => {
    if (getScore(currentPositions, playerMarker) === 10) {
      displayController.displayWinner();
      endGame();
    } else if (getScore(currentPositions, playerMarker) === 0) {
      displayController.displayDraw();
      endGame();
    }
  };

  playMove();
  generateBoard();
  checkEndGame();
  generateNextTurn();
}

function getScore(board, mark) {
  const playerOneTurns = board.reduce((array, element, index) => {
    if (element === 'X') {
      array.push(index);
    }
    return array;
  }, []);
  // win
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
  // Draw
  if (playerOneTurns.length === 5) {
    return 0;
  }
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
  gameStatusDisplay.textContent = `${generatePlayers.playerOneName}'s turn`;
}

resetGameButton.addEventListener('click', resetGame);

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

function findBestMove(board) {
  let bestVal = -Infinity;
  let bestMove;
  board.forEach((item, index) => {
    if (item === '') {
      board[index] = computerMarker;
      const score = minimax(board, 0, false);
      board[index] = '';
      if (score > bestVal) {
        bestVal = score;
        bestMove = index;
      }
    }
  });
  return bestMove;
}

// Generates a random move for the computer player
// const handleRandomComputerMove = () => {
//   const randomComputerMove = Math.round(Math.random() * 9);
//   if (gameBoard.getPositions()[randomComputerMove] !== '') {
//     handleComputerMove();
//   } else if (gameBoard.getPositions()[randomComputerMove] === '') {
//     handleGameFlow(randomComputerMove);
//   }
// };
