
/* global THREE */
class Observer extends THREE.Camera {
  constructor() {
    super()
    // sets initial values
    this.time = 0
    
    this.velocity = new THREE.Vector3()
    
    // for orbit
    this.theta = 0
    this.angularVelocity = 0
    this.maxAngularVelocity = 0
    

    this.position.set(0,0,1)
    
    
    this.moving = false
  }
  
  update(delta){
    // time dilation
    this.theta += this.angularVelocity*delta
    let cos = Math.cos(this.theta)
    let sin = Math.sin(this.theta)
    
    if (this.moving){
      // accel
      if (this.angularVelocity < this.maxAngularVelocity)
        this.angularVelocity += delta        
      else
        this.angularVelocity = this.maxAngularVelocity
      
      this.position.set(this.r*sin, 0, this.r*cos)
      this.velocity.set(-this.angularVelocity*sin,0, this.angularVelocity*cos)
    } else { 
      // deccel
      
      if (this.angularVelocity > 0.0)
        this.angularVelocity -= delta
      else  
        this.angularVeloicty = 0
        
      
    }
    
    
    this.time += delta
  }
  
  // sets position, r vector, direction
  set distance(r){
    this.r = r
    this.maxAngularVelocity = 1/Math.sqrt(2.0*(r-1.0))/r 
    // new position
    this.position.normalize().multiplyScalar(r)


  }
}