//import the HTTP modules
var http = require('http');

//import the fs modules
var fs = require('fs');

//import express
var express = require('express');
var app = express();

var pageNoteFoundHTML = fs.readFileSync('./404.html');
var gameHTML = fs.readFileSync('./testBoard.html');
var gameJS = fs.readFileSync('./testBoard.js');
var gameCSS = fs.readFileSync('./style.css');

//Handle requests to log into the server
function requestHandler(request, response){
  switch(request.url){
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
