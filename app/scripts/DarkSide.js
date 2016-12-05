const THREE = require('three');
import SmokeSystem from './objects/SmokeSystem';
import ReactiveObject from './objects/ReactiveObject';

export default class DarkSide {
  constructor({ scene, renderer, config }) {
    this.type = 'lightSide';
    this.scene = scene;
    this.renderer = renderer;
    this.lights = [];
    this.objects = [];
    this.config = config;

  }
  initLights({ spotLights }) {
    const directionalLight = new THREE.DirectionalLight(0xd95eff, 0.1);
    directionalLight.position.set(0, -1, 0);
    this.scene.add(directionalLight);

    this.spotLight = new THREE.SpotLight(0xff0000);
    this.spotLight.position.y = -200;
    this.scene.add(this.spotLight);
    if (window.DEBUG) {
      const spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
      this.scene.add(spotLightHelper);
    }
    spotLights.push(this.spotLight);
  }
  addObjects() {
    this.smokeSystem = new SmokeSystem({
      scene: this.scene,
      renderer: this.renderer,
    });
    this.scene.add(this.smokeSystem);

    for (let i = 0; i < this.config.objects.length; i++) {

      const obj = this.config.objects[i];
      console.log('cc',obj);
      if (obj.reactive) {
        const object = new ReactiveObject(obj);
        this.scene.add(object);

      } else {}
    }
    this.off();

  }
  on() {
    this.spotLight.distance = 0;
  }
  off() {
    this.spotLight.distance = 1;
  }
  update() {
    this.smokeSystem.update();

  }
}
