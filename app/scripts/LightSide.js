const THREE = require('three');

import ParticleSystem from './objects/ParticleSystem';
import ReactiveObject from './objects/ReactiveObject';
export default class LightSide {
  constructor({ scene, renderer, config }) {
    this.type = 'lightSide';
    this.scene = scene;
    this.renderer = renderer;
    this.lights = [];
    this.objects = [];
    this.config = config;
    console.log(this.config);
  }
  initLights({ spotLights }) {

    const directionalLight = new THREE.DirectionalLight(0x5e9bff, 0.1);
    directionalLight.position.set(0, 1, 0);
    this.scene.add(directionalLight);
    this.spotLight = new THREE.SpotLight(0xffffff);
    this.spotLight.position.y = 200;
    this.scene.add(this.spotLight);
    if (window.DEBUG) {
      const spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
      this.scene.add(spotLightHelper);
    }
    spotLights.push(this.spotLight);
  }
  addObjects() {
    this.particleSystem = new ParticleSystem({
      scene: this.scene,
      renderer: this.renderer,
    });
    this.scene.add(this.particleSystem);
    for (let i = 0; i < this.config.objects.length; i++) {
      const obj = this.config.objects[i];
      if (obj.reactive) {
        const object = new ReactiveObject(obj);
        this.scene.add(object);

      } else {}
    }

    // this.candy.position.set(-40, 28, -26);
  }
  on() {
    this.spotLight.distance = 0;
  }
  off() {
    this.spotLight.distance = 1;
  }
  update() {
    this.particleSystem.update();
  }
}
