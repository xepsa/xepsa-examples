import './style.css';

import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

// Global Setup ---------------------------------------------------------------
//
// Camera   - The 'point of view' from which the 'scene' is drawn.
// Scene    - The `meshes` that define the scene to draw.
// Renderer - A way to 'draw' the scene. Rendering options. Connection to the
//            DOM.

// Create the Camera.
//
const fov = 75; // Field of View in 'degrees'.
const aspectRatio = innerWidth / innerHeight;
const nearClippingPlane = 0.1; // Hide objects closer.
const farClippingPlane = 1000; // Hide object further.
const camera = new THREE.PerspectiveCamera(fov, aspectRatio, nearClippingPlane, farClippingPlane);

// Create the Scene (root).
//
const scene = new THREE.Scene();

// Create Renderer
//
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight); // Render dimensions.
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Object Setup ---------------------------------------------------------------
//
// Geometry - Vertices for the wireframe. Vertex Shader.
// Material - Shader for the faces. Fragment Shader.
// Mesh     - Combination of 'geometry and material'. This must be added to the
//            'scene'.

// Add a 'Green Cube' to the scene.
//
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Reposition the camera (by moving it toward us from the origin) to see the
// cube.
//
camera.position.z = 5;

// Animation Loop -------------------------------------------------------------
//

function animate() {
    requestAnimationFrame(animate);
    // Rotate the cube.
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;
    renderer.render(scene, camera);
}
animate();
