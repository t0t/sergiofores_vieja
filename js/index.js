// import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.133.1-dCIBIz3pnzocx0lNrLHe/mode=imports/optimized/three.js';
import * as THREE from '../three.js-master/build/three.module.js';

import { GLTFLoader } from '../three.js-master/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '../three.js-master/examples/jsm/controls/OrbitControls.js';

let camera, controls, scene, renderer;

init();
animate();

function init() {
        
    camera = new THREE.PerspectiveCamera( 
        50, window.innerWidth / window.innerHeight, 1, 3500 
        );
    camera.position.set( 5, 15, 10 );

    
    //

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xFEFF9F );
    scene.fog = new THREE.Fog( 0x000000, 17, 1 );
    
    // Ground

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry( 80, 80 ),
        new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } )
    );

    plane.rotation.x = - Math.PI / 2;
    plane.position.y = - 1.5;
    scene.add( plane );

    plane.receiveShadow = true;
    
    // LOADER
    
    const loader = new GLTFLoader().setPath( './3dmodels/' );
    loader.load( 'model-4.glb', function ( gltf ) {

        gltf.scene.traverse( function ( child ) {
            
            if ( child.isMesh ) {
                const material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
                const mesh = new THREE.Mesh( geometry, material );

                mesh.position.set( 0, - 0.25, 0.6 );
                mesh.rotation.set( 0, - Math.PI / 2, 0 );
                mesh.scale.set( 0.5, 0.5, 0.5 );
                mesh.castShadow = true;
                mesh.receiveShadow = true;
            }
        } );

        scene.add( gltf.scene );

    });



    // LIGHTS

    const light = new THREE.HemisphereLight(0x443333, 0x111122);
    scene.add( light );
    addShadowedLight( 1, 1, 1, 0xffffff, 2.35 );
    addShadowedLight( 0.5, 1, - 1, 0x9F9FFF, 1 );
    
    // RENDERER

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    // renderer.setSize( 350, 200 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;

    document.getElementById("render").appendChild(renderer.domElement);

    // world

    const geometry = new THREE.BufferGeometry();
    const material = new THREE.MeshPhongMaterial( {
        side: THREE.DoubleSide,
        color: 0xffffff, flatShading: true
    } );

    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = Math.random() * 1600 - 800;
    mesh.position.y = 0;
    mesh.position.z = Math.random() * 1600 - 800;
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    scene.add( mesh );
   
    // CONTROLS

    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.01;
    controls.screenSpacePanning = true;
    controls.maxPolarAngle = Math.PI / 2;
    // controls.enabled = false;
    
    
    // // Event listeners
    // controls.addEventListener("change", render, false);
    //
    
    // // Listeners
    // document.addEventListener("mousewheel", onMouseWheel, false);
    // document.addEventListener("mousedown", mouseDown, true);
    // document.addEventListener("mouseup", onMouseUp, true);
    // document.addEventListener("onMouseWheel", onMouseWheel, false);
    // document.addEventListener("mousemove", onMouseMove, false);
    
    window.addEventListener( 'resize', onWindowResize );
    
}

const boton = document.getElementById("btn-mover");
boton.addEventListener("mousedown", btnMover, true);
boton.addEventListener("mouseup", activeScroll, false);

function btnMover() {
    controls.enabled = true;
}
function activeScroll() {
    controls.enabled = false;
}

// function mouseDown() {
//     controls.enabled = true;
//     console.log("cliccc");
// }

// function onMouseMove() {
//     controls.enabled = false;
//     console.log("cliccc");
// }
// function onMouseUp() {
//     controls.enabled = true;
//     console.log("cliccc");
// }



function addShadowedLight( x, y, z, color, intensity ) {

    const directionalLight = new THREE.DirectionalLight( color, intensity );
    directionalLight.position.set( x, y, z );
    scene.add( directionalLight );

    directionalLight.castShadow = true;

    const d = 1;
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;

    directionalLight.shadow.bias = - 0.002;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    

    render();

}

function render() {

    renderer.render( scene, camera );

}