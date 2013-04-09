var BackgroundClass = Class.extend({
	
	backgroundURL : 'images/earth_circle.png',
	background : null,
	
	imgCount: 0,
	
	fullyLoaded : false,
	
	load: function ( img ) {
    	
    	gBackground.background = img;
    	gBackground.fullyLoaded = true;
    },
    
    drawBackground : function(){
    	context.drawImage( gBackground.background, 0, 0, gBackground.background.width, gBackground.background.height, -gBackground.background.width/2, -gBackground.background.height/2, gBackground.background.width, gBackground.background.height );
    }
});

gBackground = new BackgroundClass(); 