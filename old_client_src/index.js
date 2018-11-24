import Events from '../client_src/Events';
import { Engine } from 'babylonjs';

window.document.onreadystatechange = function(){
  switch(document.readyState){
    case 'interactive': {
      main();
    }
  }
}

function main(){
  const events = new Events;
  const engine = new Engine(
    document.getElementById('viewport'), true,
    { preserveDrawingBuffer: true, stencil: true }
  )

  //what do we want to do procedurally? 
  //generate a map
  //step one: generate a tile map

  const level = function(){

  }();
}
