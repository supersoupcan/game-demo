import { EventTarget } from './events';

const Viewport2D = function(pixi, events){
  EventTarget.call(events);
  this.pixi = pixi;
  this.assets = {};
}

Viewport2D.prototype = Object.create(EventTarget.prototype);

export default Viewport2D;