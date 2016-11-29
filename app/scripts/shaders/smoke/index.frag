varying vec3 vColor;

uniform sampler2D tSmoke;
void main() {

	// if ( length(vec2(0.5) - gl_PointCoord) > 0.5 ) {
	// 	discard;
	// }
	vec4 smokeColor = texture2D(tSmoke, gl_PointCoord);
  float depth = smoothstep( 800.0, -800.0, gl_FragCoord.z / gl_FragCoord.w );
	gl_FragColor = vec4(smokeColor.xyz, depth);
	// gl_FragColor = vec4(vColor, depth);

}
