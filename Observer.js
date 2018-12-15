
/* global THREE */
class Observer extends THREE.Camera {
  constructor(barycenter) {
    super()
    this.barycenter = new THREE.Vector3()
    this.barycenter.copy(barycenter)
    this.position.set(0,0,1)
    this.r
    this.distance = 10
    
    this.move = false
  }
  
  update(delta){
    if (this.move){
      
    }
  }
  
  set distance(dist){
    let newPos = new THREE.Vector3()
    newPos.subVectors(this.position, this.barycenter)
    newPos.normalize()
    newPos.multiplyScalar(dist)
    this.position.set(newPos.getComponent(0),newPos.getComponent(1),newPos.getComponent(2))
    
    this.speed = Math.sqrt(dist-1)/Math.sqrt(2)
    
  }
}