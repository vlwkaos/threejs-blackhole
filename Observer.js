
/* global THREE */
class Observer extends THREE.Camera {
  constructor(barycenter) {
    super()
    this.barycenter = new THREE.Vector3()
    this.barycenter.copy(barycenter)

    this.move = false
  }
  
  update(delta){
    if (this.move){
      
    }
  }
  
  set distance(dist){
    this.position = new THREE.Vector3()
    //this.position = this.position.subVectors(this.barycenter,this.position).normalize().multiplyScalar(dist)
    
  }
}