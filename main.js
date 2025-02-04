import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

// Inspired by https://dissolve-particles.vercel.app/
// From: https://x.com/0xjatinchopra/status/1884290238840988005

// Function to load shader files
async function loadShader(url) {
  const response = await fetch(url);
  return await response.text();
}

// Load shaders
const vertexShader = await loadShader('shaders/vertexShader.glsl');
const fragmentShader = await loadShader('shaders/fragmentShader.glsl');

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x009999);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Load texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('textures/texture.jpg');

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTexture: { type: 't', value: texture },
    uProgress: { type: 'f', value: 0.0 },
    uColor1: { value: new THREE.Color(0x000000) },
    uColor2: { value: new THREE.Color(0xffffff) }
  },
  transparent: true,
  depthTest: false,
  forceSinglePass: false,
  side: THREE.DoubleSide
});

const geometry = new THREE.BoxGeometry(2, 2, 2);

const box = new THREE.Mesh(geometry, material);
scene.add(box);

camera.position.z = 3;

function animate() {
  controls.update();
  renderer.render(scene, camera);
}

const gui = new GUI();

gui.add({ progress: 0 }, 'progress', 0, 1, 0.01).onChange((value) => {
  material.uniforms.uProgress.value = value;
});

gui
  .addColor({ color: '#009999' }, 'color')
  .onChange((value) => {
    scene.background = new THREE.Color(value);
  })
  .name('Background Color');

gui
  .addColor({ color: '#009999' }, 'color')
  .onChange((value) => {
    material.uniforms.uColor1.value = new THREE.Color(value);
  })
  .name('Color 1');

gui
  .addColor({ color: '#009999' }, 'color')
  .onChange((value) => {
    material.uniforms.uColor2.value = new THREE.Color(value);
  })
  .name('Color 2');

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
