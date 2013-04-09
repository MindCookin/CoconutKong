ButtonsClass = Class.extend({
	
	setup : function(){
	
		$('#infoPopup').fadeOut(0);
		$('#finishPopup').fadeOut(0);
//		$('#helpPopup').fadeOut(0);
	
		$('#stateButtons a').click( gButtons.clickHandler )
		$('.btnPlay').click( gButtons.clickHandler )
		$('.btnBackToGame').click( gButtons.clickHandler )
		$('.btnPlayAgain').click( gButtons.clickHandler )
		
		$('.btnPlay').fadeOut();
	},
	
	showBtnPlay : function(){
		$('#helpPopup img').hide( 400, function(){
			$('.btnPlay').fadeIn( 400 );
		});
	},
	
	clickHandler : function(){
		
		switch( $(this).attr("class") )
		{
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
			case "btnUnmute":
				$(this).addClass('btnMute');
				$(this).removeClass('btnUnmute');
				gSM.toggleMute(); 
			break;
			case "btnPause" :
				
				gManager.pause();
				
				$('#canvas').fadeOut( 400 );
				$('#helpPopup').fadeIn( 400, function(){
					
				}); 
				
			break;
			case "btnPlay" 	: 
				
				$('#canvas').fadeIn( 400 );
				$('#helpPopup').fadeOut( 400, function(){
					gManager.resume();	
				});
			break;
			case "btnInfo" 	: 
				
				gManager.pause();
				
				$('#canvas').fadeOut( 400 );
				$('#infoPopup').fadeIn( 400, function(){
					
				}); 
			break;
			case "btnBackToGame" 	: 
				$('#canvas').fadeIn( 400 );
				$('#infoPopup').fadeOut( 400, function(){
					gManager.resume();	
				});
			break;
			case "btnPlayAgain" 	: 
				
				$('#finishPopup').fadeOut( 400, function(){
					gLevelSelector.enableSwitch();
					gManager.changeLevel(1);
				});
			break;
		}
	},
	
	showFinishPopup : function(){
		
		gManager.finished 	= true;
		gManager.pause();
		
		$('#canvas').fadeOut( 400 );
		$('#finishPopup').fadeIn( 400, function(){
			
		});
	}
	
});

var gButtons = new ButtonsClass();
