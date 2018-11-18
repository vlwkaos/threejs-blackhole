/* globals THREE dat*/
// Following through - http://www.dominictran.com/pdf/ThreeJS.Essentials.PACKT.pdf

// Start with scene, camera, and renderer
let s_console = {debugMode: true}
s_console.log = (text)=>{ if (s_console.debugMode)  console.log(text);}


// Scene drawing
var cube;
const sceneInit = ()=>{
  
  //cube
  let cubeGeometry = new THREE.CubeGeometry(6, 4, 6); // width, height, depth
  let cubeMaterial = new THREE.MeshLambertMaterial({
   color: "red"
  });
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true; // must tell which object will cast shadow
  cube.material.transparent = true;
  scene.add(cube);
  
  //floor
  var planeGeometry = new THREE.PlaneGeometry(20, 20);
  var planeMaterial = new THREE.MeshLambertMaterial({
   color: 0xcccccc
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true; // shadow will be casted on the floor
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.y = -2;
  scene.add(plane);
  
  //light
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(10, 20, 20);
  spotLight.castShadow = true;
  scene.add(spotLight);
  
  
}

// dat.gui
let control;
const addControlGUI = ()=>{
  
  // define properties
  control = {
    
  rotationSpeed: 0.005,
  opacity:0.6,
  color: cube.material.color.getHex()
  
  }
  
  let gui = new dat.GUI();
  gui.add(control, 'rotationSpeed', -0.01, 0.01);
  gui.add(control, 'opacity', 0.1, 1);
  gui.addColor(control, 'color');

}

let scene;
let camera;
let cameraControl;
let renderer;
// 
window.onload = ()=>{
  
  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); // POV, ratio, start, end
  camera.position.x = 15;
  camera.position.y = 16;
  camera.position.z = 13;
  camera.lookAt(scene.position);
  
  cameraControl = new THREE.OrbitControls(camera);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;
  
  document.body.appendChild( renderer.domElement );
  
  sceneInit();
  addControlGUI();
  render();

}

const render = ()=>{
  
  cube.rotation.y += control.rotationSpeed;
  cube.material.color = new THREE.Color(control.color);
  cube.material.opacity = control.opacity;
  
  cameraControl.update();
  
  renderer.render( scene, camera );
  requestAnimationFrame(render)
  
}