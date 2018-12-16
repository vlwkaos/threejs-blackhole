
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
    
    // for orbit
    this.theta = 0
    this.angularVelocity = 0
    this.maxAngularVelocity = 0
    

    this.position.set(0,0,1)
    
    
    this.moving = false
  }
  
  update(delta){
    
    this.theta += this.angularVelocity*delta
    if (this.moving){
      // accel
      if (this.angularVelocity < this.maxAngularVelocity){
        this.angularVelocity += delta        
        this.velocity.set(this.dist*Math.cos(this.angularVelocity), 0, this.dist*Math.sin(this.angularVelocity))
      } else{
        this.angularVelocity = this.maxAngularVelocity
      }
      this.position.applyAxisAngle(this.up, this.theta)
      
    } else { 
      // deccel
      if (this.angularVelocity > 0.0){
        this.angularVelocity -= delta
         
        this.position.applyAxisAngle(this.up, this.theta)
        this.velocity.applyAxisAngle(this.up, this.theta)
      } else { 
        this.angularVeloicty = 0
        this.velocity.set(0,0,0)
      }
    }
    
    
    this.time += delta
  }
  
  // sets position, r vector, direction
  set distance(dist){
    this.dist = dist
    this.r.subVectors(this.position, this.barycenter)
    let newPos = new THREE.Vector3().copy(this.r)
    newPos.normalize()
    newPos.multiplyScalar(dist)
    // new position
    this.position.set(newPos.getComponent(0),newPos.getComponent(1),newPos.getComponent(2))
    // new theta
    this.theta = this.r.angleTo(this.position) // angle from observer to barycenter
    
    this.maxAngularVelocity = 1/Math.sqrt(2.0*(dist-1)) // in radian
    this.velocity.set(this.dist*Math.cos(this.angularVelocity), 0, this.dist*Math.sin(this.angularVelocity))
  }
}