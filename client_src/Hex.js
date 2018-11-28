 import flotsam from './flotsam';
import { Vector3 } from 'babylonjs';

import { lerp } from './utils';

class Hex extends Array{
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
  multiply(scaler){
    return new this.constructor(...this.map((v, i) => v * scaler));
  }
  divide(scaler){
    return new this.constructor(...this.map((v, i) => v / scaler));
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
  neighbours(){
    return this.directions().map((direction) => this.add(direction));
  }
  edges(){
    return hexEdges;
  }
  corners(index){
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
  lerp(hex, scaler){
    return new Hex(
      lerp(this[0], hex[0], scaler),
      lerp(this[1], hex[1], scaler)
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
  toVector3(y){
    const x = Math.sqrt(3) * this[0] + Math.sqrt(3)/2 * this[1];
    const z = 3/2 * this[1];
    return new Vector3(x, y, z);
  }
  fromVector3(vector3){
    return new Hex(
      Math.sqrt(3)/3 * vector3.x + -1/3 * vector3.z,
      2/3 * vector3.z
    )
  }
}

const hexDirections = [
  new Hex(0, 1), new Hex(-1, 1), new Hex(-1, 0),
  new Hex(0, -1), new Hex(1, -1), new Hex(1, 0)
];

export default Hex;