const gameBoardContainer = document.getElementById("game-board-container");
let count = 0;
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

// Module pattern to generate the game board and array
const gameBoard = (function () {
  for (i = 0; i < 9; i++) {
    const boardSquare = document.createElement("div");
    boardSquare.className = "board-squares";
    boardSquare.id = i;
    gameBoardContainer.appendChild(boardSquare);
  }
  const gameBoardArray = ["", "", "", "", "", "", "", "", ""];
  return {
    gameBoardArray,
  };
})();

// Factory function to generate players
const playerFactory = (name, marker) => ({ name, marker });
const playerOne = playerFactory("playerOne", "X");
const playerTwo = playerFactory("playerTwo", "O");

gameBoardContainer.addEventListener("click", handleGameFlow);

function handleGameFlow(e) {
  // Checks which player's using a counter, even is playerOne, odd playerTwo
  // Checks if a square has already been used

  const targetSquare = document.getElementById(e.target.id);
  const index = targetSquare.id;
  if (targetSquare.textContent == "X" || targetSquare.textContent == "O") {
  } else if (count % 2 === 0) {
    targetSquare.textContent = playerOne.marker;
    gameBoard.gameBoardArray[index] = playerOne.marker;
  } else {
    targetSquare.textContent = playerTwo.marker;
    gameBoard.gameBoardArray[index] = playerTwo.marker;
  }
  checkForWinner();
  incrementByOne();
}

const incrementByOne = () => {
  count++;
};

function checkForWinner() {
  const currentArray = gameBoard.gameBoardArray;
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
  // Loops through winning index positions
  // Returns congratulations message to winner
  winningPatterns.forEach((array) => {
    if (multipleInArray(returnIndexes[0], array) === true) {
      alert("Player one has won!");
    } else if (multipleInArray(returnIndexes[1], array) === true) {
      alert("Player two has won!");
    }
  });
}

function multipleInArray(indexes, array) {
  // Loops through the winning index values to check,
  // if they are contained in the current game board array
  // Re-usable function for checking multiple winning patterns
  return array.every((value) => indexes.includes(value));
}
