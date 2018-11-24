import Events from './Events';
import { Engine, Scene } from 'babylonjs';
import { Hexagon } from './shapes';
import LevelGenerator from './LevelGenerator';
import Level from './Level';

import Viewport from './Viewport';
import Tile from '../old_client_src/level/Tile';

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
    { preserveDrawingBuffer: true, stencil: true 
  });

  const viewport = new Viewport();
  viewport.init(engine, () => {
    const generator = new LevelGenerator();
      
    generator.init(
      new Hexagon([12, 12], [1, 0]), 
      { role: 'ground'},
      { role: 'wall'}
    );

    const options = {
      generations: 0,
      seed: [
        {value: 0.5, tileCf: { role: 'ground'}},
        {value: 0.5, tileCf: { role: 'wall'}},
      ],
      rules: [{
        
      }]
    }

    generator.addCellularAutomata(options);
    
    const level = generator.toLevel();
    viewport.loadLevel(level);

    engine.runRenderLoop(() => {
      events.emitKeyPairs();
      viewport.scene.render();
    })
  });
};




