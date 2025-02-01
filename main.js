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
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  const controls = new OrbitControls(camera, renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Define the uniform
  const uniforms = {
    uColor: { value: new THREE.Color(0xff0000) } // Red color
  };

  // Shader Material
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms
  });

  // Box
  const geometry = new THREE.BoxGeometry();
  const box = new THREE.Mesh(geometry, material);
  scene.add(box);

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