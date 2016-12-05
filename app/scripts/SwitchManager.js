import Mediator from './Mediator';
import sono from 'sono';

export default class SwitchManager {
  constructor({ scene, lightSide, darkSide }) {
    console.log('SwitchManager');
    this.isLightSide = true;
    this.scene = scene;
    this.lightSide = lightSide;
    this.darkSide = darkSide;
    this.events();
    this.sounds();


  }
  sounds() {
    this.soundLight = sono.createSound({
      id: 'foo',
      src: 'assets/sound/light.mp3',
      volume: 0.5,
    });
    this.analyserLight = this.soundLight.effect.analyser({
      fftSize: 1024,
      smoothingTimeConstant: 0.7,
    });

    this.soundLight.play();
    var echo = this.echo = sono.effect.echo({
      delay: 0.8,
      feedback: 0.5
    });
    // change the delay time and feedback amount:
    echo.delay = 0.5;
    echo.feedback = 0;
    this.soundLight.currentTime = 50;
    this.soundDark = sono.createSound({
      id: 'dark',
      src: 'assets/sound/dark.mp3',
      volume: 0,
    });
    this.analyserDark = this.soundDark.effect.analyser({
      fftSize: 1024,
      smoothingTimeConstant: 0.7,
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
    TweenMax.to(this.echo, 0.2, {
      feedback: 0.9,
      repeat:3,
      yoyo: true,
      ease: Quad.easeOut,
    });
    this.isLightSide = !this.isLightSide;
    if (this.isLightSide) {
      this.lightSide.on();
      this.darkSide.off();
      this.soundLight.fade(0.5, 0.4);
      this.soundDark.fade(0, 0.4);
      this.glitch.enabled = false;
      this.rgb.enabled = false;

      this.noise.params.amount = 0.011;
      this.vignette.params.reduction = 1;

    } else {
      this.lightSide.off();
      this.darkSide.on();
      this.soundDark.fade(0.5, 0.4);
      this.soundLight.fade(0, 0.4);
      this.glitch.enabled = true;
      this.rgb.enabled = true;

    }
  }
  update() {

    if (this.isLightSide) {

      const lightFreq = this.analyserLight.getFrequencies();
      let total = 0;
      for (let i = 0; i < lightFreq.length; i++) {
        const magnitude = lightFreq[i];
        total += magnitude / 256;
      }
      Mediator.emit('freqLight:update', {
        total,
      });

    } else {

      const darkFreq = this.analyserDark.getFrequencies();
      let total = 0;
      for (let i = 0; i < darkFreq.length; i++) {
        const magnitude = darkFreq[i];
        total += magnitude / 256;
      }
      Mediator.emit('freqDark:update', {
        total,
      });

      this.noise.params.amount = Math.random() * 0.8;
      this.glitch.intensity = Math.random() * 0.5;
      this.rgb.params.delta.x = Math.random() * 80;
      this.rgb.params.delta.y = Math.random() * 80;
      this.vignette.params.reduction = 1 + Math.random() * 0.5;
      this.darkSide.spotLight.distance = 200 + total
    }
  }
}
