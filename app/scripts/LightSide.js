const THREE = require('three');
export default class LightSide {
  constructor({ scene }) {
    this.type = 'lightSide';
    this.scene = scene;
    this.lights = [];
    this.objects = [];
  }
  initLights({ spotLights }) {

    this.spotLight = new THREE.SpotLight(0xffffff);
    this.spotLight.position.y = 200;
    this.scene.add(this.spotLight);
    const spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
    this.scene.add(spotLightHelper);
    spotLights.push(this.spotLight);
  }
  addObjects() {

  }
  on() {
    this.spotLight.distance = 500;
  }
  off() {
    this.spotLight.distance = 1;
  }
  update() {

  }
}
