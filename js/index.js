// import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.133.1-dCIBIz3pnzocx0lNrLHe/mode=imports/optimized/three.js';
import * as THREE from "../three.js-master/build/three.module.js";

import { GLTFLoader } from "../three.js-master/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "../three.js-master/examples/jsm/controls/OrbitControls.js";

let camera, controls, scene, renderer;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera( 5,
    window.innerWidth / window.innerHeight,
    3, 3500
  );
  camera.position.set(10, 5, 10);
  

  //

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfeff9f);

  // Ground

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshPhongMaterial({
      color: 0xFF6874,
      specular: 0x2bc4a9,
      shininess: 50,
    })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.07;
  plane.receiveShadow = true;
  scene.add(plane);

  // 3D Model

  const loader = new GLTFLoader().setPath("./3dmodels/");

  loader.load("model-4.glb", function (gltf) {
    gltf.scene.traverse(function (child) {
        // console.log(child);
        child.castShadow = true;
        child.doubleSided = true;
    });
    gltf.scene.scale.x = 0.05;
    gltf.scene.scale.y = 0.05;
    gltf.scene.scale.z = 0.05;

    console.log(gltf.scene);
    scene.add(gltf.scene);
  });

  //Axes helper
  const axesHelper = new THREE.AxesHelper();
  scene.add(axesHelper);

  // LIGHTS

  const light = new THREE.HemisphereLight(0xffffff, 0x111122);
  scene.add(light);
  addShadowedLight(0.05, 0.1, 1, 0x9F9FFF, 2.5);
  addShadowedLight(0.2, 0.9, 3, 0xffffff, 1.5);

  // RENDERER

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.shadowMap.enabled = true;


  document.getElementById("render").appendChild(renderer.domElement);


  // CONTROLS

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.01;
  controls.screenSpacePanning = true;
  controls.maxPolarAngle = Math.PI / 2.1;
    // controls.autoRotate = true;
  controls.enabled = false;

  window.addEventListener("resize", onWindowResize);

}

// Anula interferencia con scroll html
const boton = document.getElementById("btn-mover");
boton.addEventListener("click", activarControl, true);

// Mobil
boton.addEventListener("touchstart", activarControl, false);


function activarControl(e) {
  if (boton.checked == true) {
    controls.enabled = true;
    renderer.domElement.classList.remove("deshabilitar");
    console.log(e);
  } else {
    controls.enabled = false;
    renderer.domElement.classList.add("deshabilitar");
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
