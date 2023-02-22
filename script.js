const gameBoardContainer = document.getElementById("game-board-container");
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

gameBoardContainer.addEventListener("click", handleGameFlow);

const switchPlayer = (() => {
  // Module pattern to switch players between rounds
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
  } else if (switchPlayer.checkPlayer() % 2 === 0) {
    targetSquare.textContent = playerOne.marker;
    generateGameBoard.gameBoardArray[index] = playerOne.marker;
  } else {
    targetSquare.textContent = playerTwo.marker;
    generateGameBoard.gameBoardArray[index] = playerTwo.marker;
  }
  checkForWinner();
  switchPlayer.switch();
}

function checkForWinner() {
  const currentArray = generateGameBoard.gameBoardArray;
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
  // Displays message if there is a winner
  winningPatterns.forEach((array) => {
    if (checkWinningPattern(returnIndexes[0], array) === true) {
      alert("Player one has won!");
    } else if (checkWinningPattern(returnIndexes[1], array) === true) {
      alert("Player two has won!");
    }
  });
}

function checkWinningPattern(indexes, array) {
  // Loops through the winning index values to check,
  // if they are contained in the current game board array
  // Re-usable function for checking multiple winning patterns
  return array.every((value) => indexes.includes(value));
}
