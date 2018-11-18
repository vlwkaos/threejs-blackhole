/* globals THREE */

// Start with scene, camera, and renderer
let scene
let camera
let renderer

window.onload =()=>{
  
  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.x = 15;
  camera.position.y = 16;
  camera.position.z = 13;
  camera.lookAt(scene.position);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;
  
  document.body.appendChild( renderer.domElement );
  render();

}

var geometry
var material
var cube 
const sceneInit=()=>{
  
  geometry = new THREE.BoxGeometry( 1, 1, 1 );
  material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
  
}

const render=()=>{
  
  requestAnimationFrame( animate );
  
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
	renderer.render( scene, camera );
  
}
