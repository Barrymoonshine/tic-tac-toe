const gameAreaContainer = document.getElementById("game-area-container");
const gameBoardContainer = document.getElementById("game-board-container");
const playerNameDisplay = document.getElementById("player-name-display");
const modal = document.getElementById("new-game-modal");
const startGameButton = document.getElementById("modal-button");
const submitNamesForm = document.getElementById("player-names-form");

submitNamesForm.addEventListener("submit", displayGameElements);

function displayGameElements(e) {
  e.preventDefault();
  gameAreaContainer.style.display = "flex";
  modal.style.display = "none";
}

const generateGameBoard = (() => {
  // Module pattern and loop to generate the game board and array
  const gameBoardArray = [];
  for (i = 0; i < 9; i++) {
    gameBoardContainer.innerHTML += String.raw`
    <div class="board-squares" id='${i}'>
    `;
    gameBoardArray.push("");
  }
  return {
    gameBoardArray,
  };
})();

// Factory function to generate players
const generatePlayers = (name, marker) => ({ name, marker });

gameBoardContainer.addEventListener("click", (e) => {
  // Checks that the target id only contains numbers and is therefore a game board cell
  if (String(e.target.id).match(/^[0-9]+$/)) {
    handleGameFlow(e);
  }
});

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
    checkPlayer() {
      return playerCount;
    },
  };
})();

function handleGameFlow(e) {
  const targetSquare = document.getElementById(e.target.id);
  const index = targetSquare.id;
  const playerOneName = document.getElementById("player-one-name").value;
  const playerTwoName = document.getElementById("player-two-name").value;
  const playerOne = generatePlayers(playerOneName, "X");
  const playerTwo = generatePlayers(playerTwoName, "O");
  // Stops players from playing in cells already taken
  if (targetSquare.textContent == "X" || targetSquare.textContent == "O") {
  } else if (getPlayer.checkPlayer() % 2 === 0) {
    playerNameDisplay.innerHTML = String.raw`
    ${playerOneName}'s turn
    `;
    targetSquare.textContent = playerOne.marker;
    generateGameBoard.gameBoardArray[index] = playerOne.marker;
  } else {
    playerNameDisplay.innerHTML = String.raw`
    ${playerTwoName}' turn 
    `;
    targetSquare.textContent = playerTwo.marker;
    generateGameBoard.gameBoardArray[index] = playerTwo.marker;
  }
  checkForGameOver();
  getPlayer.switch();
}

function checkForGameOver() {
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
    if (compareWithWinningPattern(returnIndexes[0], array)) {
      alert("Player one has won!");
      generateGameBoard();
    } else if (compareWithWinningPattern(returnIndexes[1], array)) {
      alert("Player two has won!");
      generateGameBoard();
    } else if (returnIndexes[0].length === 5) {
      alert("It's a draw!");
      generateGameBoard();
    }
  });
}

function compareWithWinningPattern(indexes, array) {
  // Loops through the winning index values to check,
  // if they are contained in the current game board array
  return array.every((value) => indexes.includes(value));
}

// Modal event listeners
startGameButton.addEventListener("click", () => {
  modal.style.display = "flex";
  startGameButton.style.display = "none";
});
