const Layer = function(canvas, render, viewport){
  this.viewport = viewport;
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.render = render;
  this.rerender = true;
  this.round = false;
  this.styles = {
    fillStyle: 'pink',
    strokeStyle: 'black',
  }
}

Layer.prototype.setStyles = function(styles = {}){
  Object.keys(this.styles).forEach((key) => {
    this.ctx[key] = styles.hasOwnProperty(key) ? styles[key] : this.styles[key];
  })
}

Layer.prototype.setSize = function(size){
  this.canvas.width = size[0];
  this.canvas.height = size[1];
}

Layer.prototype.clear = function(){
  this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
}

/*
Layer.prototype.body = function(vertices, body){
  if(this.round){
    vertices = vertices.map((vertex) => vertex.map((coord) => Math.round(coord)));
  }
  this.ctx.beginPath();
  this.ctx.moveTo(vertices[5][0], vertices[5][1]);
  vertices.forEach((vertice) => {
    this.ctx.lineTo(vertice[0], vertice[1]);
  })
  this.ctx.fill();
  this.ctx.stroke();
}
*/

//think in three dimensions;

Layer.prototype.body = function(vertices, faces){
  faces.forEach((face) => {
    const end = face[face.length - 1];
    this.ctx.beginPath();
    this.ctx.moveTo(vertices[end][0], vertices[end][1])
    face.forEach((index) => {
      this.ctx.lineTo(vertices[index][0], vertices[index][1]);
    })
    this.ctx.stroke();
    this.ctx.fill();
  })
}

Layer.prototype.drawLine = function(vertices, connect){
  if(this.round){
    vertices = vertices.map((vertice) => vertice.map((coord) => Math.round(coord)));
  }
  this.ctx.beginPath();
  this.ctx.moveTo(vertices[0][0], vertices[0][1]);
  this.ctx.lineTo(vertices[1][0], vertices[1][1]);
  this.ctx.fill();
  this.ctx.stroke();
}

Layer.prototype.drawCircle = function(vertices){
  this.ctx.fillStyle = 'black';
  this.ctx.beginPath();
  this.ctx.arc(vertices[0], vertices[1], 2, 0, 2*Math.PI);
  this.ctx.fill();
  this.ctx.stroke();
}

export default Layer;