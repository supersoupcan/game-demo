import { Hex } from './vectors';

function completeIndices(){
  let indicesMap = [...new Array(3)];
  this.indices.forEach((chosenIndex, index) => {
    indicesMap[chosenIndex] = index;
  });

  return (coords) => {
    return coords.map((value, index) => {
      if(Number.isInteger(indicesMap[index])){
        return coords[indicesMap[index]];
      }else{
        return coords.reduce((acc, cur) => acc - cur, 0);
      }
    })
  }
}

const Rectangle = function(size, indices){
  this.size = size;
  this.indices = indices;
}

Rectangle.prototype.completeIndices = completeIndices;

Rectangle.prototype.tiles = function(){
  let tiles = [];
  const indicesMapper = this.completeIndices();
  for(let c0 = -this.size[0][0]; c0 <= this.size[0][1]; c0++){
    let c0_offset = Math.floor(c0/2);
    for(let c1 = -this.size[1][0] - c0_offset; c1 <= this.size[1][1] - c0_offset; c1++){
      tiles.push(new Hex(...indicesMapper([c0, c1])));
    }
  }
  return tiles;
}

const Parallelogram = function(size, indices){
  this.size = size;
  this.indices = indices;
}

Parallelogram.prototype.completeIndices = completeIndices;

Parallelogram.prototype.tiles = function(){
  let tiles = [];
  const indicesMapper = this.completeIndices();
  for(let c0 = -this.size[0][0]; c0 <= this.size[0][1]; c0++){
    for(let c1 = -this.size[1][0]; c1 <= this.size[1][1]; c1++){
      tiles.push(new Hex(...indicesMapper([c0, c1])))
    }
  }
  return tiles;
}

const Hexagon = function(size, indices){
  this.size = size;
  this.indices = indices;
}

Hexagon.prototype.completeIndices = completeIndices;

Hexagon.prototype.tiles = function(){
  let tiles = [];
  const indicesMapper = this.completeIndices();
  for(let c0 = -this.size[0]; c0 <= this.size[0]; c0++){
    let c1_1 = Math.max(-this.size[1], -c0 - this.size[1]);
    let c1_2 = Math.min(this.size[1], -c0 + this.size[1]);
    for(let c1 = c1_1; c1 <= c1_2; c1++){
      tiles.push(new Hex(...indicesMapper([c0, c1])));
    }
  }
  return tiles;
}






export { Parallelogram, Hexagon, Rectangle };