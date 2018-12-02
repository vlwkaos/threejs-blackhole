/* global THREE */

THREE.CameraDragControls = function ( object, domElement ) {

	this.object = object;

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.enabled = true;

	this.lookSpeed = 0.005;
	this.lookVertical = true;	

	this.offsetX = 0;
  this.offsetY = 0;
  this.lastX = 0;
  this.lastY = 0;

	this.viewHalfX = 0;
	this.viewHalfY = 0;

	if ( this.domElement !== document ) {

		this.domElement.setAttribute( 'tabindex', - 1 );

	}

	//

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}

	};

	this.onMouseDown = function ( event ) {
		if ( this.domElement !== document ) {

			this.domElement.focus();

		}
  

		event.preventDefault();
		event.stopPropagation();

		this.mouseDragOn = true;
      // remember current mouse position

	};

	this.onMouseUp = function ( event ) {

		event.preventDefault();
		event.stopPropagation();

		this.mouseDragOn = false;
    this.deltaX = 0;
    this.deltaY = 0;
	};

	this.onMouseMove = function ( event ) {
    float xoffset = xpos - lastX;
float yoffset = lastY - ypos; // reversed since y-coordinates range from bottom to top
lastX = xpos;
lastY = ypos;

float sensitivity = 0.05f;
xoffset *= sensitivity;
yoffset *= sensitivity;
    
    
    // calculate moved position
    if (this.mouseDragOn){
      let newX,newY;  
      if ( this.domElement === document ) {

          this.newX = event.pageX - this.viewHalfX;
          this.newY = event.pageY - this.viewHalfY;

      } else {

          this.newX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
          this.newY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

      } 

      
      
    }
    
	};


	this.update = function ( delta ) {

		if ( this.enabled === false ) return;
  
    if (this.mouseDragOn){
      // last position
      if ( this.domElement === document ) {

        this.lastX = this.viewHalfX;
        this.lastY = this.viewHalfY;

      } else {

        this.lastX = this.domElement.offsetLeft - this.viewHalfX;
        this.lastY = this.domElement.offsetTop - this.viewHalfY;

      } 
      
      this.deltaX = newX - this.mouseX;
      this.deltaY = newY - this.mouseY;
      
      this.yaw += this.lookSpeed * delta * this.deltaX;
      this.pitch += this.lookSpeed * delta * this.deltaY;

      let newDirection = new THREE.Vector3(
        Math.cos(this.pitch) * Math.cos(this.yaw),                          
        Math.sin(this.pitch),
        Math.cos(this.pitch) * Math.sin(this.yaw));

      this.object.lookAt(newDirection);
    }
  
  }
  
	function contextmenu( event ) {

		event.preventDefault();

	}

	this.dispose = function () {
		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
		this.domElement.removeEventListener( 'mousedown', _onMouseDown, false );
		this.domElement.removeEventListener( 'mousemove', _onMouseMove, false );
		this.domElement.removeEventListener( 'mouseup', _onMouseUp, false );

	};

	var _onMouseMove = bind( this, this.onMouseMove );
	var _onMouseDown = bind( this, this.onMouseDown );
	var _onMouseUp = bind( this, this.onMouseUp );

	this.domElement.addEventListener( 'contextmenu', contextmenu, false );
	this.domElement.addEventListener( 'mousemove', _onMouseMove, false );
	this.domElement.addEventListener( 'mousedown', _onMouseDown, false );
	this.domElement.addEventListener( 'mouseup', _onMouseUp, false );



	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	}

	this.handleResize();

};