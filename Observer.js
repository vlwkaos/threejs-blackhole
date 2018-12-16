
/* global THREE */
class Observer extends THREE.Camera {
  constructor(barycenter) {
    super()
    // sets initial values
    this.time = 0
    this.barycenter = new THREE.Vector3()
    this.barycenter.copy(barycenter)
    this.r = new THREE.Vector3()
    this.theta = 0
    this.aberration = 0
    this.angularVelocity = 0
    this.direction = new THREE.Vector3()
    this.position.set(0,0,1)
    
    
    this.moving = false
  }
  
  update(delta){
    if (this.moving){
      this.time += delta
      this.theta += this.angularVelocity*delta/1000
      this.position.applyAxisAngle(this.up, this.theta)
    }
  }
  
  // sets position, r vector, direction
  set distance(dist){
    this.r.subVectors(this.position, this.barycenter)
    let newPos = new THREE.Vector3().copy(this.r)
    newPos.normalize()
    newPos.multiplyScalar(dist)
    // new position
    this.position.set(newPos.getComponent(0),newPos.getComponent(1),newPos.getComponent(2))
    // new theta
    this.theta = this.r.angleTo(this.position) // angle from observer to barycenter
    
    this.angularVelocity = (Math.PI / 180) * Math.sqrt(dist - 1)/Math.sqrt(2) // in radian
    let velsqr = (Math.pow(dist*Math.cos(this.angularVelocity),2)+Math.pow(dist*Math.sin(this.angularVelocity),2))
    let phi = Math.atan2(Math.sin(this.angularVelocity)*Math.sqrt(1-velsqr)/ // 
                                 (Math.sqrt(velsqr)+Math.cos(this.angularVelocity)))
    this.aberration = this.theta-phi
  }
}