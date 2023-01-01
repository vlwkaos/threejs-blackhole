/* globals THREE dat Stats Observer*/
import * as THREE from 'three';
import { createCamera, createRenderer, createScene, createShaderProjectionPlane, loadTextures } from './graphics/render';
import { createStatsGUI } from './gui/statsGUI';
import { createConfigGUI } from './gui/datGUI';

let lastframe = Date.now()
let delta = 0
let time = 0

// set variables types for shader
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
const renderer = createRenderer()
const { composer, bloomPass, scene } = createScene(renderer);
document.body.appendChild(renderer.domElement)

// init graphics
const textures = loadTextures();
const { mesh, changePerformanceQuality } = await createShaderProjectionPlane(uniforms);
// add shader plane to scene
scene.add(mesh);

// setup camera
const { observer, cameraControl } = createCamera(renderer);
// add camera object to scene
scene.add(observer)

// GUI
const { cameraConfig, effectConfig, performanceConfig, bloomConfig } = createConfigGUI(changePerformanceQuality, saveToScreenshot);
const stats = createStatsGUI();
document.body.appendChild(stats.dom);

// start loop
update();


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
  render();

  // loop
  requestAnimationFrame(update)
  lastframe = Date.now()
}

function render() {
  composer.render()
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

  uniforms.bg_texture.value = textures.get('bg1')
  uniforms.star_texture.value = textures.get('star')
  uniforms.disk_texture.value = textures.get('disk')


  bloomPass.strength = bloomConfig.strength
  bloomPass.radius = bloomConfig.radius
  bloomPass.threshold = bloomConfig.threshold


  observer.distance = cameraConfig.distance
  observer.moving = cameraConfig.orbit
  observer.fov = cameraConfig.fov
  uniforms.lorentz_transform.value = effectConfig.lorentz_transform
  uniforms.accretion_disk.value = effectConfig.accretion_disk
  uniforms.use_disk_texture.value = effectConfig.use_disk_texture
  uniforms.doppler_shift.value = effectConfig.doppler_shift
  uniforms.beaming.value = effectConfig.beaming
}

// https://r105.threejsfundamentals.org/threejs/lessons/threejs-tips.html
function saveToScreenshot() {
  render();
  renderer.domElement.toBlob((blob) => {
    if (!blob) return;
    let URLObj = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = URLObj.createObjectURL(blob)
    a.download = `blackhole-image-${new Date(Date.now()).toLocaleDateString('en-GB').replace(/\//g, '-')}.png`
    document.body.appendChild(a)
    a.click();
    document.body.removeChild(a)
  });
}
