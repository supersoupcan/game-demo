const random = {
  range: function(range, base = 0){
    return Math.floor(Math.random() * range) + base;
  },
  index: function(arr){
    return Math.floor(Math.random() * arr.length);
  },
  select: function(arr){
    return arr[Math.floor(Math.random() * arr.length)];
  },
  indices: function(){
    let indices = [0, 1, 2];
    let chosen = [];
    for(let i = 0; i < 2; i++){
      chosen.push(indices.splice(indices, 1));
    }
    return chosen;
  }
}

export default random;