const THREE = require('three');
import Ressources from '../Ressources';
import Mediator from '../Mediator';

export default class ReactiveObject extends THREE.Object3D {
  constructor({
    type = 'cadeau',
    scale = 0.1,
    audioFactor = 0,
    ao = false,
    shininess = 3000,
    aoMapIntensity = 0.1,
  }) {
    super();
    this.type = type;
    const object = this.object = Ressources.get(`obj-${type}`);
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhongMaterial({
          shininess,
          side: THREE.DoubleSide,
          map: Ressources.get(`txr-${type}`),
        });
        if (ao) {
          child.material.aoMap = Ressources.get(`txr-${type}-ao`);
          child.material.aoMap.needsUpdate = true;
          child.material.aoMapIntensity = aoMapIntensity;
        }
        child.geometry.center();
        child.geometry.computeFaceNormals();
        child.geometry.computeVertexNormals();
      }
    });

    object.scale.set(scale, scale, scale);
    this.add(this.object);

    Mediator.on('freqLight:update', ({ total }) => {
      this.object.scale.y = Math.max(total / 800, scale);
    });
  }
  addGUI(folder) {
    const obj = folder.addFolder(`${this.type + this.id}`);
    obj.open();
    const pos = obj.addFolder('position');
    pos.open();
    pos.add(this.object.position, 'x').min(-200).max(200);
    pos.add(this.object.position, 'y').min(-200).max(200);
    pos.add(this.object.position, 'z').min(-200).max(200);
  }
  update() {

  }

}
