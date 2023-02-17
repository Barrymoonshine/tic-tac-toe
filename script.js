const gameBoardContainer = document.getElementById("game-board-container");
let count = 0;

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

gameBoardContainer.addEventListener("click", (e) => {
  // Checks which player's turn it should be using a counter,
  // even is playerOne, odd playerTwo,
  // note use array methods and the target id to update the appropriate array index
  incrementByOne();
  const targetSquare = document.getElementById(e.target.id);
  const index = targetSquare.id;
  if (count % 2 !== 0) {
    targetSquare.textContent = playerOne.marker;
    gameBoard.gameBoardArray[index] = playerOne.marker;
    console.log("playerOne");
    console.log(count);
  } else {
    targetSquare.textContent = playerTwo.marker;
    gameBoard.gameBoardArray[index] = playerTwo.marker;
    console.log("playerTwo");
    console.log(count);
  }
});
