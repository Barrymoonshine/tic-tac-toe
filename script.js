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

const gameBoardController = (() => {
  const gameBoardArray = ['', '', '', '', '', '', '', '', ''];
  const generateNewBoard = () => {
    for (i of boardSquares) {
      i.innerText = '';
      i.style.cursor = `pointer`;
      i.addEventListener('click', handlePlayerMove);
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

const gameModeController = (() => {
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

const playerController = (() => {
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

const displayController = (() => {
  startGameButton.addEventListener('click', () => {
    selectGameTypeModal.style.display = 'flex';
    startGameButton.style.display = 'none';
  });
  twoPlayerModeButton.addEventListener('click', () => {
    selectGameTypeModal.style.display = 'none';
    twoPlayerFormModal.style.display = 'flex';
  });
  const displayFirstPlayer = () => {
    if (gameModeController.checkForComputerMode() === false) {
      gameStatusDisplay.textContent = `${
        document.getElementById('player-one-name').value
      }'s turn`;
    } else {
      gameStatusDisplay.textContent = `${
        playerController.getActivePlayerComputerMode().name
      }'s turn`;
    }
  };
  const displayGameArea = () => {
    gameAreaContainer.style.display = 'flex';
    twoPlayerFormModal.style.display = 'none';
    selectGameTypeModal.style.display = 'none';
  };
  const displayNextPlayer = () => {
    if (gameModeController.checkForComputerMode() === false) {
      gameStatusDisplay.textContent = `${
        playerController.getActivePlayerTwoPlayerMode().name
      }'s turn`;
    } else {
      gameStatusDisplay.textContent = `${
        playerController.getActivePlayerComputerMode().name
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

const gameFlowController = (() => {
  const playMove = (playerMove, playerMarker) => {
    gameBoardController.placeMarker(playerMove, playerMarker);
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
  const generateComputerMove = (currentPositions) => {
    if (gameFlowController.getScore(currentPositions, 'X') === 0) {
    } else {
      handleBestComputerMove();
    }
  };
  const endGame = () => {
    for (i of boardSquares) {
      i.removeEventListener('click', handlePlayerMove);
      i.style.cursor = `not-allowed`;
    }
  };

  return { playMove, generateBoard, getScore, generateComputerMove, endGame };
})();

function minimax(board, depth, maximizingPlayer) {
  const playerScore = gameFlowController.getScore(board, 'X');
  const computerScore = gameFlowController.getScore(board, 'O');

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
        board[index] = 'O';
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
      board[index] = 'X';
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
      board[index] = 'O';
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

const handleGame = (playerMove, playerName, playerMarker) => {
  const currentPositions = gameBoardController.getPositions();
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
      playerController.switchActivePlayer();
      displayController.displayNextPlayer();
      gameFlowController.generateComputerMove(currentPositions);
    }
  }
};

const handlePlayerMove = (e) => {
  // Two player mode
  if (gameModeController.checkForComputerMode() === false) {
    const playerMove = e.target.getAttribute('data-index-number');
    const playerName = playerController.getActivePlayerTwoPlayerMode().name;
    const playerMarker = playerController.getActivePlayerTwoPlayerMode().marker;
    handleGame(playerMove, playerName, playerMarker);
    // Human player computer mode
  } else if (
    gameModeController.checkForComputerMode() === true &&
    playerController.checkActivePlayer() === true &&
    isNaN(e)
  ) {
    const playerMove = e.target.getAttribute('data-index-number');
    const playerName = playerController.getActivePlayerComputerMode().name;
    const playerMarker = playerController.getActivePlayerComputerMode().marker;
    handleGame(playerMove, playerName, playerMarker);
    // Computer player computer mode
  } else if (
    gameModeController.checkForComputerMode() === true &&
    playerController.checkActivePlayer() === false
  ) {
    const playerName = playerController.getActivePlayerComputerMode().name;
    const playerMarker = playerController.getActivePlayerComputerMode().marker;
    handleGame(e, playerName, playerMarker);
  }
};

const handleBestComputerMove = () => {
  const getGameBoardPositions = () => {
    const board = [];
    for (square of boardSquares) {
      board.push(square.innerText);
    }
    return board;
  };
  const bestMove = findBestMove(getGameBoardPositions());
  handlePlayerMove(bestMove);
};

const startTwoPlayerMode = (e) => {
  e.preventDefault();
  displayController.displayFirstPlayer();
  gameBoardController.generateNewBoard();
  displayController.displayGameArea();
};
playerNamesForm.addEventListener('submit', startTwoPlayerMode);

const startComputerMode = () => {
  gameModeController.activateComputerMode();
  displayController.displayFirstPlayer();
  gameBoardController.generateNewBoard();
  displayController.displayGameArea();
};
vsComputerModeButton.addEventListener('click', startComputerMode);

function resetGame() {
  gameBoardController.getPositions().forEach((item, index) => {
    gameBoardController.placeMarker(index, '');
  });
  gameBoardController.generateNewBoard();
  playerController.resetActivePlayer();
  displayController.displayFirstPlayer();
}
resetGameButton.addEventListener('click', resetGame);
