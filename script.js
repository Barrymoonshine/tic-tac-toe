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

// Factory function to generate players
const playerFactory = (name, marker) => ({ name, marker });

const startComputerMode = () => {
  generatePlayers.playerOneName = 'Human player';
  generatePlayers.playerTwoName = 'The Super Computer';
  gameStatusDisplay.textContent = `${generatePlayers.playerOneName}'s turn`;

  gameBoard.generateNewBoard();
  getGameMode.activateComputerMode();
  displayController.displayFirstPlayer();
  displayController.displayGameArea();
};

const handleGameListener = (e) => {
  handleTwoPlayerGame(e);
};

const handleTwoPlayerGame = (e) => {
  const currentPositions = gameBoard.getPositions();
  const playerMove = e.target.getAttribute('data-index-number');
  const playerOne = playerFactory(
    document.getElementById('player-one-name').value,
    'X'
  );
  const playerTwo = playerFactory(
    document.getElementById('player-one-name').value,
    'O'
  );

  if (currentPositions[playerMove] !== '') {
  } else if (getPlayerTurn.checkPlayer() % 2 === 0) {
    gameFlowController.playMove(playerMove, 'X');
    displayController.changePlayerDisplay(playerTwo.name);
    gameFlowController.generateNextTurn('X', currentPositions);
    gameFlowController.checkEndGame('X', playerOne.name, currentPositions);
  } else {
    gameFlowController.playMove(playerMove, 'O');
    displayController.changePlayerDisplay(playerOne.name);
    gameFlowController.generateNextTurn('O', currentPositions);
    gameFlowController.checkEndGame('O', playerTwo.name, currentPositions);
  }
  gameFlowController.generateBoard(currentPositions);
};

const startTwoPlayerMode = (e) => {
  e.preventDefault();
  displayController.displayFirstPlayer();
  gameBoard.generateNewBoard();
  displayController.displayGameArea();
};

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
  const displayFirstPlayer = () => {
    if (getGameMode.checkForComputerMode() === false) {
      const playerOneName = playerFactory(
        document.getElementById('player-one-name').value
      );
      gameStatusDisplay.textContent = `${playerOneName.name}'s turn`;
    } else {
      gameStatusDisplay.textContent = `$Human players's turn`;
    }
  };
  const displayGameArea = () => {
    gameAreaContainer.style.display = 'flex';
    twoPlayerFormModal.style.display = 'none';
    selectGameTypeModal.style.display = 'none';
  };
  const changePlayerDisplay = (nextPlayersName) => {
    gameStatusDisplay.textContent = `${nextPlayersName}'s turn`;
  };
  const displayWinner = (currentPlayerName) => {
    gameStatusDisplay.textContent = `${currentPlayerName} has won!`;
  };
  const displayDraw = () => {
    gameStatusDisplay.textContent = `It's a draw!`;
  };
  return {
    displayFirstPlayer,
    displayGameArea,
    changePlayerDisplay,
    displayWinner,
    displayDraw,
  };
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

const gameFlowController = (() => {
  // Places the players marker on the board
  const playMove = (playerMove, playerMarker) => {
    gameBoard.placeMarker(playerMove, playerMarker);
  };

  // Generates the board using the current players array positions
  const generateBoard = (currentPositions) => {
    currentPositions.forEach((item, index) => {
      boardSquares[index].innerText = item;
    });
  };

  // Generates the next player's turn
  const generateNextTurn = (playerMarker, currentPositions) => {
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
  const checkEndGame = (playerMarker, playerName, currentPositions) => {
    if (getScore(currentPositions, playerMarker) === 10) {
      displayController.displayWinner(playerName);
      endGame();
    } else if (getScore(currentPositions, playerMarker) === 0) {
      displayController.displayDraw(playerName);
      endGame();
    }
  };
  return { playMove, generateBoard, checkEndGame, generateNextTurn };
})();

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
  displayController.displayFirstPlayer();
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
