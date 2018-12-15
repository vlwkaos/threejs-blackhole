
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
    let newPos = (this.position.subVectors(this.barycenter,this.position).normalize()).multiplyScalar(dist)
    console.log(newPos)
    this.position.set(newPos.getComponent(0),newPos.getComponent(1),newPos.getComponent(2))
  
    
    
  }
}