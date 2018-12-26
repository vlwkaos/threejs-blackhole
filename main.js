/* globals THREE dat Stats Observer*/

let scene, camera, renderer 
let composer, effectBloom
let observer, camControl
window.onload = ()=>{
  //
  lastframe = Date.now()
  
  scene = new THREE.Scene()

  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0x000000, 1.0)
  renderer.setSize(window.innerWidth, window.innerHeight) // res
  renderer.autoClear = false
  

  camera = new THREE.Camera() 
  camera.position.z = 1
  
  document.body.appendChild( renderer.domElement )
  
  composer = new THREE.EffectComposer(renderer)
  let renderPass = new THREE.RenderPass(scene, camera)
  // strength, kernelSize, sigma, res
  //
  // resolution, strength, radius, threshold
  effectBloom = new THREE.UnrealBloomPass(128, 0.8, 2.0, 0.0)
  let scenePass = new THREE.RenderPass(scene, camera)
  let effectCopy = new THREE.ShaderPass(THREE.CopyShader)
  effectCopy.renderToScreen  =true
  composer.addPass(renderPass)
  composer.addPass(effectBloom)
  composer.addPass(effectCopy)
  
  
  init()
  
  observer = new Observer(60.0, window.innerWidth/window.innerHeight, 1, 80000)
  observer.distance=8
  camControl = new THREE.CameraDragControls(observer, renderer.domElement) // take care of camera view
  // camControl sets up vector
  scene.add(observer)
  delta = 0
  time = 0
  
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
  
  
  loadTexture('bg1','https://cdn.glitch.com/631097e7-5a58-45aa-a51f-cc6b44f8b30b%2Fmilkyway.jpg?1545745139132', THREE.NearestFilter)
  loadTexture('star','https://cdn.glitch.com/631097e7-5a58-45aa-a51f-cc6b44f8b30b%2Fstars.png?1545722529872', THREE.LinearFilter)
  loadTexture('disk','https://cdn.glitch.com/631097e7-5a58-45aa-a51f-cc6b44f8b30b%2Fd.png?1545795381565', THREE.LinearFilter)

  
  // screen frame
  uniforms = {
		time: { type: "f", value: 0.0 },
		resolution: { type: "v2", value: new THREE.Vector2()},
    accretion_disk: {type: "b", value: false},
    use_disk_texture: {type: "b", value: true},
    lorentz_transform: {type: "b", value: false},
    doppler_shift: {type: "b", value: false},
    beaming: {type: "b", value: false},
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
           let defines = 
          `#define STEP 0.05
#define NSTEPS 600
`
    
    material.fragmentShader = defines+data
    material.fragmentShader.needsUpdate = true
    material.needsUpdate = true
    mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material )
  	scene.add( mesh )   
  })
  
}

const loadTexture = (name, image, interpolation ,wrap = THREE.ClampToEdgeWrapping)=>{
    textures[name]= null
    textureLoader.load(image, (texture)=> {
      texture.magFilter = interpolation
      texture.minFilter = interpolation
      texture.wrapT = wrap
      texture.wrapS = wrap
      textures[name] = texture
    })
}



// dat.gui
let camconf,effectconf,perfconf,bloomconf,etcconf
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
  perfconf = {
    resolution : 1.0, 
    quality: 'medium'
  }
  
  bloomconf = {
    strength :1.0, 
	  radius :0.5,
    threshold:0.6 
  }
  
  camconf = {
    distance : 10,
    orbit: true,
    fov: 90.0
  }
  
  effectconf = {
    lorentz_transform: true,
    accretion_disk : true,
    use_disk_texture : true,
    doppler_shift : true,
    beaming: true
  }
  
  etcconf = {
    save: ()=>{
      getImageData = true;
      render()
      renderer.domElement.toBlob(function(blob) {
        saveAs(blob, "pretty image.png");
      });
      let image = renderer.domElement.toDataURL("image/png").replace("image/png", "image/octet-stream");  
      window.location.download = 'image.png'
      window.location.href=image;
    }
    
  }
  
  let gui = new dat.GUI()
  let perfFolder = gui.addFolder('Performance')
  perfFolder.add(perfconf, 'resolution', [0.25,0.5,1.0,2.0,4.0])
  perfFolder.add(perfconf, 'quality', ['low','medium','high']).onChange((val)=>{
    let defines = ''
    switch (val){
      case 'low':
        defines = 
          `#define STEP 0.1
#define NSTEPS 300
`
      break
      case 'medium':
        defines = 
          `#define STEP 0.05
#define NSTEPS 600
`
      break
      case 'high':
        defines = `#define STEP 0.02
#define NSTEPS 1000
`
      break
    }
      
    loader.load('0_current_tracer.glsl', (data)=>{
          
      material.fragmentShader = defines+data
      material.fragmentShader.needsUpdate = true
      material.needsUpdate = true
    })
  })
  let bloomFolder = gui.addFolder('Bloom')
  bloomFolder.add(bloomconf, 'strength', 0.0, 3.0)
  bloomFolder.add(bloomconf, 'radius', 0.0, 1.0)
  bloomFolder.add(bloomconf, 'threshold', 0.0, 1.0)
  
  
  let observerFolder = gui.addFolder('Observer')
  observerFolder.add(camconf, 'distance', 2, 14)
  observerFolder.add(camconf, 'fov', 30, 90)
  observerFolder.add(camconf, 'orbit')
  
  let effectFolder = gui.addFolder('Effects')
  effectFolder.add(effectconf, 'lorentz_transform')
  effectFolder.add(effectconf, 'doppler_shift')
  effectFolder.add(effectconf, 'beaming')
  effectFolder.add(effectconf, 'accretion_disk')
  effectFolder.add(effectconf, 'use_disk_texture')  
  perfFolder.open()
  //bloomFolder.open()
  observerFolder.open()
  effectFolder.open()
  
  gui.add(etcconf, 'save')
  
}


// UPDATING

let delta, lastframe
let time
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

  uniforms.bg_texture.value = textures['bg1']
  uniforms.star_texture.value = textures['star']
  uniforms.disk_texture.value = textures['disk']
  
  
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

let getImageData, imgData
const render = ()=>{
  if(getImageData == true){
    imgData = renderer.domElement.toDataURL();
    getImageData = false;
  }
  //renderer.render( scene, camera )
  composer.render()
}