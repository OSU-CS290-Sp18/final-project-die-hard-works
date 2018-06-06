

//create and return a cell-wrapper with the grahical HTML divs nested inside
function createCellWrapper(color){
  var cell = document.createElement('div');
  if(color == 'black'){
    cell.className = 'cell-wrapper black';
  }
  else if(color == 'white'){
    cell.className = 'cell-wrapper white';
  }

  //create the five inner divs
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

  //append states 1-4 onto the cell-wrapper
  cell.appendChild(stateOne);
  cell.appendChild(stateTwo);
  cell.appendChild(stateThree);
  cell.appendChild(stateFour);

  //return the cell-wrapper
  return cell;
}


var checkerboard = document.getElementById('checkerboard');

for(var i = 0; i < 4; i++){
 // console.log("==Running");
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


function resetStates(){
  //add all of the cell wrappers to an array
    for(i = 0; i < cells.length; i++){
      cells[i].querySelector('.state-one').style.display = 'none';
      cells[i].querySelector('.state-two').style.display = 'none';
      cells[i].querySelector('.state-three').style.display = 'none';
      cells[i].querySelector('.state-four').style.display = 'none';
  }
}

function toggleState(event){
  if(event.currentTarget.querySelector('.state-one').style.display == 'block'){
    event.currentTarget.querySelector('.state-one').style.display = 'none';
    event.currentTarget.querySelector('.state-two').style.display = 'block';
  }
  else if(event.currentTarget.querySelector('.state-two').style.display == 'block'){
    event.currentTarget.querySelector('.state-two').style.display = 'none';
    event.currentTarget.querySelector('.state-three').style.display = 'block';
  }
  else if(event.currentTarget.querySelector('.state-three').style.display == 'block'){
    event.currentTarget.querySelector('.state-three').style.display = 'none';
    event.currentTarget.querySelector('.state-four').style.display = 'block';
  }
  else if(event.currentTarget.querySelector('.state-four').style.display == 'block'){
    event.currentTarget.querySelector('.state-four').style.display = 'none';
  }
  else{
    event.currentTarget.querySelector('.state-one').style.display = 'block';
  }


}

//grab the test button and add an event listener to it
var resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetStates);

//add an event listener to each cell-wrapper
for(var i = 0; i < cells.length; i++){
cells[i].addEventListener('click', toggleState);
}


//adding an event listener to the cells to make them move.
for(var i = 0; i < cells.length; i++){
	cells[i].addEventListener('click', move);
}



var coordinates = [];

//This function takes one object and returns it to get one quardinate. 
function move(event){
	console.log("Clicked");
	console.log(event.currentTarget);
	coordinates.push(event.currentTarget);
}











