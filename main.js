import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Function to load shader files
async function loadShader(url) {
  const response = await fetch(url);
  return await response.text();
}

// Initialize the scene after shaders are loaded
async function init() {
  // Load shaders
  const vertexShader = await loadShader('shaders/vertexShader.glsl');
  const fragmentShader = await loadShader('shaders/fragmentShader.glsl');

  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x009999);
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  const controls = new OrbitControls(camera, renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Load texture
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('textures/texture.jpg');

  const backMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTexture: { type: 't' , value: texture },
    },
    transparent: true,
    side: THREE.BackSide,
  });

  // Shader Material for front faces
  const frontMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTexture: { type: 't' , value: texture },
    },
    transparent: true,
    side: THREE.FrontSide,
  });

  const geometry = new THREE.BoxGeometry();

  // Box for back faces
  const backBox = new THREE.Mesh(geometry, backMaterial);
  scene.add(backBox);

  // Box for front faces
  const frontBox = new THREE.Mesh(geometry, frontMaterial);
  scene.add(frontBox);

  // Camera Position
  camera.position.z = 3;
  controls.update();

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Resize Handling
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}

// Start the initialization
init();