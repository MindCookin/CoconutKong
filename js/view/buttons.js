
/*********************************************
 *	
 * ButtonsClass is used to handle 
 * all button events from all our views, specially popups
 * 
 ************************************************/

ButtonsClass = Class.extend({
	
	/**
	 *	Initializer for all our event handlers  
	 */
	setup : function(){
	
		$('#infoPopup').fadeOut(0);
		$('#finishPopup').fadeOut(0);
//		$('#helpPopup').fadeOut(0);
	
		$('#stateButtons a').click( gButtons.clickHandler )
		$('.btnPlayMouse').click( gButtons.clickHandler )
		$('.btnPlayOrientation').click( gButtons.clickHandler )
		$('.btnBackToGame').click( gButtons.clickHandler )
		$('.btnPlayAgain').click( gButtons.clickHandler )
		
		$('#mouseGameplay').fadeOut();
		$('#orientationGameplay').fadeOut();
	},
	
	/**
	 *	Shows Play button 
	 * 	called when all our assets are loaded
	 */
	showBtnPlay : function(){
		
		// jQuery effects
		$('#helpPopup img').hide( 400, function(){
			
			$('#mouseGameplay').fadeIn( 400 );
			$('#orientationGameplay').fadeIn( 400 );
			
			// Check if we can play on tilt mode
			if( !gInputEngine.orientationSupport )
			{
				$('#orientationGameplay').html('<p class="red">TILT MODE is not supported on this device or browser.</p>');
			} 
			
			// Check if we can play on mouse mode
			if( !gInputEngine.mouseSupport )
			{
				$('#mouseGameplay').html('<p class="red">MOUSE MODE is not supported on this device or browser.</p>');
			}
		});
	},
	
	/**
	 *	Click/touch event handler
	 */
	clickHandler : function(){
		
		
		// swith over the currentTarget's class name 
		// to perform an action  
		switch( $(this).attr("class") )
		{
			// switch to unmuted mode, 
			// if Web Audio is supported
			case "btnMute" 	:
			
				if( gSM._context )
				{
					$(this).removeClass('btnMute');
					$(this).addClass('btnUnmute');
					gSM.toggleMute();
				} else {
					alert('Web Audio is not supported in this browser. \nPlease try Coconut Kong in Chrome or Safari 6.');
				}
				
			break;
			
			// switch to muted mode, 
			// only called if Web Audio is supported
			// as if not this button's class name won't exist
			case "btnUnmute":
				$(this).addClass('btnMute');
				$(this).removeClass('btnUnmute');
				gSM.toggleMute(); 
			break;
			
			// pause the game
			case "btnPause" :
				
				gManager.pause();
				
				$('#canvas').fadeOut( 400 );
				$('#helpPopup').fadeIn( 400, function(){
					
				}); 
				
			break;
			
			// play the game on Tilt Mode
			case "btnPlayOrientation" 	:
			
				if( gInputEngine.orientationSupport )
				{
					gInputEngine.useMouse 		= false;
					gInputEngine.useOrientation = true;
					
					// prevent the game from switching over gametypes bugs
					world.resetRotations();
					
					$('#canvas').fadeIn( 400 );
					$('#helpPopup').fadeOut( 400, function(){
						gManager.resume();	
					});
				}
				 
			break;
			
			// play the game on Mouse Mode
			case "btnPlayMouse" 	: 
				
				gInputEngine.useMouse 		= true;
				gInputEngine.useOrientation = false;
				
				// prevent the game from switching over gametypes bugs
				world.resetGravity();
				
				$('#canvas').fadeIn( 400 );
				$('#helpPopup').fadeOut( 400, function(){
					gManager.resume();	
				});
			break;
			
			// show info popup
			case "btnInfo" 	: 
				
				gManager.pause();
				
				$('#canvas').fadeOut( 400 );
				$('#infoPopup').fadeIn( 400, function(){
					
				}); 
			break;
			
			// go back from info popup
			case "btnBackToGame" 	: 
				$('#canvas').fadeIn( 400 );
				$('#infoPopup').fadeOut( 400, function(){
					gManager.resume();	
				});
			break;
			
			// plays the game when 
			// the user has completed the whole levels
			case "btnPlayAgain" 	: 
				
				$('#finishPopup').fadeOut( 400, function(){
					
					// enables level switching
					gLevelSelector.enableSwitch();
					
					// go to first level
					gManager.changeLevel(1);
				});
			break;
		}
		
		// prevent anchor navigation
		return false;
	},
	
	
	// shows finish popup
	// the only popup opened without 
	// a mouse event
	showFinishPopup : function(){
		
		gManager.finished 	= true;
		gManager.pause();
		
		$('#canvas').fadeOut( 400 );
		$('#finishPopup').fadeIn( 400, function(){
			
		});
	}
	
});

var gButtons = new ButtonsClass();
