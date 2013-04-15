/*********************************************
 *	
 * Input Engine Class 
 * used to handle inputs for the game
 * whether mouse move or orientation events
 * 
 ************************************************/

InputEngineClass = Class.extend({

	// Boolean that handles if we play in mouse mode
	useMouse		: false,
	
	// Boolean that handles mouse capabilities
	mouseSupport 	: false,
	
	// mouse position
	mouse: {
		x: 0,
		y: 0
	},
	
	// Boolean that handles if we play in tilt mode
	useOrientation 		: false,
	
	// Boolean that handles tilt capabilities
	orientationSupport	: false,
	
	// Boolean that handles if we are in portrait mode
	orientationPortrait	: false,
	
	// orientation positions
	orientationPosition :  { 
		x : 0, 
		y : 0 
	},
	
	// hack for Firefox
	is_firefox : false,
	
	/**
	 * initialization function
	 */
	setup: function () {
		
		// set firefox hack
		gInputEngine.is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
		
		// mouse listener
		document.getElementById('canvas').addEventListener('mousemove', gInputEngine.onMouseMove);
		
		// set mouse support
		gInputEngine.mouseSupport = isMouseEventSupported( 'mousemove' );
		gInputEngine.mouseSupport = !( isMouseEventSupported( 'touchstart' ) );
		
		// tilt listener
		if (window.DeviceOrientationEvent) {
			
		    window.addEventListener("deviceorientation", function ( event ) {
		        gInputEngine.onTilt(event.beta, event.gamma, event.alpha);
		    }, true);
		    
		} else if (window.DeviceMotionEvent) {
			
		    window.addEventListener('devicemotion', function ( event ) {
		        gInputEngine.onTilt(event.acceleration.x * 2, event.acceleration.y * 2, event.acceleration.z * 2);
		    }, true);
			
		}
		
	},

	/**
	 * Mouse move handler
 	 * @param {Event} event
	 */
	onMouseMove: function (event) {
		
		// get the canvas rectangle, 
		// we need it to substract canvas position to 
		// the event clientX and clientY variables, 
		// to relate the mouse position with our canvas 
		var rect = canvas.getBoundingClientRect();
    	gInputEngine.mouse.x = event.clientX - rect.left;
    	gInputEngine.mouse.y = event.clientY - rect.top;
	},
	/**
	 * Orientation handler
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 */
	onTilt : function( x, y, z ){
		
		// use for debugging
//		$("#tilt").text( (window.innerHeight > window.innerWidth) +"\n" + x +"\n"+y+"\n"+ z );
		
		// if we enter here means that we can use Tilt Mode
		gInputEngine.orientationSupport = true;
		
		// check if we are in portrait
		gInputEngine.orientationPortrait = (window.innerHeight > window.innerWidth );
		
		//------------ 
		//------- Tested over Firefox Mobile, Chrome Mobile and Safari 
		//-------
		//------- Running on my Samsung Galaxy 2 pretty well.
		//------- Unfortunately on iPad and Nexus7 coordinates are rotated
		//-------
		//------- At the time I haven't been able to find a 
		//------- constant on the use of this coordinates 
		//------- through browsers and devices.
		//------- 
		//------- Any solution/help will be really appreciated
		//------- 
		//------------  
		// set the world's gravity 
		// related with our x and y variables.
		// There are multiply tricks here 
		// as x and y values depends on 
		// device orientation ( z value ),
		// to set the gravity always 
		// to the bottom of the scenario
		if( gInputEngine.orientationPortrait )
		{
			if ( !gInputEngine.is_firefox ) // hack for firefox
			{
				if( z > 90 && z < 270 )
				{
					gInputEngine.orientationPosition.x = y;
					gInputEngine.orientationPosition.y = x;
				} else {
					gInputEngine.orientationPosition.x = -y;
					gInputEngine.orientationPosition.y = -x;
				}
			} else {
				if( z > 90 && z < 270 )
				{
					gInputEngine.orientationPosition.x = -y;
					gInputEngine.orientationPosition.y = -x;
				} else {
					gInputEngine.orientationPosition.x = y;
					gInputEngine.orientationPosition.y = x;
				}
			}
			
		} else {
			
			if( z < 180 )
			{
				gInputEngine.orientationPosition.x = -x;
				gInputEngine.orientationPosition.y = y;
			} else {
				gInputEngine.orientationPosition.x = x;
				gInputEngine.orientationPosition.y = -y;
			}
		}
		
		gInputEngine.orientationPosition.x = parseFloat(gInputEngine.orientationPosition.x).toFixed(2);
		gInputEngine.orientationPosition.y = parseFloat(gInputEngine.orientationPosition.y).toFixed(2);
	}
});

gInputEngine = new InputEngineClass();