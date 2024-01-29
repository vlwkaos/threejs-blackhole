import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { CameraDragControls } from "../camera/CameraDragControls";
import { Observer } from "../camera/Observer";
import { Vector2 } from 'three/src/math/Vector2';
import fragmentShader from './fragmentShader.glsl?raw';
import starUrl from '../../assets/star_noise.png';
import milkywayUrl from '../../assets/milkyway.jpg';
import diskUrl from '../../assets/accretion_disk.png';

export function createRenderer() {
  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0x000000, 1.0)
  renderer.setSize(window.innerWidth, window.innerHeight) // res
  renderer.autoClear = false
  return renderer;
}

export function createScene(renderer) {
  // scene and camera
  const scene = new THREE.Scene()
  // this camera is THREE.js camera fixated at position z=1
  // since drawing happens only with shader on a 2D plane, actual camera control is done by Observer
  const camera = new THREE.Camera()
  camera.position.z = 1

  // render pass composing
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera)
  // strength, kernelSize, sigma, res
  // resolution, strength, radius, threshold
  const bloomPass = new UnrealBloomPass(new Vector2(128, 128), 0.8, 2.0, 0.0)
  const shaderPass = new ShaderPass(CopyShader);
  shaderPass.renderToScreen = true;
  composer.addPass(renderPass);
  composer.addPass(bloomPass);
  composer.addPass(shaderPass);

  return {
    scene, composer, bloomPass
  }
}

export function createCamera(renderer) {
  const observer = new Observer(60.0, window.innerWidth / window.innerHeight, 1, 80000)
  const cameraControl = new CameraDragControls(observer, renderer.domElement) // take care of camera view
  return {
    observer, cameraControl
  }
}

export function loadTextures() {
  const textures = new Map();
  const textureLoader = new THREE.TextureLoader()

  loadTexture('bg1', milkywayUrl, THREE.NearestFilter)
  loadTexture('star', starUrl, THREE.LinearFilter)
  loadTexture('disk', diskUrl, THREE.LinearFilter)

  window.onbeforeunload = () => {
    for (const texture of textures.values()) {
      texture.dispose();
    }
  }

  return textures;

  function loadTexture(name, image, interpolation, wrap = THREE.ClampToEdgeWrapping) {
    textures.set(name, null);
    textureLoader.load(image, (texture) => {
      texture.magFilter = interpolation
      texture.minFilter = interpolation
      texture.wrapT = wrap
      texture.wrapS = wrap
      textures.set(name, texture);
    })
  }
}

export async function createShaderProjectionPlane(uniforms) {

  const vertexShader = document.getElementById('vertexShader')?.textContent
  if (!vertexShader) {
    throw new Error('Error reading vertex shader!');
  }

  const defines = getShaderDefineConstant('medium');
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader,
    fragmentShader: defines + fragmentShader,
  })
  material.needsUpdate = true;

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)


  async function changePerformanceQuality(quality) {
    const defines = getShaderDefineConstant(quality);
    material.fragmentShader = defines + fragmentShader;
    material.needsUpdate = true;
  }


  function getShaderDefineConstant(quality) {
    let STEP, NSTEPS;
    switch (quality) {
      case 'low':
        STEP = 0.1;
        NSTEPS = 300;
        break;
      case 'medium':
        STEP = 0.05;
        NSTEPS = 600;
        break;
      case 'high':
        STEP = 0.02;
        NSTEPS = 1000;
        break;
      default:
        STEP = 0.05;
        NSTEPS = 600;
    }
    return `
  #define STEP ${STEP} 
  #define NSTEPS ${NSTEPS} 
`
  }

  return {
    mesh,
    changePerformanceQuality
  };
}
