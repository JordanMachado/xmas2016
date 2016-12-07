import Mediator from './Mediator';
import sono from 'sono';

export default class SwitchManager {
  constructor({ scene, camera, lightSide, darkSide, earth }) {
    this.isLightSide = true;
    this.scene = scene;
    this.earth = earth;
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
    this.soundLight.currentTime = 1;

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
    this.soundDark.volume = 0.5

    this.isLightSide = !this.isLightSide;
    if (this.isLightSide) {
      this.lightSide.on();
      this.darkSide.off();
      this.soundLight.fade(0.5, 0.4);
      this.soundDark.fade(0, 0.4);
      this.camera.position.x = -60

      this.scene.rotation.y = 2;
      this.earth.position.y = -10;
      this.noise.params.amount = 0.011;
      this.vignette.params.reduction = 1;

    } else {
      this.scene.rotation.y = 1;
      this.camera.position.x = -20;
      this.earth.position.y = 10;
      this.lightSide.off();
      this.darkSide.on();
      this.soundDark.fade(0.5, 0.4);

      this.soundLight.fade(0, 0.4);

    }
  }
  charge(transition) {
    this.noise.params.amount = 0.4 * transition;
    this.rgb.params.delta.x = Math.random() * 140 * transition;
    this.rgb.params.delta.y = Math.random() * 140 * transition;
    this.glitch.intensity = 0.1 * transition;
    this.echo.feedback = 0.9 * transition;
    this.vignette.params.reduction = 1 + transition * 1.4;

    this.soundLight.playbackRate = 1 - transition / 5;
    // this.soundDark.volume = transition / 2.5;

    this.camera.position.z = 200 - 20 * transition;
    this.camera.position.y = 110 + (Math.random() * 10 * transition);


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

      this.noise.params.amount = Math.random() * 0.6;
      this.glitch.intensity = Math.random() * 0.5;
      this.rgb.params.delta.x = Math.random() * 140;
      this.rgb.params.delta.y = Math.random() * 140;
      this.vignette.params.reduction = 1 + Math.random() * 0.5;
      this.darkSide.spotLight.distance = 150 + total;
    }
  }
}
