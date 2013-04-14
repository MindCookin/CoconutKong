/*********************************************
 *	
 * The Game Manager class, 
 * it manage looping, 
 * assets loading 
 * and other game setups.
 * 
 ************************************************/

ManagerClass = Class.extend({
	    
	// flag for game finishing
	finished	: false,
	
	// flag for game first Load
	firstLoad	: true,
	
	// Boolean to handle game pause
	_paused		: true,
	
	// actualLevel ID reference
	actualLevel : 1,
	
	// last looping date time, in miliseconds
	lastTime	: 0,
	
	// time passed playing this level, in miliseconds
	timeInLevel	: 0,
	
	// counter to update DOM. 
	// It's used to prevent losing performance
	updateTimerCounter : 0,
	
	// use debugger fps counter
	showFPS		: false,

	/**
	 * initialization function 
	 */
	setup : function() 
	{
		// start game engine
		gGameEngine.setup();
		
		// start our nextLevel
		gManager.nextLevel = 1;
		gManager.goNextLevel();
	
		// start animation 
		// and frame looping 
		gManager.animate();
		
		// show play buttons on #helpPopup
		gButtons.showBtnPlay();
		
		// show canvas
		$('#canvas').fadeIn();
	},
	/**
	 *	move to next level 
	 */
	goNextLevel : function(){
		
		// pause the game  
		// for the canvas alpha animation 
		gManager.pause();
		
		// set actualLevel to nextLevel
		gManager.actualLevel = gManager.nextLevel;
		
		// canvas alpha animation
		$('#canvas').fadeOut(
			400, 
			function(){
				
			// on completed canvas animation
			// we check if we have finished the game
			// ( if so, no scenario will be created )
			if( createScenario( gManager.actualLevel ) )
			{
				// update our level selector sidebar
				gLevelSelector.update( gManager.actualLevel );
				
				// show canvas
				$('#canvas').fadeIn( 400, function(){
					
					// we use firstLoad to prevent 
					// game resuming while the initial popup
					// is over
					if(!gManager.firstLoad )
						gManager.resume();
					else
						gManager.firstLoad = false;
					
					// reset timeInLevel	
					gManager.timeInLevel = 0;
				});
				
			} else {
				
				// update our level selector sidebar
				gLevelSelector.update( gManager.actualLevel );
				
				// we use firstLoad to prevent 
				// game resuming while the initial popup
				// is over
				if(!gManager.firstLoad )
					gManager.resume();
				else
					gManager.firstLoad = false;
				
				// reset timeInLevel		
				gManager.timeInLevel = 0;
			}
		});
	},
	/**
	 *	handles level completion 
	 */
	completedLevel : function(){
		
		// update time records dictionary
		gLevelSelector.updateTimeRecords();
		
		// set nextLevel variable to the next level ID
		gManager.nextLevel = parseInt( gManager.actualLevel ) + 1;
	},
	/**
	 *  set nextLevel to the level 
	 * passed as parameter and 
	 * destroy world to load the next level
 	 * @param {int} level
	 */
	changeLevel : function( level ){
		
		// set world's destroy flag to true 
		// to destroy world
		world.setDestroy 	= true;
		
		// set next level ID
		gManager.nextLevel 	= level;
	},
		
	/**
	 *	the game loop, 
	 *  uses requestAnimFrame function 
	 * 	because it increases performance and 
	 *  helps in cross-browser management  
	 */
    animate : function () {
    	
    	// call to loop function to 
    	// update the game elements
		gManager.loop();	
      		
      	// requestAnimFrame handles the next 
      	// animate pass
      	requestAnimFrame( gManager.animate );
    },
	/**
	 * handles the game objects 
	 * and classes updates 
	 */
	loop : function()
	{
		// Store the current transformation matrix
		context.save();
		
		// Use the identity matrix while clearing the canvas
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		// Restore the transform
		context.restore();
		
		// check if our assets are all loaded
		if( gMap.fullyLoaded && gBackground.fullyLoaded )
		{
			// if game its not paused 
			// then we update the world
			// and timer 
    		if( !gManager._paused )
    		{
    			gManager.updateTime();
				world.update();	// world.DebugDraw clears canvas! that's why we need to do this first of all
    		}
			
			// update game engine and entities
			gGameEngine.update();
			
			// store Roller's angle
	        var angle = gGameEngine.getEntity("Roller").body.GetAngle();
	        
	        // translate and rotate context to draw background and map
			context.translate( canvas.width/2, canvas.height/2 );
			context.rotate(	angle );
		
	        // now draw background and map
			gBackground.drawBackground();
			gMap.draw( context );
		
	    	// we unrotate context after draw
			context.rotate(	-angle );
			context.translate( -canvas.width/2, -canvas.height/2 );
			
	        // now we draw our entities
			gGameEngine.draw();
		}	
		
		// if debugging, show FPS
		if( gManager.showFPS )
			updateFPS();
	},
	/**
	 * updates timeInLevel
	 */
	updateTime : function(){
		
		// we get the milliseconds passed 
		// since the last time we fill lastTime.
		// Is important to prevent counting time 
		// when game is paused
		var date 	= new Date();
		var time 	= date.getTime();
		var delay 	= time - gManager.lastTime;
		
		// we add the delay to the timeInLevel variable
		gManager.timeInLevel += delay;
		
		// adds one tick to updateTimerCounter
		gManager.updateTimerCounter++;
		
		// if there has passed 5 TimerCounter ticks,
		// we update the DOM
		if( gManager.updateTimerCounter > 5 )
		{
		   	gLevelSelector.updateTime( gManager.timeInLevel );	
			gManager.updateTimerCounter = 0;
		}
		
		// set lastTime
		gManager.lastTime = time;
	},
	
	/**
	 * set _pause to true 
	 */
	pause : function(){
		gManager._paused = true; 
	},
	
	/**
	 *  resumes the game
	 */
	resume : function(){
		
		// and set lastTime to this 
		// current Date time, to prevent 
		// additional counting when paused
		var date 	= new Date();
		var time 	= date.getTime();
		gManager.lastTime = time;
		
	 	//set _pause to false
		gManager._paused = false; 
	},
	/**
	 * parse the sprite image 
	 * with SpriteSheetClass
	 * @param {JSON} mapJSON
	 * @param {Image} atlasImage
	 */
	parseSprite : function( mapJSON, atlasImage ){
		
		var parsedJSON = JSON.parse(mapJSON);
		
		var spritesheet = new SpriteSheetClass();
		spritesheet.load( "images/" + parsedJSON.meta.image, atlasImage );
		spritesheet.parseAtlasDefinition( mapJSON );
	},
	/**
	 * parse the JSON map
	 * and adds a new level
	 * 
	 * @param {JSON} mapJSON
	 * @param {int} id
	 * @param {Image} atlasImage
	 */
	parseLevel : function( mapJSON, id, atlasImage ){
		
		var parsedJSON = JSON.parse(mapJSON);
		
		var level = new LevelClass();
		
		level.load( id, mapJSON, atlasImage );
	}, 
	
	/**
	 * Loads JSONs.
	 * The image passed as parameter 
	 * is the atlas sprite. It is the 
	 * same image for both spritesheet
	 * and level maps
 	 * @param {Image} atlasImage
	 */
	loadJSONs : function( atlasImage ){
		
		// concat level maps urls 
		// and spritesheets urls into one array
		var urls 	= levelURLs.concat( spriteURLs );
		
		// loaded counter
		var count 	= 0;
		
		// iterate through urls array
		for ( var i = 0; i < urls.length; i++ )
		{
			// load items by ajax
			$.ajax({
			type : 'GET',
			url : urls[i],
			dataType : 'json',
			complete : function( jqXHR, textStatus ){
				
					
					// if its a level map
					if( levelURLs.indexOf( this.url ) >= 0 )	
						gManager.parseLevel( jqXHR.responseText, levelURLs.indexOf( this.url ) + 1, atlasImage );
					else 	// if its a sprite 
						gManager.parseSprite( jqXHR.responseText, atlasImage );
					
					// add one to counter
					count++;
					
					// if we have loaded all assets
					// then is time to start
					if( count == urls.length )
						gManager.setup();
				}
			});
		}
	}, 
	
	/**
	 * images loader 
	 */
	loadImages : function(){
		
		// image counter
		var imgCount = 0;
		
		// dictionary to maintain 
		// url-image relationship
		var diccImages = {};
		
		// iterate throug all our images
		for ( var i = 0; i < images.length; i++ )
		{
			// create and store image in dictionary
			var img = new Image();
			diccImages[ images[i] ] = img;
		    
		    // handle image load
		    img.onload 	= function(){
		    	
		    	// add one to image counter
		    	imgCount++;
		    	
		    	// if all images are loaded, 
		    	// load JSONs and set background image
		    	if ( imgCount == images.length )
	    		{
					gManager.loadJSONs( diccImages[ images[0] ] );
					gBackground.load( diccImages[ images[1] ] );
	    		}
		    };
		    
		    // start loading the Image 
		    // setting src attribute
		 	img.src = images[i];
		}
	}
});

gManager = new ManagerClass();