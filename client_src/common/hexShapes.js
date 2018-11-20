import { Hex } from './vectors';

//Creates various Shapes composed of Hex Tiles
//Each Shape is built around a center Hex tile of [0, 0]


//recursively maps arrays which increasing
//deepest values by a set amount


function indicesMapper(){
  //most shapes have different configurations depending on
  //which hex coordiantes are chosen to iterate around... :P
  //??!??!??!
  // documentation is hard

  //argv[0]: primary hex coordinate (0 - 2);
  //argv[1]: secondary hex coordinate ( 0 - 2);

  let indicesMap = [...new Array(3)];
  this.indices.forEach((chosenIndex, index) => {
    indicesMap[chosenIndex] = index;
  });

  //returns a custom completeHex function
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

const HexShape = function(size, indices){
  this.size = size;
  this.indices = indices;
  this.completeHex = indicesMapper.call(this);
}

HexShape.prototype.content = function(serialize){
  const content = [];
  this.iterator(this.size, (c0, c1) => {
    const hex = this.completeHex(c0, c1);
    content.push(serialize ? hex.serialize() : hex);
  });
  return content;
}

HexShape.prototype.border = function(serialize){
  const border = [];
  const size = this.size.map((size) => size + 1);
  this.iterator(size, (c0, c1) => {
    if(this.onBorder(c0, c1, size)){
      const hex = this.completeHex(c0, c1);
      border.push(serialize ? hex.serialize() : hex);
    }
  })
  return border;
}

HexShape.prototype.tiles = function(serialize){
  const content = [];
  const border = [];
  const size = this.size.map((size) => size + 1);
  this.iterator(size, (c0, c1) => {
    const hex = this.completeHex(c0, c1);
    if(this.onBorder(c0, c1, size)){
      border.push(serialize ? hex.serialize() : hex);
    }else{
      content.push(serialize ? hex.serialize() : hex);
    }
  })
  return {content, border};
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

const Hexagon = function(size, indices){
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

export { Parallelogram, Hexagon, Rectangle };