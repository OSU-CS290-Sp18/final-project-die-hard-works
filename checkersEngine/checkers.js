//Checkers engine
function checkersEngine(boardArray, userNum, start_cell, end_cell){



}

//setBoard sets up the board to the begining setup
function setBoard(boardArray){
  //set the black pieces (TOP)
  for(var i = 1; i < 23; i + 2){
    boardArray[i] = "BB";
  }

  //set the red pieces (BOTTOM)
  for(var i = 62; i > 39; i - 2){
    boardArray[i] = "RR";
  }
}
