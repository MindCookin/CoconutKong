// create box2D definitions
 var   	b2Vec2 		= Box2D.Common.Math.b2Vec2
    ,  	b2AABB 		= Box2D.Collision.b2AABB
 	,	b2BodyDef 	= Box2D.Dynamics.b2BodyDef
 	,	b2Body 		= Box2D.Dynamics.b2Body
 	,	b2FixtureDef= Box2D.Dynamics.b2FixtureDef
 	,	b2Fixture 	= Box2D.Dynamics.b2Fixture
 	,	b2World 	= Box2D.Dynamics.b2World
 	,	b2MassData 	= Box2D.Collision.Shapes.b2MassData
 	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
 	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
 	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    ,  	b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
    ,	b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
    ,	b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef
    ;
    
    // create our global variables
    var images		= [ 'images/atlas.png', 'images/earth_circle.png' ];
    var levelURLs	= [ 'data/level1.json', 'data/level2.json', 'data/level3.json', 'data/level4.json', 'data/level7.json', 'data/level6.json', 'data/level9.json', 'data/level8.json', 'data/level5.json', 'data/level10.json' ];
    var spriteURLs	= [ 'data/atlas.json' ];

	var canvas 	= null;
	var context = null;
	var body 	= null;

	var world	= new WorldClass();

$(document).ready(function(){
	
	$('#canvas').fadeOut(0);
	
	$("body").queryLoader2( { 
		backgroundColor : "#7ec122", 
		barColor : '#000000', 
		barHeight : '20', 
		minimumTime : 1000,
        completeAnimation: "grow",
		onComplete : gManager.loadImages 
	} );
	
	body 	= document.getElementById('body');
	canvas 	= document.getElementById('canvas');

	
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	
	context = canvas.getContext("2d"); // Grab the 2d canvas context
	// Note: The above code is a workaround for IE 8and lower. Otherwise we could have used:
	//     context = document.getElementById('canvas').getContext("2d");
	
	world.createWorld();

	gButtons.setup();
	gLevelSelector.setup();		

	if( gManager.showFPS )
	{
		setFPS()
		updateFPS();
	} else {
		$('#fps').hide();
	}
		
	gSM.create();
	playSoundInstance("sounds/background.mp3", true);
//	$(window).resize( centerCanvas ); 
});


