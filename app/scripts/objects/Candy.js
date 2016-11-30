const THREE = require('three');
import Ressources from '../Ressources';
import Mediator from '../Mediator';

export default class Skybox extends THREE.Object3D {
  constructor() {
    super();
    this.candys = new THREE.Group();
    const object = this.object = Ressources.get('obj-candy');
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
    this.candys.add(object);
    object.scale.set(10, 10, 10);
    for (let i = 0; i < 5; i++) {
      const t = object.clone();
      t.position.set(Math.random() * 20, 0, Math.random() * 20);
      const r = Math.random() * 5 + 5;
      t.scale.set(r, r, r);

      t.rotation.set(0, Math.random() * Math.PI * 2, Math.random() * Math.PI / 4);
      this.candys.add(t);
    }
    this.add(this.candys);

    Mediator.on('freqLight:update', ({ total }) => {
      this.candys.scale.y = Math.max(total / 80, 1);
    });
  }
  addGUI(folder) {
    const candy = folder.addFolder(`Candy${this.id}`);
    candy.open();
    const pos = candy.addFolder('position');
    pos.open();
    pos.add(this.object.position, 'x').min(-200).max(200);
    pos.add(this.object.position, 'y').min(-200).max(200);
    pos.add(this.object.position, 'z').min(-200).max(200);
  }
  update() {

  }

}
