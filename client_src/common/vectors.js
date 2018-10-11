import * as math from 'mathjs';

//no simple way of subclassing arrays beyond ES6 class notation


class Vector extends Array{
  constructor(){
    super(...arguments);
  }
  add(vector){
    return new this.constructor(...this.map((v, i) => v + vector[i]));
  }
  subtract(vector){
    return new this.constructor(...this.map((v, i) => v - vector[i]));
  }
  multiply(vector){
    return new this.constructor(...this.map((v, i) => v * vector[i]));
  }
  divide(vector){
    return new this.constructor(...this.map((v, i) => v / vector[i]));
  }
  length(){
    return this.reduce((a, c) => Math.abs(c) + a) / this.length;
  }
  distance(vector){
    return this.subtract(vector).length();
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
  get key(){
    return this.join(',');
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
  neighbour(){
    return this.add(this.direction(directionIndex))
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
}

const hexDirections = [
  new Hex(1, 0), new Hex(1, -1), new Hex(0, -1),
  new Hex(-1, 0), new Hex(-1, 1), new Hex(0, 1)
];

export { Vector, Hex }