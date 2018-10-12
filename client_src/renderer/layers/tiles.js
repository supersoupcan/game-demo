import { Hexagon, Parallelogram, Rectangle } from '../../common/hexShapes';

export default function(){
  const { layout, tilesInView, cursor } = this.viewport;

  this.setStyles();
  this.clear();

  let base = new Hexagon([2, 3], [2, 0]);
  let all = base.both();

  all.border.forEach((hex) => {
    const vertices = layout.toBody([...hex, 0], 'hexHCs', 'iso');
    const faces = [[0, 1, 2, 3, 4, 5]]
    this.body(vertices, faces, { fillStyle: 'pink' });
  })

  all.tiles.forEach((hex) => {
    const vertices = layout.toBody([...hex, 0], 'hexHCs', 'iso');
    const faces = [[0, 1, 2, 3, 4, 5]]
    this.body(vertices, faces, { fillStyle: 'orange' });
  });

  function prism(top, bottom){
    let vertices = [...top, ...bottom];
    let faces = [
      //[6, 7, 8, 9, 10, 11],
      [0, 1, 2, 3, 4, 5],
      [3, 4, 10, 9],
      [4, 5, 11, 10],
      [5, 0, 6, 11],
    ];
    this.body(vertices, faces);
  }

  function createHex(hex){
    let hexTop = layout.toBody([...hex, 0], 'hexHCs', 'iso');
    let hexBottom = layout.toBody([...hex, -0.5], 'hexHCs', 'iso');
    //console.log(hexTop);
    prism.call(this, hexTop, hexBottom);
  }

  //createHex.call(this, [-1, 1]); //
  //createHex.call(this, [-1, 0]); //
  //createHex.call(this, [0, 1]); //
  //createHex.call(this, [0, 0]); //
  //createHex.call(this, [1, 0]); //
  //createHex.call(this, [0, -1]); //
  //createHex.call(this, [1, -1]); //
  
 
  
  //createHex.call(this, [0, 0]);
  //createHex.call(this, [0, 0]);
  //createHex.call(this, [0, 0]);

  //let x = layout.to([[20, 0, 0], [-20, 0, 0]], 'euc', 'iso');
  //let y = layout.to([[0, 20, 0], [0, -20, 0]], 'euc', 'iso');
  //let z = layout.to([[0, 0, 20], [0, 0, -20]], 'euc', 'iso');

  //this.drawLine(x);
  //this.drawLine(y);
  //this.drawLine(z);

  /*
  if(this.viewport.cursor){
    const pos = layout.recoverIso(cursor[0], cursor[1], 0);
    let euc = layout.to(pos, 'iso', 'euc');
    let iso = layout.to(euc, 'euc', 'iso');
    this.drawCircle([cursor[0], cursor[1]]);
  }

  
  */
}