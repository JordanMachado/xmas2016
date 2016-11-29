const THREE = require('three');

import ParticleSystem from './objects/ParticleSystem';
export default class LightSide {
  constructor({ scene, renderer }) {
    this.type = 'lightSide';
    this.scene = scene;
    this.renderer = renderer;
    this.lights = [];
    this.objects = [];
  }
  initLights({ spotLights }) {

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
  }
  on() {
    this.spotLight.distance = 500;
  }
  off() {
    this.spotLight.distance = 1;
  }
  update() {
    this.particleSystem.update();
  }
}
