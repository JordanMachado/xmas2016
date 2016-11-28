import Emitter from 'component-emitter';

class Mediator extends Emitter {
  emit(...args) {
    super.emit(...args);
    // console.log('%c [MEDIATOR] Emit ->', 'background-color: #333; color: #FFFFFF', ...args);
  }
}
window.Mediator = new Mediator();
export default new Mediator();
