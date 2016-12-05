'use strict';

const THREE = require('three');
const glslify = require('glslify');
const Pass = require('@superguigui/wagner/src/Pass');
const vertex = glslify('@superguigui/wagner/src/shaders/vertex/basic.glsl');
const fragment = glslify('./glitch-fs.glsl');
/* Inspired by makio */
class GlitchPass extends Pass {
  constructor(options = {}) {
    super(options);
    this.setShader(vertex, fragment);
    this.createTexture();
    this.intensity = options.intensity || 0;
    // this.debug();
    this.time = Date.now();
    this.lastTime = 0;

  }
  createTexture() {
    this.canvas = document.createElement('canvas');
    this.size = 256;
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.ctx = this.canvas.getContext('2d');

    this.texture = new THREE.Texture(
      this.canvas,
      THREE.UVMapping,
      THREE.RepeatWrapping,
      THREE.RepeatWrapping,
      THREE.NearestFilter,
      THREE.NearestFilter,
      THREE.LuminanceFormat
    );
    this.texture.needsUpdate = true;
    this.texture.generateMipmaps = false;
    this.shader.uniforms.glitchMap.value = this.texture;
    this.shader.uniforms.intensity.value = this.intensity;
  }
  run(composer) {
    super.run(composer);
    if (!this.enabled) return;
    this.time = Date.now();

    if (this.time - this.lastTime > 40) {
      this.lastTime = this.time;
      this.clear();
      this.draw();
      this.texture.needsUpdate = true;
    }

    this.shader.uniforms.intensity.value = this.intensity;


  }
  draw() {
    this.ctx.save();
    this.ctx.fillStyle = '#808080';
    this.ctx.fillRect(this.size * Math.random(),
    this.size * Math.random(),
    Math.random() * 100,
    Math.random() * 10);
    this.ctx.fillRect(this.size * Math.random(),
    this.size * Math.random(),
    Math.random() * 100,
    Math.random() * 10);
    this.ctx.fillRect(this.size * Math.random(),
    this.size * Math.random(),
    Math.random() * 100,
    Math.random() * 10);
    this.ctx.restore();
  }
  clear() {
    this.ctx.save();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }
  debug() {
    document.body.appendChild(this.canvas);
    this.canvas.style.zIndex = 10000;
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = 0;
    this.canvas.style.left = 0;
  }
}
module.exports = GlitchPass;
