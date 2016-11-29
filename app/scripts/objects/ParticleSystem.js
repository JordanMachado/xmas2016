const THREE = require('three');

import hexRgb from 'hex-rgb';
const glslify = require('glslify');
window.THREE = THREE;


export default class ParticleSystem extends THREE.Object3D {
  constructor({ renderer, scene }) {
    super();

    const width = 256;
    const height = 256;
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
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 70;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      this.dataPos[i] = x;
      this.dataPos[i + 1] = Math.random() * 90;
      this.dataPos[i + 2] = z;

      size[count * 3] = Math.random() * 4;

      this.datatInfos[i] = Math.random() * 0.1;
      this.datatInfos[i + 1] = Math.random() * 0.5;
      this.datatInfos[i + 2] = Math.random();

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
      vertexShader: glslify('../shaders/snow/simulation.vert'),
      fragmentShader: glslify('../shaders/snow/position.frag'),
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
      origin: {
        type: 't',
        value: this.textureDataPos,
      },
      pointSize: {
        type: 'f',
        value: 3.0,
      },
    };
    this.mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../shaders/snow/index.vert'),
      fragmentShader: glslify('../shaders/snow/index.frag'),
      blending: THREE.AdditiveBlending,
      transparent: true,
    });


    this.system = new THREE.Points(this.geom, this.mat);


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
