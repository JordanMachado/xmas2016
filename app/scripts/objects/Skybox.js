const THREE = require('three');

export default class Skybox extends THREE.Object3D {
  constructor() {
    super();
    this.mat = new THREE.MeshBasicMaterial({
      map: new THREE.Texture(),
      fog: false,
      // wireframe: true,
      side: THREE.BackSide,
    });
    this.geom = new THREE.SphereBufferGeometry(200, 36, 36);
    this.mesh = new THREE.Mesh(this.geom, this.mat);
    this.add(this.mesh);
  }

}
