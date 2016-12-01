const THREE = require('three');
import SmokeSystem from './objects/SmokeSystem';

export default class DarkSide {
  constructor({ scene, renderer }) {
    this.type = 'lightSide';
    this.scene = scene;
    this.renderer = renderer;
    this.lights = [];
    this.objects = [];
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
