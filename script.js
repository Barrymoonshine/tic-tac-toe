const startGameButton = document.getElementById("modal-button");
const modal = document.getElementById("new-game-modal");
const submitNamesForm = document.getElementById("player-names-form");
const gameAreaContainer = document.getElementById("game-area-container");
const resetGameButton = document.getElementById("reset-button");
const playerNameDisplay = document.getElementById("player-name-display");
const gameBoardContainer = document.getElementById("game-board-container");
const boardSquares = document.getElementsByClassName("board-squares");

const handleGameListener = (e) => {
  // Checks that the target id only contains numbers and is therefore a game board cell
  handleGameFlow(e);
};

const handleForm = (e) => {
  e.preventDefault();
  const playerOneName = document.getElementById("player-one-name").value;
  playerNameDisplay.innerHTML = String.raw`
    ${playerOneName}'s turn
    `;
  generateGameBoard.generateNewBoard();
  gameAreaContainer.style.display = "flex";
  modal.style.display = "none";
};

submitNamesForm.addEventListener("submit", handleForm);

const generateGameBoard = (() => {
  // Module pattern and loop to generate the game board and array
  const gameBoardArray = [];
  const generateNewBoard = () => {
    for (i = 0; i < 9; i++) {
      gameBoardArray.push("");
    }
  };

  for (i of boardSquares) {
    i.addEventListener("click", handleGameListener);
  }

  return {
    generateNewBoard,
    gameBoardArray,
  };
})();

function generateNewGame() {
  while (gameBoardContainer.lastElementChild) {
    gameBoardContainer.removeChild(gameBoardContainer.lastElementChild);
  }
  generateGameBoard.gameBoardArray = [];
  generateGameBoard.generateNewBoard();
  getPlayer.resetCount();
  const playerOneName = document.getElementById("player-one-name").value;
  playerNameDisplay.innerHTML = String.raw`
    ${playerOneName}'s turn
    `;
}

resetGameButton.addEventListener("click", generateNewGame);

const getPlayer = (() => {
  // Module pattern to switch players each round using a private variable
  let playerCount = 0;
  function changeBy(val) {
    playerCount += val;
  }
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

function handleGameFlow(e) {
  const playerOneName = document.getElementById("player-one-name").value;
  const playerTwoName = document.getElementById("player-two-name").value;

  const squareIndex = e.target.getAttribute("data-index-number");

  const square = document.getElementById(e.target.id);

  // Stops markers being placed in cells already taken
  if (square.textContent == "X" || square.textContent == "O") {
  } else if (getPlayer.checkPlayer() % 2 === 0) {
    playerNameDisplay.innerHTML = String.raw`
    ${playerTwoName}'s turn
    `;
    square.textContent = "X";
    generateGameBoard.gameBoardArray[squareIndex] = "X";
  } else {
    playerNameDisplay.innerHTML = String.raw`
    ${playerOneName}' turn 
    `;
    square.textContent = "O";
    generateGameBoard.gameBoardArray[squareIndex] = "O";
  }
  checkForGameOver();
  getPlayer.switch();
}

function checkForGameOver() {
  const playerOneName = document.getElementById("player-one-name").value;
  const playerTwoName = document.getElementById("player-two-name").value;
  const currentArray = generateGameBoard.gameBoardArray;
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
  // Loops through the game board array,
  // And returns the index values for both players in a nested array
  const returnIndexes = currentArray.reduce(
    (array, element, index) => {
      if (element === "X") {
        array[0].push(index);
      } else if (element === "O") {
        array[1].push(index);
      }
      return array;
    },
    [[], []]
  );

  // Compares each players index position with the winning patterns
  // Displays message if there is a winner or draw
  winningPatterns.forEach((array) => {
    if (checkForWinningPattern(returnIndexes[0], array)) {
      playerNameDisplay.innerHTML = String.raw`
      ${playerOneName} has won
      `;
      endGame();
    } else if (checkForWinningPattern(returnIndexes[1], array)) {
      playerNameDisplay.innerHTML = String.raw`
      ${playerTwoName} has won
      `;
      endGame();
    } else if (returnIndexes[0].length === 5) {
      playerNameDisplay.innerHTML = String.raw`
      It's a draw!
      `;
      endGame();
    }
  });
}

function checkForWinningPattern(indexes, array) {
  // Loops through the winning index values to check,
  // if they are contained in the current game board array
  return array.every((value) => indexes.includes(value));
}

function endGame() {
  for (i of boardSquares) {
    i.removeEventListener("click", handleGameListener);
    i.style.cursor = `not-allowed`;
  }
}

// Modal event listeners
startGameButton.addEventListener("click", () => {
  modal.style.display = "flex";
  startGameButton.style.display = "none";
});
