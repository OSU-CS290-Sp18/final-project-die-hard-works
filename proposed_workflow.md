# Proposed Workflows for Server and Client Javascript
## Travis Seevers, Die Hard Works

## Server Side


## Client Side
### Graphics
Graphics can be handled using a mixture of CSS, HTML and JS. The client side JS will have an 8x8 array that holds the current locations of each checker piece, every cycle of JS will refresh the game board with the current positions. The game board will be an HTML element comprised of 64 individual box elements arranged in an 8x8 pattern. For each of the two background colors of cells, there will be five total states:
* Blank cell
  - denoted by states one through four being hidden
* Occupied Cell
  - Having a orange piece
    - State one shown
  - Having a blank piece
    - State two shown
  - Having a orange king
    - State three shown
  - Having a black king
    - State four shown

Each state will be accessed/shown by hiding or unhiding it from the user using JS to change its HTML display setting. In practice there will be 5 separate cells stacked on top of each other at all times, with only the proper cell showing during gameplay, and all of them hidden when in the menus.

### User Input
User input will be through JS event listeners placed on HTML elements, waiting for the 'click' event. The groupings of the 5 backgrounds, described in the Graphics heading, will be wrapped in an HTML parent which a listener can be placed.

Menus will use buttons for navigation, and request text inout when applicable.

### Starting a Game
Each player should be given a cookie when they visit the site. When they start a game, either single player or multiplayer, the server should create a new HTML page with a random ID to serve the game. The server should be able to host multiple games at once by creating and serving multiple of these HTML pages. This could also be accomplished through handlebars I suppose. The server will differentiate users on the same webpage through their cookies in order to determine which player is player one and which is player two.

Optionally, if a person is on the webpage whose cookie doesn't match the cookies of the two players they can enter into spectator mode, where it doesn't let them interact with the game board, but they can see the others play and the current score. 

## HTML / CSS
HTML and CSS play somewhat minor roles in this project, but should not be ignored by any means. The checkerboard and pieces could be CSS and HTML elements controlled by the client side JS. It will also have to comprise the menus and text inputs.
