//import the HTTP modules
var http = require('http');

//import the fs modules
var fs = require('fs');

var pageNoteFoundHTML = fs.readFileSync('./404.html');
var gameHTML = fs.readFileSync('./testBoard.html');
var gameJS = fs.readFileSync('./testBoard.js');
var gameCSS = fs.readFileSync('./style.css');

//make an array element for the game board
var boardArray = [];
for(var i = 0; i < 64; i++){
  //init the gameboard array to length 64 with each cell == 'B'
  boardArray.push('B');
}
//set the first gameboard element to be 'R'
boardArray[0] = 'R';

function updateBoard(){
  for(var i = 0; i < boardArray.length; i++){
    if(boardArray[i] === 'R'){
      if(i+1 >= boardArray.length){
        boardArray[i] = 'B';
        boardArray[0] = 'R';
        break;
      }
      else{
        boardArray[i] = 'B';
        boardArray[i+1] = 'R';
        break;
      }
    }
  }
}


//Handle requests to log into the server
function requestHandler(request, response){
  console.log("==request:", request.url);

  //for whatever reason, when sending data from the client to the server "" turn into %22
  //and spaced into %20. we split the response on any space (%20) since we know that
  //any space will come from the client sending JSON information to us. we also replace any %22
  //into "" so that JSON.parse can return the array
  var request = request.url.replace(/%22/g, "\"").split('%20');

  //request[0] will always be populated with either the requested URL or the CLIENT_DATA header
  switch(request[0]){
    case "/testBoard.html":
    case "/":
         response.statusCode = 200;
         response.setHeader("Content-Type", "text/html");
         response.write(gameHTML);
         response.end();
         console.log("testBoard.html sent");
         break;

    case "/style.css":
          response.statusCode = 200;
          response.setHeader("Content-Type", "text/css");
          response.write(gameCSS);
          response.end();
          console.log("style.css sent");
          break;

    case "/testBoard.js":
          response.statusCode = 200;
          response.setHeader("Content-Type", "application/javascript");
          response.write(gameJS);
          response.end();
          console.log("testBoard.js sent");
          break;

    case "/board":
          response.statusCode = 200;
          response.setHeader("Content-Type", "text/html");
          response.write(JSON.stringify(boardArray));
          response.end();
          console.log("board sent");
          //update the boardArray
          updateBoard();
          break;

    //if a response has the header of "/CLIENT_DATA", then we have recieved a response from a client
    case "/CLIENT_DATA":
          console.log("==SUCCESS!!");

          //parse the JSON information back into an array
          //if we recieved the "CLIENT_DATA" header, we know that request[1] will be populated with
          //the client's data array
          var data = JSON.parse(request[1]);
          console.log(data[1]);

          //let the client know we recieved their comunication and that the move was Accepted
          //in the future this will check if the move was legal and update the baord acordingly
          response.statusCode = 200;
          response.setHeader("Content-Type", "text/html");
          response.write(JSON.stringify("Move Accepted"));
          response.end();

          break;

    default:
         response.statusCode = 404;
         response.setHeader("Content-Type", "text/html");
         response.write(pageNoteFoundHTML);
         response.end();
         console.log("404.html sent");
         break;
  }
}




//run the server
//create a server element
var server = http.createServer(requestHandler);

//check the port variable from the environment, if undefined use 3000
console.log("Port: ",process.env.PORT);
serverPort = process.env.PORT || 3000;

//start the server listening on the port
server.listen(serverPort);
