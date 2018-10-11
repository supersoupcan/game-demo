import * as math from 'mathjs';
import { Vector, Hex } from '../common/vectors';

/*
//  Layout class holds matrixes which convert between 3 coordinate types
//
//  Hex (Grid)
//    units are Hex Base Vectors two dimension (q, r), with the third (s) 
//    calculated when needed by from s = -q-r
//
//  Euc (Euclidean Space)
//    units are Vectors with three dimensions (x, y, z),
//
//  Iso (Isometric Projection)
//    units are Vectors with two dimensions (x, y)
//    isometric position handles translation so
//    vertices represent a final location on game canvas
//
//  so we move from, Hex -> Euc -> Iso or Iso -> Euc -> Hex (inverse)
//
//  in the normal case we move a 3D position to a final 2D isometric projection
//  in the inverse case, we invert the 2D projection, and assume that z = 0, 
//    as the plane is non-determinate.
//    (if it sounds like i know what i'm taling about, i really don't.
//    I watched a single 3Blue1Brown video on the subject)
//    https://www.youtube.com/watch?v=Ip3X9LOh2dk
*/


const eucToIsoBase = math.multiply(1/Math.sqrt(6), [
  [Math.sqrt(3), -Math.sqrt(2), 1, 0],
  [Math.sqrt(3), Math.sqrt(2), -1, 0],
  [0, Math.sqrt(2), -2, 0],
  [0, 0, 0, Math.sqrt(6) * 1]
]);
const isoToEucBase = math.inv(eucToIsoBase);

const hexToEucBase = [
  [Math.sqrt(3), 0, 0, 0],
  [Math.sqrt(3)/2, 3/2, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
];
const eucToHexBase = math.inv(hexToEucBase);

const hexToIsoBase = math.multiply(hexToEucBase, eucToIsoBase);
const isoToHexBase = math.multiply(isoToEucBase, eucToHexBase);
const hexHCsBase = function(){
  return [...Array(6)].map((_, i) => {
    const a = (Math.PI / 6 ) + (Math.PI * i / 3);
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [Math.cos(a), Math.sin(a), 0, 1]
    ];
  });
}();

const hexHCsToEucBase = hexHCsBase.map(
  (hexHC) => math.multiply(hexToEucBase, hexHC)
)
const hexHCsToIsoBase = hexHCsBase.map(
  (hexHC) => math.multiply(hexToEucBase, hexHC, eucToIsoBase)
)

function layoutTransform(scale, origin){
  return math.multiply(
    [
      [scale[0], 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, scale[1], 0],
      [0, 0, 0, 1]
    ],
    [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [origin[0], 0, origin[1], 1]
    ]
  )
}

function layoutUntransform(scale, origin){
  return math.multiply(
    [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [-origin[0], 0, -origin[1], 1]
    ],
    [
      [1/scale[0], 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1/scale[1], 0],
      [0, 0, 0, 1]
    ],
  )
}

const LayoutIso2D = function(scale, origin){
  this.scale = scale;
  this.origin = origin;
  this.matrices = {
    euc: {},
    hex: {},
    iso: {},
  };
  this.bodyMatrices = {
    hexHCs: {}
  }
}

const process = {
  iso: (vertex) => {
    return [vertex[0], vertex[2]];
  },
  euc: (vertex) => [vertex[0], vertex[1], vertex[2]],
  hex: (vertex) => new Hex(vertex[0], vertex[1])
}

LayoutIso2D.prototype.recalculate = function(){
  const transform = layoutTransform(this.scale, this.origin);
  const untransform = layoutUntransform(this.scale, this.origin);
  this.matrices.hex.euc = hexToEucBase;
  this.matrices.euc.hex = math.inv(hexToEucBase);
  this.matrices.hex.iso = math.multiply(hexToIsoBase, transform);
  this.matrices.euc.iso = math.multiply(eucToIsoBase, transform);
  this.matrices.iso.euc = math.inv(this.matrices.euc.iso);
  this.matrices.iso.hex = math.multiply(untransform, isoToHexBase);
  this.bodyMatrices.hexHCs.euc = hexHCsToEucBase.map(
    (hexHCToEuc) => math.multiply(hexHCToEuc, transform)
  )
  this.bodyMatrices.hexHCs.iso = hexHCsToIsoBase.map(
    (hexHCToIso) =>  math.multiply(hexHCToIso, transform)
  )
}

//Converts an array of vectors of one type to an array of vectors of another type
LayoutIso2D.prototype.to = function(vectors, from, to){
  const matrix = this.matrices[from][to];
  if(Array.isArray(vectors[0])){
    return vectors.map(
      (vector) => process[to](math.multiply([...vector.slice(), 1], matrix))
    )
  }else{
    return process[to](math.multiply([...vectors.slice(), 1], matrix))
  }
}
//Converts an vector of one type into an array of body vectors of another type 
LayoutIso2D.prototype.toBody = function(vector, from, to){
  return this.bodyMatrices[from][to].map(
    (matrix) => process[to](math.multiply([...vector.slice(), 1], matrix))
  );
}

LayoutIso2D.prototype.recoverIso = function(mouseX, mouseY, height){
  //recover lost iso y dimension that results in a euc z space of height
  //by solving iso to euc matrix with iso(x, ?, y) with resulting z = height;
  let mtx = this.matrices.iso.euc;
  let y = (height - mouseX*mtx[0][2] - mouseY*mtx[2][2] - mtx[3][2]) / mtx[1][2];
  return [mouseX, y, mouseY];
}

export default LayoutIso2D;