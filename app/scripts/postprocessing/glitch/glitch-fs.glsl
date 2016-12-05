
varying vec2 vUv;
uniform sampler2D tInput;
uniform sampler2D glitchMap;
uniform vec2 resolution;
uniform float time;
uniform float intensity;

float rand(vec2 co){
return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec2 p = vUv;
  vec4 glitch = texture2D(glitchMap, vUv);
  // p.x += glitch.r;
  // p.x = fract(p.x);
  lowp vec2 uv = vec2( vUv.x + (glitch.r- 1.0) * intensity, vUv.y);
	uv.x = mod(1.+uv.x,1.);

  gl_FragColor = texture2D(tInput, uv);
}
