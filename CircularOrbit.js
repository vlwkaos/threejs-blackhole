
/* global THREE */
class CircularOrbit {
  constructor(object, barycenter) {
    this.object = object
    this.barycenter = new THREE.Vector3()
    this.barycenter.copy(barycenter)
    
    
    this.move = false
    
    
  }
  
  update(delta){
    if (this.move){
      
    }
  }
  
  set distance(dist){
    let theta = THREE.subVectors(this.barycenter,this.object.position)
    
    
    this.distance = 0
    
  }
}