const Edge = function(index){
    this.roles = ['void', 'void', 'void'];
    this.meshId = null;
    this.offset = index % 2;
    this.rotate = null;
  }
  
  Edge.prototype.init = function(edgeIdSet){
    for(this.rotate = 0; this.rotate < 3; this.rotate++){
      this.roles.push(this.roles.shift());
      const meshId = this.roles.join('_');
      if(edgeIdSet.has(meshId)){
        if(meshId === 'water_wall_ground'){
         //this.offset = (this.offset) + 1 % 2;
         //this.rotate = (this.rotate + 2) % 3;
        }
        this.meshId = meshId;
        return;
      }
    }
  }
  
  Edge.prototype.setRole = function(index, role){
    this.roles[index % 3] = role;
  }
  
  Edge.prototype.rotation = function(){
    return Math.PI/3 * (2 + (this.offset * 3) + (this.rotate  * 2));
  }

  export default Edge;