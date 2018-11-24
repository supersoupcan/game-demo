//concerned with 3D rendered output and input

import { 
  Axis, Space, Scene, SceneLoader, 
  HemisphericLight, FreeCamera, Vector3, 
  Engine, AssetContainer, KeyboardInfo, Color3 
} from 'babylonjs';
import { edgeLines, addLineMeshes } from './lines';
import Hex from './Hex';

const Viewport = function(){
  this.scene = null;
  this.meshes = {};
}

Viewport.prototype.init = async function(engine, done){
  try{
    this.scene = await SceneLoader.LoadAsync(
      '/assets/',  'tiles_1.babylon', engine
    );
    this.scene.meshes.forEach((mesh) => {
      const [ meshName, meshType ] = mesh.name.split('.');
      if(!this.meshes.hasOwnProperty(meshType)) this.meshes[meshType] = {};
      this.meshes[meshType][meshName] = mesh;
      mesh.convertToFlatShadedMesh();
      mesh.rotate(Axis.Y, Math.PI/6, Space.WORLD);
      mesh.scaling = new Vector3(Math.sqrt(3)/3,  Math.sqrt(3)/3,  Math.sqrt(3)/3);
      mesh.setEnabled(false);
      mesh.freezeWorldMatrix();
    })
    addLineMeshes(this);

    const camera = new FreeCamera('camera', new Vector3(0, 10, -10), this.scene);

    camera.setTarget(Vector3.Zero());
    camera.attachControl(engine.getRenderingCanvas(), true);

    done();
  }
  catch(err){
    throw err;
  }
}


Viewport.prototype.loadLevel = function(level){


  const light = new HemisphericLight('light', new Vector3(0, 1, 1), this.scene);

  light.intensity = 0.9;
  light.diffuse = new Color3(1, 1, 1);
	light.specular = new Color3(0.8, 0.8, 0.8);
  light.groundColor = new Color3(0.2, 0.2, 0.2);

  //create tile meshes and create edge record
  const edges = new Map();

  level.tiles.forEach((tile, key) => {

    const hex = new Hex(key);

    const assetMesh = this.meshes['tile'][tile.role];
    const tileMesh = assetMesh.createInstance('tile_' + key);
    tileMesh.position = hex.toVector3(0);
    tileMesh.freezeWorldMatrix();

    const corners = [...Array(6)].map((_, index) => hex.corners(index));
    corners.forEach((cornerHex, index) => {
      const cornerKey = cornerHex.serialize();
      let edge;
      if(!edges.has(cornerKey)){
        edge = {
          offset: index % 2,
          tiles: [null, null, null]
        }
        edges.set(cornerKey, edge);
      }else{
        edge = edges.get(cornerKey);
      }
      edge.tiles[index % 3] = tile;
    })
  })
  
  //create edge and line meshes

  edges.forEach((edge, key) => {
    const hex = new Hex(key);
    const solution = (() => {
      const roles = edge.tiles.map((tile) => tile ? tile.role : 'void');
      for(let rotationIndex = 0; rotationIndex < 3; rotationIndex++){
        roles.push(roles.shift());
        const edgesKey = roles.join('_');
        if(this.meshes['edge'].hasOwnProperty(edgesKey)){
          return { rotationIndex, edgesKey };
        }
      }
    })();

    const assetMesh = this.meshes['edge'][solution.edgesKey];
    const edgeMesh = assetMesh.createInstance('edge_' + key);

    const rotation = Math.PI/3 * (2 + (edge.offset * 3) + (solution.rotationIndex  * 2));
    
    edgeMesh.rotate(Axis.Y, rotation, Space.WORLD);
    edgeMesh.position = hex.toVector3(0);
    edgeMesh.freezeWorldMatrix();

    if(edgeLines.hasOwnProperty(solution.edgesKey)){
      const { lines, height } =  edgeLines[solution.edgesKey];

      lines.forEach((name, index) => {
        const lineAsset = this.meshes['line'][name];
        const lineMesh = lineAsset.createInstance('line_' + key);
        lineMesh.rotate(Axis.Y, index * 2 * Math.PI/3 + rotation, Space.WORLD);
        lineMesh.position = hex.toVector3(Math.sqrt(3)/3 * height + 0.01);
        lineMesh.freezeWorldMatrix();
      })
    }
  })
}

Viewport.prototype.unloadLevel = function(){

}

export default Viewport;