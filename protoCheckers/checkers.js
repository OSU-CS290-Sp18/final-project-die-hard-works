checkers.movePiece = function(board, start, stop){
  console.log("++Moving pieces");
  if(board[start] != "BC" && board[stop] == "BC"){
    board[stop] = board[start];
    board[start] = "BC";
  }
}
