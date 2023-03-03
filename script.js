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

const startComputerMode = () => {
  getGameMode.activateComputerMode();
  displayController.displayFirstPlayer();
  gameBoard.generateNewBoard();
  displayController.displayGameArea();
};

const playerDetails = (() => {
  let isPlayerOneActive = true;
  const resetActivePlayer = () => {
    isPlayerOneActive = true;
  };
  const switchActivePlayer = () => {
    if (isPlayerOneActive === true) {
      isPlayerOneActive = false;
    } else {
      isPlayerOneActive = true;
    }
  };
  const playerFactory = (name, marker) => ({ name, marker });
  return {
    checkActivePlayer() {
      return isPlayerOneActive;
    },
    resetActivePlayer,
    switchActivePlayer,
    getActivePlayerTwoPlayerMode() {
      if (isPlayerOneActive === true) {
        return playerFactory(
          document.getElementById('player-one-name').value,
          'X'
        );
      }
      return playerFactory(
        document.getElementById('player-two-name').value,
        'O'
      );
    },
    getActivePlayerComputerMode() {
      if (isPlayerOneActive === true) {
        return playerFactory('Human player', 'X');
      }
      return playerFactory('The Super Computer', 'O');
    },
  };
})();

const handleBestComputerMove = () => {
  const getGameBoardPositions = () => {
    const board = [];
    for (square of boardSquares) {
      board.push(square.innerText);
    }
    return board;
  };
  const bestMove = findBestMove(getGameBoardPositions());
  handleGameListener(bestMove);
};

const handleGameListener = (e) => {
  // Two player mode
  if (getGameMode.checkForComputerMode() === false) {
    const playerMove = e.target.getAttribute('data-index-number');
    const playerName = playerDetails.getActivePlayerTwoPlayerMode().name;
    const playerMarker = playerDetails.getActivePlayerTwoPlayerMode().marker;
    handleGame(playerMove, playerName, playerMarker);
    // Human player computer mode
  } else if (
    getGameMode.checkForComputerMode() === true &&
    playerDetails.checkActivePlayer() === true
  ) {
    const playerMove = e.target.getAttribute('data-index-number');
    const playerName = playerDetails.getActivePlayerComputerMode().name;
    const playerMarker = playerDetails.getActivePlayerComputerMode().marker;
    handleGame(playerMove, playerName, playerMarker);
    handleBestComputerMove();
    // Computer player computer mode
  } else {
    const playerName = playerDetails.getActivePlayerComputerMode().name;
    const playerMarker = playerDetails.getActivePlayerComputerMode().marker;
    handleGame(e, playerName, playerMarker);
  }
};

const handleGame = (playerMove, playerName, playerMarker) => {
  const currentPositions = gameBoard.getPositions();
  // Stops move being placed in empty cell
  if (currentPositions[playerMove] !== '') {
  } else {
    gameFlowController.playMove(playerMove, playerMarker);
    gameFlowController.generateBoard(currentPositions);
    // Win
    if (gameFlowController.getScore(currentPositions, playerMarker) === 10) {
      displayController.displayWinner(playerName);
      gameFlowController.endGame();
      // Draw
    } else if (
      gameFlowController.getScore(currentPositions, playerMarker) === 0
    ) {
      displayController.displayDraw();
      gameFlowController.endGame();
      // Else next round
    } else {
      playerDetails.switchActivePlayer();
      displayController.displayNextPlayer();
    }
  }
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
      gameStatusDisplay.textContent = `${
        document.getElementById('player-one-name').value
      }'s turn`;
    } else {
      gameStatusDisplay.textContent = `Human players's turn`;
    }
  };
  const displayGameArea = () => {
    gameAreaContainer.style.display = 'flex';
    twoPlayerFormModal.style.display = 'none';
    selectGameTypeModal.style.display = 'none';
  };
  const displayNextPlayer = () => {
    if (getGameMode.checkForComputerMode() === false) {
      gameStatusDisplay.textContent = `${
        playerDetails.getActivePlayerTwoPlayerMode().name
      }'s turn`;
    } else {
      gameStatusDisplay.textContent = `${
        playerDetails.getActivePlayerComputerMode().name
      }'s turn`;
    }
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
    displayNextPlayer,
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

const gameFlowController = (() => {
  const playMove = (playerMove, playerMarker) => {
    gameBoard.placeMarker(playerMove, playerMarker);
  };

  const generateBoard = (currentPositions) => {
    currentPositions.forEach((item, index) => {
      boardSquares[index].innerText = item;
    });
  };

  const getScore = (board, mark) => {
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
  };

  const endGame = () => {
    for (i of boardSquares) {
      i.removeEventListener('click', handleGameListener);
      i.style.cursor = `not-allowed`;
    }
  };

  return { playMove, generateBoard, getScore, endGame };
})();

function resetGame() {
  gameBoard.getPositions().forEach((item, index) => {
    gameBoard.placeMarker(index, '');
  });
  gameBoard.generateNewBoard();
  playerDetails.resetActivePlayer();
  displayController.displayFirstPlayer();
}

resetGameButton.addEventListener('click', resetGame);

// Unbeatable AI minimax algorithm

function minimax(board, depth, maximizingPlayer) {
  const playerScore = gameFlowController.getScore(board, humanMarker);
  const computerScore = gameFlowController.getScore(board, computerMarker);

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
