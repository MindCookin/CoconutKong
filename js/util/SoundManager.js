
/*********************************************
 *	
 * 	A copy of the original Udacity's
 * 	SoundManager, with modifications on assets loading
 * 
 ************************************************/

SoundManager = Class.extend({
	
	clips : {},
	
    enabled : true,
    
    _context : null,
    _mainNode : null,
    
	create: function () {
		
		try {
	       	gSM._context = new AudioContext();
		} catch(e){
//			window.alert("Your browser do not support Web Audio, sorry.");
		}
		
		if( gSM._context )
		{
        	gSM._mainNode = gSM._context.createGain();
        	gSM._mainNode.connect( gSM._context.destination );
        }
	},
	
	loadAsync : function( path, callbackFcn ){
		
		if( !gSM._context )
			return false;
		
		if(this.clips[path])
		{
			callbackFcn( this.clips[path].s );
			return this.clips[path].s;
		}
		
		var clip = { s : new Sound(), b : null, l : false };
		this.clips[path] = clip;
		clip.s.path = path;
		
		var request = new XMLHttpRequest();
		request.open("GET", path, true );
		request.responseType = "arraybuffer";
		request.onload = function() {
			
			gSM._context.decodeAudioData( request.response, 
				function ( decodedBuffer ){
					clip.b = decodedBuffer;
					clip.l = true;
					callbackFcn( clip.s );
				},
				function ( error ){
					console.log("Failed to load sound");
				} 
			);
		};
		request.send();
		
		return clip.s;
	},
	
	toggleMute : function(){
		
		if( gSM._context )
        	gSM._mainNode.gain.value = ( gSM._mainNode.gain.value === 0 ) ? 1 : 0;
	},
	
	stopAll: function() {
		
		if( !gSM._context )
			return;
		
		gSM._mainNode.disconnect();
        gSM._mainNode = gSM._context.createGainNode(0);
        gSM._mainNode.connect( gSM._context.destination );
	},
	
	playSound: function (path, settings) {
		
		if( !gSM._context )	return false;
		if (!gSM.enabled) 	return false;
		
		var looping = false;
		var volume = 0.2;
		
		if (settings) {
			if (settings.looping) looping = settings.looping;
			if (settings.volume) volume = settings.volume;
		}
		
		var sd = this.clips[path];
		if (sd === null) return false;
		if (sd.l === false) return false;
		
		var currentClip = null;
		currentClip = gSM._context.createBufferSource();
    currentClip.buffer = sd.b;
		currentClip.loop = looping;
		
		currentClip.connect( gSM._mainNode );
    currentClip.start();

		return true;
	}
});


//----------------------------
Sound = Class.extend({
	path: "",

	play: function(loop) {
        var settings = { looping : loop, volume : 1 };
        gSM.playSound( this.path, settings );
	}
});

//----------------------------
function playSoundInstance(soundpath, loop) {
	
	gSM.loadAsync( soundpath, function( sound ){ 
            sound.play( loop );
    } );
}

var gSM = new SoundManager();
