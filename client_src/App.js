import Events from './Events';
import Viewport from './renderer/Viewport';
import { Vector } from './common/vectors';

const App = function(){
  this.events = new Events();
  this.lastTime = 0;
  this.viewport = new Viewport();
}

App.prototype = {
  init: function(){
    this.events.init();
    this.viewport.init(this.events);
    this.animate();
  },
  animate: function(){
    window.requestAnimationFrame(() => this.animate());
    this.events.emitKeyPairs();
    this.viewport.render();
  }
}

export default App;