/*
//  this.map
//    a hashmap whose key is the name of an event, 
//    and whose value is another hashmap containing a list of 
//    functions to call on the emiting of said event
//  this.keys
//    an simple object which relays whether 
//    or not a given key is held down at the moment
//  this.keypairs
//    a hashmap whose keys are the name of key combo, 
//    and whose value is an array of key names
*/

const Events = function(){
  this.map = new Map();
  this.keys = {};
  this.keyPairs = new Map();
  this.mouse = {
    elementId: null,
  }
}

Events.prototype = {
  init: function(){
    window.addEventListener("keydown", (e) => this.onKeyInput(e));
    window.addEventListener("keyup", (e) => this.onKeyInput(e));
    window.addEventListener("mousemove", (e) => this.onMouse(e));
    window.addEventListener("click", (e) => this.onClick(e));
  },
  onClick(e){
    this.emit('click_' + e.target.id, e);
  },
  onMouse(e){
    if(e.target.id !== this.mouse.elementId){
      this.emit('mouse_out_' + this.mouse.elementId);
      this.emit('mouse_over_' + e.target.id);
      this.mouse.elementId = e.target.id;
    }
    this.emit('mouse_move_' + e.target.id, e);
  },
  addKeyPair: function(name, keys){
    this.keyPairs.set(name, keys);
  },
  emitKeyPairs: function(){
    this.keyPairs.forEach((keypair, name) => {
      if(keypair.some((key) => this.keys[key])){
        this.emit('keypair_' + name, this.keys);
      }
    })
  },
  removeKeyPair: function(name){
    this.keyPairs.delete(name);
  },
  onKeyInput: function(event){
    const { type, key } = event;
    const current = this.keys[key];
    const value = (type === "keydown");
    if(value === current){
      event.preventDefault();
      return false;
    }else{
      if(!current && value){
        this.emit('toggle_key_' + key, event);
      }
      this.keys[key] = value;
    }
  },
  resetKeys: function(){
    this.map = [];
  },
  on: function(eventName, name, handler){
    if(!this.map.has(eventName)){
      this.map.set(eventName, new Map())
    }
    this.map.get(eventName).set(name, handler);
  },
  off: function(eventName, name){
    if(this.map.has(eventName)){
      const event = this.map.get(eventName);
      if(event.has(name)) event.delete(name);
      if(event.size === 0) this.map.delete(eventName);
    }
  },
  emit: function(eventName, event){
    if(this.map.has(eventName)){
      this.map.get(eventName).forEach((handler) => handler(event));
    }
  }
}

export default Events;