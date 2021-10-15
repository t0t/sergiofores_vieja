// import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.133.1-dCIBIz3pnzocx0lNrLHe/mode=imports/optimized/three.js';
import * as THREE from "../three.js-master/build/three.module.js";

import { GLTFLoader } from "../three.js-master/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "../three.js-master/examples/jsm/controls/OrbitControls.js";

let camera, controls, scene, renderer;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    3500
  );
  camera.position.set(5, 15, 10);

  //

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfeff9f);
  scene.fog = new THREE.Fog(0x000000, 17, 1);

  // Ground

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshPhongMaterial({
      color: 0x2bc4a9,
      specular: 0x111111,
      shininess: 100,
    })
  );

  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -1.5;
  scene.add(plane);

  plane.receiveShadow = true;

  // LOADER

  const loader = new GLTFLoader().setPath("./3dmodels/");

  loader.load("model-4.glb", function (gltf) {
    gltf.scene.traverse(function (child) {
        console.log(child);
      
        const material = new THREE.MeshPhongMaterial({
          color: 0xff5533,
          specular: 0x333333,
          shininess: 100
        });
      
    });

    scene.add(gltf.scene);
  });

  //Axes helper
  const axesHelper = new THREE.AxesHelper();
  scene.add(axesHelper);

  // LIGHTS

  const light = new THREE.HemisphereLight(0x443333, 0x111122);
  scene.add(light);
  addShadowedLight(0.5, 0.5, 1, 0xffffff, 2);
  addShadowedLight(0.6, 1, 3, 0x9f9fff, 2);

  // RENDERER

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.shadowMap.enabled = true;


  document.getElementById("render").appendChild(renderer.domElement);

  // CONTROLS

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.01;
  controls.screenSpacePanning = true;
  controls.maxPolarAngle = Math.PI / 2;
    // controls.autoRotate = true;
  // controls.enabled = false;

  window.addEventListener("resize", onWindowResize);

}

// Anula interferencia con scroll html
const boton = document.getElementById("btn-mover");
boton.addEventListener("click", activarControl, true);

function activarControl() {
  if (boton.checked == true) {
    controls.enabled = true;
  } else {
    controls.enabled = false;
  }
}


// Añadir fuente de luz

function addShadowedLight(x, y, z, color, intensity) {
    const directionalLight = new THREE.DirectionalLight(color, intensity);
    directionalLight.position.set(x, y, z);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  requestAnimationFrame(animate);

  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  render();
}

function render() {
  renderer.render(scene, camera);
}
