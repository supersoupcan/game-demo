import Hex from './Hex';
import { random }  from './utils';

//Creates various Shapes composed of Hex Tiles
//Each Shape is built around a center Hex tile of [0, 0]

function indicesMapper(){
  let indicesMap = [...new Array(3)];
  this.indices.forEach((chosenIndex, index) => {
    indicesMap[chosenIndex] = index;
  });

  return (c0, c1) => {
    const coords = [c0, c1];
    return new Hex(...coords.map((_, index) => {
      if(Number.isInteger(indicesMap[index])){
        return coords[indicesMap[index]];
      }else{
        return coords.reduce((acc, cur) => acc - cur, 0);
      }
    }))
  }
}

function interpretIndices(indices, indicesArray){
  if(!Array.isArray(indices)){
    return random.select(indicesArray);
  }else if(Array.isArray(indices[0])){
    return random.select(indices);
  }else{
    return indices;
  }
}

function intepretSize(size){
  if(Array.isArray(size)){
    return size;
  }else{
    const range = size.range;
    const difference = size.difference;
    const firstSize = random.range(range.base, range.offset);
    let secondSize;
    if(difference){
      secondSize = random.range(difference.base + firstSize, difference.offset)
    }else{
      secondSize = random.range(range.base, range.offset);
    }
    return [firstSize, secondSize];
  }
}

const HexShape = function(size, indices){
  this.size = size;
  this.indices = indices;
  this.completeHex = indicesMapper.call(this);
}

HexShape.prototype.contentSet = function(){
  const contentSet = new Set();
  this.iterator(this.size, (c0, c1) => {
    const hex = this.completeHex(c0, c1);
    contentSet.add(hex.serialize());
  });
  return contentSet;
}

HexShape.prototype.borderSet = function(){
  const borderSet = new Set();
  const size = this.size.map((size) => size + 1);
  this.iterator(size, (c0, c1) => {
    if(this.onBorder(c0, c1, size)){
      const hex = this.completeHex(c0, c1);
      borderSet.add(hex.serialize());
    }
  })
  return borderSet;
}

HexShape.prototype.sets = function(center){
  const contentSet = new Set();
  const borderSet = new Set();
  const size = this.size.map((size) => size + 1);
  this.iterator(size, (c0, c1) => {
    let hex = this.completeHex(c0, c1);
    if(center) hex = hex.add(center);
    if(this.onBorder(c0, c1, size)){
      borderSet.add(hex.serialize());
    }else{
      contentSet.add(hex.serialize());
    }
  })
  return {borderSet, contentSet};
}

const Rectangle = function(size, indices){
  HexShape.call(this, size, indices);
  this.iterator = function(size, callback){
    for(let c0 = -size[0]; c0 <= size[0]; c0++){
      let c0_offset = Math.floor(c0/2);
      for(let c1 = -size[1] - c0_offset; c1 <= size[1] - c0_offset; c1++){
        callback(c1, c0);
      }
    }
  }
}

Rectangle.prototype = Object.create(HexShape.prototype);
Rectangle.prototype.constructor = Rectangle;

const Parallelogram = function(size, indices){
  HexShape.call(this, size, indices);
  this.iterator = function(size, callback){
    for(let c0 = -size[0]; c0 <= size[0]; c0++){
      for(let c1 = -size[1]; c1 <= size[1]; c1++){
        callback(c0, c1);
      }
    }
  }
}

Parallelogram.prototype = Object.create(HexShape.prototype);
Parallelogram.prototype.constructor = Parallelogram;

/**
 * 
 * @param {Array[]|Object } sizeOptions - look at intepretSize
 * @param {Array[]|Array|Object|} indicesOptions - look at interpretIndices
 */

const Hexagon = function(sizeOptions, indicesOptions){
  const size = intepretSize(sizeOptions);
  const indices = interpretIndices(indicesOptions, hexagonIndices);
  
  HexShape.call(this, size, indices);
  this.iterator = function(size, callback){
    for(let c0 = -size[0]; c0 <= size[0]; c0++){
      let c1_0 = Math.max(-size[1], -c0 - size[1]);
      let c1_1 = Math.min(size[1], -c0 + size[1]);
      for(let c1 = c1_0; c1 <= c1_1; c1++){
        callback(c0, c1);
      }
    }
  }
  this.onBorder = function(c0, c1, size){
    return (
      Math.abs(c0) === size[0] || 
      Math.abs(c1) === size[1] ||
      Math.abs(-c0-c1) === size[1]
    )
  }
}



Hexagon.prototype = Object.create(HexShape.prototype);
Hexagon.prototype.constructor = Hexagon;

const hexagonIndices = [[0, 1],[1, 2],[2, 0]];

export { Parallelogram, Hexagon, Rectangle };