InputEngineClass = Class.extend({

	mouse: {
		x: 0,
		y: 0
	},

	//-----------------------------
	setup: function () {
		document.getElementById('canvas').addEventListener('mousemove', gInputEngine.onMouseMove);
	},

	//-----------------------------
	onMouseMove: function (event) {
		
    	var rect = canvas.getBoundingClientRect();
    	gInputEngine.mouse.x = event.clientX - rect.left;
    	gInputEngine.mouse.y = event.clientY - rect.top;
//		gInputEngine.mouse.x = event.clientX;
//		gInputEngine.mouse.y = event.clientY;
	}
});

gInputEngine = new InputEngineClass();

