import { Hex } from '../common/vectors';
import { Vector3, Axis, Space, MeshBuilder } from 'babylonjs';
import { edgeLines } from '../../client_src/lines';

const Edge = function(){
  this.tiles = null; 
  this.mesh = null;
  this.offset = null;
}

/**
 *  @param { number } index - the tile index (if odd offset, if even do not)
 */

Edge.prototype.init = function(index){
  this.offset = index % 2;
  this.tiles = [null, null, null];
  this.lines = [null, null, null];
}

/**
 *  @param { Level } level - the level that this edge belongs to
 *  @param { string } key - seralized hex vector
*/

Edge.prototype.createMeshAndLineMeshes = function(level, key){
  if(this.mesh) this.mesh.dispose();
  const roles = this.tiles.map((tile) => tile ? tile.role : 'void');
  
  //find mesh and rotation by analysing neighbouring tile roles
  const result = (function(){
    for(let rotationIndex = 0; rotationIndex < 3; rotationIndex++){
      roles.push(roles.shift());
      const edgesKey = roles.join('_');
      if(level.meshes['edge'].hasOwnProperty(edgesKey)){
        return { rotationIndex, edgesKey }
      }
    }
  })();
  const mesh = level.meshes['edge'][result.edgesKey];
  const hex = new Hex(key);
  const position = hex.toEuc();
  const rotation = Math.PI/3 * (2 + (this.offset * 3) + (result.rotationIndex  * 2));

  this.mesh = mesh.createInstance('edge_' + key);
  this.mesh.rotate(Axis.Y, rotation, Space.WORLD)
  this.mesh.position = new Vector3(position.x, 0, position.y);
  
  if(edgeLines.hasOwnProperty(result.edgesKey)){
    const { lines, height } =  edgeLines[result.edgesKey];
    
    lines.forEach((name, index) => {
      const lineAsset = level.meshes['line'][name];
      const lineMesh = lineAsset.createInstance('line_' + key);

      lineMesh.position = new Vector3(position.x, Math.sqrt(3)/3 * height + 0.01, position.y);
      lineMesh.rotate(Axis.Y, index * 2 * Math.PI/3 + rotation, Space.WORLD);
    })
  }
}


export default Edge;