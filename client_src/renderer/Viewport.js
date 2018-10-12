import Layout from './Layout';
import { Vector, Hex } from '../common/vectors';
import { Parallelogram, Hexagon, Rectangle } from '../common/hexShapes';
import Layer from './Layer';
import math from 'mathjs';

import tiles from './layers/tiles';

const size = 800;
const ratio = new Vector(size, Math.sqrt(3)/3 * size);

const Viewport = function(){
  this.size = ratio;
  this.layout = new Layout(
    new Vector(10, 10),
    new Vector(this.size[0]/2, this.size[1]/2)
  );
  this.layers = new Map([
    ['tiles', new Layer(window.document.getElementById('vp_tiles'), tiles, this)]
  ]);
  this.tilesInView = null;
  this.cursor = null;
}

Viewport.prototype.init = function(events){
  this.layout.recalculate();
  this.layers.forEach((layer) => layer.setSize(this.size));
  this.recaculateTilesInView();
  //events.addKeyPair('scale_vp', ['z', 'x']);
  events.addKeyPair('move_vp', ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']);
  //events.on('keypair_scale_vp', 'vp', (e) => this.scale(e));
  events.on('keypair_move_vp', 'vp', (e) => this.move(e));
  events.on('click_vp_tiles', 'vp', (e) => {
    let recovered = this.layout.recoverIso(e.clientX, e.clientY, 0);
    let hex = this.layout.to(recovered, 'iso', 'hex');
  })
  events.on('mouse_out_vp_tiles', 'vp', (e) => this.cursor = null);
  events.on('mouse_move_vp_tiles', 'vp', (e) => {
    this.cursor = [
      e.pageX - e.target.offsetLeft,
      e.pageY - e.target.offsetTop
    ];
    this.layers.get('tiles').rerender = true;
  });
}

Viewport.prototype.move = function(keys){
  const { origin } = this.layout;
  if(keys['ArrowRight']) origin[0] += 5;
  if(keys['ArrowLeft']) origin[0] -= 5;
  if(keys['ArrowDown']) origin[1] += 5;
  if(keys['ArrowUp']) origin[1] -= 5;
  this.layers.get('tiles').rerender = true;
  this.layout.recalculate();
}

Viewport.prototype.recaculateTilesInView = function(){
  //const outline = new Hexagon([5, 5], [2, 1]);
  //this.tilesInView = outline.tiles();
  this.tilesInView = [new Hex(0, 0)];
}

Viewport.prototype.render = function(){
  this.layers.forEach((layer) => {
    if(layer.rerender){
      layer.render();
      layer.rerender = false;
    }
  })
}

export default Viewport;