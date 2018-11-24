import { Hex } from '../common/vectors'; 
import { Vector3 } from 'babylonjs';
import Edge from '../renderer/Edge';


const Tile = function(){
  this.role = null;
}

//rendering level geometry
/**
 * @param { string } key - serialized hex vector 
 * @param { Level } level - level to init tile mesh into
 * */

Tile.prototype.createMesh = function(key, level){
  const hex = new Hex(key);
  const mesh = level.meshes['tile'][this.role];
  this.mesh = mesh.createInstance('tile_' + key);
  this.mesh.position = hex.toVector3(0);
}

/**
 * @param { string } key - serialized hex vector 
 * @param { Level } level - level to init tile mesh into
 * */

Tile.prototype.createEdges = function(key, level){
  const hex = new Hex(key);
  const corners = [...Array(6)].map((_, index) => hex.corner(index));
  
  corners.forEach((corner, index) => {
    const cornerKey = corner.serialize();
    let edge = null;
    if(!level.edges.has(cornerKey)){
      edge = new Edge();
      edge.init(index);
      level.edges.set(cornerKey, edge);
    }else{
      edge = level.edges.get(cornerKey);
    }
    edge.tiles[index % 3] = this;
  });
}

export default Tile;