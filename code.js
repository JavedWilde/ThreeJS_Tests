import * as thjs from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


let mixer
const clock = new thjs.Clock();
const scene = new thjs.Scene()
scene.background = new thjs.Color( 0xa0a0a0 );
scene.fog = new thjs.Fog( 0xa0a0a0, 10, 50 );
const cam = new thjs.PerspectiveCamera(75,innerWidth/innerHeight,0.1,1000)
const renderer = new thjs.WebGLRenderer()
renderer.shadowMap.enabled = true;
renderer.setSize(innerWidth,innerHeight)
document.body.appendChild(renderer.domElement)
const hemiLight = new thjs.HemisphereLight( 0xffffff, 0x444444 );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );
const dirLight = new thjs.DirectionalLight( 0xffffff );
dirLight.position.set( - 3, 10, 10 );
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = - 2;
dirLight.shadow.camera.left = - 2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add( dirLight );
const ambLight = new thjs.AmbientLight(0xffffff)
scene.add(ambLight)

const mesh = new thjs.Mesh( new thjs.PlaneGeometry( 100, 100 ), new thjs.MeshPhongMaterial( { color: 0xff0000, depthWrite: false } ) );
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add( mesh );

cam.position.z = 10

const loader = new GLTFLoader()
const controls = new OrbitControls( cam, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = true;
controls.enableDamping = true;
loader.load('./3dResources/Anim2.gltf', function(gltf){
    const model = gltf.scene
    scene.add(gltf.scene)
    model.traverse(function ( object ) {
        if ( object.isMesh ) object.castShadow = true})
    mixer = new thjs.AnimationMixer( model );
	mixer.clipAction( gltf.animations[ 0 ] ).play();
    console.log(gltf.scene)
})

function animate() {

    requestAnimationFrame( animate );

    const delta = clock.getDelta();
    mixer.update( delta )
    renderer.render( scene, cam );

}
animate();