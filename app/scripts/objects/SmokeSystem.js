const THREE = require('three');

import hexRgb from 'hex-rgb';
const glslify = require('glslify');
window.THREE = THREE;
import Mediator from '../Mediator';

import Ressources from '../Ressources';
export default class ParticleSystem extends THREE.Object3D {
  constructor({ renderer, scene }) {
    super();

    const width = 72;
    const height = 72;
    this.dataPos = new Float32Array(width * height * 4);
    this.datatInfos = new Float32Array(width * height * 4);
    this.geom = new THREE.BufferGeometry();
    this.tick = 0;
    const vertices = new Float32Array(width * height * 3);
    const uvs = new Float32Array(width * height * 2);
    const colors = new Float32Array(width * height * 3);
    const size = new Float32Array(width * height * 1);

    let count = 0;

    this.colors = [
      'FFFFFF',
      '00171F',
      '003459',
      '007EA7',
      '00A8E8',
    ];
    for (let i = 0, l = width * height * 4; i < l; i += 4) {

      // this.dataPos[i] = Math.random();
      // this.dataPos[i + 1] = 0;
      // this.dataPos[i + 2] = Math.random();
      // this.dataPos[i + 3] = Math.random();
      const angle2 = Math.random() * Math.PI * 2;
      const radius = Math.random() * 50;

      const x = Math.cos(angle2) * radius;
      const z = Math.sin(angle2) * radius;
      this.dataPos[i] = x;
      this.dataPos[i + 1] = 0;
      this.dataPos[i + 2] = z;
      this.dataPos[i + 3] = Math.random();

      size[count * 3] = Math.random() * 50;

      const angle = Math.random() * Math.PI * 2;

      this.datatInfos[i] = Math.cos(angle);
      this.datatInfos[i + 1] = Math.random() * 0.3;
      this.datatInfos[i + 2] = Math.sin(angle);



      uvs[count * 2 + 0] = (count % width) / width;
      uvs[count * 2 + 1] = Math.floor(count / width) / height;

      const color = hexRgb(this.colors[Math.floor(Math.random() * this.colors.length)]);

      colors[count * 3 + 0] = color[0] / 255;
      colors[count * 3 + 1] = color[1] / 255;
      colors[count * 3 + 2] = color[2] / 255;


      vertices[count * 3 + 0] = this.dataPos[i];
      vertices[count * 3 + 1] = this.dataPos[i + 1];
      vertices[count * 3 + 2] = this.dataPos[i + 2];
      count++;

    }
    this.geom.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    this.geom.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    this.geom.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.geom.addAttribute('size', new THREE.BufferAttribute(size, 1));

    this.textureDataPos = new THREE.DataTexture(
      this.dataPos, width, height, THREE.RGBAFormat, THREE.FloatType);

    this.textureDataInfos = new THREE.DataTexture(
      this.datatInfos, width, height, THREE.RGBAFormat, THREE.FloatType);

    this.textureDataPos.minFilter = THREE.NearestFilter;
    this.textureDataPos.magFilter = THREE.NearestFilter;
    this.textureDataPos.needsUpdate = true;

    this.textureDataInfos.minFilter = THREE.NearestFilter;
    this.textureDataInfos.magFilter = THREE.NearestFilter;
    this.textureDataInfos.needsUpdate = true;


    this.rtTexturePos = new THREE.WebGLRenderTarget(width, height, {
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      stencilBuffer: false,
      flipY: false,
    });

    this.rtTexturePos2 = this.rtTexturePos.clone();

    this.positionShader = new THREE.ShaderMaterial({
      uniforms: {
        tPositions: {
          type: 't',
          value: this.textureDataPos,
        },
        tInfos: {
          type: 't',
          value: this.textureDataInfos,
        },
        tick: {
          type: 'f',
          value: this.tick,
        },
        origin: {
          type: 't',
          value: this.textureDataPos,
        },
      },
      vertexShader: glslify('../shaders/smoke/simulation.vert'),
      fragmentShader: glslify('../shaders/smoke/position.frag'),
    });

    this.positionsFBO = new THREE.FBOUtils(width, renderer, this.positionShader);
    this.positionsFBO.renderToTexture(this.rtTexturePos, this.rtTexturePos2);
    this.positionsFBO.in = this.rtTexturePos;
    this.positionsFBO.out = this.rtTexturePos2;


    this.uniforms = {
      map: {
        type: 't',
        value: this.rtTexturePos,
      },
      tSmoke: {
        type: 't',
        value: Ressources.get('txr-smoke'),
      },
      alpha: {
        type: 'f',
        value: 1,
      },
      origin: {
        type: 't',
        value: this.textureDataPos,
      },
      pointSize: {
        type: 'f',
        value: 3.0,
      },
      volume: {
        type: 'f',
        value: 1,
      },
    };
    this.mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../shaders/smoke/index.vert'),
      fragmentShader: glslify('../shaders/smoke/index.frag'),
      // blending: THREE.AdditiveBlending,
      transparent: true,
      alphaTest: 0.5,
      // depthTest: false,
      depthWrite: false,
    });


    this.system = new THREE.Points(this.geom, this.mat);

    Mediator.on('freqDark:update', ({ total }) => {
      this.uniforms.volume.value = total / 120;
    });
    this.add(this.system);

    this.timer = 0;

  }
  update() {
    this.tick += 0.1;

    const tmp = this.positionsFBO.in;
    this.positionsFBO.in = this.positionsFBO.out;
    this.positionsFBO.out = tmp;

    this.positionShader.uniforms.tick.value = this.tick;
    this.positionShader.uniforms.tPositions.value = this.positionsFBO.in;

    this.positionsFBO.simulate(this.positionsFBO.out);
    this.uniforms.map.value = this.positionsFBO.out;

  }
}
