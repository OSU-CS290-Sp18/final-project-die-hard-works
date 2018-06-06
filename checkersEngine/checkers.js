//Checkers engine
function checkersEngine(boardArray, userNum, start_cell, end_cell){
	/*compute the distance between the start_cell and end_cell. 
	 *
	 * 	if it is within 1 then continue with the move functionality.
	 * 	check to make sure it is not a forward move 
	 * 	if it is then clear the cells, return not a valid move to client side
	 *
	 * 	if it is within 1 and diagonal then return true 
	 *
	 * Call check if king
	 *
	 * we might want to think about how it is going to do the checking? Maybe do a two dimensional array representing the entire board.
	 */

}

//setBoard sets up the board to the begining setup
//	this is incredibly specific. we might want to change this. 
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



/* pass through the move. coordinates "); */





