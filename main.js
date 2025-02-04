import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  EffectComposer,
  OutputPass,
  RenderPass,
  ShaderPass,
  UnrealBloomPass
} from 'three/examples/jsm/Addons.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

// Inspired by https://dissolve-particles.vercel.app/
// From: https://x.com/0xjatinchopra/status/1884290238840988005

// Function to load shader files
async function loadShader(url) {
  const response = await fetch(url);
  return await response.text();
}

// Load shaders
const cubeVertexShader = await loadShader('shaders/cube/vertexShader.glsl');
const cubeFragmentShader = await loadShader('shaders/cube/fragmentShader.glsl');
const postVertexShader = await loadShader('shaders/post/vertextShader.glsl');
const postFragmentShader = await loadShader('shaders/post/fragmentShader.glsl');

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

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);

const customShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    }
  },
  vertexShader: postVertexShader,
  fragmentShader: postFragmentShader
};

const shaderPass = new ShaderPass(customShader);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
const outputPass = new OutputPass();

composer.addPass(renderPass);
composer.addPass(shaderPass);
composer.addPass(bloomPass);
composer.addPass(outputPass);

// Load texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('textures/texture.jpg');

const material = new THREE.ShaderMaterial({
  vertexShader: cubeVertexShader,
  fragmentShader: cubeFragmentShader,
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
  composer.render(scene, camera);
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
  shaderPass.uniforms['resolution'].value.set(
    window.innerWidth,
    window.innerHeight
  );
  bloomPass.resolution.set(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
