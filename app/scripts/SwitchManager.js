import Mediator from './Mediator';
import sono from 'sono';

export default class SwitchManager {
  constructor({ scene, lightSide, darkSide }) {
    console.log('SwitchManager');
    this.side = true;
    this.scene = scene;
    this.lightSide = lightSide;
    this.darkSide = darkSide;
    this.events();
    this.sounds();
  }
  sounds() {
    this.soundLight = sono.createSound({
      id: 'foo',
      src: 'assets/jingl.mp3',
      volume: 0.5,
    });
    this.soundLight.play();
    this.soundDark = sono.createSound({
      id: 'dark',
      src: 'assets/jinglhard.mp3',
      volume: 0,
    });
    this.soundDark.play();
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
      this.soundLight.fade(0.5, 0.4);
      this.soundDark.fade(0, 0.4);
    } else {
      this.lightSide.off();
      this.darkSide.on();
      this.soundDark.fade(0.5, 0.4);
      this.soundLight.fade(0, 0.4);
    }
  }
}
