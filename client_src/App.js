import Events from './Events';
import Viewport from './renderer/Viewport';

import { Level }  from './level/level';

const App = function(){
  this.events = new Events();
  this.level = new Level();
  this.lastTime = 0;
  this.viewport = new Viewport();
}

App.prototype = {
  init: function(){
    this.events.init();
    this.level.generate();
    this.viewport.init(document.getElementById('viewport'), this);
    
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