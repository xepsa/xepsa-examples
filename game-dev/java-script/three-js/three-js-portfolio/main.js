import './style.css';

// ES6 module import.
// import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dg from 'dat.gui';
import gsap from 'gsap';

// Global Setup ===============================================================
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

// Controls -------------------------------------------------------------------
//
const controls = new OrbitControls(camera, renderer.domElement);

// Raycaster ------------------------------------------------------------------
//
const mousePos = {
    x: undefined,
    y: undefined,
};

const raycaster = new THREE.Raycaster();

// Object Setup ===============================================================
//
// Geometry - Vertices for the wireframe. Vertex Shader.
// Material - Shader for the faces. Fragment Shader.
// Mesh     - Combination of 'geometry and material'. This must be added to the
//            'scene'.

// Add a 'plane' to the scene.
//
const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
    // Has no affect when using 'vertexColors'.
    // color: 0xffff00,
    side: THREE.DoubleSide,
    flatShading: true,
    vertexColors: true,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

const ditherMesh = (mesh) => {
    const points = mesh.geometry.attributes.position.array;
    for (let i = 0; i < points.length; i += 3) {
        // Update z coordinate randomly [-.05, 0.5].
        (points[i + 2] += Math.random() - 0), 5;
    }
};
ditherMesh(planeMesh);

const defaultColor = { r: 0.0, g: 0.19, b: 0.4 };
const highlightColor = { r: 0.1, g: 0.5, b: 1.0 };
const colorMesh = (mesh) => {
    // Create an array of 'blue' color points.
    const color = [defaultColor.r, defaultColor.g, defaultColor.b];
    const colorAttributes = [];
    const pointCount = mesh.geometry.attributes.position.count;
    for (let i = 0; i < pointCount; i++) {
        colorAttributes.push(...color);
    }
    // Set a new 'color' attribute: 3 float values (blue). So, the 'group size' is 3.
    planeMesh.geometry.setAttribute(
        'color',
        // mesh.geometry.attributes.position
        new THREE.BufferAttribute(new Float32Array(colorAttributes), color.length)
    );
};
colorMesh(planeMesh);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 5);
scene.add(light);

// Reposition the camera (by moving it toward us from the origin) to see the
// cube.
//
camera.position.z = 5;

// Animation Loop -------------------------------------------------------------
//

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    raycaster.setFromCamera(mousePos, camera);
    const intersects = raycaster.intersectObject(planeMesh);
    if (intersects.length > 0) {
        const color = intersects[0].object.geometry.attributes.color;
        const faces = [intersects[0].face.a, intersects[0].face.b, intersects[0].face.c];
        const initialColor = { r: defaultColor.r, g: defaultColor.g, b: defaultColor.b };
        const hoverColor = { r: highlightColor.r, g: highlightColor.g, b: highlightColor.b };

        gsap.to(hoverColor, {
            r: initialColor.r,
            g: initialColor.g,
            b: initialColor.b,
            duration: 1,
            onUpdate: () => {
                faces.forEach((face) => {
                    color.setX(face, hoverColor.r);
                    color.setZ(face, hoverColor.b);
                    color.setY(face, hoverColor.g);
                });
                color.needsUpdate = true;
            },
        });
    }
}
animate();

// dat.gui Setup --------------------------------------------------------------
//

const regeneratePlaneGeometry = () => {
    if (planeMesh) {
        planeMesh.geometry.dispose();
        planeMesh.geometry = new THREE.PlaneGeometry(
            dat.plane.width,
            dat.plane.height,
            dat.plane.widthSegment,
            dat.plane.heightSegment
        );
        ditherMesh(planeMesh);
        colorMesh(planeMesh);
    }
};

const gui = new dg.GUI();
const dat = {
    plane: {
        width: 5,
        height: 5,
        widthSegment: 10,
        heightSegment: 10,
    },
};
gui.add(dat.plane, 'width', 1, 30).onChange(regeneratePlaneGeometry);
gui.add(dat.plane, 'height', 1, 10).onChange(regeneratePlaneGeometry);
gui.add(dat.plane, 'widthSegment', 1, 50).onChange(regeneratePlaneGeometry);
gui.add(dat.plane, 'heightSegment', 1, 50).onChange(regeneratePlaneGeometry);

// Event Listeners ------------------------------------------------------------
//

addEventListener('mousemove', (e) => {
    // Normalise coordinates from 'Canvas space' to 'Three.js space'.
    mousePos.x = (e.clientX / innerWidth) * 2 - 1;
    mousePos.y = -(e.clientY / innerHeight) * 2 + 1;
});
