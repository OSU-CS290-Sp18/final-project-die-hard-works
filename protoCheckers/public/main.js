
//the users id (AKA cookie)
var userID = 0;

//the users current game idea
var gameID = 0;

//the board arary, which will be a two dimensional array
var boardArray = [];

console.log(checkersEngine(boardArray, 0, 0, 0));

//===============
//Functions
//===============

function refreshIDs(){
  userID = window.sessionStorage.getItem("userID");
  gameID = window.sessionStorage.getItem("gameID");
}

function clearTheCookies(){
  console.log("++Force Clear the cookies");
  userID = 0;
  gameID = 0;
  window.sessionStorage.setItem("userID", userID);
  window.sessionStorage.setItem("gameID", gameID);
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
  refreshIDs();
  //create the AJAX object
  var request = new XMLHttpRequest();
  //check to see if the user already has a cookie before requesting a new one
  console.log("userID = ", userID);
  if(userID == 0){
    //request the user ID from the server
    var reqURL = "/getCookie";
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
  else{
    changePage("/init/"+userID+"/wait");
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

//helper updater function 
function getBoardArray(){
	return boardArray;

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
    startButton.addEventListener('click', getUserID);
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


});

window.onload = function () {
    if (window.sessionStorage.getItem("hasCodeRunBefore") == null) {
        console.log("++setting ID's for the first time");
        userID = 0;
        gameID = 0;
        window.sessionStorage.setItem("userID", userID);
        window.sessionStorage.setItem("gameID", gameID);
        window.sessionStorage.setItem("hasCodeRunBefore", true);
    }
}


//grabbing all the cells so we can add them to the board.
var cells = document.getelementsByClassName('cell-wrapper');


