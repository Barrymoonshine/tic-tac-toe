const gameBoardContainer = document.getElementById("game-board-container");
const modal = document.getElementById("new-game-modal");
const startGameButton = document.getElementById("modal-button");
const submitNames = document.getElementById("player-names-form");

submitNames.addEventListener("submit", startGame);

function startGame(e) {
  e.preventDefault();
  gameBoardContainer.style.display = "grid";
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
const playerOne = generatePlayers("playerOne", "X");
const playerTwo = generatePlayers("playerTwo", "O");

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
  if (targetSquare.textContent == "X" || targetSquare.textContent == "O") {
  } else if (getPlayer.checkPlayer() % 2 === 0) {
    targetSquare.textContent = playerOne.marker;
    generateGameBoard.gameBoardArray[index] = playerOne.marker;
  } else {
    targetSquare.textContent = playerTwo.marker;
    generateGameBoard.gameBoardArray[index] = playerTwo.marker;
  }
  checkResults();
  getPlayer.switch();
}

function checkResults() {
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
      if (element === playerOne.marker) {
        array[0].push(index);
      } else if (element === playerTwo.marker) {
        array[1].push(index);
      }
      return array;
    },
    [[], []]
  );

  // Compares each players index position with the winning patterns
  // Displays message if there is a winner or draw
  winningPatterns.forEach((array) => {
    if (checkWinningPattern(returnIndexes[0], array)) {
      alert("Player one has won!");
      generateGameBoard();
    } else if (checkWinningPattern(returnIndexes[1], array)) {
      alert("Player two has won!");
      generateGameBoard();
    } else if (returnIndexes[0].length === 5) {
      alert("It's a draw!");
      generateGameBoard();
    }
  });
}

function checkWinningPattern(indexes, array) {
  // Loops through the winning index values to check,
  // if they are contained in the current game board array
  return array.every((value) => indexes.includes(value));
}

// Modal event listeners
startGameButton.addEventListener("click", () => {
  modal.style.display = "flex";
  body.style.backgroundColor = "rgba (0,0,0,0.4)";
});
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
