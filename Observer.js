
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
    let newPos = new THREE.Vector3()
    console.log('init: '+newPos.x)
    newPos.subVectors(this.position, this.barycenter)
    console.log('subvec:'+newPos)
    newPos.normalize()
    console.log('unit:' + newPos)
    newPos.multiplyScalar(dist)
    console.log('multpi:' +newPos)
    
    //let newPos = (this.position.subVectors(this.barycenter,this.position).normalize()).multiplyScalar(dist)
    this.position.set(newPos.getComponent(0),newPos.getComponent(1),newPos.getComponent(2))
    
    
    
  }
}