uniform sampler2D tDiffuse;
uniform vec2 resolution;
varying vec2 vUv;
void main() {
  float pixelSize = 16.0;
  vec2 normalizedPixelSize = pixelSize / resolution;
  
  vec2 uvPixel = normalizedPixelSize * floor(vUv / normalizedPixelSize);
  
  gl_FragColor = texture2D(tDiffuse, uvPixel);
}
