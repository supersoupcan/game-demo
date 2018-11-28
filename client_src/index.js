import Events from './Events';
import { Engine, Scene } from 'babylonjs';
import { Hexagon } from './shapes';
import  { LevelGenerator, combineSets, Region, Layer } from './generation';
import Level from './Level';

import Viewport from './Viewport';

window.document.onreadystatechange = function(){
  switch(document.readyState){
    case 'interactive': {
      main();
    }
  }
}

function main(){
  const events = new Events();
  const engine = new Engine(
    document.getElementById('viewport'), true, 
    { preserveDrawingBuffer: true, stencil: true 
  });

  const viewport = new Viewport();
  viewport.init(engine, () => {

    const generator = new LevelGenerator();
    generator.init(new Hexagon([12, 12], [1, 0]));

    generator.imprint({
      onBorder: (tile) => { tile.role = 'wall'; },
    });

    let openSet = new Set(generator.subset.contentSet);
    const roomLayer = new Layer();

    roomLayer.addRegions(openSet, {
      shape: {
        constructor: Hexagon,
        argvs: [{
          range: { base: 2, offset: 0 },
          difference: { base: -1, offset: 2}
        }],
      },
      success: {
        fraction: 0.65,
        distance: 7,
      },
      regions: 7,
      maxAttempts: 100,
    });

    const connection = roomLayer.connect(openSet);

    generator.imprint({
      target: roomLayer,
      onContent: (tile) => tile.role = 'ground',
      onBorder: (tile) => tile.role = 'wall',
    });

    generator.imprint({
      target: connection.layer,
      onContent: (tile) => tile.role = 'ground',
    });

    const secretRoomLayer = new Layer();
    secretRoomLayer.addRegions(openSet, {
      shape: {
        constructor: Hexagon,
        argvs: [{
          range: { base: 1 },
          difference: { base: 0, offset: 0}
        }],
      },
      success: {
        fraction: 1,
        distance: 10,
      },
      regions: 2,
      maxAttempts: 500,
    });

    generator.imprint({
      target: secretRoomLayer,
      onBorder: (tile) => tile.role = 'wall',
      onContent: (tile) => tile.role = 'ground'
    })

    const ignoreConnectionOpenSet = combineSets(openSet, connection.additionSet);
    
    const waterLayer = new Layer();

    waterLayer.addRegions(ignoreConnectionOpenSet, {
      shape: {
        constructor: Hexagon,
        argvs: [{
          range: { base: 3, offset: 0 },
          difference: { base: -1, offset: 2}
        }],
      },
      success: {
        fraction: 0.3,
        distance: 10,
      },
      regions: 3,
      maxAttempts: 100,
    });
    
    generator.imprint({
      target: waterLayer,
      onContent: (tile) => tile.role = 'water'
    })

    /*
    const groundLayer = new Layer(ignoreConnectionOpenSet);
    
    groundLayer.addRegions(ignoreConnectionOpenSet, {
      shape: {
        constructor: Hexagon,
        argvs: [{
          range: { base: 2, offset: 0 },
          difference: { base: 0, offset: 0}
        }],
      },
      success: {
        fraction: 0.4,
        distance: 5,
      },
      regions: 5,
      maxAttempts: 100,
    });

    generator.imprint({
      target: groundLayer,
      onContent: (tile) => tile.role = 'ground'
    });
    */

    const emptyTiles = generator.assembleSet((tile) => !tile.role);
    
    generator.seed(emptyTiles, [
      {value: 0.70, on: (tile) => {tile.role = 'ground'}},
      {value: 0.25, on: (tile) => {tile.role = 'wall'}},
      {value: 0.05, on: (tile) => { tile.role = 'water'}}
    ]);


    generator.addCellularAutomata(emptyTiles, {
      generations: 3,
      resistance: 1.5,
    });


    const level = generator.toLevel();
    viewport.loadLevel(level);

    engine.runRenderLoop(() => {
      events.emitKeyPairs();
      viewport.scene.render();
    })
  });
};




