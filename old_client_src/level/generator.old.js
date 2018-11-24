import random from '../common/random';
import { Hex } from '../common/vectors';
import MinBinaryHeap from './MinBinaryHeap';
import Tile from './Tile';


Generator.prototype.init = function(level){
  this.level = level;
  this.emptyTiles = new Set();
}

function basicTileMap(){
   //define border tiles as border
 
  const tiles = this.level.shape.tiles(true);
  tiles.border.map((key) => {
    const tile = new Tile();
    tile.role = "wall";
    this.level.tiles.set(key, tile);
  });
 
  //define other tiles as roleless and add them to the set of emptytile
  tiles.content.map((key) => {
    const tile = new Tile();
    tile.role = 'ground';
    this.level.tiles.set(key, tile);
    this.emptyTiles.add(key);
  });
}

/**
 * @param { Set, <string > } tileset - set of tile keys to iterate over (tiles outside of this remain constant)
 * @param { number } generations - number or iterations
 * @param { Object[] } rules - contains a list of rules to run for each iteration
 * @param { function } rules.match - wheter or not to match a given tile
 * @param { function } rules.callback - what to do to a matched tile
 * @param { Object[] = } init - run on first call to set initial tile values
 * @param { function } init.match - wheter or not to match a given tile
 * @param { function } init.callback - what to do to with the matched tile
 */

Generator.prototype.cellularAutomata = function(tileset){

}


const Region = function(shape, key){
  this.key = key;
  this.shape = shape;
  this.center = null;
  this.tiles = null;
}

Region.prototype.init = function(center, level, minimum){
  //try form this region centered around a random empty tile
  this.center = center;
  this.tiles = new Set();

  //record whether each inner tile can be added to the region
  this.shape.content(true).forEach((key) => {
    const hex = (new Hex(key)).add(new Hex(this.center));
    const levelTile = level.tiles.get(hex.serialize());
    if(levelTile && !levelTile.role){
      this.tiles.add(key);
    }
  })
  //if the room has more tiles then a minimum return true
  //maybe make this tinkerable percentage so that we get less overlapped regions
  return this.tiles.size >= minimum;
}

/**
 * @param { number } amount -  amount of regions to build
 * @param { number } maxAttempts - how many attempts to try build each region
 * @param { Object[] } shapes - shapes to 
 * @param { number } shapes.base - base size of given shape
 * @param { number } shapes.range - random variance in shape size
 * @param { number } shapes.minimumSpaceFraction - fraction required for max-region size to create
 * @param { HexShape } shapes.HexShape - shape type
 * @param { function = } content - called on each tile with a region
 * @param { function = } border - called on each tile on border of region
 * @param { funciton = } connect - called on each tile which connects regions
*/

Generator.prototype.createRegions = function(amount, maxAttempts, shapes, content, border, connect){
  const regions = new Map();
  for(let i = 0; i < amount; i++){
    //randomly generate a region

    const shapeRecipe = random.select(shapes);

    const shapeSize = [
      random.range(shapeRecipe.range, shapeRecipe.base),
      random.range(shapeRecipe.range, shapeRecipe.base)
    ];

    const shape = new shapeRecipe.HexShape(shapeSize, random.indices());
    const region = new Region(shape, 'room_' + i);

    let curAttempt = 0;
    let isSuccess = false;

   
    
    while(!isSuccess && curAttempt < maxAttempts){
      const center = random.select(Array.from(this.emptyTiles));
      isSuccess = region.init(center, this.level, shape.content().length * shapeRecipe.minimumSpaceFraction);
      curAttempt++;
    }

    if(isSuccess){
      //update region into level data
      const center = new Hex(region.center);
      if(content){
        region.tiles.forEach((key) => {
          const levelHex = new Hex(key).add(center);
          const levelKey = levelHex.serialize();
          const levelTile = this.level.tiles.get(levelKey);
          content(levelTile);
          this.emptyTiles.delete(levelKey);
        });
      }
      if(border){
        region.shape.border().forEach((hex) => {
          const levelHex = hex.add(center);
          const levelKey = levelHex.serialize();
          const levelTile = this.level.tiles.get(levelKey);
          border(levelTile);
          this.emptyTiles.delete(levelKey);
        });
      }
      regions.set(region.key, region);
    }
  }

  if(connect){
    const minSpanMap = new Map();
    const minBinaryHeap = new MinBinaryHeap();

    const regionArr = Array.from(regions);

    minBinaryHeap.init(regionArr.map((region) => region[0]));
    minBinaryHeap.decreaseKey(random.select(regionArr)[0], 0);

    while(minBinaryHeap.heap.length > 0){
      const curRegion = regions.get(minBinaryHeap.extractMin().value);
      minBinaryHeap.map.forEach((index, value) => {
        const region = regions.get(value);
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
      const region0 = regions.get(value);
      const region1 = regions.get(key);
      
      const d0 = new Hex(region0.center);
      const d1 = new Hex(region1.center);

      const line = d0.line(d1);
      line.forEach((hex) => {
        const levelKey = hex.serialize();
        connect(this.level.tiles.get(levelKey));
        this.emptyTiles.delete(levelKey);
      })
    })
  }
}

export default Generator;