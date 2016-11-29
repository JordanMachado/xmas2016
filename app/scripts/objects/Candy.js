const THREE = require('three');
import Ressources from '../Ressources';
export default class Skybox extends THREE.Object3D {
  constructor() {
    super();

    const object = Ressources.get('obj-candy');
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhongMaterial({
          shininess: 300,
          color: 0xffffff,
          side: THREE.DoubleSide,
        });
        child.geometry.center();
        child.geometry.computeFaceNormals();
        child.geometry.computeVertexNormals();
      }
    });
    object.scale.set(10, 10, 10);
    this.add(object);
  }
  update() {

  }

}
