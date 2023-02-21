const gameBoardContainer = document.getElementById("game-board-container");
let count = 0;
const horizontalWinOne = [0, 1, 2];
const horizontalWinTwo = [3, 4, 5];
const horizontalWinThree = [6, 7, 8];
const verticalWinOne = [0, 3, 6];
const verticalWinTwo = [1, 4, 7];
const verticalWinThree = [2, 5, 8];
const diagonalWinOne = [0, 4, 8];
const diagonalWinTwo = [2, 4, 6];

// Module pattern to generate game board array
const gameBoard = (function () {
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
  // Checks which player's using a counter, odd is playerOne, odd playerTwo
  // Checks if a square has already been used
  incrementByOne();
  const targetSquare = document.getElementById(e.target.id);
  const index = targetSquare.id;
  if (targetSquare.textContent == "X" || targetSquare.textContent == "O") {
  } else if (count % 2 !== 0) {
    targetSquare.textContent = playerOne.marker;
    gameBoard.gameBoardArray[index] = playerOne.marker;
  } else {
    targetSquare.textContent = playerTwo.marker;
    gameBoard.gameBoardArray[index] = playerTwo.marker;
  }
  checkForWinner();
}

function renderGameBoard() {
  for (i = 0; i < 9; i++) {
    const boardSquare = document.createElement("div");
    boardSquare.className = "board-squares";
    boardSquare.id = i;
    gameBoardContainer.appendChild(boardSquare);
  }
}

renderGameBoard();

const incrementByOne = () => {
  count++;
};

function checkForWinner() {
  const currentArray = gameBoard.gameBoardArray;

  // Loops through the game board array,
  // And returns the index value for player ones marker
  const playerOneIndexes = currentArray.reduce((array, element, index) => {
    if (element === "X") {
      array.push(index);
    }
    return array;
  }, []);

  // Loops through the winning index values to check,
  // if they are contained in the current game board array
  const checkForWinningCombination = horizontalWinOne.every((value) =>
    playerOneIndexes.includes(value)
  );

  if (checkForWinningCombination === true) {
    alert("Player one has won!");
  }
}
