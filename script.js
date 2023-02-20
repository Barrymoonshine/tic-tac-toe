const gameBoardContainer = document.getElementById("game-board-container");
let count = 0;

function getAllIndexes() {
  const currentArray = gameBoard.gameBoardArray;
  currentArray.reduce((array, element, index) => {
    if (element === "X") {
      array.push(index);
    }
    return array;
  }, []);
}

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
  console.log(targetSquare);
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
  // Checks if the current gameBoardArray matches a winning pattern and returns,
  // a congratulations message
  getAllIndexes();
}
