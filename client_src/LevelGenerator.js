import Tiles from "./Tiles";
import Tile from './Tile';
import Level from "./Level";

const LevelGenerator = function(){
  this.shape = null;
  this.tiles = null;
}

LevelGenerator.prototype.init = function(shape, contentCf, borderCf){
  this.shape = shape;
  this.tiles = new Tiles();

  const { borderSet, contentSet } = shape.sets();

  contentSet.forEach((key) => this.tiles.set(key, new Tile(contentCf)));
  borderSet.forEach((key) => this.tiles.set(key, new Tile(borderCf)));
}

/**
 * @param {Set <string>} tileSubSet - subset of tiles to automata, if null, all tile content
 * @param { Object } options - options to customize the process
 * @param { number } options.generations
 * @param { Object } options.seed -
 */

LevelGenerator.prototype.addCellularAutomata = function(options){
  const tileSubSet = this.shape.sets().contentSet;
  let tiles = new Tiles(this.tiles); 

  if(options.seed){
    tileSubSet.forEach((key) => {
      const tileCf = (function(){
        const seed = Math.random();
        let acc = 0;
        for(let i = 0; i < options.seed.length; i++){
          acc += options.seed[i].value;
          if(seed <= acc) return options.seed[i].tileCf;
        }
        return null;
      }());
      if(tileCf) tiles.set(key, new Tile(tileCf));
    })
  }

  for(let i = 0; i < options.generations; i++){
    const nextTiles = new Tiles(tiles);
    tileSubSet.forEach((key) => {
      const tile = tiles.get(key);
      //tinker with tile based on customziable options (count neighbours)
      nextTiles.set(key, tile);
    })
    tiles = nextTiles;
  }
  this.tiles = tiles;
}

LevelGenerator.prototype.toLevel = function(){
  return new Level(this.tiles);
}

export default LevelGenerator;