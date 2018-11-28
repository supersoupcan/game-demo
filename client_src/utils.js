import { normalize } from "path";

export const random = {
  range: function(base = 0, offset= 0){
    return Math.floor(Math.random() * offset) + base;
  },
  index: function(arr){
    return Math.floor(Math.random() * arr.length);
  },
  select: function(arr){
    return arr[Math.floor(Math.random() * arr.length)];
  },
  hexIndices: function(){
    let indices = [0, 1, 2];
    let chosen = [];
    for(let i = 0; i < 2; i++){
      chosen.push(indices.splice(indices, 1));
    }
    return chosen;
  },
  seed: function(normalizedValuesArr){
    const seed = Math.random();
    return function(){
      let acc = 0;
      for(let i = 0; i < normalizedValuesArr.length; i++){
        acc += normalizedValuesArr[i];
        if(seed <= acc) return i;
      }
    }();
  }
}

export const parametric = {
  normalize: function(valuesArr){
    const sum = valuesArr.reduce((acc, value) => acc + value, 0);
    return valuesArr.map((value) => value / sum);
  }
}

export function lerp(a, b, t){
  return a * ( 1 - t ) + b * t;
}