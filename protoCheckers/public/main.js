
//the users id (AKA cookie)
var userID = 0;

//the users current game idea
var gameID = 0;

//the users name, only used in case of forces cookie refresh
var name = "";

//the current board
var board;

//the previously clicked cell, if -1, then there was no previous click
var previousClick = -1;


//===============
//Functions
//===============

function showModal(){
  refreshIDs();
  if(name != ""){
    getUserID();
  }
  console.log("++");
  var Modal = document.getElementById('playerNameInput');

  // Show the modal and its backdrop.
  Modal.classList.remove("hidden");
}

function hideModal(){
  console.log("--");
  var Modal = document.getElementById('playerNameInput');

  // Show the modal and its backdrop.
  Modal.classList.add("hidden");

  var inputElems = document.getElementsByClassName('input-element');
  for (var i = 0; i < inputElems.length; i++) {
    var input = inputElems[i].querySelector('input, textarea');
    input.value = '';
  }
}

function refreshIDs(){
  userID = window.sessionStorage.getItem("userID");
  gameID = window.sessionStorage.getItem("gameID");
  name = window.sessionStorage.getItem("name");
}

function clearTheCookies(){
  console.log("++Force Clear the cookies");
  userID = 0;
  gameID = 0;
  window.sessionStorage.setItem("userID", userID);
  window.sessionStorage.setItem("gameID", gameID);
  //window.sessionStorage.setItem("name", "");
}

function getContentFromURL(index) {
  var path = window.location.pathname;
  var pathParts = path.split('/');
  // console.log("== pathParts:", pathParts);
  if (pathParts.length > index) {
    return pathParts[index];
  } else {
    return null;
  }
}

function getUserID(){

  console.log("Getting User ID");
  refreshIDs();
  //create the AJAX object
  var request = new XMLHttpRequest();
  //check to see if the user already has a cookie before requesting a new one
  console.log("userID = ", userID);
  console.log("name", name);
  if(userID == 0){
    //request the user ID from the server
    var reqURL = "/getCookie/"+name;
    request.open("POST", reqURL);

    request.addEventListener('load', function (event) {
      var message = event.target.response;
      if (event.target.status != 200) {
        alert("Error Retreiving Cookie: " + message);
      }
      else{
        //found a game!
        console.log("==New Cookie:", message);
        userID = message;
        window.sessionStorage.setItem("userID", userID);
        changePage("/init/"+userID+"/wait");
      }
    }
    );

    request.send();
  }
  else if(name != ""){
    changePage("/init/"+userID+"/wait");
  }
  else{
    changePage("/");
  }

}

function changePage(URL){
  window.location.href = /*window.location.hostname + */ URL;
}

function searchForGame(){

  //get the IDs stored in the browser
  refreshIDs();

  //search function to check if the game is ready
  function search(){
    //create the AJAX object
    var request = new XMLHttpRequest();

    var reqURL = "/game/init/" + userID;
    request.open("POST", reqURL);

    request.addEventListener('load', function (event) {
      var message = event.target.response;
      if (event.target.status != 200) {
        console.log("Error Retreiving gameID: " + message);
      }
      else{
        //found a game!
        console.log("==New gameID:", message);
        gameID = message;
        window.sessionStorage.setItem("gameID", gameID);
        changePage("/game/checkers/"+gameID+'/'+userID);
      }
    }
  );

    request.send();
  }

  function searchLoop(i){
    //every 5 seconds, check to see if your game is ready
    setTimeout(function(){
      console.log("==Searching for a game");
      //need some checking functionality to see if anouther player is ready
      gameID = 0;
      search();
      //if a game has been found, then the players game ID != 0
      if(gameID != 0){
        //a game has been found!
        changePage("/game/checkers/"+gameID);
      }
      //if a game hasnt been found in 5 minutes, timeout
      if(++i > 6){
        //go to the timeout Page
        changePage("/timeout");
      }

      //if we havnt timed out, or a game hasnt been found, keep Searching
      searchLoop(i);

    }, 5000)
  }

  searchLoop(0);
  //search();
}

function resetState(cells){
  //add all of the cell wrappers to an array
    for(i = 0; i < cells.length; i++){
      cells[i].querySelector('.state-one').style.display = 'none';
      cells[i].querySelector('.state-two').style.display = 'none';
      cells[i].querySelector('.state-three').style.display = 'none';
      cells[i].querySelector('.state-four').style.display = 'none';
  }
}

function initBoard(){
  //create the board elements
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
    //clicked.id = 'clicky';
    clicked.className = 'clicky';
    clicked.style.display = 'none';

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
}

function requestBoard(){

  //get the IDs stored in the browser
  refreshIDs();


  //create the AJAX object
  var request = new XMLHttpRequest();

  var reqURL = "/graphics/" + gameID;
  request.open("POST", reqURL);

  request.addEventListener('load', function (event) {
    var message = event.target.response;
    if (event.target.status != 200) {
      console.log("Error Retreiving graphics: " + message);
    }
    else{
      //found a game!
      console.log("==New graphics recived:");
      board = JSON.parse(message);
    }
  }
);

  request.send();
}

function updateGraphics(){
  //console.log("==Updating Graphics...");
  //request a new board from the server
  requestBoard();

  //update the graphics acordingly
  //get all the cell wrappers
  var cells = document.getElementsByClassName('cell-wrapper');

  if(board){

  //console.log("==Cell Array: ", cells.length);
  //console.log("==Board Array: ", board.length);
  //console.log("==Board[0]:", board[0]);

  resetState(cells);

  for(var i = 0; i < board.length; i++){

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

}

function updateGraphicsLoop(){
  //every 5 seconds, check to see if your game is ready
  setTimeout(function(){

    updateGraphics();//check to see if any users have timed out

    updateGraphicsLoop();//recall the loop

  }, 250)//check every quater second
}

function changeClick(event){
  if(event.currentTarget.querySelector('.clicky').style.display == 'none'){
    event.currentTarget.querySelector('.clicky').style.display = 'block'
  }

  var cells = document.getElementsByClassName('cell-wrapper');

  //get the index of the cell
  for(var i = 0; i < cells.length; i++){
    if(cells[i].querySelector('.clicky').style.display == 'block'){
      //set the display to none
      cells[i].querySelector('.clicky').style.display = 'none'
      //put the index in the next open space in the moveIndex array
      if(previousClick < 0){
        previousClick = i;
      }
      else{
        //comunicate to the server with the selected cells
        //get the IDs stored in the browser
        refreshIDs();

        //create the AJAX object
        var request = new XMLHttpRequest();

        var reqURL = "/gamemove/" + userID + '/' + previousClick + '/' + i;

        request.open("POST", reqURL);

        request.addEventListener('load', function (event) {
          var message = event.target.response;
          if (event.target.status != 200) {
            console.log("Error sending cell indexes: " + message);
          }
          else{
            //found a game!
            console.log("==Moves Successfully sent");
          }
        }
      );

        request.send();

        previousClick = -1;
      }
    }
  }

}


function hideTurn() { //INSERT FUNCTIONALITY FOR WHEN WE KNOW WHOS TURN IT IS.
  var yourT = document.getElementbyId("yourTurn");
  var notT = document.getElementbyId("NotyourTurn");

  if (yourT.style.display === "none")
  {
    notT.style.display = "block";
  } else
  {
    yourT.style.display = "block";
  }

}

function getName(){
    // get the user's text inputElems
    var text_input_box = document.getElementById('text-input');

      name = text_input_box.value;
      window.sessionStorage.setItem("name", name);
      if(name == ""){
        alert("Please Enter a name, human.");
        return;
      }
      else{
        getUserID();
      }
}


//===============
//Event Listners
//===============

/*
 * Wait until the DOM content is loaded, and then hook up UI interactions, etc.
 */
window.addEventListener('DOMContentLoaded', function () {

  var startButton = document.getElementById('big-start-button');
  if(startButton){
    startButton.addEventListener('click', showModal);
  }

  var acceptBtn = document.getElementById('modal-accept-button');
  if(acceptBtn){
    acceptBtn.addEventListener('click', getName);
  }

  var cancelBtn = document.getElementById('modal-cancel-button');
  if(cancelBtn){
    cancelBtn.addEventListener('click', hideModal);
  }

  var exitBtn = document.getElementById('modal-close-button');
  if(exitBtn){
    exitBtn.addEventListener('click', hideModal);
  }

  var clearCookies = document.getElementById('clear-cookie-button');
  if(clearCookies){
    clearCookies.addEventListener('click', clearTheCookies);
  }

  var waitPage = document.getElementById('wait');
  if(waitPage){
    //waitPage.addEventListener('load', searchForGame);
    searchForGame();
  }

  //if the user has been sent to the state cookies page clear the cookie and request a new one
  var staleCookie = document.getElementById('staleCookie');
  if(staleCookie){
    //clear the cookies
    clearTheCookies();
    //request new cookies
    getUserID();
  }

  var newBoard = document.getElementById('checkerboard');
  if(newBoard){
    //waitPage.addEventListener('load', searchForGame);
    initBoard();
    updateGraphicsLoop();

    //grab all the cell wrappers and assign the click event listener to them
    var cells = document.getElementsByClassName('cell-wrapper');
    //add an event listener to each cell-wrapper
    for(var i = 0; i < cells.length; i++){
    cells[i].addEventListener('click', changeClick);
    }
  }


});

window.onload = function () {
    if (window.sessionStorage.getItem("hasCodeRunBefore") == null) {
        console.log("++setting ID's for the first time");
        userID = 0;
        gameID = 0;
        window.sessionStorage.setItem("userID", userID);
        window.sessionStorage.setItem("gameID", gameID);
        window.sessionStorage.setItem("name", "");
        window.sessionStorage.setItem("hasCodeRunBefore", true);
    }
}
