const gameBoardContainer = document.getElementById("game-board-container");
let count = 0;

const createGameBoard = (function () {
  const gameBoard = ["", "", "", "", "", "", "", "", ""];
  return {
    gameBoard,
  };
})();

const playerFactory = (name, marker) => ({ name, marker });

const playerOne = playerFactory("playerOne", "X");

const playerTwo = playerFactory("playerTwo", "O");

function renderGameBoard() {
  for (i = 0; i < 9; i++) {
    const boardSquare = document.createElement("div");
    boardSquare.className = "board-squares";
    boardSquare.id = i;
    boardSquare.textContent = createGameBoard.gameBoard[i];
    gameBoardContainer.appendChild(boardSquare);
  }
}

renderGameBoard();

// Factory function to generate a private variable count to keep this safe from cheating,
// which increments by 1 each time function is called
function incrementByOne() {
  count++;
}

gameBoardContainer.addEventListener("click", (e) => {
  // Checks which player's turn it should be using a counter,
  // even is playerOne, odd playerTwo,
  // note use array methods and the target id to update the appropriate array index
  incrementByOne();
  console.log(count);
  const targetSquare = document.getElementById(e.target.id);
  if (count % 2 === 0) {
    targetSquare.textContent = playerOne.marker;
  } else {
    targetSquare.textContent = playerTwo.marker;
  }
});
