import { Hexagon } from '../common/hexShapes';

const Generator = function(){
  this.baseShape = new Hexagon([5, 5], [0, 1]);
  this.regionGraph = new Map();
  this.tiles = new Map();
}

Generator.prototype.init = function(){
  const base = this.baseShape.both();
  base.tiles = () => 
}