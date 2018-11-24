import { Vector3, MeshBuilder, EdgesRenderer } from "babylonjs";
/**
 * simple line meshes used to display the hexagon grid.
 * Every edge contains three lines which split it into 3 sections -
 *   think of a peace sign placed within a hexagon.
 * An edges provides two lines to a given tile neighbour.
 * Since each tile has three edges, if we find the lines 
 *   of any given tile we will end up with 6 hexagon corners.
 */

const linePoints = new Map(
  [
    ['flat', [new Vector3(0, 0, 1)]],
    ['cliff_up', [new Vector3(0, 1, 0), new Vector3(0, 1, 1)]],
    ['low_cliff_up', [new Vector3(0, 1.5, 0), new Vector3(0, 1.5, 1)]],
    ['up', [new Vector3(0, 0.5, 1)]],
    ['smooth_up', [new Vector3(0, 0.25, 1)]],
    ['smooth_down', [new Vector3(0, -0.25, 1)]],
    ['border_left', [new Vector3(
      4 * Math.sqrt(3)/3 * Math.cos(Math.PI/3), 
      0, 
      4 * Math.sqrt(3)/3 * Math.sin(Math.PI/3))]
    ],
    ['border_right', [new Vector3(
      4 * Math.sqrt(3)/3 * -Math.cos(5 * Math.PI/3), 
      0, 
      4 * Math.sqrt(3)/3 * -Math.sin(5 * Math.PI/3))]
    ]
  ]
);

 export const edgeLines = {
  'water_water_water': {
    height: -0.5,
    lines: ['flat', 'flat', 'flat'],
  },
  'ground_ground_ground': {
    height: 0,
    lines: ['flat', 'flat', 'flat']
  },
  'wall_wall_wall': {
    height: 1,
    lines: ['flat', 'flat', 'flat']
  },
  'wall_ground_ground':{
    height: 0,
    lines: ['flat', 'flat', 'flat']
  },
  'ground_wall_wall': {
    height: 0,
    lines: ['cliff_up', 'flat', 'flat']
  },
  'ground_water_water': {
    height: -0.5, 
    lines: ['flat', 'smooth_up', 'smooth_up']
  },
  'water_ground_ground':{
    height: 0,
    lines: ['flat', 'smooth_down', 'smooth_down']
  },
  'water_wall_wall':{
    height: -0.5,
    lines: ['low_cliff_up', 'flat', 'flat']
  },
  'wall_water_water': {
    height: -0.5,
    lines: ['flat', 'flat', 'flat']
  },
  'wall_water_ground': {
    height: -0.5,
    lines: ['smooth_up', 'up', 'flat']
  },
  'water_wall_ground': {
    height: -0.5,
    lines: ['up', 'smooth_up', 'flat']
  },
  'void_wall_wall': {
    height: 1,
    lines: ['flat', 'border_right', 'border_left']
  }
};

export function addLineMeshes(viewport){
  viewport.meshes['line'] = {};
  linePoints.forEach((points, key) => {
    const mesh = MeshBuilder.CreateLines('line_' + key, 
      {
        points: [ new Vector3(0, 0, 0), ...points],
        useVertexAlpha: false,
      }, 
      viewport.scene
    )
    mesh.scaling = new Vector3(0.5, Math.sqrt(3)/3, 0.5);
    mesh.setEnabled(false);
    viewport.meshes['line'][key] = mesh;
  })
}