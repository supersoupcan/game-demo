import Hex from "./Hex";

class Tiles extends Map {
  constructor(...argvs){
    super(...argvs);
  }
  findNeighbours(key){
    const hex = new Hex(key);
    return hex.neighbours().map((neighbourHex, directionIndex) => {
      const key = neighbourHex.serialize();
      if(this.has(key)){
        return {
          directionIndex: directionIndex,
          tile: this.get(key)
        }
      }
    });
  }
}

export default Tiles;