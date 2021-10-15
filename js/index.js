// Find the latest version by visiting https://cdn.skypack.dev/three.
// import * as THREE from "https://cdn.skypack.dev/pin/three@v0.133.1-dCIBIz3pnzocx0lNrLHe/mode=imports/optimized/three.js";
// import * as THREE from "../three.js-master/src/Three.js";

import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.133.1-dCIBIz3pnzocx0lNrLHe/mode=imports/optimized/three.js';

// import three from 'https://cdn.skypack.dev/three';


// import * as THREE from '../three.js-master/build/three.module.js';

    
import { OrbitControls } from '../three.js-master/examples/jsm/controls/OrbitControls.js';
// import { OrbitControls } from 'https://unpkg.com/three@0.133.1/examples/jsm/controls/OrbitControls.js';


import { GLTFLoader } from '../three.js-master/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../three.js-master/examples/jsm/loaders/RGBELoader.js';
import { RoughnessMipmapper } from '../three.js-master/examples/jsm/utils/RoughnessMipmapper.js';

let camera, scene, renderer;

init();
render();

function init() {

    const container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 10, 80 );
    camera.position.set( 1, 9, 1 );

    scene = new THREE.Scene();

    new RGBELoader()
        .setPath( './3dmodels/' )
        .load( 'royal_esplanade_1k.hdr', function ( texture ) {

            texture.mapping = THREE.EquirectangularReflectionMapping;

            scene.background = texture;
            scene.environment = texture;

            render();

            // model

            // use of RoughnessMipmapper is optional
            const roughnessMipmapper = new RoughnessMipmapper( renderer );

            const loader = new GLTFLoader().setPath( './3dmodels/' );
            loader.load( 'model-4.glb', function ( gltf ) {

                gltf.scene.traverse( function ( child ) {

                    if ( child.isMesh ) {

                        roughnessMipmapper.generateMipmaps( child.material );

                    }

                } );

                scene.add( gltf.scene );

                roughnessMipmapper.dispose();

                render();

            } );

        } );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( renderer.domElement );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render ); // use if there is no animation loop
    controls.minDistance = 20;
    controls.maxDistance = 20;
    controls.target.set( 2, 0.5, - 0.9 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}

//

function render() {

    renderer.render( scene, camera );

}