import Tiles from "./Tiles";
import Tile from './Tile';
import Level from "./Level";
import { random, parametric } from "./utils";
import Hex from './Hex';
import MinBinaryHeap from "./MinBinaryHeap";

//a subset is any combination of tiles that has content and a border
//subset sub classes: regions and rooms
//regions are randomely generated while rooms are hand crafted

const LevelGenerator = function(){
  this.tiles = null;
  this.subset = null;
  this.layers = null;
}

/**
 * @param { HexShape } shape - shape to init Level base as
 * @param { Object } options - options to configure intitiation
 * @param { Object } options.contentCf - initiate border tiles as type
 * @param { Object } options.contentCf - initiate 
 */

LevelGenerator.prototype.init = function(shape){
  this.tiles = new Tiles();
  this.hexes = new Map();
  const { borderSet, contentSet } = shape.sets();
  this.subset = new Subset(contentSet, borderSet);
  borderSet.forEach((key) => {
    this.hexes.set(key, new Hex(key));
    this.tiles.set(key, new Tile());
  });
  contentSet.forEach((key) => {
    this.hexes.set(key, new Hex(key));
    this.tiles.set(key, new Tile());
  })
}

LevelGenerator.prototype.assembleSet = function(test){
  const assembledSet = new Set();
  this.tiles.forEach((tile, key) => {
    if(test(tile)){
      assembledSet.add(key);
    }
  })
  return assembledSet;
}


LevelGenerator.prototype.imprint = function(options){
  const { target, onContent, onBorder} = options;
  const subset = (() => {
    if(target){
      switch(target.constructor.name){
        case 'Region':
        case 'Subset': {
          return target;
        }
        case 'Layer': {
          return target.toSubset();
        }
      }
    }else{
      return this.subset;
    }
  })();

  if(onContent){
    subset.contentSet.forEach((key) => {
      onContent(this.tiles.get(key));
    })
  }
  if(onBorder){
    subset.borderSet.forEach((key) => {
      onBorder(this.tiles.get(key));
    })
  }
}

/**
 * 
 * @param {Set <string>} tileSet - set of tiles to automata, if null, all tile content
 * @param { Object } options - options to customize the process
 * @param { number } options.generations - times to repeat
 * @param { Object[] } options.seed - seed options
 * @param { number } options.seed.value - fraction to spawn
 * @param { Object } options.seed.tileCf
 */

LevelGenerator.prototype.seed = function(openSet, seeds){
  const normalizedValues = parametric.normalize(seeds.map((seed) => seed.value));
  openSet.forEach((key) => {
    const randomIndex = random.seed(normalizedValues);
    const tile = this.tiles.get(key);
    seeds[randomIndex].on(tile);
  })
}

/*
  refactor and optimize because this runs like garbage
*/

LevelGenerator.prototype.addCellularAutomata = function(openSet, options){
  for(let i = 0; i < options.generations; i++){
    const nextTiles = new Tiles(this.tiles);
    openSet.forEach((key) => {
      const tile = this.tiles.get(key);
      const role = tile.role;
      const neighbours = this.tiles.findNeighbours(key);
      
      const count = (function(){
        const roles = {};
        roles[role] = options.resistance;
        neighbours.forEach((neighbour) => {
          if(!roles.hasOwnProperty(neighbour.tile.role)){
            roles[neighbour.tile.role] = 0;
          }
          roles[neighbour.tile.role]++;
        })
        return roles;
      })();

      const nextRole = (function(){
        let toBeat = -1;
        let values = Object.keys(count).reduce((acc, cur) => {
          if(count[cur] > toBeat){
            toBeat = count[cur];
            return [cur];
          }else if(count[cur] === toBeat){
            acc.push(cur);
            return acc;
          }else{
            return acc;
          }
        }, [])
        return random.select(values);
      }())

      nextTiles.set(key, new Tile({role: nextRole}));
      this.tiles = nextTiles;
    })
  }
}

LevelGenerator.prototype.toLevel = function(){
  return new Level(this.tiles);
}

/**
 * @param { string } name - a base class for add 
 * @param { string} name - name of string 
 * @param { Set <string>} openSubset - tiles considered open for a subset
 */

const Layer = function(){
  this.connectSubset = null;
  this.subsets = [];
}

Layer.prototype.connect = function(openSet){
  const additionSet = new Set();
  const minSpanMap = new Map();
  const minBinaryHeap = new MinBinaryHeap();

  minBinaryHeap.init(this.subsets.map((subset, index) => index));
  minBinaryHeap.decreaseKey(random.index(this.subsets), 0);

  while(minBinaryHeap.heap.length > 0){
    const curSubset = this.subsets[minBinaryHeap.extractMin().value];
    const center0 = new Hex(curSubset.center);
    minBinaryHeap.map.forEach((index, value) => {
      const subset = this.subsets[value];
      const center1 = new Hex(subset.center);
      const distance = center0.distance(center1);
      if(minBinaryHeap.heap[index].key > distance){
        minBinaryHeap.decreaseKey(value, distance);
        minSpanMap.set(value, [
          { hex: center0, subset: curSubset},
          { hex: center1, subset: subset }
        ]) 
      }
    })
  }
  const connectionLayer = new Layer();
  minSpanMap.forEach((pair) => {
    const line = pair[0].hex.line(pair[1].hex);
    const contentSet = new Set();
    line.forEach((hex) => {
      const key = hex.serialize();
      if(!pair[0].subset.contentSet.has(key) && !pair[1].subset.contentSet.has(key)){
        contentSet.add(key);
        if(!pair[0].subset.borderSet.has(key)){
          pair[0].subset.borderSet.delete(key);
        }
        if(!pair[1].subset.borderSet.has(key)){
          pair[1].subset.borderSet.delete(key);
        }
      }
    });
    const subset = new Subset(contentSet);
    subset.recalculateBorders();
    subset.contentSet.forEach((key) => {
      if(openSet.has(key)){
        additionSet.add(key);
        openSet.delete(key);
      }
    });
    subset.borderSet.forEach((key) => {
      if(openSet.has(key)){
        additionSet.add(key);
        openSet.delete(key);
      }
    });
    connectionLayer.subsets.push(subset);
  })
  return {
    layer: connectionLayer,
    additionSet: additionSet,
  }
}

function combineSets(set, additionSet){
  const combinedSets = new Set(set)
  additionSet.forEach((key) => {
    combinedSets.add(key);
  })
  return combinedSets;
}

/**
 * Subsets are areas that can be added to a layer
 * @param {Set <string>} contentSet - subset content
 * @param {Set <string>} borderSet - subset borders
 */

Layer.prototype.toSubset = function(){
  const borderSet = new Set();
  const contentSet = new Set();

  this.subsets.forEach((subset) => {
    subset.contentSet.forEach((key) => {
      contentSet.add(key);
    })
    if(subset.borderSet){
      subset.borderSet.forEach((key) => {
        borderSet.add(key);
      })
    }
  })
  return new Subset(contentSet, borderSet);
}

/**
 * @param { Layer } layer - layer object to push to level
 * @param { Shapes } layer - 
 * 
 */

Layer.prototype.addRegions = function(openSet, options){
  const additionSet = new Set();
  for(let r = 0; r < options.regions; r++){
    const shape = new options.shape.constructor(...options.shape.argvs);
    let center;
    let region;
    let isSuccess = false;
    let curAttempt = 0;
    while(!isSuccess && curAttempt < options.maxAttempts){
      curAttempt++;
      center = random.select(Array.from(openSet));
      const isDistance = this.subsets.every((region) => {
        const distance = new Hex(region.center).distance(new Hex(center));
        return distance >= options.success.distance;
      })
      if(isDistance){
        region = new Region(shape, center);
        const initialSize = region.contentSet.size;
        region.eliminateOverlap(openSet);
        const filteredSize = region.contentSet.size;
        isSuccess = (filteredSize / initialSize) >= options.success.fraction;
      }
    }
    if(isSuccess){
      region.contentSet.forEach((key) => { 
        if(openSet.has(key)){
          openSet.delete(key);
          additionSet.add(key);
        }
      });
      region.borderSet.forEach((key) => { 
        if(openSet.has(key)){
          openSet.delete(key);
          additionSet.add(key);
        }
      });
      this.subsets.push(region);
    }
  }
  return additionSet;
}

const Subset = function(contentSet, borderSet){
  this.contentSet = contentSet;
  this.borderSet = borderSet;
}

Subset.prototype.recalculateBorders = function(){
  const newBorderSet = new Set();
  this.contentSet.forEach((key) => {
    new Hex(key).neighbours().forEach((neighbour) => {
      const neighbourKey = neighbour.serialize();
      if(!this.contentSet.has(neighbourKey)) newBorderSet.add(neighbourKey);
    })
  })
  this.borderSet = newBorderSet;
}

Subset.prototype.removeBorderOverlap = function(subset){
  this.borderSet.forEach((key) => {
    if(subset.borderSet.has(key) || subset.tileSet.has(key)){
      this.borderSet.delete(key);
    }
  })
}

Subset.prototype.removeContentOverlap = function(subset){
  this.contentSet.forEach((key) => {
    if(subset.borderSet.has(key) || subset.tileSet.has(key)){
      this.borderSet.delete(key);
    }
  })
}

Subset.prototype.removeOverlap = function(subset){
  this.removeBorderOverlap(subset);
  this.removeContentOverlap(subset);
}

const Region = function(shape, center){
  this.center = center;
  const sets = shape.sets(new Hex(center));
  Subset.call(this, sets.contentSet, sets.borderSet);
}

Region.prototype.constructor = Region;
Region.prototype = Object.create(Subset.prototype);

Region.prototype.eliminateOverlap = function(openSet){
  let recalculate = false;
  this.contentSet.forEach((key) => {
    if(!openSet.has(key)){
      recalculate = true;
      this.contentSet.delete(key);
    }
  });
  if(recalculate) this.recalculateBorders();
}

export { combineSets, LevelGenerator, Region, Layer, OpenSet }