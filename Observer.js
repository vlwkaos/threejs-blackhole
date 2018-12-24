
/* global THREE */
class Observer extends THREE.PerspectiveCamera {
  constructor(fov, ratio, near, far) {
    super(fov, ratio, near, far)

    
    // for orbit
    this.time = 0
    this.theta = 0
    this.angularVelocity = 0
    this.maxAngularVelocity = 0
    this.velocity = new THREE.Vector3()
    
    this.position.set(0,0,1)
  
    // options
    this.moving = false
    this.timeDilation = false
    this.incline = -10 * Math.PI / 180
  }
  
  update(delta){
    // time dilation
    if (this.timeDiltion){
      this.delta = Math.sqrt((delta*delta * (1.0 - this.angularVelocity*this.anuglularVelocity)) / (1-1.0/this.r));  
    } else {
      this.delta = delta 
    }
    
  
    
    this.theta += this.angularVelocity*this.delta
    let cos = Math.cos(this.theta)
    let sin = Math.sin(this.theta)
    
    
    
    this.position.set(this.r*sin, 0 , this.r*cos)
    this.velocity.set(cos*this.angularVelocity, 0 ,-sin*this.angularVelocity) 
    
    //incline
    let inclineMatrix = (new THREE.Matrix4()).makeRotationX(this.incline)

    this.position.applyMatrix4(inclineMatrix)
    this.velocity.applyMatrix4(inclineMatrix)
    
    if (this.moving){
      // accel
      if (this.angularVelocity < this.maxAngularVelocity)
        this.angularVelocity += this.delta/this.r      
      else
        this.angularVelocity = this.maxAngularVelocity
      
    } else { 
      // deccel
      
      if (this.angularVelocity > 0.0)
        this.angularVelocity -= this.delta/this.r
      else 
        this.angularVelocity = 0
      
    }

    this.time += this.delta
  }
  
  // sets position, r vector, direction
  set distance(r){
    this.r = r
    
    // w
    this.maxAngularVelocity = 1/Math.sqrt(2.0*(r-1.0))/this.r
    // p
    this.position.normalize().multiplyScalar(r)
  }
  
  get distance(){return this.r}
}