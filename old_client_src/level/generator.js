import Tile from './Tile';

/**
 * 
 * @param { HexShape } shape - shape to construct map of
 * @param {*} onContent - function to create content Tile
 * @param {*} onBorder - function to create border Tile
 */

export function createTiles(shape, onContent, onBorder){
  const tiles = new Map();
  const tiles = shape.tiles(true);

  if(onContent){
    tiles.content.forEach((key) => {
      const tile = onContent(key);
      tiles.set(key, tile)
    })
  }

  if(onBorder){
    tiles.content.forEach((key) => {
      const tile = onBorder(key);
      tiles.set(key, tile)
    })
  }

  return tiles;
}

/**
 * @param { Map < string, Object } tiles - tile map to generate over
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

export function generateRegions(tiles, amount, maxAttempts, regionShapes, onContent, onBorder, connect){

}

