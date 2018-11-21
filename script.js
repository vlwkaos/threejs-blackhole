/* globals THREE dat Stats*/
// Following through - http://www.dominictran.com/pdf/ThreeJS.Essentials.PACKT.pdf
// Custrom Shader - http://www.ianww.com/blog/2012/12/16/an-introduction-to-custom-shaders-with-three-dot-js/


// Start with scene, camera, and renderer
let s_console = {debugMode: true}
s_console.log = (text)=>{ if (s_console.debugMode)  console.log(text);}


// Scene drawing
// My float attribute

let geometry;
let mesh;
let vertexDisplacement;
const sceneInit = ()=>{
  
  //cube
  geometry = new THREE.SphereBufferGeometry(10, 30, 30); // width, height, depth
  vertexDisplacement = new Float32Array(geometry.attributes.position.count);
  for (var i = 0; i < vertexDisplacement.length; i ++) {
    vertexDisplacement[i] = Math.sin(i);
  }
  geometry.addAttribute('vertexDisplacement', new THREE.BufferAttribute(vertexDisplacement, 1));
  
  let material = new THREE.ShaderMaterial({  
  uniforms: {

		resolution: { value: new THREE.Vector2() },
    delta: {value: 0}

	},
  vertexShader: document.getElementById('vertexShader').textContent,
  fragmentShader: document.getElementById('fragmentShader').textContent
});
  mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true; // must tell which object will cast shadow
  mesh.material.transparent = true;
  scene.add(mesh);

  //light
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(10, 20, 20);
  spotLight.castShadow = true;
  scene.add(spotLight);
  
  
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
  renderer.shadowMapEnabled = true;
  
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); // POV, ratio, start, end
  camera.position.x = 15;
  camera.position.y = 16;
  camera.position.z = 13;
  camera.lookAt(scene.position);
  
  cameraControl = new THREE.OrbitControls(camera,renderer.domElement);
   
  document.body.appendChild( renderer.domElement );
  
  sceneInit();
  addStatsGUI();
  addControlGUI();
  render();

}
var delta=0;
const render = ()=>{
  
  requestAnimationFrame(render)
  cameraControl.update();
  stats.update();
  delta += 0.1;
  mesh.material.uniforms.delta.value = 0.5 + Math.sin(delta) * 0.5;

  for (var i = 0; i < vertexDisplacement.length; i ++) {
      vertexDisplacement[i] = 0.5 + Math.sin(i + delta) * 0.25;
  }

  mesh.geometry.attributes.vertexDisplacement.needsUpdate = true;
  mesh.rotation.y += control.rotationSpeed;
  //cube.material.color = new THREE.Color(control.color);
  //cube.material.opacity = control.opacity
  renderer.render( scene, camera );
  
}