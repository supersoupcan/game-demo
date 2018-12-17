import { EventTarget } from '../../events';

const PushdownAutomata = function(events){
  EventTarget.call(this, events);
  this.stack = [];
}

Object.defineProperty(PushdownAutomata.prototype, 'state', {
  get: function state(){
    return this.stack[this.stack.length - 1];
  }
})

PushdownAutomata.prototype.initState = function(startingState){
  this.stack.push(startingState);
  this.state.run('init');
}

PushdownAutomata.prototype.popAndPushState = function(nextState){
  this.state.run('cleanUp');
  this.stack.pop();
  this.stack.push(nextState);
  this.state.run('init');
}

PushdownAutomata.prototype.popState = function(){
  this.state.run('cleanUp');
  this.stack.pop();
  this.state.run('resume');
}

PushdownAutomata.prototype.pushState = function(nextState){
  this.state.run('pause');
  this.stack.push(nextState);
  this.state.run('init');
}

export default PushdownAutomata;