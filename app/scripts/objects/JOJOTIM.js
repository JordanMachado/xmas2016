const THREE = require('three');
import Ressources from '../Ressources';
export default class JOJOTIM extends THREE.Object3D {
  constructor() {
    super();
    this.mat = new THREE.MeshBasicMaterial({
      map: Ressources.get('txr-jojotim'),
      fog: false,
      transparent:true,
      opacity:0,
      // wireframe: true,
      side: THREE.FrontSide,
    });
    this.geom = new THREE.PlaneBufferGeometry(100, 50);
    this.mesh = new THREE.Mesh(this.geom, this.mat);
    this.mesh.rotation.y = Math.PI/ 180 * 75;
    this.add(this.mesh);
  }

}
