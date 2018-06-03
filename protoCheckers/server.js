
var path = require('path');
var express = require('express');

var expressHB = require('express-handlebars');

var app = express();
var port = process.env.PORT || 3000;

//setup handlebars
app.engine('handlebars', expressHB({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');



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

  app.get("/init", function (req, res, next) {

    //give the player a unique ID and wait for two players where
    res.status(200).render('waitPage');

  });

  //single twit functionality
  app.get('/game/:userID', function (req, res, next) {
  // var twitID = req.params.twitID;
  // console.log("==We'll get here soon", twitID);
  // if (twitData[twitID]) {
  //   console.log(twitData[twitID]);
     res.status(200).render('gamePage');
  // } else {
  //   next();
  // }
});

app.use(express.static('public'));


app.get('*', function (req, res) {
  //console.log("==URL NOT FOUND: ", req.url);
  res.status(404).render('404page');
});

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
