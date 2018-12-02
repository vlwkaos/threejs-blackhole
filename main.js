/* globals THREE dat Stats*/
let s_console = {debugMode: true}
s_console.log = (text)=>{ if (s_console.debugMode)  console.log(text);}

// Scene drawing
let material, mesh, uniforms;
let loader, textureLoader; 
const init = ()=>{
  textureLoader = new THREE.TextureLoader();
  loader = new THREE.FileLoader();

  let bgTex = textureLoader.load('https://raw.githubusercontent.com/oseiskar/black-hole/master/img/milkyway.jpg');

  // screen frame
  uniforms = {
		time: { type: "f", value: 1.0 },
		resolution: { type: "v2", value: new THREE.Vector2() },
    cam_pos: {type:"v3", value: new THREE.Vector3()},
    cam_dir: {type:"v3", value: new THREE.Vector3()},
    cam_up: {type:"v3", value: new THREE.Vector3()},
    fov: {type:"f", value: 1.0},
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
let observer, camControl;
window.onload = ()=>{
  
  //
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth/2, window.innerHeight/2); // res

  camera = new THREE.Camera(); 
  camera.position.z = 1;
  

  
  document.body.appendChild( renderer.domElement );
  
  init();
  
  observer = new THREE.Camera();
  observer.position.set(0,0,7);
  observer.up.set(0,1,0);
  observer.lookAt(0,0,0);
  observer.fov = 90.0;
  observer.direction = new THREE.Vector3(0,0,-1);
  camControl = new THREE.CameraDragControls(observer, renderer.domElement);
  
  scene.add(observer);
  delta = 0;
  
  addStatsGUI();
  update();
  
}

let delta, lastframe;
const update = ()=>{
  lastframe = Date.now();
  stats.update();
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  camControl.update(delta);
  
  updateUniforms();
  render();
  requestAnimationFrame(update)
  delta = Date.now()-lastframe;
}

const updateUniforms = ()=>{
  uniforms.resolution.value.x = window.innerWidth;
	uniforms.resolution.value.y = window.innerHeight;
  uniforms.cam_pos.value = observer.position;
  observer.getWorldDirection(uniforms.cam_dir.value);
  uniforms.cam_up.value = observer.up;
  uniforms.fov.value = observer.fov;

}

const render = ()=>{
  
  renderer.render( scene, camera );
}