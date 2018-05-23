# Proposed Workflows for Server and Client Javascript
## Travis Seevers, Die Hard Works

## Server Side


## Client Side
### Graphics
Graphics can be handled using a mixture of CSS, HTML and JS. The client side JS will have an 8x8 array that holds the current locations of each checker piece, every cycle of JS will refresh the game board with the current positions. The game board will be an HTML element comprised of 64 individual box elements arranged in an 8x8 pattern. For each of the two background colors of cells, there will be five total states:
* Blank cell
* Occupied Cell
  - Having a orange piece
  - Having a blank piece
  - Having a orange king
  - Having a blank king

Each state will be accessed/shown by hiding or unhiding it from the user using JS to change its HTML display setting. In practice there will be 5 separate cells stacked on top of each other at all times, with only the proper cell showing during gameplay, and all of them hidden when in the menus.

### User Input
User input will be through JS event listeners placed on HTML elements, waiting for the 'click' event. The groupings of the 5 backgrounds, described in the Graphics heading, will be wrapped in an HTML parent which a listener can be placed.

Menus will use buttons for navigation, and request text inout when applicable.

### Starting a Single-Player Game

## HTML / CSS
HTML and CSS play somewhat minor roles in this project, but should not be ignored by any means. The checkerboard and pieces could be CSS and HTML elements controlled by the client side JS. It will also have to comprise the menus and text inputs.
