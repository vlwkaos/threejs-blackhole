
/* global THREE */
class Observer extends THREE.Camera {
  constructor(barycenter) {
    super()
    // sets initial values
    this.time = 0
    this.barycenter = new THREE.Vector3()
    this.barycenter.copy(barycenter)
    this.r = new THREE.Vector3()
    this.direction = new THREE.Vector3()
    this.position.set(0,0,1)
    
    
    this.move = false
  }
  
  update(delta){
    if (this.move){
      this.time += delta
    }
  }
  
  // sets position, r vector, direction
  set distance(dist){
    this.r.subVectors(this.position, this.barycenter)
    this.direction = this.direction.copy().cross(this.up).normalize()
    
    let newPos = new THREE.Vector3().copy(this.r)
    newPos.normalize()
    newPos.multiplyScalar(dist)
    this.position.set(newPos.getComponent(0),newPos.getComponent(1),newPos.getComponent(2))
    
    this.speed = Math.sqrt(dist-1)/Math.sqrt(2)
    
  }
}