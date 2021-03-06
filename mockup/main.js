/* jQuery onload */ $(function () {

/************/
/************/
/* * Data * */
/************/
/************/
var state = {
  userIs: "blue",
  computerIs: "green",
  userTurn: false,
  greenWins: 0,
  blueWins: 0,
  ties: 0
};

/*************/
/*************/
/* Selectors */
/*************/
/*************/
var gameButtons = $(".ttt-square"),
    colorSelectors = $(".ttt-selector"),
    tieMarker = $("#tie-marker"),
    pickGreen = $('#pick-green'),
    pickBlue = $('#pick-blue');

/*************/
/*************/
/* Functions */
/*************/
/*************/

function changeColor(e) {
  var selection = $(e.target).hasClass("green") ? "green" : "blue";

  if (state.userIs === selection) { return; }

  $(colorSelectors).removeClass("active");

  state.userIs = selection;
  state.computerIs = selection === "green" ? "blue" : "green";
  state.greenWins = 0;
  state.blueWins = 0;
  state.ties = 0;

  if (selection === "green") {
    $("#pick-green").addClass("active");
  } else {
    $("#pick-blue").addClass("active");
  }

  resetBoard();
}

function resetBoard() {
  updateScore();

  //Remove all of the classes from the game pieces
  gameButtons.removeClass("blue").removeClass("green");

  //Recreate clean board
  state.board = [
    [ null,null,null ],
    [ null,null,null ],
    [ null,null,null ]
  ];

  //Reset user turn
  if (state.computerIs === "green") {
    state.userTurn = false;
  } else {
    state.userTurn = true;
  }

  //If the computer should play first, trigger it
  if (!state.userTurn) { computerMove(); }
}

function updateScore() {
  //Update scores in boxes
  $(pickGreen).html(state.greenWins);
  $(pickBlue).html(state.blueWins);
  $(tieMarker).html(state.ties);
}

function rand0_2() {
  //Create a random number between 0 and 2 inclusive
  var num = Math.random(),
      result;

  if (num > 0.66666) {
    result = 2;
  } else if (num > 0.33333) {
    result = 1;
  } else {
    result = 0;
  }

  return result;
}

function computerMove() {
  //If it's the user's turn, return early
  if (state.userTurn) { return; }

  //Pick a random number for row and column
  var row = rand0_2(),
      col = rand0_2(),
      gameOver;

  //Keep looking for an empty spot
  while (state.board[row][col]) {
    row = rand0_2();
    col = rand0_2();
  }

  //Take the first open spot found
  state.board[row][col] = state.computerIs;

  $("#" + row + col).addClass(state.computerIs);

  //Check if the game is over
  endMove();
}

function handleUserSelection(event) {
  //If it's not the user's turn, return early
  if (!state.userTurn) { return; }

  //Extract the square position from event
  var id = event.target.id,
      row = +id[0],
      col = +id[1];

  //If that square is taken, return early
  if (state.board[row][col]) { return; }

  //Otherwise take that position on the board
  state.board[row][col] = state.userIs;

  id = "#" + id;

  //Update the view with the new position
  $(id).addClass(state.userIs);

  //Check is the game is over
  endMove();
}

function endMove () {
  //Alternate user turn
  state.userTurn = !state.userTurn;

  //Check if game is over
  //isGameOver returns false, "green", "blue", or "tie"
  var gameOver = isGameOver();

  //If the game is over, reset the board
  if (gameOver) {
    resetBoard();
  } else if (!state.userTurn) {
    computerMove();
  }
}

// Return false or winner or something for tie
function isGameOver() {
  //Horizontal lines
  var b = state.board.slice(),
      bigBoard,
      fullLine = 0,
      greenWon = false,
      blueWon = false;

  bigBoard = [
    //Horizontals
    [b[0][0], b[0][1], b[0][2]],
    [b[1][0], b[1][1], b[1][2]],
    [b[2][0], b[2][1], b[2][2]],
    //Vericals
    [b[0][0], b[1][0], b[2][0]],
    [b[0][1], b[1][1], b[2][1]],
    [b[0][2], b[1][2], b[2][2]],
    //Diagonals
    [b[0][0], b[1][1], b[2][2]],
    [b[0][2], b[1][1], b[2][0]]
  ]

  bigBoard.forEach(function (elem, idx) {
    //Check if the line is full
    if (elem[0] && elem[1] && elem[2]) {
      fullLine++;

      //Check if there is a winner
      if (elem[0] === elem[1] && elem[1] === elem[2]) {
        //Note who won
        if (elem[0] === "green") {
          greenWon = true;
        } else if (elem[0] === "blue") {
          blueWon = true;
        }
      }
    }
  });

  //Update score and return win/tie
  if (greenWon) {
    state.greenWins++;
    return "green";
  } else if (blueWon) {
    state.blueWins++;
    return "blue";
  } else if (fullLine === 8) {
    state.ties++;
    return "tie";
  }

  //False if no winner
  return false;
}

/**************/
/**************/
/* Setup game */
/**************/
/**************/
resetBoard();
$(gameButtons).click(handleUserSelection);
$(colorSelectors).click(changeColor);

}); /* end jQuery wrapper */
