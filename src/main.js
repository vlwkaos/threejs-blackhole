import * as THREE from 'three';
import { Vector2 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
import { createStatsGUI } from './statsGUI';
import { CameraDragControls } from './CameraDragControls';
import { Observer } from './Observer';
import { createConfigGUI } from './datGUI';

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

// create scene, 3d context, etc.. instances
const renderer = createRenderer();
const { observer, cameraControl, scene, composer, bloomPass } = createScene(renderer);
document.body.appendChild(renderer.domElement)

// init graphics
const textures = loadTextures();
const { fragmentShader, material } = loadShader(scene, uniforms);

// GUI
const stats = createStatsGUI();
document.body.appendChild(stats.dom)
const { performanceConfig, cameraConfig, bloomConfig, effectConfig } = createConfigGUI(changePerformanceQuality, saveToScreenshot);

// start render loop
update();

/** --------------------------------------
 * 
 */

function createRenderer() {
  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0x000000, 1.0)
  renderer.setSize(window.innerWidth, window.innerHeight) // res
  renderer.autoClear = false
  return renderer;
}

function createScene(renderer) {
  // scene and camera
  const scene = new THREE.Scene()
  // this camera is THREE.js camera fixated at position z=1
  // since drawing happens only with shader on a 2D plane, actual camera control is done by Observer
  const camera = new THREE.Camera()
  camera.position.z = 1

  // Actual camera - observer object
  const observer = new Observer(60.0, window.innerWidth / window.innerHeight, 1, 80000)
  observer.distance = 8
  // camera control
  const cameraControl = new CameraDragControls(observer, renderer.domElement) // take care of camera view
  scene.add(observer)


  // render pass composing
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera)
  // strength, kernelSize, sigma, res
  // resolution, strength, radius, threshold
  // const bloomPass = new UnrealBloomPass(new Vector2(128, 128), 0.8, 2.0, 0.0)
  const shaderPass = new ShaderPass(CopyShader);
  shaderPass.renderToScreen = true;
  composer.addPass(renderPass);
  // composer.addPass(bloomPass);
  composer.addPass(shaderPass);

  return {
    observer, cameraControl, scene, composer
  }
}

function loadTextures() {
  const textures = new Map();
  const textureLoader = new THREE.TextureLoader()
  const loadTexture = (name, image, interpolation, wrap = THREE.ClampToEdgeWrapping) => {
    textures.set(name, null);
    textureLoader.load(image, (texture) => {
      texture.magFilter = interpolation
      texture.minFilter = interpolation
      texture.wrapT = wrap
      texture.wrapS = wrap
      textures.set(name, texture);
    })
  }

  loadTexture('bg1', 'https://cdn.glitch.com/631097e7-5a58-45aa-a51f-cc6b44f8b30b%2Fmilkyway.jpg?1545745139132', THREE.NearestFilter)
  loadTexture('star', 'https://cdn.glitch.com/631097e7-5a58-45aa-a51f-cc6b44f8b30b%2Fstars.png?1545722529872', THREE.LinearFilter)
  loadTexture('disk', 'https://cdn.glitch.com/631097e7-5a58-45aa-a51f-cc6b44f8b30b%2FdQ.png?1545846159297', THREE.LinearFilter)

  return textures;
}

function loadShader(scene, uniforms) {
  const fileLoader = new THREE.FileLoader()

  const vertexShader = document.getElementById('vertexShader')?.textContent;
  if (!vertexShader) {
    throw new Error('Failed to load shader program!');
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
  scene.add(mesh)

  // load fragment shader
  let fragmentShader;
  fileLoader.load('./src/fragmentShader.glsl', (data) => {
    fragmentShader = data;
    material.fragmentShader = String(data);
    material.needsUpdate = true;
  });

  return {
    vertexShader,
    fragmentShader,
    material,
  }
}


// UPDATING
function update() {
  delta = (Date.now() - lastframe) / 1000
  time += delta

  // update peripherals
  stats.update()
  // window size
  renderer.setPixelRatio(window.devicePixelRatio * performanceConfig.resolution)
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth * performanceConfig.resolution, window.innerHeight * performanceConfig.resolution)

  // update renderer
  observer.update(delta)
  cameraControl.update(delta)

  // update shader variables
  updateUniforms()

  // render
  composer.render()

  // loop
  requestAnimationFrame(update)
  lastframe = Date.now()
}

function updateUniforms() {
  uniforms.time.value = time
  uniforms.resolution.value.x = window.innerWidth * performanceConfig.resolution
  uniforms.resolution.value.y = window.innerHeight * performanceConfig.resolution

  uniforms.cam_pos.value = observer.position
  uniforms.cam_dir.value = observer.direction
  uniforms.cam_up.value = observer.up
  uniforms.fov.value = observer.fov

  uniforms.cam_vel.value = observer.velocity

  uniforms.bg_texture.value = textures['bg1']
  uniforms.star_texture.value = textures['star']
  uniforms.disk_texture.value = textures['disk']


  // controls
  // bloomPass.strength = bloomConfig.strength
  // bloomPass.radius = bloomConfig.radius
  // bloomPass.threshold = bloomConfig.threshold


  observer.distance = cameraConfig.distance
  observer.moving = cameraConfig.orbit
  observer.fov = cameraConfig.fov
  uniforms.lorentz_transform.value = effectConfig.lorentz_transform
  uniforms.accretion_disk.value = effectConfig.accretion_disk
  uniforms.use_disk_texture.value = effectConfig.use_disk_texture
  uniforms.doppler_shift.value = effectConfig.doppler_shift
  uniforms.beaming.value = effectConfig.beaming
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
  // TODO must be loaded
  material.fragmentShader = defines + fragmentShader
  material.needsUpdate = true
}

// disposing memory
window.onbeforeunload = () => {
  for (const texture of textures.values()) {
    texture.dispose()
  }
}
