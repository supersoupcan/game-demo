const Tile = function(hex, type){
  this.type = type;
}


const tiles = {
  "WATER":{
    z: -1
  },
  "FLOOR": { 
    z: 0
  },
  "WALL": {
    z: 1
  }
}