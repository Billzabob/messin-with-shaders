uniform vec3 uColor;
varying vec3 vNormal;
void main() {
  gl_FragColor = vec4(vNormal * 0.2 + 0.5, 1.0) * vec4(uColor, 1.0);
}