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
      float life = pos.a;
      life-= 0.01;
      if(life< 0.0) {
        life = 1.0;
          pos.xyz = opos.xyz;
      }
      pos.x += infos.x * 0.2;
      pos.y -= infos.y;
      pos.z += infos.z * 0.2;

      gl_FragColor = vec4(pos.xyz,life);
}
