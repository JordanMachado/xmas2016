// simulation
varying vec2 vUv;

uniform sampler2D origin;
uniform sampler2D tPositions;
uniform sampler2D tInfos;
uniform float tick;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}


void main() {
      vec4 opos = texture2D(origin, vUv);
      vec4 pos = texture2D(tPositions, vUv);
      vec4 infos = texture2D(tInfos, vUv);
      float speedX = infos.x;
      float speedY = infos.y;
      pos.y -= speedY;
      pos.x += cos(tick) * speedX;
      if (pos.y < 0.0) {
        pos.y = opos.y;
      }
      gl_FragColor = vec4(pos.xyz,1.0);
}
