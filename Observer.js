
/* global THREE */
class Observer extends THREE.Camera {
  constructor(barycenter) {
    super()
    // sets initial values
    this.time = 0
    this.barycenter = new THREE.Vector3()
    this.barycenter.copy(barycenter)
    this.r = new THREE.Vector3()
    this.velocity = new THREE.Vector3()
    this.direction = new THREE.Vector3()
    this.position.set(0,0,1)
    
    
    this.move = false
  }
  
  update(delta){
    if (this.move){
      this.time += delta
      this.velocity =  
    }
  }
  
  // sets position, r vector, direction
  set distance(dist){
    this.r.subVectors(this.position, this.barycenter)
    let newPos = new THREE.Vector3().copy(this.r)
    newPos.normalize()
    newPos.multiplyScalar(dist)
    this.position.set(newPos.getComponent(0),newPos.getComponent(1),newPos.getComponent(2))
    
    
    
  }
}