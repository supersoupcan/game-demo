import { Hexagon } from '../common/hexShapes';
import MinBinaryHeap from './MinBinaryHeap';
import { Hex } from '../common/vectors';
import random from '../common/random';

const cf = {
  regionCycles: 10,
  regionAttempts: 20,
  regionBase: 0,
  regionRange: 3,
}

const Level = function(){
  this.tiles = null;
  this.shape = null;
  this.regions = null;
}

Level.prototype.generate = function(){
  const generator = new Generator(this);
  generator.init();

  generator.createRegions(10, 10,
    [{
      base: 2, range: 1, minimumSpaceFraction: 7/10, HexShape: Hexagon
    }],
    (tile) => { tile.role = 'ground'},
    (tile) => { if(tile && !tile.role) tile.role = 'wall'; },
    (tile) => { tile.role = 'ground'}
  )
  generator.emptyTiles.forEach((key) => {
    this.tiles.get(key).role = 'wall';
  })
}

/*
Generator.prototype.connectRegions = function(){
  const minSpanMap = new Map();
  const minBinaryHeap = new MinBinaryHeap();

  const regionArr = Array.from(this.level.regions);
  
  minBinaryHeap.init(regionArr.map((region) => region[0]));
  minBinaryHeap.decreaseKey(random.select(regionArr)[0], 0);

  while(minBinaryHeap.heap.length > 0){
    const curRegion = this.level.regions.get(minBinaryHeap.extractMin().value);
    minBinaryHeap.map.forEach((index, value) => {
      const region = this.level.regions.get(value);
      const d0 = new Hex(curRegion.center);
      const d1 = new Hex(region.center);
      const distance = d0.distance(d1);
      if(minBinaryHeap.heap[index].key > distance){
        minBinaryHeap.decreaseKey(value, distance);
        minSpanMap.set(value, curRegion.key);
      }
    })
  }

  minSpanMap.forEach((key, value) => {
    const region0 = this.level.regions.get(value);
    const region1 = this.level.regions.get(key);
    
    const d0 = new Hex(region0.center);
    const d1 = new Hex(region1.center);

    const line = d0.line(d1);
    line.forEach((hex) => {
      let tile = this.level.tiles.get(hex.serialize());
      tile.role = 'ground';
      tile.road = true;
    })
  })
}

export { Level }

*/

