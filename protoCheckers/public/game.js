
//global boardArray
var boardArray;



//create and return a cell-wrapper with the grahical HTML divs nested inside
function createCellWrapper(color){
  var cell = document.createElement('div');
  if(color == 'black'){
    cell.className = 'cell-wrapper black';
  }
  else if(color == 'white'){
    cell.className = 'cell-wrapper white';
  }

  //create the four inner divs
  var stateOne = document.createElement('div');
  stateOne.className = 'state state-one';
  stateOne.style.display = 'none';
  var stateTwo = document.createElement('div');
  stateTwo.className = 'state state-two';
  stateTwo.style.display = 'none';
  var stateThree = document.createElement('div');
  stateThree.className = 'state state-three';
  stateThree.style.display = 'none';
  var stateFour = document.createElement('div');
  stateFour.className = 'state state-four';
  stateFour.style.display = 'none';

  //create the clicked div
  var clicked = document.createElement('div');
  stateFour.className = 'notClicked';
  stateFour.style.display = 'none';

  //append states 1-4 onto the cell-wrapper
  cell.appendChild(stateOne);
  cell.appendChild(stateTwo);
  cell.appendChild(stateThree);
  cell.appendChild(stateFour);
  cell.appendChild(clicked);

  //return the cell-wrapper
  return cell;
}


var checkerboard = document.getElementById('checkerboard');

for(var i = 0; i < 4; i++){
  //console.log("==Running");
  for(var j = 0; j < 4; j++){
    checkerboard.appendChild(createCellWrapper('white'));

    checkerboard.appendChild(createCellWrapper('black'));
  }
  for(var j = 0; j < 4; j++){
    checkerboard.appendChild(createCellWrapper('black'));

    checkerboard.appendChild(createCellWrapper('white'));
  }
}



//this is only temporily global for testing purposes and for speed of prototyping
var cells = document.getElementsByClassName('cell-wrapper');

//
// remove state five, only four states are needed since having a zero state can be acomplished with all displays = none
//


function resetState(cell){
  //add all of the cell wrappers to an array
  cell.querySelector('.state-one').style.display = 'none';
  cell.querySelector('.state-two').style.display = 'none';
  cell.querySelector('.state-three').style.display = 'none';
  cell.querySelector('.state-four').style.display = 'none';
}

//grab the reset button and add an event listener to it
var resetButton = document.getElementById('resetButton');
//resetButton.addEventListener('click', void);

//grab the load button and add an event listener to it
var loadButton = document.getElementById('loadButton');
loadButton.addEventListener('click', requestBoard);

//grab the Send button and add an event listener to it
var sendButton = document.getElementById('sendButton');
sendButton.addEventListener('click', send("move"));

//add an event listener to each cell-wrapper
for(var i = 0; i < cells.length; i++){
//cells[i].addEventListener('click', toggleState);
}




//need to impliment a basic graphics engine
function updateGraphics(board){
  //get all the cell wrappers
  var cells = document.getElementsByClassName('cell-wrapper');

  //console.log("==Cell Array: ", cells.length);
  //console.log("==Board Array: ", board.length);

  for(var i = 0; i < board.length; i++){

    resetState(cells[i]);

    switch (board[i]) {
      case "BC":
        //do nothing
        break;
      case "RR":
        cells[i].querySelector('.state-one').style.display = 'block';
        break;
      case "RK":
        cells[i].querySelector('.state-two').style.display = 'block';
        break;
      case "BB":
        cells[i].querySelector('.state-three').style.display = 'block';
        break;
      case "BK":
        cells[i].querySelector('.state-four').style.display = 'block';
        break;

      default:
        //do nothing
        break;

    }
  }
}


function requestBoard(){
  send("updateBoard");
}

function send(command){

  console.log("==COMMAND: ", command);

  //the information to send
  var info = ['client_cookie', command, 'end_cell'];

  //prepaire the xml object to send the info array with the heaer "CLIENT_DATA" to tell
  //the server that this is a client comunication
  xml.open("POST", "CLIENT_DATA " + JSON.stringify(info));

  //console.log(JSON.stringify(info));

  console.log("==Sending Info");

  xml.onload = function(){
    //read the response back from the server
    //this is very important, if the XML object POSTs but doenst get a response it throws an error
    //in the future this will be used to say if the move as legal or if the user will have to make a different
    //move. It will also cause the client to request the board again if it was successful
    var data = xml.responseText.split(" ");//.replace(/%22/g, "\"").split('%20');
    //updateGraphics(data);
    console.log(data);

    //if the move was successful, request the updated boardArray
    if(data[0] == "Move_Accepted"){
      requestBoard();
    }
    else if(data[0] = "NEW_BOARD"){
      //console.log(JSON.parse(data[1]));
      updateGraphics(JSON.parse(data[1]));
    }
   }

  xml.send();

  //TEMP
  if(command == "updateBoard"){
    updateGraphics
  }
}
