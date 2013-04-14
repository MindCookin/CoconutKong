
/*********************************************
 *	
 * BackgroundClass is used to handle 
 * the game's background drawing.
 * 
 ************************************************/

var BackgroundClass = Class.extend({
	
	// the image url
	backgroundURL : 'images/earth_circle.png',
	
	// the image object 
	image : null,
	
	// Boolean to handle if image is loaded
	fullyLoaded : false,
	
	/**
	 * Loads the given image into our "background" variable 
	 * 
 	 * @param {Image} image
	 */
	load: function ( image ) {
    	
    	gBackground.image = image;
    	gBackground.fullyLoaded = true;
    },
    
    
	/**
	 * Draws background image 
	 */
    drawBackground : function(){
    	context.drawImage( gBackground.image, 0, 0, gBackground.image.width, gBackground.image.height, -gBackground.image.width/2, -gBackground.image.height/2, gBackground.image.width, gBackground.image.height );
    }
});

gBackground = new BackgroundClass(); 