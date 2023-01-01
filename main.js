/* globals THREE dat Stats Observer*/
import * as THREE from 'three';
import { createCamera, createRenderer, createScene, loadTextures } from './render';
import { createStatsGUI } from './src/statsGUI';
import { createConfigGUI } from './src/datGUI';

let lastframe = Date.now()
let delta = 0
let time = 0

// variables for shader
const uniforms = {
  time: { type: "f", value: 0.0 },
  resolution: { type: "v2", value: new THREE.Vector2() },
  accretion_disk: { type: "b", value: false },
  use_disk_texture: { type: "b", value: true },
  lorentz_transform: { type: "b", value: false },
  doppler_shift: { type: "b", value: false },
  beaming: { type: "b", value: false },
  cam_pos: { type: "v3", value: new THREE.Vector3() },
  cam_vel: { type: "v3", value: new THREE.Vector3() },
  cam_dir: { type: "v3", value: new THREE.Vector3() },
  cam_up: { type: "v3", value: new THREE.Vector3() },
  fov: { type: "f", value: 0.0 },
  bg_texture: { type: "t", value: null },
  star_texture: { type: "t", value: null },
  disk_texture: { type: "t", value: null }
}

let scene, renderer
let composer, effectBloom
let observer, camControl
let stats;
let camconf, effectconf, perfconf, bloomconf;
window.onload = ()=>{
  //
  lastframe = Date.now()

  renderer = createRenderer()
  document.body.appendChild( renderer.domElement )

  const a = createScene(renderer);
  composer = a.composer;
  effectBloom = a.bloomPass;
  scene = a.scene;
  
  textures = loadTextures();
  init()


  const b = createCamera(renderer);
  observer = b.observer;
  camControl = b.cameraControl;
  // camControl sets up vector
  scene.add(observer)
  delta = 0
  time = 0
  
  const c = createConfigGUI(changePerformanceQuality, saveToScreenshot);
  camconf = c.cameraConfig;
  effectconf = c.effectConfig;
  perfconf = c.performanceConfig;
  bloomconf = c.bloomConfig;

  stats = createStatsGUI();
  document.body.appendChild(stats.dom);
  update()
  
}

// Scene drawing
let material, mesh
let loader;
let textures;

const init = () => {
  loader = new THREE.FileLoader()



  material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
			vertexShader: document.getElementById( 'vertexShader' ).textContent
		})
  loader.load('0_current_tracer.glsl', (data)=>{
           let defines = 
          `#define STEP 0.05
#define NSTEPS 600
`
    
    material.fragmentShader = defines + data
    material.needsUpdate = true
    mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material )
  	scene.add( mesh )   
  })
  
}

// UPDATING
const update = ()=>{
  delta = (Date.now()-lastframe)/1000  
  time += delta
  stats.update()
  
  renderer.setPixelRatio( window.devicePixelRatio*perfconf.resolution)
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth*perfconf.resolution, window.innerHeight*perfconf.resolution)
  // update what is drawn
  observer.update(delta)
  camControl.update(delta)
  updateUniforms()
    
  render()
  requestAnimationFrame(update)

  lastframe = Date.now()
}

const updateUniforms = ()=>{
  uniforms.time.value = time
  uniforms.resolution.value.x = window.innerWidth*perfconf.resolution
	uniforms.resolution.value.y = window.innerHeight*perfconf.resolution

  uniforms.cam_pos.value = observer.position
  uniforms.cam_dir.value = observer.direction
  uniforms.cam_up.value = observer.up
  uniforms.fov.value = observer.fov

  uniforms.cam_vel.value = observer.velocity

  uniforms.bg_texture.value = textures.get('bg1');
  uniforms.star_texture.value = textures.get('star');
  uniforms.disk_texture.value = textures.get('disk');
  
  
  // controls
  effectBloom.strength = bloomconf.strength
  effectBloom.radius = bloomconf.radius
  effectBloom.threshold = bloomconf.threshold

  
  observer.distance = camconf.distance
  observer.moving = camconf.orbit
  observer.fov = camconf.fov  
  uniforms.lorentz_transform.value = effectconf.lorentz_transform
  uniforms.accretion_disk.value = effectconf.accretion_disk
  uniforms.use_disk_texture.value = effectconf.use_disk_texture
  uniforms.doppler_shift.value = effectconf.doppler_shift
  uniforms.beaming.value = effectconf.beaming
  
  
}

//little hacks for screenshot
let getImageData, imgData
const render = ()=>{
  if(getImageData == true){
    imgData = renderer.domElement.toDataURL();
    getImageData = false;
  }
  //renderer.render( scene, camera )
  composer.render()
}

function saveToScreenshot() {
  renderer.domElement.toBlob((blob) => {
    if (!blob) return;
    let URLObj = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = URLObj.createObjectURL(blob)
    a.download = 'image.png'
    document.body.appendChild(a)
    a.click();
    document.body.removeChild(a)
  });
}

function changePerformanceQuality(quality) {
  const getShaderDefineConstant = () => {
    switch (quality) {
      case 'low':
        return {
          STEP: 0.1,
          NSTEPS: 300,
        };
      case 'medium':
        return {
          STEP: 0.05,
          NSTEPS: 600,
        };
      case 'high':
        return {
          STEP: 0.02,
          NSTEPS: 1000
        };
      default:
        return {
          STEP: 0.05,
          NSTEPS: 600,
        }
    }
  }

  const { STEP, NSTEPS } = getShaderDefineConstant();
  let defines = `
  #define STEP ${STEP} 
  #define NSTEPS ${NSTEPS} 
`
  loader.load('0_current_tracer.glsl', (data) => {
    material.fragmentShader = defines + data
    material.fragmentShader.needsUpdate = true
    material.needsUpdate = true
  })
}