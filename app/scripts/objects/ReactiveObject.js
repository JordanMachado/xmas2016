const THREE = require('three');
import Ressources from '../Ressources';
import Mediator from '../Mediator';
const RAD = Math.PI / 180;
export default class ReactiveObject extends THREE.Object3D {
  constructor(obj) {
    super();
    this.type = obj.type;
    this.open = obj.open;
    const object = this.object = Ressources.get(`obj-${obj.type}`).clone();
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhongMaterial({
          shininess: obj.shininess,
          side: THREE.DoubleSide,
          map: Ressources.get(`txr-${obj.type}`),
        });
        if (obj.ao) {
          child.material.aoMap = Ressources.get(`txr-${obj.type}-ao`);
          child.material.aoMap.needsUpdate = true;
          child.material.aoMapIntensity = obj.aoMapIntensity;
        }
        if (obj.noCenter) {

        } else {
          child.geometry.center();

        }
        child.geometry.computeFaceNormals();
        child.geometry.computeVertexNormals();
      }
    });

    object.scale.set(obj.scale, obj.scale, obj.scale);
    object.position.set(obj.p.x, obj.p.y, obj.p.z);
    object.oposition = object.position.clone();
    if (obj.r) {
      object.rotation.set(obj.r.x * RAD, obj.r.y * RAD, obj.r.z * RAD);
    }
    this.add(this.object);

    this.tick = 0;
    this.invert = obj.scale < 0 ? -1 : 1;
    const post = new THREE.Vector3()
  //   if(obj.follow) {
  //   Mediator.on('scene:update', ({ rot }) => {
  //     this.object.rotation.y = -rot.y
  //    });
  //  }

    if(this.invert === -1) {
      Mediator.on('freqDark:update', ({ total }) => {
        this.object.scale.y = this.invert *
         Math.max(total * obj.factor + Math.abs(obj.scale),
         Math.abs(obj.scale)
       );
       if (obj.type === 'hand') {
        //  this.object.rotation.y = RAD * -total / 2;
       }
        if (obj.type === 'skull-head-bottom') {
          this.object.position.y = this.object.oposition.y + total / 40;
        }
       });
    } else {
      Mediator.on('freqLight:update', ({ total }) => {
        this.object.scale.y = this.invert *
         Math.max(total * obj.factor + Math.abs(obj.scale),
         Math.abs(obj.scale)
       );
        if (obj.type === 'snowman-head') {
          this.tick += 0.1;
          // object.rotation.z = Math.sin(this.tick + total * 0.05) * RAD * 4;
          object.rotation.x = Math.sin(this.tick) * RAD * 2;
          object.rotation.z = Math.cos(this.tick) * RAD * 2;
        }
      });
    }
  }
  addGUI(folder) {
    const obj = folder.addFolder(`${this.type + this.id}`);
    if (this.open) obj.open();
    const pos = obj.addFolder('position');
    if (this.open) pos.open();
    pos.add(this.object.position, 'x').min(-200).max(200);
    pos.add(this.object.position, 'y').min(-200).max(200);
    pos.add(this.object.position, 'z').min(-200).max(200);
  }
  update() {
  }

}
