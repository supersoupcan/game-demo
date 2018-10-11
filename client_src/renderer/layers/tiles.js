export default function(){
  const { layout, tilesInView, cursor } = this.viewport;

  this.setStyles();
  this.clear();

  function Prism(top, bottom){
    let vertices = [...top, ...bottom];
    
  }

  const hextop = this.drawShape(layout.toBody([0, 0, 0], 'hexHCs', 'iso'));
  const hexbottom = this.drawShape(layout.toBody([0, 0, -1], 'hexHCs', 'iso'));

  this.drawShape();

  tilesInView.forEach((tile) => {
    //this.drawShape(layout.toBody([0, 0, 0], 'hexHCs', 'iso'))
    //this.drawShape(layout.toBody([0, 1, 0], 'hexHCs', 'iso'))
  })

  let x = layout.to([[20, 0, 0], [-20, 0, 0]], 'euc', 'iso');
  let y = layout.to([[0, 20, 0], [0, -20, 0]], 'euc', 'iso');
  let z = layout.to([[0, 0, 20], [0, 0, -20]], 'euc', 'iso');

  //this.drawLine(x);
  //this.drawLine(y);
  //this.drawLine(z);
  if(this.viewport.cursor){
    const pos = layout.recoverIso(cursor[0], cursor[1], 0);
    let euc = layout.to(pos, 'iso', 'euc');
    let iso = layout.to(euc, 'euc', 'iso');
    this.drawCircle([cursor[0], cursor[1]]);
  }
}