import "./styles.css";

// document.getElementById("app").innerHTML = `

// `;
const cellValues = Array(9).fill(null);
const cells = document.querySelectorAll(".cell");

const winningPoss = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const checkWinStatus = function () {
  for (let i = 0; i < winningPoss.length; i++) {
    const [a, b, c] = winningPoss[i];
    if (
      cellValues[a] &&
      cellValues[a] === cellValues[b] &&
      cellValues[a] === cellValues[c]
    ) {
      return cellValues[a] === "X" ? "You win" : "You loss";
    }
  }

  return false;
};

// computer need to know
// computer want to win and dont let player to win
const calIndToWin = function (player) {
  // will calculate next move to win for a player
  // if player have two x in winning
  for (let i = 0; i < winningPoss.length; i++) {
    const [a, b, c] = winningPoss[i]; // (a,b), (b,c), (a,c)
    if (
      cellValues[a] &&
      cellValues[b] &&
      cellValues[a] === player &&
      cellValues[b] === player &&
      !cellValues[c]
    ) {
      return c;
    } else if (
      cellValues[a] &&
      cellValues[c] &&
      cellValues[a] === player &&
      cellValues[c] === player &&
      !cellValues[b]
    ) {
      return b;
    } else if (
      cellValues[c] &&
      cellValues[b] &&
      cellValues[b] === player &&
      cellValues[c] === player &&
      !cellValues[a]
    ) {
      return a;
    }
  }

  return -1; // when next move is not possible to win
};

//cases
// after play either win if not then next to this move should win
const calWinningMove = function () {
  // find best move for com
  const winMove = calIndToWin("O"); // index to play for computer to win in this move, return index only when there are already two "O" in win move
  if (winMove !== -1) {
    return winMove;
  } // after this play their should be possibility for computer to play winning move
  else {
    // find best move for computer becuase till now there is no possibility for computer to win in this turn
    // iterate over every move and check ?
    console.log("here");
    for (let i = 0; i < cellValues.length; i++) {
      if (!cellValues[i]) {
        // possible case for comp move
        cellValues[i] = "O"; // played here, so check for this index only
        const isNextWin = calIndToWin("O"); // return index of third move only when two move already played (one that we played right now and other played before this turn)
        if (isNextWin !== -1) {
          return i;
        } else {
          // when com not played any move yet and + did not find next winning move for player
          for (let j = 0; j < winningPoss.length; j++) {
            // if in any winning situation next two indexes are null
            const [a, b, c] = winningPoss[j]; // checking for this move if comp can win through this combination
            // first check one of a,b,c is i
            if (a === i || b === i || c === i) {
              // if yes then check possibility of not win
              //case - 1 either one of these (a,b,c) is "X"
              if (
                cellValues[a] === "X" ||
                cellValues[b] === "X" ||
                cellValues[c] === "X"
              ) {
                // comp cant win by playing at i so check for next
                continue;
              } else {
                cellValues[i] = null;
                return i;
              }
            }
          }
        }
        cellValues[i] = null;
      }
    }
  }
};

const isDraw = function () {
  // game will get draw at a point when atleast one index in winning possibility contian alike player move
  for (let i = 0; i < winningPoss.length; i++) {
    // check if any of winning possibility is not polluted
    const winComb = winningPoss[i];
    const filteredWinComb = winComb.filter((val) => {
      return cellValues[val] !== null;
    });
    if (filteredWinComb.length !== 0) {
      let isTherePossibleWin = true;
      for (let i = 0; i < filteredWinComb.length; i++) {
        if (cellValues[filteredWinComb[i]] !== cellValues[filteredWinComb[0]]) {
          isTherePossibleWin = false;
          break;
        }
      }
      if (isTherePossibleWin) {
        return false;
      }
    } else {
      return false;
    }
  }

  return true;
};

const playCom = function (index) {
  if (index !== undefined && !cellValues[index]) {
    cellValues[index] = "O";
    console.log("comp best move: ", index);
    console.log(cells[index]);
    cells[index].innerHTML = "O";
  }
  // check if computer win ?
  const isComWin = checkWinStatus();
  if (isComWin) {
    // const status = document.querSelecto("status");
    const status = document.getElementById("status");
    status.innerHTML = "You loss";
    return;
  }
};

const makeComMove = function () {
  const isDrawed = isDraw();
  if (isDrawed) {
    const status = document.getElementById("status");
    status.innerHTML = "Game Draw";
    return;
  }
  // Two case
  // case-1 block player to win in next move
  // case-2 if cas-1 is not occuring then play best move
  const playerNextMove = calIndToWin("X"); // calculate index where player can win in next move
  if (playerNextMove !== -1) {
    // a possible case for player to win (case-1)
    //play on winning move of player, dont let player win
    // console.log("winMove from if block: ", playerNextMove);
    playCom(playerNextMove); // comp play before player so player cant win
  } else {
    // case-2
    // play own winning move
    const winMove = calWinningMove();
    console.log("winMove from else block: ", winMove);
    playCom(winMove);
  }
};

const handleClick = function (index) {
  //   const isAnyoneWin = checkWinStatus();
  //   if (isAnyoneWin) {
  //     const status = document.getElementById("status");
  //     status.innerHTML(isAnyoneWin);
  //     return;
  //   }
  //   const it move possible ?
  const isDrawed = isDraw();
  if (isDrawed) {
    const status = document.getElementById("status");
    status.innerHTML = "Game Draw";
    return;
  }
  if (!cellValues[index]) {
    cellValues[index] = "X";
    cells[index].innerHTML = "X";
  }
  const isAnyoneWin = checkWinStatus();
  if (isAnyoneWin) {
    const status = document.getElementById("status");
    status.innerHTML = isAnyoneWin;
    return;
  }
  setTimeout(() => {
    makeComMove();
  }, 500);
  // computer played after player's move
};

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => handleClick(index));
});

// after move check if anyone win, if win then end game else continue
// player played move
// com decide
// com will check if in next move player win ? if yes then play to lose him in next move , if no then play his best move to win
// handle tied game
