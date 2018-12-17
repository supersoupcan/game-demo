const Events = function(){
  this.channels = {};
}

Events.prototype.on = function(name, listenerToAdd){
  if(!this.channels.hasOwnProperty(name)){
    this.channels[name] = [];
  }
  const eventChannel = this.channels[name];
  eventChannel.push(listenerToAdd);
}

Events.prototype.off = function(name, listenerToRemove){
  if(this.channels.hasOwnProperty(name)){
    const eventChannel = this.channels[name];
    const index = eventChannel.findIndex((listener) => listener === listenerToRemove);
    if(index !== -1) eventChannel.splice(index, 1);
  }
}

Events.prototype.checkOn = function(name, listenerToCheck){
  if(this.channels.hasOwnProperty(name)){
    const eventChannel = this.channels[name];
    return eventChannel.includes(listenerToCheck);
  }
  return false;
}

Events.prototype.emit = function(name, event){
  if(this.channels.hasOwnProperty(name)){
    const eventChannel = this.channels[name];
    eventChannel.forEach((listener) => listener(event));
  }
}

const EventTarget = function(events){
  this.events = events;
  this.listeners = [];
}

EventTarget.prototype.addListener = function(name, listener){
  this.listeners.push({ name, pointer: listener });
  this.events.on(name, listener);
}

EventTarget.prototype.clearListeners = function(){
  this.listeners.forEach((listener) => {
    this.events.off(listener.name, listener.pointer);
  })
  this.listener.off()
}

export { Events, EventTarget };