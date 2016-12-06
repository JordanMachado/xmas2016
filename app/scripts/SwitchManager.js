import Mediator from './Mediator';
import sono from 'sono';

export default class SwitchManager {
  constructor({ scene, camera, lightSide, darkSide }) {
    this.isLightSide = true;
    this.scene = scene;
    this.camera = camera;
    this.lightSide = lightSide;
    this.darkSide = darkSide;
    this.events();
    this.sounds();

    Mediator.on('energy:charge', (transition) => {
      this.charge(transition);
    });


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

    const echo = this.echo = sono.effect.echo({
      delay: 0.8,
      feedback: 0.5,
    });
    echo.delay = 0.5;
    echo.feedback = 0;
    this.soundDark = sono.createSound({
      id: 'dark',
      src: 'assets/sound/dark.mp3',
      volume: 0,
    });
    this.analyserDark = this.soundDark.effect.analyser({
      fftSize: 1024,
      smoothingTimeConstant: 0.7,
    });
  }
  start() {
    this.soundLight.play();
    this.soundDark.play();
    // this.soundLight.currentTime = 50;

  }
  events() {
    Mediator.on('switch', this.onSwitch.bind(this));

  }
  onSwitch() {
    TweenLite.to(this.scene.rotation, 0.4, {
      x: this.scene.rotation.x + Math.PI / 180 * 180,
      ease: Quad.easeOut,
    });
    this.echo.feedback = 0

    this.isLightSide = !this.isLightSide;
    if (this.isLightSide) {
      this.lightSide.on();
      this.darkSide.off();
      this.soundLight.fade(0.5, 0.4);
      this.soundDark.fade(0, 0.4);

      this.scene.rotation.y = 2;
      this.noise.params.amount = 0.011;
      this.vignette.params.reduction = 1;

    } else {
      this.scene.rotation.y = 1;
      this.lightSide.off();
      this.darkSide.on();
      this.soundDark.fade(0.5, 0.4);
      this.soundLight.fade(0, 0.4);

    }
  }
  charge(transition) {
    this.noise.params.amount = 0.4 * transition;
    this.rgb.params.delta.x = Math.random() * 80 * transition;
    this.rgb.params.delta.y = Math.random() * 80 * transition;
    this.glitch.intensity = 0.5 * transition;
    this.echo.feedback = 0.9 * transition;
    this.vignette.params.reduction = 1 + transition;

    this.soundLight.playbackRate = 1 - transition / 5;

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
      this.darkSide.spotLight.distance = 150 + total;
    }
  }
}
