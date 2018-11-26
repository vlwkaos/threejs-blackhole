/* globals THREE dat Stats*/
let s_console = {debugMode: true}
s_console.log = (text)=>{ if (s_console.debugMode)  console.log(text);}


// Scene drawing

let material, mesh, uniforms;
const sceneInit = ()=>{
  //cube
  uniforms = {
			time: { type: "f", value: 1.0 },
			resolution: { type: "v2", value: new THREE.Vector2() }
	};
  material = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: document.getElementById( 'vertexShader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent
		});
  mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
	scene.add( mesh );
}

// dat.gui
let control;
let stats;
const addStatsGUI = ()=>{
     
  stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild( stats.domElement ); 
  
}

const addControlGUI = ()=>{
  
  // define properties
  control = {
    
  rotationSpeed: 0.005,
  opacity:0.6
  //color: cube.material.color.getHex()
  
  }
  
  let gui = new dat.GUI();
  gui.add(control, 'rotationSpeed', -0.01, 0.01);
  gui.add(control, 'opacity', 0.1, 1);
 //gui.addColor(control, 'color');

}

let scene;
let camera;
let cameraControl;
let renderer;
// 
window.onload = ()=>{
  
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera = new THREE.Camera(); // POV, ratio, start, end
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 1;

  cameraControl = new THREE.OrbitControls(camera,renderer.domElement);
   
  document.body.appendChild( renderer.domElement );
  
  sceneInit();
  uniforms.resolution.value.x = window.innerWidth;
	uniforms.resolution.value.y = window.innerHeight
  
  addStatsGUI();
  //addControlGUI();
  render();

}
var delta=0;
const render = ()=>{
  
  requestAnimationFrame(render)
  //cameraControl.update();
  stats.update();

  renderer.render( scene, camera );
  
}