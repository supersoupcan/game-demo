import { EventTarget } from './events';

const Viewport3D = function(events, engine){
  EventTarget.call(this, events);
  this.engine = engine;
  this.assets = {};
}

Viewport3D.prototype = Object.create(EventTarget.prototype);


export default Viewport3D;