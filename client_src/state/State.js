import { EventTarget } from "../events";

class State extends EventTarget{
  constructor(events){
    super(events);
  }

  //travel down prototype chain calling namedMethod where possible
  //terminate upon reaching its own prototype

  run(methodName, app, context = this){
    const prototype = Object.getPrototypeOf(this);
    if(State.prototype.constructor !== prototype.constructor){
      if(prototype.hasOwnProperty(methodName)){
        if(!prototype[methodName].call(context, app) === false){
          prototype.run(methodName, app, this);
        }
      }else{
        prototype.run(methodName, app, this);
      }
    }
  } 
}

export default State;