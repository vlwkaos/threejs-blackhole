/* globals THREE dat Stats*/
let s_console = {debugMode: true}
s_console.log = (text)=>{ if (s_console.debugMode)  console.log(text);}

class Observer {
  constructor(fov, ar, n, f){
    this.prototype = new THREE.PerspectiveCamera(fov,ar,n,f); 
    this.position = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.up = new THREE.Vector3();
  }
  
}

// Scene drawing
let material, mesh, uniforms;
let loader, textureLoader; 
const init = ()=>{
  textureLoader = new THREE.TextureLoader();
  loader = new THREE.FileLoader();

  let bgTex = textureLoader.load('https://raw.githubusercontent.com/oseiskar/black-hole/master/img/milkyway.jpg');

  uniforms = {
		time: { type: "f", value: 1.0 },
		resolution: { type: "v2", value: new THREE.Vector2() },
    cam_pos: {type:"v3", value: new THREE.Vector3() },
    cam_dir: {type:"v3", value: new THREE.Vector3()},
    cam_up: {type:"v3", value: new THREE.Vector3()},
    fov: {type:"v3", value: new THREE.Vector3()},
    bg_texture: {type: "t", value: bgTex}
	};
  
  material = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: document.getElementById( 'vertexShader' ).textContent
		});
  loader.load('0_current_tracer.glsl', (data)=>{
    material.fragmentShader = data;
    material.fragmentShader.needsUpdate = true;
    material.needsUpdate = true;
    mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
  	scene.add( mesh );   
  });
  
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

  }
  
  let gui = new dat.GUI();
  gui.add(control, 'rotationSpeed', -0.01, 0.01);
  gui.add(control, 'opacity', 0.1, 1);
 //gui.addColor(control, 'color');

}

let scene, camera, renderer;
let observer;
window.onload = ()=>{
  
  //
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth/2, window.innerHeight/2); // res

  camera = new THREE.Camera(); 
  camera.position.z = 1;
  
  observer = new Observer(90.0, window.innerWidth/window.innerHeight, 1,1000);
  observer.position.set(0,0,7);
  observer.direction.set(0,0,-1);
  observer.up.set(0,1,0);
  
  document.body.appendChild( renderer.domElement );
  
  init();
  addStatsGUI();
  update();

}

const update = ()=>{
  
  stats.update();
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateUniforms();
  render();
  requestAnimationFrame(update)
}

const updateUniforms = ()=>{
  uniforms.resolution.value.x = window.innerWidth;
	uniforms.resolution.value.y = window.innerHeight;
  uniforms.cam_pos.value = observer.position;
  uniforms.cam_pos.needsUpdate = true;
  uniforms.cam_dir.value = observer.direction;
  uniforms.cam_dir.needsUpdate = true;
  uniforms.cam_up.value = observer.up;
  uniforms.cam_up.needsUpdate = true;
  uniforms.fov.value = observer.fov;
  uniforms.fov.needsUpdate = true;
}

const render = ()=>{
  
  renderer.render( scene, camera );
}