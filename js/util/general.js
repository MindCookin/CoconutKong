
/***********************************
 * 	Animation Frame
 *************************************/

window.requestAnimFrame = (function () {
  return  window.requestAnimationFrame        ||
          window.webkitRequestAnimationFrame  ||
          window.mozRequestAnimationFrame     ||
          window.oRequestAnimationFrame       ||
          window.msRequestAnimationFrame      ||
          function ( /* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
          };
})();

/***********************************
 * 	Frames per second  
 *************************************/

var fps = 0, now, lastUpdate = (new Date)*1 - 1;

// The higher this value, the less the FPS will be affected by quick changes
// Setting this to 1 will show you the FPS of the last sampled frame only
var fpsFilter = 50;

function setFPS(){
	/// fps
	var fpsOut = document.getElementById('fps');
		
	setInterval(function(){
		  fpsOut.innerHTML = fps.toFixed(1) + "fps";
	}, 1000);
}

function updateFPS(){
  // ... draw the frame ...

  var thisFrameFPS = 1000 / ((now=new Date) - lastUpdate);
  fps += (thisFrameFPS - fps) / fpsFilter;
  lastUpdate = now;
}

/***********************************
 * 	Canvas centerer
 *************************************/

function centerCanvas(){

  	$('#canvas').css({
  		position:'absolute',
   		left: ( $(window).width()- $('#canvas').outerWidth())/2,
   		top: ($(window).height() - $('#canvas').outerHeight())/2
  	});
}


/************************************
 *	Mouse detector
 * ************************************/
 function isMouseEventSupported(eventName) {
    var el = document.createElement('div');
    eventName = 'on' + eventName;
    var isSupported = (eventName in el);
    if (!isSupported) {
      el.setAttribute(eventName, 'return;');
      isSupported = typeof el[eventName] == 'function';
    }
    el = null;
    return isSupported;
  }
