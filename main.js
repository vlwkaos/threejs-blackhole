/* globals THREE dat Stats Observer*/

let scene, camera, renderer
let observer, camControl
window.onload = ()=>{
  //
  lastframe = Date.now()
  
  scene = new THREE.Scene()

  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0x000000, 1.0)
  renderer.setSize(window.innerWidth, window.innerHeight) // res

  camera = new THREE.Camera() 
  camera.position.z = 1
  
  document.body.appendChild( renderer.domElement )
  
  init()
  
  observer = new Observer(60.0, window.innerWidth/window.innerHeight, 1, 80000)
  observer.distance=8
  camControl = new THREE.CameraDragControls(observer, renderer.domElement) // take care of camera view
  // camControl sets up vector
  
  
  scene.add(observer)
  delta = 0
  
  addControlGUI()
  addStatsGUI()
  update()
  
}

 window.onbeforeunload = ()=>{
  for (let i= 0;i<textures.length;i++)
    textures[i].dispose()
 }
// Scene drawing
let material, mesh, uniforms
let loader, textureLoader
let textures

const init = ()=>{
  textureLoader = new THREE.TextureLoader()
  loader = new THREE.FileLoader()

  textures = {}
  
  
  loadTexture('bg1','https://raw.githubusercontent.com/oseiskar/black-hole/master/img/milkyway.jpg', THREE.NearestFilter)
  loadTexture('bg2','https://cdn-images-1.medium.com/max/2000/1*i53XJF3x04oq3BUJHy4TQQ.png', THREE.NearestFilter)
  loadTexture('star','https://raw.githubusercontent.com/oseiskar/black-hole/master/img/stars.png', THREE.LinearFilter)
  //loadTexture('disk','https://raw.githubusercontent.com/oseiskar/black-hole/master/img/accretion-disk.png', THREE.LinearFilter)
  loadTexture('disk','https://raw.githubusercontent.com/rantonels/starless/master/textures/adisk.jpg', THREE.LinearFilter)
  // screen frame
  uniforms = {
		time: { type: "f", value: 1.0 },
		resolution: { type: "v2", value: new THREE.Vector2()},
    accretion_disk: {type: "b", value: false},
    lorentz_transform: {type: "b", value: false},
    cam_pos: {type:"v3", value: new THREE.Vector3()},
    cam_vel: {type:"v3", value: new THREE.Vector3()},
    cam_dir: {type:"v3", value: new THREE.Vector3()},
    cam_up: {type:"v3", value: new THREE.Vector3()},
    fov: {type:"f", value: 0.0},
    cam_vel: {type:"v3", value: new THREE.Vector3()},
    bg_texture: {type: "t", value: null},
    star_texture: {type: "t", value: null},
    disk_texture: {type: "t", value:null}
	}
  
  material = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: document.getElementById( 'vertexShader' ).textContent
		})
  loader.load('0_current_tracer.glsl', (data)=>{
    material.fragmentShader = data
    material.fragmentShader.needsUpdate = true
    material.needsUpdate = true
    mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material )
  	scene.add( mesh )   
  })
  
}

const loadTexture = (name, image, interpolation)=>{
    textures[name]= null
    textureLoader.load(image, (texture)=> {
      texture.magFilter = interpolation
      texture.minFilter = interpolation
      textures[name] = texture
    })
}



// dat.gui
let camconf,effectconf
let stats
const addStatsGUI = ()=>{
     
  stats = new Stats()
  stats.setMode(0)
  stats.domElement.style.position = 'absolute'
  stats.domElement.style.left = '0px'
  stats.domElement.style.top = '0px'
  document.body.appendChild( stats.domElement ) 
  
}

const addControlGUI = ()=>{
  
  // define properties
  camconf = {
    distance : 8.0,
    orbit: false,
    fov: 90.0
  }
  
  effectconf = {
    lorentz_transform: true,
    accretion_disk : true 
  }
  
  let gui = new dat.GUI()
  let observerFolder = gui.addFolder('Observer')
  observerFolder.add(camconf, 'distance', 3, 14)
  observerFolder.add(camconf, 'fov', 30, 90)
  observerFolder.add(camconf, 'orbit')
  
  let effectFolder = gui.addFolder('Effects')
  effectFolder.add(effectconf, 'lorentz_transform')
  effectFolder.add(effectconf, 'accretion_disk')

}


// UPDATING

let delta, lastframe
const update = ()=>{
  delta = (Date.now()-lastframe)/1000  
  stats.update()
  
  renderer.setSize(window.innerWidth, window.innerHeight)
  
  // update what is drawn
  observer.update(delta)
  camControl.update(delta)
  updateUniforms()
    
  render()
  requestAnimationFrame(update)
  
  lastframe = Date.now()
}

const updateUniforms = ()=>{
  uniforms.resolution.value.x = window.innerWidth
	uniforms.resolution.value.y = window.innerHeight

  uniforms.cam_pos.value = observer.position
  uniforms.cam_dir.value = observer.direction
  uniforms.cam_up.value = observer.up
  uniforms.fov.value = observer.fov

  uniforms.cam_vel.value = observer.velocity

  uniforms.bg_texture.value = textures['bg1']
  uniforms.star_texture.value = textures['star']
  uniforms.disk_texture.value = textures['disk']
  
  // controls
  observer.distance = camconf.distance
  observer.moving = camconf.orbit
  observer.fov = camconf.fov  
  uniforms.lorentz_transform.value = effectconf.lorentz_transform
  uniforms.accretion_disk.value = effectconf.accretion_disk
  
}

const render = ()=>{
  
  renderer.render( scene, camera )
}