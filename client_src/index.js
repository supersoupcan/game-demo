import { Events } from './events';
import Controls from './Controls';
import PushdownAutomata from './models/structures/PushdownAutomata';
import Viewport3D from './Viewport3D';
import Viewport2D from './Viewport2D';
import { InitialLoadingState } from './state/LoadingState';
import { Engine } from 'babylonjs';
import * as PIXI from 'pixi.js';

window.document.onreadystatechange = function(){
  switch(document.readyState){
    case 'interactive': {
      const events = new Events();
      const webglElement = window.document.getElementById('webgl');

      const babylon_engine = new Engine(
        webglElement,
        true, {
          preserveDrawingBuffer: true,
          stencil: true
      });
      
      const pixi_app = new PIXI.Application({
        context: babylon_engine._gl,
        view: babylon_engine.getRenderingCanvas(),
        width: babylon_engine.getRenderWidth(),
        height: babylon_engine.getRenderHeight(),
        clearBeforeRender: false,
        roundPixels: true,
        autoStart: false
      });

      const stateMachine = new PushdownAutomata(events, startingState);
      const controls = new Controls(events);
      const viewport3D = new Viewport3D(events, babylon_engine);
      const viewport2D = new Viewport2D(events, pixi_app);
      const startingState = new InitialLoadingState(events);

      window.addEventListener('keydown', (e) => events.emit('window_keydown', e));
      window.addEventListener('keyup', (e) => events.emit('window_keydown', e));
      webglElement.addEventListener('mousemove', (e) => events.emit('webgl_mousemove', e));
      webglElement.addEventListener('mouseout', (e) => events.emit('webgl_mouseout', e));
     
      stateMachine.initState(startingState);

      babylon_engine.runRenderLoop(() => {
        stateMachine.state.run('handleEvents')
        stateMachine.state.run('update');
        stateMachine.state.run('draw');
      })
    }
  }
}
