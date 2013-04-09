ManagerClass = Class.extend({    
	
	finished	: false,
	firstLoad	: true,
	_paused		: true,
	actualLevel : 1,
	lastTime	: 0,
	timeInLevel	: 0,
	updateTimerCounter : 0,
	showFPS		: false,

	setup : function() 
	{
		gGameEngine.setup();
		
		gManager.nextLevel = 1;
		gManager.goNextLevel();
	
		gManager.animate();
		
		gButtons.showBtnPlay();
		
		$('#canvas').fadeIn();
	},
	
	goNextLevel : function(){
		
		gManager.pause();
		gManager.actualLevel = gManager.nextLevel;
		
		$('#canvas').fadeOut(
			400, 
			function(){
				
			if( createScenario( gManager.actualLevel ) )
			{
				gLevelSelector.update( gManager.actualLevel );
				
				$('#canvas').fadeIn( 400, function(){
					
					if(!gManager.firstLoad )
						gManager.resume();
					else
						gManager.firstLoad = false;
						
					gManager.timeInLevel = 0;
				});
			} else {
				
				gLevelSelector.update( gManager.actualLevel );
				
				if(!gManager.firstLoad )
						gManager.resume();
				else
					gManager.firstLoad = false;
						
				gManager.timeInLevel = 0;
			}
		});
	},
	
	completedLevel : function(){
		
		gLevelSelector.updateTimeRecords();
		gManager.nextLevel = parseInt( gManager.actualLevel ) + 1;
	},
	
	changeLevel : function( level ){
		
		world.setDestroy 		= true;
		gManager.nextLevel 	= level;
	},
		
    // Gameloop
    animate : function () {
    	
		gManager.loop();	
      		
      	requestAnimFrame( gManager.animate );
    },

	loop : function()
	{
		// Store the current transformation matrix
		context.save();
		
		// Use the identity matrix while clearing the canvas
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		// Restore the transform
		context.restore();
		
		if( gMap.fullyLoaded && gBackground.fullyLoaded )
		{
    		if( !gManager._paused )
    		{
    			gManager.updateTime();
				world.update();	// world.DebugDraw clears canvas!
    		}
			
			gGameEngine.update();
			
	        var angle = gGameEngine.getEntity("Roller").body.GetAngle();
	        
			context.translate( canvas.width/2, canvas.height/2 );
			context.rotate(	angle );
		
			gBackground.drawBackground();
			gMap.draw( context );
		
	    	// we unrotate context after draw
			context.rotate(	-angle );
			context.translate( -canvas.width/2, -canvas.height/2 );
			
			gGameEngine.draw();
		}	
		
		if( gManager.showFPS )
			updateFPS();
	},
	
	updateTime : function(){
		
		var date 	= new Date();
		var time 	= date.getTime();
		var delay 	= time - gManager.lastTime;
		gManager.timeInLevel += delay;
		
		gManager.updateTimerCounter++;
		
		if( gManager.updateTimerCounter > 5 )
		{
		   	gLevelSelector.updateTime( gManager.timeInLevel );	
			gManager.updateTimerCounter = 0;
		}
		
		gManager.lastTime = time;
	},
	
	pause : function(){
		gManager._paused = true; 
	},
	
	resume : function(){
		
		var date 	= new Date();
		var time 	= date.getTime();
		gManager.lastTime = time;
		
		gManager._paused = false; 
	},

	parseSprite : function( mapJSON, atlasImage ){
		
		var parsedJSON = JSON.parse(mapJSON);
		
		var spritesheet = new SpriteSheetClass();
		spritesheet.load( "images/" + parsedJSON.meta.image, atlasImage );
		spritesheet.parseAtlasDefinition( mapJSON );
	},

	parseLevel : function( mapJSON, id, atlasImage ){
		
		var parsedJSON = JSON.parse(mapJSON);
		
		var level = new LevelClass();
		
		level.load( id, mapJSON, atlasImage );
	}, 
	
	loadJSONs : function( atlasImage ){
		var urls 	= levelURLs.concat( spriteURLs );
		var count 	= 0;
		
		for ( var i = 0; i < urls.length; i++ )
		{
			$.ajax({
			type : 'GET',
			url : urls[i],
			dataType : 'json',
			complete : function( jqXHR, textStatus ){
				
					if( levelURLs.indexOf( this.url ) >= 0 )
					{
						gManager.parseLevel( jqXHR.responseText, levelURLs.indexOf( this.url ) + 1, atlasImage );
					}
					else 
						gManager.parseSprite( jqXHR.responseText, atlasImage );
					
					count++;
					
					if( count == urls.length )
						gManager.setup();
				}
			});
		}
	}, 
	
	loadImages : function(){
		var imgCount = 0;
		var diccImages = {};
		
		for ( var i = 0; i < images.length; i++ )
		{
			var img = new Image();
			diccImages[ images[i] ] = img;
		    
		    img.onload 	= function(){
		    	imgCount++;
		    	
		    	if ( imgCount == images.length )
	    		{
					gManager.loadJSONs( diccImages[ images[0] ] );
					gBackground.load( diccImages[ images[1] ] );
	    		}
		    };
		    
		 	img.src = images[i];
		}
	}
});

gManager = new ManagerClass();