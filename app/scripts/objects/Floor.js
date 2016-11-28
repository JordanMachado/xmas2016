const THREE = require('three');

export default class Cube extends THREE.Object3D {
  constructor() {
    super();
    this.geom = new THREE.CircleGeometry(50, 36);
    this.mat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(this.geom, this.mat);
    this.mesh.rotation.x = Math.PI / 180 * 90;
    this.add(this.mesh);
  }
  update() {
    this.rotation.x += 0.01;
    this.rotation.z += 0.01;
  }
}
