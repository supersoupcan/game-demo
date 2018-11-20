import * as math from 'mathjs';
import flotsam from './flotsam';

//no simple way of subclassing Arrays. Alas, ES6 class notation!
//flotsam is used to efficiently serialize instances to unique strings

function lerp(a, b, t){
  return a * ( 1 - t ) + b * t;
}

class Vector extends Array{
  constructor(){
    if(arguments[0] && typeof arguments[0] === 'string'){
      super(...flotsam.decode(arguments[0]));
    }else{
      super(...arguments);
    }
  }
  serialize(){
    return flotsam.encode(this);
  }
  add(vector){
    return new this.constructor(...this.map((v, i) => v + vector[i]));
  }
  subtract(vector){
    return new this.constructor(...this.map((v, i) => v - vector[i]));
  }
  multiply(constant){
    return new this.constructor(...this.map((v, i) => v * constant));
  }
  divide(constant){
    return new this.constructor(...this.map((v, i) => v / constant));
  }
  transform(matrix, CustomConstructor = Vector){
    const transformation = math.multiply(this, matrix).slice(0, -1);
    return new CustomConstructor(...transformation);
  }
}

class Hex extends Vector{
  constructor(){
    super(...arguments);
  }
  complete(shell){
    //completes a hex of any two coordinants
    //shell = an array or length 2, which contains two arrays of length 2, 
    //which contain in index0 a chosen coordinate, and index1 that coordinates value
    let complete = [...new Array(3)];
    let missingValue = 0;
    shell.forEach((coord) => {
      complete[coord[0]] = coord[1];
      missingValue -= coord[1];
    })
    const missingIndex = complete.findIndex((value) => {
      return !Number.isInteger(value);
    })
    complete[missingIndex] = missingValue;
    return new Hex(complete[0], complete[1]);
  }
  direction(directionIndex){
    return hexDirections[directionIndex % 6];
  }
  directions(){
    return hexDirections;
  }
  neighbour(directionIndex){
    return this.add(this.direction(directionIndex))
  }
  edges(){
    return hexEdges;
  }
  corner(index){
    return this.add(this.neighbour(index)).add(this.neighbour((index + 1) % 6)).divide(3);
  }
  vLength(){
    return (Math.abs(this[0]) + Math.abs(this[1]) + Math.abs(-this[0] - this[1])) / 2;
  }
  distance(vector){

    const subtract = this.subtract(vector);
    const vLength = subtract.vLength();
    return vLength;
  }
  line(hex){
    const distance = this.distance(hex);
    const step = 1 / Math.max(distance, 1);
    const results = [];
    for(let i = 0; i <= distance; i++){
      results.push(this.lerp(hex, step * i).round());
    }
    return results;
  }
  lerp(hex, constant){
    return new Hex(
      lerp(this[0], hex[0], constant),
      lerp(this[1], hex[1], constant)
    )
  }
  round(){
    // knowing q = -r -s, resolve Hex to closest int position,
    // by analysing all three hex coordinates,
    let full = [this[0], this[1], this.reduce((acc, cur) => acc - cur, 0)];

    const rounded = full.map((v) => Math.round(v));
    const diff = rounded.map(((v, i) => Math.abs(v - full[i])));

    if(diff[0] > diff[1] && diff[0] > diff[2]){
      rounded[0] = -rounded[1] - rounded[2];
    }else if(diff[1] > diff[2]){
      rounded[1] = -rounded[2] - rounded[0];
    }

    return new Hex(rounded[0], rounded[1]);
  }
  toEuc(){
    return {
      x: Math.sqrt(3) * this[0] + Math.sqrt(3)/2 * this[1],
      y: 3/2 * this[1]
    }
  }
  fromEuc(x, y){
    return new Hex(
      Math.sqrt(3)/3 * x + -1/3 * y,
      2/3 * y
    )
  }
}

const hexDirections = [
  new Hex(0, 1), new Hex(-1, 1), new Hex(-1, 0),
  new Hex(0, -1), new Hex(1, -1), new Hex(1, 0)
];

export { Vector, Hex }
