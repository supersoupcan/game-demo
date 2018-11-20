import { Vector3, MeshBuilder, EdgesRenderer } from "babylonjs";

const gridLinePoints = new Map(
  [
    ['standard', [new Vector3(1, 0, 0)]],
    ['wall_standard', [new Vector3(0, 1, 0), new Vector3(1, 0, 0)]]
  ]
)

const gridEdgeData = {
  'water_water_water': {
    height: -0.5,
    lines: ['standard'],
  },
  'ground_ground_ground': {
    height: 0,
    lines: ['standard', 'standard', 'standard']
  },
  'wall_wall_wall': {
    height: 1,
    lines: ['standard', 'standard', 'standard']
  }
}

export function createLineMeshes(scene){
  const meshes = {};
  gridLinePoints.forEach((points, key) => {
    meshes[key] = MeshBuilder.CreateLines('line_' + key, 
      { options: {
        points: [ new Vector3(0, 0, 0), ...points],
        useVertexAlpha: false,
        updatable: false,
      }, scene
    })
    meshes[key].setEnabled(false);
  })
  return meshes;
}

export function assembleEdgeLineMeshes(scene, lineMeshes, edge, hex){
  if(gridEdgeData.hasOwnProperty(edge.meshId)){
    const gridEdgeData = gridEdgesData[edge.meshId];
    gridEdgeData.lines.forEach((name, index) => {
      const line = lineMeshes[name].createInstance('line_' + hex.serealize());
    })
  }
}