const boardSquares = document.getElementsByClassName('board-squares');

const GameBoardController = (() => {
  const gameBoardArray = ['', '', '', '', '', '', '', '', ''];
  const placeMarker = (index, marker) => {
    gameBoardArray[index] = marker;
  };
  const getPositions = () => gameBoardArray;
  return {
    getPositions,
    placeMarker,
  };
})();

const GameModeController = (() => {
  let computerMode = false;
  const activateComputerMode = () => {
    computerMode = true;
  };
  const checkForComputerMode = () => computerMode;
  return {
    activateComputerMode,
    checkForComputerMode,
  };
})();

const PlayerController = (() => {
  let isPlayerOneActive = true;
  const checkActivePlayer = () => isPlayerOneActive;
  const switchActivePlayer = () => {
    isPlayerOneActive = !isPlayerOneActive;
    return isPlayerOneActive;
  };
  const resetActivePlayer = () => {
    isPlayerOneActive = true;
  };
  const PlayerFactory = (name, marker) => ({ name, marker });
  const getActivePlayerTwoPlayerMode = () => {
    const playerOneName = document.getElementById('player-one-name').value;
    const playerTwoName = document.getElementById('player-two-name').value;
    if (isPlayerOneActive) {
      return PlayerFactory(playerOneName, 'X');
    }
    return PlayerFactory(playerTwoName, 'O');
  };
  const getActivePlayerComputerMode = () => {
    if (isPlayerOneActive) {
      return PlayerFactory('Human player', 'X');
    }
    return PlayerFactory('The Super Computer', 'O');
  };
  return {
    checkActivePlayer,
    switchActivePlayer,
    resetActivePlayer,
    getActivePlayerTwoPlayerMode,
    getActivePlayerComputerMode,
  };
})();

const DisplayController = (() => {
  const startGameButton = document.getElementById('modal-button');
  const selectGameTypeModal = document.getElementById('game-type-modal');
  const twoPlayerModeButton = document.getElementById('two-player-mode');
  const twoPlayerFormModal = document.getElementById('new-game-modal');
  const gameAreaContainer = document.getElementById('game-area-container');
  const gameStatusDisplay = document.getElementById('game-status-display');
  let activePlayer = '';

  startGameButton.addEventListener('click', () => {
    selectGameTypeModal.style.display = 'flex';
    startGameButton.style.display = 'none';
  });
  twoPlayerModeButton.addEventListener('click', () => {
    selectGameTypeModal.style.display = 'none';
    twoPlayerFormModal.style.display = 'flex';
  });
  const getActivePlayerName = () => {
    if (GameModeController.checkForComputerMode() === false) {
      activePlayer = PlayerController.getActivePlayerTwoPlayerMode().name;
    } else {
      activePlayer = PlayerController.getActivePlayerComputerMode().name;
    }
  };
  const displayFirstPlayer = () => {
    getActivePlayerName();
    gameStatusDisplay.textContent = `${activePlayer}'s turn`;
  };
  const displayGameArea = () => {
    gameAreaContainer.style.display = 'flex';
    twoPlayerFormModal.style.display = 'none';
    selectGameTypeModal.style.display = 'none';
  };
  const displayNextPlayer = () => {
    getActivePlayerName();
    gameStatusDisplay.textContent = `${activePlayer}'s turn`;
  };
  const displayWinner = () => {
    getActivePlayerName();
    gameStatusDisplay.textContent = `${activePlayer} has won!`;
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

const GameFlowController = (() => {
  const resetGameButton = document.getElementById('reset-button');
  const playerNamesForm = document.getElementById('player-names-form');
  const vsComputerModeButton = document.getElementById('vs-computer-mode');

  const generateNewBoard = () => {
    for (i of boardSquares) {
      i.innerText = '';
      i.style.cursor = `pointer`;
      i.addEventListener('click', handlePlayerMove);
    }
  };

  const startTwoPlayerMode = (e) => {
    e.preventDefault();
    DisplayController.displayFirstPlayer();
    generateNewBoard();
    DisplayController.displayGameArea();
  };
  playerNamesForm.addEventListener('submit', startTwoPlayerMode);

  const startComputerMode = () => {
    GameModeController.activateComputerMode();
    DisplayController.displayFirstPlayer();
    generateNewBoard();
    DisplayController.displayGameArea();
  };
  vsComputerModeButton.addEventListener('click', startComputerMode);

  const playMove = (playerMove, playerMarker) => {
    GameBoardController.placeMarker(playerMove, playerMarker);
  };
  const generateBoard = (currentPositions) => {
    currentPositions.forEach((item, index) => {
      boardSquares[index].innerText = item;
    });
  };

  const checkForEndGame = (board, mark) => {
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
    const playerOneTurns = board.filter(
      (boardPosition) => boardPosition === 'X'
    );
    // Draw
    if (playerOneTurns.length === 5) {
      return 0;
    }
  };
  const generateComputerMove = (currentPositions) => {
    if (GameFlowController.checkForEndGame(currentPositions, 'X') === 0) {
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

  const handleGame = (playerMove, playerMarker) => {
    const currentPositions = GameBoardController.getPositions();
    // Stops move being placed in empty cell
    if (currentPositions[playerMove] !== '') {
    } else {
      playMove(playerMove, playerMarker);
      generateBoard(currentPositions);
      // Win
      if (checkForEndGame(currentPositions, playerMarker) === 10) {
        DisplayController.displayWinner();
        endGame();
        // Draw
      } else if (checkForEndGame(currentPositions, playerMarker) === 0) {
        DisplayController.displayDraw();
        endGame();
        // Else next round
      } else {
        PlayerController.switchActivePlayer();
        DisplayController.displayNextPlayer();
        generateComputerMove(currentPositions);
      }
    }
  };

  const handlePlayerMove = (e) => {
    // Two player mode
    if (GameModeController.checkForComputerMode() === false) {
      const playerMove = e.target.getAttribute('data-index-number');
      const playerMarker =
        PlayerController.getActivePlayerTwoPlayerMode().marker;
      handleGame(playerMove, playerMarker);
      // Human player computer mode
    } else if (
      GameModeController.checkForComputerMode() === true &&
      PlayerController.checkActivePlayer() === true &&
      isNaN(e)
    ) {
      const playerMove = e.target.getAttribute('data-index-number');
      const playerMarker =
        PlayerController.getActivePlayerComputerMode().marker;
      handleGame(playerMove, playerMarker);
      // Computer player computer mode
    } else if (
      GameModeController.checkForComputerMode() === true &&
      PlayerController.checkActivePlayer() === false
    ) {
      const playerMarker =
        PlayerController.getActivePlayerComputerMode().marker;
      handleGame(e, playerMarker);
    }
  };

  const findBestMove = (board) => {
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

  const resetGame = () => {
    GameBoardController.getPositions().forEach((item, index) => {
      GameBoardController.placeMarker(index, '');
    });
    generateNewBoard();
    PlayerController.resetActivePlayer();
    DisplayController.displayFirstPlayer();
  };
  resetGameButton.addEventListener('click', resetGame);

  return {
    startTwoPlayerMode,
    startComputerMode,
    playMove,
    generateBoard,
    checkForEndGame,
    generateComputerMove,
    endGame,
    handleGame,
    handlePlayerMove,
    resetGame,
  };
})();

function minimax(board, depth, maximizingPlayer) {
  const playerScore = GameFlowController.checkForEndGame(board, 'X');
  const computerScore = GameFlowController.checkForEndGame(board, 'O');

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
