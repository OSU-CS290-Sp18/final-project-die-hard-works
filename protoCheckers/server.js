
var path = require('path');
var express = require('express');

var expressHB = require('express-handlebars');

var bodyParse = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;

//setup handlebars
app.engine('handlebars', expressHB({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//setup the Date object for timeouts
var date = new Date();

//Player array containing the user ID's and the game number
var players = [];


//=================
//Functions
//=================
function newCookie(){

  while(1){
    //generate a new cookie between 0 and 1000
    var newCookie = Math.floor(Math.random() * 1001);
    //check to see if the cookie is unique
    if(!checkCookie(newCookie)){
      console.log("==returning new cookie:", newCookie);
      //add the cookie to the player array
      //add the cookie to the player object first then push into the array
      var player = { gameID: 0, cookie: newCookie, timeout: date.getTime()};
      players.push(player);
      for(var i = 0; i < players.length; i++){
        console.log("==Players:", players[i]);
      }
      return newCookie;
    }
  //cookie already in use, generate a new content
  }

}

function newGameID(){

  while(1){
    //generate a new cookie between 0 and 1000
    var newID = Math.floor(Math.random() * 1001);
    //check to see if the cookie is unique
    if(!checkCookie(newID)){
      console.log("==returning new gameID:", newCookie);
      //add the cookie to the player array
      //add the cookie to the player object first then push into the array
      return newID;
    }
  //cookie already in use, generate a new content
  }

}

function checkGame(gameID){
  //check to see if the gameID is unique
  for(var i = 0; i < players.length; i++){
    if(players[i].gameID == gameID){
      console.log("==GameID found");
      return true;
    }
  }
  //gameID not found
  return false;
}

function checkCookie(cookie){
  //check to see if the player's sent cookie was valid
  for(var i = 0; i < players.length; i++){
    if(players[i].cookie == cookie){
      console.log("==Cookie found");
      return true;
    }
  }
  //cookie not found
  return false;
}

function logUserInteraction(passedCookie){
  console.log("++Updating Timestamp of User:", passedCookie);
  //update the users timestamp to prevent a timeout
  //find the user's object
  for(var i = 0; i < players.length; i++){
    if(players[i].cookie == passedCookie){
      //update the players timestamp
      players[i].timestamp = date.getTime();
      return;
    }
  }


}

function userTimeout(){
  //if a user hasnt loged an interaction for 5 minutes remove them from the server
  //a temporary players array to hold the players that will be kept
  console.log("++Performing Timeout Check");
  console.log("++Starting Player Count:", players.length);
  var temp = [];
  var currentTime = date.getTime();
  for(var i = 0; i < players.length; i++){
    if(currentTime - players[i].timestamp < (5*60*1000)){
      //dont remove the player, add them to the temp array
      temp.push(players[i]);
    }
  }

  //copy over the new array
  players = temp;

  console.log("++Ending Player Count:", players.length);

}

function timeoutLoop(){
  //every 5 seconds, check to see if your game is ready
  setTimeout(function(){

    userTimeout();//check to see if any users have timed out

    timeoutLoop();//recall the loop

  }, 3*60*1000)//check every 3 minutes to see if any usrs have timed out
}


//====================
//Server Functionality
//====================

  //Start the setTimeout loop
  timeoutLoop();


  app.post('/game/init/:cookie', function (req, res, next) {
    //set up the game ID's and put 2 players in the same game
     //get the cookie from the URL
     var cookie = parseInt(req.params.cookie);
     console.log("++Game Requested from the user:", cookie);

     //update the users timestamp
     logUserInteraction(cookie);

     //get the players index #
     var index = -1;
     for(var i = 0; i < players.length; i++){
      if(players[i].cookie == cookie){
       index = i;
       console.log("==I:", i);
      }
     }

     //if the player has already been assigned a game that is currently in progress, send them there
     if(index >= 0 && players[index].gameID != 0){
       console.log("++Player was already assigned a game in progress");
       res.status(200).send(JSON.stringify(players[index].gameID));
     }
     else{
       //see if there is another player waiting for a game
       var playerTwoIndex = -1;

       for(var i = 0; i < players.length; i++){
        if(players[i].cookie != cookie && players[i].gameID == 0){
          playerTwoIndex = i;
        }
       }

       if(playerTwoIndex < 0){
         //no player was FOUND
         console.log("++A second player was not found");
         res.status(202).send(JSON.stringify("no game found"));
       }
       else{
         console.log("++A Second Player Was Found");
         //player found! set both game ID's equal to a new game ID
         var newID = newGameID();
         players[index].gameID = newID
         players[playerTwoIndex].gameID = newID

         //send the new game ID to the player currently requesting it
         res.status(200).send(JSON.stringify(newID));
       }

     }


  });

  app.post("/getCookie", function (req, res, next) {

    //give the player a unique ID
    console.log("==Serving Cookies");
    //generate a new Cookie
    var cookie = newCookie();
    res.status(200).send(JSON.stringify(cookie));

  });



  //serve the home page to the client
  app.get('/', function(req, res){
    console.log("==Home Page Requested");
    res.status(200).render('homePage');
  });

  //serve the scoreboard to the client
  app.get('/scoreboard', function(req, res){
    console.log("==Score Board Page Requested");
    res.status(200).render('scoreboardPage');
  });



  app.get("/init/:cookie/wait", function (req, res, next) {
    //get the cookie from the URL
    var cookie = parseInt(req.params.cookie);
    console.log("==Passed Cookie:", cookie);

    //update the users timestamp
    logUserInteraction(cookie);

    console.log("==Requesting Wait Page");

    //check to see if the player's cookie is valid
    if(checkCookie(cookie) == false){
      res.status(418).render('teapotPage');
    }
    else{
      //cookie was accepted, send them to the wait page until a second user joins
      res.status(200).render('waitPage');
    }



  });



app.get('/timeout', function (req, res, next) {

   res.status(200).render('timeout');

});


  app.get('/game/checkers/:userID', function (req, res, next) {

    //update the users timestamp
    //logUserInteraction(cookie);

     res.status(200).render('gamePage');

});

app.use(express.static('public'));


app.get('*', function (req, res) {
  //console.log("==URL NOT FOUND: ", req.url);
  console.log("==Sending 404:", req.url);
  res.status(404).render('404page');
});

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
