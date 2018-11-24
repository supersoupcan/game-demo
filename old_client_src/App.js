//refactor

import { Hexagon } from './common/hexShapes';
import Level from './level/Level';
import { Engine } from 'babylonjs';

const App = function(){
  this.events = null;
  this.lastTime = null;
  this.engine = null;
  this.currentLevel = null;
  this.levels = null;
}

App.prototype.init = function(){
  this.events = new Events();
  this.engine = new Engine(
    document.getElementById('viewport'), true,
    { preserveDrawingBuffer: true, stencil: true }
  )
  this.levels = [];
  this.lastTime = 0;
  this.currentLevel = 0;
}

App.prototype.createLevel = function(){
  const level = new Level();
  level.init(
    this.engine,
    new Hexagon([3, 3], [0, 1])
  )
  level.generate();
  level.buildView();
  this.levels.push(level);
}

App.prototype.animate = function(){
  this.engine.runRenderLoop(() => {
    this.events.emitKeyPairs();
    this.levels[this.currentLevel].scene.render();
  })
}

/*

App.prototype = {
  init: function(){
    this.events.init();
    this.level.generate();
    this.viewport.init(), this);
    
    this.viewport.createTiles(this.level, true);
    
    this.animate();
  },
  animate: function(){
    this.viewport.engine.runRenderLoop(() => {
      this.events.emitKeyPairs();
      this.viewport.scene.render();
    })
  }
}

export default App;

*/