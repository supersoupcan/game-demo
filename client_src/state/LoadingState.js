import State from './State';

import { 
  Axis, Space, Scene, SceneLoader, 
  HemisphericLight, FreeCamera, Vector3, 
  Engine, AssetContainer, KeyboardInfo, Color3, NullEngineOptions 
} from 'babylonjs';

class LoadingState extends State{
  constructor(){
    super();
    this.progress = null;
    this.timer = null;
  }
  init(app){

  }
  cleanUp(app){

  }
}

class InitialLoadingState extends LoadingState{
  constructor(){
    super();
  }
  init(){

  }

  handleEvents(){

  }
}

export { LoadingState, InitialLoadingState };