varying vec3 vColor;
varying vec4 vBuffer;

uniform sampler2D tSmoke;
uniform float alpha;
void main() {

	// if ( length(vec2(0.5) - gl_PointCoord) > 0.5 ) {
	// 	discard;
	// }
	vec4 smokeColor = texture2D(tSmoke, gl_PointCoord);
  float depth = smoothstep( 800.0, -800.0, gl_FragCoord.z / gl_FragCoord.w );
	gl_FragColor = vec4(smokeColor.xyz,vBuffer.a * smokeColor.w * alpha);
	// gl_FragColor = vec4(vColor, depth);

}
