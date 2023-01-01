import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { CameraDragControls } from "./CameraDragControls";
import { Observer } from "./Observer";
import { Vector2 } from 'three/src/math/Vector2';

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

export function loadShader(scene, uniforms) {
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