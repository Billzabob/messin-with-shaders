uniform sampler2D uTexture;
uniform float uProgress;
varying vec2 vUv;
varying vec3 vNormal;

// Random function
vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1, 311.7)),
              dot(st, vec2(269.5, 183.3)));
    return fract(sin(st) * 43758.5453123);
}

// Simplex noise function
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = dot(random2(i), f);
    float b = dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
    float c = dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
    float d = dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));

    // Smooth interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);

    // Mix the results
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
  float lightIntensity = max(dot(vNormal, lightDirection), 0.0);
  float ambientIntensity = 0.0;
  vec4 textureColor = texture2D(uTexture, vUv);
  
  // float brightness = ambientIntensity + lightIntensity + noiseValue;

  float noiseValue = (noise(vUv * 2.0) + uProgress * 0.6 - 0.3) * 30.0;
  float newNoiseValue = 1.0 - min(1.0, max(0.0, noiseValue));
  
  if (newNoiseValue > 0.0 && newNoiseValue < 0.8) {
    gl_FragColor = vec4(1.0, 0.0, 0.0, textureColor.a);
  } else if (newNoiseValue == 0.0) {
    gl_FragColor = vec4(textureColor.rgb, 0.0);
  } else  {
    gl_FragColor = vec4(textureColor.rgb, 1.0);
  }
}