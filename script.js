const createGameBoard = (function () {
  const gameBoard = ["", "", "", "", "", "", "", "", ""];
  return {
    gameBoard,
  };
})();

const playerFactory = (name, selector) => ({ name, selector });

const playerOne = playerFactory("playerOne", "X");

const playerTwo = playerFactory("playerTwo", "O");

function renderGameBoard() {
  for (i = 0; i < 9; i++) {
    const boardSquare = document.createElement("div");
    boardSquare.className = "boardSquares";
    boardSquare.id = i;
    boardSquare.textContent = createGameBoard.gameBoard[i];
    document.getElementById("container").appendChild(boardSquare);
  }
}

renderGameBoard();

const boardSquares = document.getElementsByClassName("boardSquares");

function applyEventListeners() {
  for (i of boardSquares) {
    i.addEventListener("click", getPlayer(e));
  }
}

// Factory function to generate a private variable count to keep this safe from cheating,
// which increments by 1 each time function is called
const counterCreator = () => {
  let count = 0;
  return () => {
    count++;
  };
};

const counter = counterCreator();

const getPlayer = function (e) {
  // Checks which player's turn it should be using a counter,
  // even is playerOne, odd playerTwo,
  // note use array methods and the target id to update the appropriate array index
  counter();
  if (counter % 2 == 0) {
  }
};
