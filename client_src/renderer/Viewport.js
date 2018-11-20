import { 
  Engine, Axis, Space, Scene, 
  SceneLoader , ArcRotateCamera, Vector3, 
  HemisphericLight, DirectionalLight, UniversalCamera, 
  FreeCamera, Color3, AssetsManager, RefractionTexture,
  HighlightLayer, Mesh, Ray, MeshBuilder, Geometry
} from 'babylonjs';

import { Hex, Vector } from '../common/vectors';

import Edge from './Edge';

const Viewport = function(){
  this.engine = null;
  this.camera = null;
  this.scene = null;
  this.pick = null;
  this.pointer = null;
}

Viewport.prototype.init = async function(canvas, events){
  this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
  this.scene = new Scene(this.engine);

  //create our own camera class so we can restrict the movement
  this.camera = new FreeCamera("camera", new Vector3(0, 10, -10), this.scene);
  this.camera.setTarget(Vector3.Zero());
  this.camera.attachControl(canvas, true);
  
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
  
  light.intensity = 0.9;
  light.diffuse = new Color3(1, 1, 1);
	light.specular = new Color3(0.8, 0.8, 0.8);
  light.groundColor = new Color3(0.2, 0.2, 0.2);

  this.pointer = null;

  events.on('mouse_out_viewport', 'viewport', (event) => {
    if(this.pointer){
      this.pointer.dispose();
      this.pointer = null;
    }
  });

  events.on('mouse_in_viewport', 'viewport', (event) => {

  })

  events.on('mouse_move_viewport', 'viewport', (event) => {

    if(this.pointer){
      this.pointer.dispose();
    }

    const pick = this.scene.pick(
      event.clientX - event.target.offsetLeft, 
      event.clientY - event.target.offsetTop
    )

    const points = [];

    const  { pickedPoint } = pick;

    const hexBase = Hex.prototype.fromEuc(pickedPoint.x, pickedPoint.z);
    const hexCenter = hexBase.round();
    const baseCenter = hexCenter.toEuc();

    const offset = pickedPoint.add(new Vector3(baseCenter.x, 0, baseCenter.y));


    const center = new Vector3(baseCenter.x, 0, baseCenter.y);

    for(let i = 0; i < 6; i++){
      const angle = 2 * Math.PI * i / 6 + Math.PI/6;
      const x = Math.cos(angle);
      const z = Math.sin(angle);

      points.push(center.add(new Vector3(x, 0 * Math.sqrt(3)/3, z)));

      //const ray = new Ray(point, new Vector3(0, -1, 0));
      //const answer = this.scene.pickWithRay(ray);

     //points.push(answer.pickedPoint);
    }

    

    points.push(points[0]);

    this.pointer = MeshBuilder.CreateLines('pointer', { points: points }, this.scene);
    this.pointer.position.y + 0.01;
  });
}


async function loadAssets(name, version, callback){
  try {
    const container  = await SceneLoader.LoadAssetContainerAsync(
      '/assets/',  name + "_" + version + '.babylon')
    callback(container);
  }
  catch(err){
    throw err;
  }
}

Viewport.prototype.createTiles = function(level, isEdges){
  let tileMeshes = null;
  let edges = null;
  let edgeIdSet = null;

  loadAssets('tiles', '1', onLoad.bind(this));

  function onLoad(assetContainer){

    init(assetContainer);
    createCenters.call(this);
    createEdges();
  }

  function initEdges(hex, tile){
    [...Array(6)].map((_, index) => hex.corner(index)).forEach((corner, index) => {
      const key = corner.serialize();
      if(!edges.has(key)) edges.set(key, new Edge(index));
      const edge = edges.get(key);
      if(tile.role) edge.setRole(index, tile.role);
    })
  }

  function createEdges(){
    edges.forEach((edge, key) => {
      edge.init(edgeIdSet);
      const mesh = tileMeshes['edge'][edge.meshId];
      const edgeInstance = mesh.createInstance('edge_' + key);
      const hex = new Hex(key);
      const position = hex.toEuc();
      edgeInstance.rotate(Axis.Y, edge.rotation(), Space.WORLD);
      edgeInstance.position = new Vector3(position.x, 0, position.y);
    })
  }

  function createGrid(){
    const edgeMeshes = 
    edges.forEach((edge, key) => {
      
    })
  }

  function createCenters(){
    /*
    const basicPoints = [];
    for(let i = 0; i < 6; i++){
      const angle = 2 * Math.PI * i / 6 + Math.PI/6;
      basicPoints.push(new Vector3(Math.cos(angle), 0, Math.sin(angle)));
    }
    basicPoints.push(basicPoints[0]);
    const basicOutline = MeshBuilder.CreateLines('outline_basic', { points: basicPoints }, this.scene);
    basicOutline.setEnabled(false);

    const info = {
      'wall': {
        customOutline: true,
        height: Math.sqrt(3)/3,
      },
      'ground': {
        customOutline: false,
        height: 0
      },
      'water': {
        customOutline: false,
        height: 0
      }
    }

    if(info[tile.role].customOutline){
        const customPoints = [];
        let curHeight = null;
        const isSame = [];
        for(let i = 0; i < 6; i++){
          const neighbour = level.tiles.get(hex.neighbour(i).serialize());
          if(neighbour){
            isSame.push(neighbour.role === tile.role);
            const angle0 = 2 * Math.PI * i / 6 + Math.PI/6;
            const angle1 = 2 * Math.PI * (i + 1) / 6 + Math.PI/6;
            if(!Number.isInteger(curHeight) || info[neighbour.role].height !== curHeight){
              customPoints.push(new Vector3(Math.cos(angle0), info[neighbour.role].height, Math.sin(angle0)));
            }
            curHeight = info[neighbour.role].height;
            customPoints.push(new Vector3(Math.cos(angle1), curHeight, Math.sin(angle1)));
          }else{
            isSame.push(false);
          }
        }
        customPoints.push(customPoints[0]);

        if(isSame.every((same) => same)){
          outlineInstance = basicOutline.createInstance('outline_' + key);
          outlineInstance.position = new Vector3(position.x, info[tile.role].height , position.y);
        }else{
          outlineInstance = MeshBuilder.CreateLines('outline_' + key, { points: customPoints }, this.scene);
          outlineInstance.position = new Vector3(position.x, 0, position.y);
        }
      }else{
        outlineInstance = basicOutline.createInstance('outline_' + key);
        outlineInstance.position = new Vector3(position.x, 0 , position.y);
      }
    */

    level.tiles.forEach((tile, key) => {
      const hex = new Hex(key);
      initEdges(hex, tile);
      const mesh = tileMeshes['center'][tile.role];
      const centerInstance = mesh.createInstance('center_' + key);
      const position = hex.toEuc();
      centerInstance.position = new Vector3(position.x, 0, position.y);
      
      let outlineInstance;

      //Make use of copies of mesh copying
     
      tile.mesh = centerInstance;
      tile.outline = outlineInstance;
    })
  }

  function init(assetContainer){
    tileMeshes = {};
    assetContainer.meshes.forEach((tileMesh) => {
      const [ meshName, meshType ] = tileMesh.name.split('.');
      if(!tileMeshes.hasOwnProperty(meshType)) tileMeshes[meshType] = {};
      tileMeshes[meshType][meshName] = tileMesh;
      tileMesh.convertToFlatShadedMesh();
      if(isEdges){
        tileMesh.rotate(Axis.Y, Math.PI/6, Space.WORLD);
        tileMesh.scaling = new Vector3(Math.sqrt(3)/3,  Math.sqrt(3)/3,  Math.sqrt(3)/3);
      }
    });

    edges = new Map();
    edgeIdSet = new Set(Object.keys(tileMeshes.edge)); 
  }
}

export default Viewport;
