uniform float alpha;
varying vec3 vColor;

void main() {

	if ( length(vec2(0.5) - gl_PointCoord) > 0.5 ) {
		discard;
	}
  float depth = smoothstep( 800.0, -800.0, gl_FragCoord.z / gl_FragCoord.w );
	gl_FragColor = vec4(vColor, depth * alpha);

}
