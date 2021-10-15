import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.133.1-dCIBIz3pnzocx0lNrLHe/mode=imports/optimized/three.js';

import { GLTFLoader } from '../three.js-master/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '../three.js-master/examples/jsm/controls/OrbitControls.js';

let camera, controls, scene, renderer;

init();
animate();

function init() {
        
    camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 1, 3500 );
    camera.position.set( 3, 0.15, 3 );
    
    //

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x2BC4A9 );
    scene.fog = new THREE.Fog( 0x72645b, 17, 1 );
    
    // Ground

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry( 40, 40 ),
        new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 10 } )
    );

    plane.rotation.x = - Math.PI / 2;
    plane.position.y = - 0.5;
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
    addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
    addShadowedLight( 0.5, 1, - 1, 0xffaa00, 1 );
    
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
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 200;
    controls.maxDistance = 100;

    controls.maxPolarAngle = Math.PI / 2;
    
    //

    window.addEventListener( 'resize', onWindowResize );

}

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