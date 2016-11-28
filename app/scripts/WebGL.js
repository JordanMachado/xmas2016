const THREE = require('three');
window.THREE = THREE;
const OrbitControls = require('three-orbit-controls')(THREE);
import WAGNER from '@superguigui/wagner';
import Mediator from './Mediator';
const objLoader = require('three-obj-loader');
objLoader(THREE);

// Passes
const FXAAPass = require('@superguigui/wagner/src/passes/fxaa/FXAAPASS');
const VignettePass = require('@superguigui/wagner/src/passes/vignette/VignettePass');
const NoisePass = require('@superguigui/wagner/src/passes/noise/noise');
const Tilt = require('@superguigui/wagner/src/passes/tiltshift/tiltshiftPass');
// Objects
import Skybox from './objects/Skybox';
import Cube from './objects/Cube';
import Floor from './objects/Floor';
import LightSide from './LightSide';
import DarkSide from './DarkSide';
import SwitchManager from './SwitchManager';

export default class WebGL {
  constructor(params) {
    this.params = {
      name: params.name || 'WebGL',
      device: params.device || 'desktop',
      postProcessing: params.postProcessing || false,
      events: {
        keyboard: {
          press: params.events.keyboard.press || false,
          up: params.events.keyboard.up || false,
          down: params.events.keyboard.down || false,
        },
        mouse: {
          click: params.events.mouse.click || false,
          move: params.events.mouse.move || false,
        },
        touch: {
          start: params.events.touch.start || false,
          move: params.events.touch.move || false,
          end: params.events.touch.end || false,
        },
      },
      controls: params.controls || false,
    };

    this.mouse = new THREE.Vector2();
    this.originalMouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    this.scene = new THREE.Scene();
    this.fog = new THREE.FogExp2(0x00fFFF, 0.001);
    this.scene.fog = this.fog;

    this.camera = new THREE.PerspectiveCamera(50, params.size.width / params.size.height, 1, 5000);
    this.camera.position.z = 200;
    this.camera.position.y = 20;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(params.size.width, params.size.height);
    this.renderer.setClearColor(0x262626);

    this.lightSide = new LightSide({ scene: this.scene });
    this.darkSide = new DarkSide({ scene: this.scene });
    this.switchManager = new SwitchManager({
      scene: this.scene,
      lightSide: this.lightSide,
      darkSide: this.darkSide,
    });

    this.composer = null;
    this.initPostprocessing();
    this.initLights();
    this.initObjects();
    this.controls = new OrbitControls(this.camera);
    this.controls.enabled = this.params.controls;

    if (window.DEBUG || window.DEVMODE) this.initGUI();

  }
  initPostprocessing() {
    this.composer = new WAGNER.Composer(this.renderer);
    this.composer.setSize(window.innerWidth, window.innerHeight);

    // Add pass and automatic gui
    this.passes = [];
    this.fxaaPass = new FXAAPass();
    this.passes.push(this.fxaaPass);
    this.noisePass = new NoisePass();
    this.passes.push(this.noisePass);
    this.vignettePass = new VignettePass({});
    this.passes.push(this.vignettePass);

    this.tilt = new Tilt();
    this.passes.push(this.tilt);

    for (let i = 0; i < this.passes.length; i++) {
      this.passes[i].enabled = true;
    }

  }
  initLights() {
    this.spotLights = [];
    this.lightSide.initLights({ spotLights: this.spotLights });
    this.darkSide.initLights({ spotLights: this.spotLights });
  }
  initObjects() {

    const loader = new THREE.TextureLoader();
    loader.load('assets/skybox.jpg', (texture) => {
      this.skybox.mesh.material.map = texture;
    });

    const test = new THREE.OBJLoader();
    test.load('assets/Planet.obj', (object) => {
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // child.material.map = texture;
          console.log(child);
          child.material = new THREE.MeshPhongMaterial({
            shininess: 300,
            color: 0xffffff,
            side: THREE.DoubleSide,
          });
          child.geometry.computeFaceNormals();
          child.geometry.computeVertexNormals();
        }
      });
      object.scale.set(10, 10, 10);
      object.position.y = 20;
      const t = object.clone();
      t.rotation.z = Math.PI / 180 * 180;
      t.position.y = -40;

      this.scene.add(object);
      this.scene.add(t);
    });

    /* Common */
    this.skybox = new Skybox();
    this.scene.add(this.skybox);
    /* Sides */
    this.lightSide.addObjects();
    this.darkSide.addObjects();

  }
  initGUI() {
    window.webgl = this;
    this.folder = window.gui.addFolder(this.params.name);
    for (const key in this.params) {
      if (!this.params.hasOwnProperty(key)) continue;
      const obj = this.params[key];
      if (typeof obj !== 'object') {

        const controller = this.folder.add(this.params, key);
        if (key === 'controls') {
          controller.onChange((value) => {
            this.controls.enabled = value;
          });
        }

      }
    }
    const folderEvents = this.folder.addFolder('Events');
    for (const key in this.params.events) {
      // skip loop if the property is from prototype
      if (!this.params.events.hasOwnProperty(key)) continue;

      const obj = this.params.events[key];
      if (typeof obj !== 'object') {
        folderEvents.add(this.params.events, key);
      } else {
        const folder = folderEvents.addFolder(key);
        for (const keyObj in obj) {
          if (!obj.hasOwnProperty(keyObj)) continue;
          folder.add(obj, keyObj);
        }
        folder.open();
      }
    }
    // init postprocessing GUI
    this.postProcessingFolder = this.folder.addFolder('PostProcessing');
    for (let i = 0; i < this.passes.length; i++) {
      const pass = this.passes[i];
      if (pass.enabled === undefined) pass.enabled = true;
      let containsNumber = false;
      for (const key of Object.keys(pass.params)) {
        if (typeof pass.params[key] === 'number') {
          containsNumber = true;
        }
      }
      const folder = this.postProcessingFolder.addFolder(pass.constructor.name);
      folder.add(pass, 'enabled');
      if (containsNumber) {
        for (const key of Object.keys(pass.params)) {
          if (typeof pass.params[key] === 'number') {
            folder.add(pass.params, key);
          }
        }
      }
      folder.open();
    }
    // this.postProcessingFolder.open();

    // light
    const Lights = this.folder.addFolder('Lights');

    for (let i = 0; i < this.spotLights.length; i++) {
      // this.spotLights[i]
      const light = this.spotLights[i];
      const folder = Lights.addFolder(`SpotLight ${i}`);
      folder.open();
      const pos = folder.addFolder('position');
      pos.open();
      pos.add(light.position, 'x').min(-200).max(200);
      pos.add(light.position, 'y').min(-500).max(500);
      pos.add(light.position, 'z').min(-200).max(200);
      const params = folder.addFolder('params');
      params.open();
      params.add(light, 'distance').min(0).max(500);

    }

    // init scene.child GUI
    for (let i = 0; i < this.scene.children.length; i++) {
      const child = this.scene.children[i];
      if (typeof child.addGUI === 'function') {
        child.addGUI(this.folder);
      }
    }
    this.folder.open();
  }
  render() {
    if (this.params.postProcessing) {
      this.composer.reset();
      this.composer.render(this.scene, this.camera);

      // Passes
      for (let i = 0; i < this.passes.length; i++) {
        if (this.passes[i].enabled) {
          this.composer.pass(this.passes[i]);
        }
      }

      this.composer.toScreen();

    } else {
      this.renderer.render(this.scene, this.camera);
    }

    this.scene.rotation.y += 0.001;
  }
  rayCast() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.cube, true);
    if (intersects.length > 0) {
      console.log('intersects');
    }
  }
  // Events
  resize(width, height) {
    if (this.composer) {
      this.composer.setSize(width, height);
    }

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
  keyPress() {}
  keyDown() {}
  keyUp(e) {
    // console.log(e.keyCode);
    if (e.keyCode === 32) {
      Mediator.emit('switch');
    }
  }
  click(x, y, time) {
    this.originalMouse.x = x;
    this.originalMouse.y = y;
    this.mouse.x = (x / window.innerWidth - 0.5) * 2;
    this.mouse.y = (y / window.innerHeight - 0.5) * 2;
  }
  mouseMove(x, y, ime) {
    this.originalMouse.x = x;
    this.originalMouse.y = y;
    this.mouse.x = (x / window.innerWidth - 0.5) * 2;
    this.mouse.y = (y / window.innerHeight - 0.5) * 2;
  }
  touchStart() {}
  touchEnd() {}
  touchMove() {}

}