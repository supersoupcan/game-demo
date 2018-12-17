import { EventTarget } from './events';

const resetControls = {
  'select': false,
}

const defaultInputMap = {
  'a': ['select']
}

const Controls = function(events){
  EventTarget.call(this, events);
  this.inputMap = null;
  this.toggled = null;
  this.held = null;
  this.viewportCursor = null;
}

Controls.prototype = Object.create(EventTarget.prototype);

Controls.prototype.init = function(inputMap = defaultInputMap){
  this.inputMap = inputMap;
  this.toggled = Object.assign({}, resetControls);
  this.held = Object.assign({}, resetControls);
  this.viewportCursor = {
    updated: false,
    position: null,
  }

  this.addListener('webgl_mousemove', (event) => { this.interpretViewportCursor(event)});
  this.addListener('webgl_mouseout', (event) => { this.interpretViewportCursor(event)});
  this.addListener('window_keydown', (event) => { this.interpretInput(event)});
  this.addListener('window_keyup', (event) => { this.interpretInput(event)});
}

Controls.prototype.interpretViewportCursor = function(event){
  if(event.type === 'mousemove'){
    const cursorX = event.pageX - event.srcElement.offsetLeft;
    const cursorY = event.pageY - event.srcElement.offsetTop;
    this.viewportCursor.position = { x: cursorX, y: cursorY };
  }else if (event.type === 'mouseout'){
    this.viewportCursor.position = null;
  }
  this.viewportCursor.updated = true;
}

Controls.prototype.interpretInput = function(event){
  const { key, type } = event;
  if(this.inputMap.hasOwnProperty(key)){
    const mappedControls = this.inputMap[key];
    switch(type){
      case "keydown": {
        mappedControls.forEach((control) => {
          //prevents key from rapidely toggling when being held
          if(this.held[control] === false){
            this.held[control] = true;
            this.toggled[control] = true;
          }
        })
        break;
      }
      case "keyup": {
        mappedControls.forEach((control) => {
          if(this.held[control] === true){
            this.held[control] = false;
          }
        })
        break;
      }
    }
  }
}

Controls.prototype.emitInput = function(){
  if(this.viewportCursor.updated){
    this.events.emit('move_viewportcursor', this.viewportCursor.position);
    this.viewportCursor.updated = false;
  }
  Object.keys(this.toggled).forEach((control) => {
    if(this.toggled[control] === true){
      this.events.emit('toggle_' + control, control)
      this.toggled[control] = false;
    }
  })
}

export default Controls;