InputEngineClass = Class.extend({

	useMouse		: false,
	mouseSupport 	: false,
	mouse: {
		x: 0,
		y: 0
	},
	
	useOrientation 		: false,
	orientationSupport	: false,
	orientationPortrait	: false,
	orientationPosition :  { 
		x : 0, 
		y : 0 
	},
	
	is_firefox : false,
	

	//-----------------------------
	setup: function () {
		
		gInputEngine.is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
		
		// mouse listener
		document.getElementById('canvas').addEventListener('mousemove', gInputEngine.onMouseMove);
		
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

	//-----------------------------
	onMouseMove: function (event) {
		var rect = canvas.getBoundingClientRect();
    	gInputEngine.mouse.x = event.clientX - rect.left;
    	gInputEngine.mouse.y = event.clientY - rect.top;
	},
	
	onTilt : function( x, y, z ){
		
//		$("#tilt").text( (window.innerHeight > window.innerWidth) +"\n" + x +"\n"+y+"\n"+ z );
		
		gInputEngine.orientationSupport = true;
		
		gInputEngine.orientationPortrait = (window.innerHeight > window.innerWidth );
		
		if( gInputEngine.orientationPortrait )
		{
			if ( !gInputEngine.is_firefox )
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
	}
});

gInputEngine = new InputEngineClass();

