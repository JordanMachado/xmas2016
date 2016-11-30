const THREE = require('three');

import ParticleSystem from './objects/ParticleSystem';
import SmokeSystem from './objects/SmokeSystem';
import Candy from './objects/Candy';
export default class LightSide {
  constructor({ scene, renderer }) {
    this.type = 'lightSide';
    this.scene = scene;
    this.renderer = renderer;
    this.lights = [];
    this.objects = [];
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
    // this.scene.add(this.particleSystem);

    this.smokeSystem = new SmokeSystem({
      scene: this.scene,
      renderer: this.renderer,
    });
    this.scene.add(this.smokeSystem);
    this.candy = new Candy();
    this.candy.position.set(-40, 12, -26);
    this.scene.add(this.candy);
  }
  on() {
    this.spotLight.distance = 0;
  }
  off() {
    this.spotLight.distance = 1;
  }
  update() {
    this.particleSystem.update();
    this.smokeSystem.update();
  }
}
