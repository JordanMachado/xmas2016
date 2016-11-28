import Mediator from './Mediator';

export default class SwitchManager {
  constructor({ scene, lightSide, darkSide }) {
    console.log('SwitchManager');
    this.side = true;
    this.scene = scene;
    this.lightSide = lightSide;
    this.darkSide = darkSide;
    this.events();
  }
  events() {
    Mediator.on('switch', this.onSwitch.bind(this));

  }
  onSwitch() {
    TweenLite.to(this.scene.rotation, 0.4, {
      x: this.scene.rotation.x + Math.PI / 180 * 180,
      ease: Quad.easeOut,
    });
    this.side = !this.side;
    if (this.side) {
      this.lightSide.on();
      this.darkSide.off();
    } else {
      this.lightSide.off();
      this.darkSide.on();
    }
  }
}
