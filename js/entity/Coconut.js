/*********************************************
 *	
 * Coconut entity
 * 
 * Handles drawing and physics creation  
 * 
 ************************************************/

CoconutClass = EntityClass.extend({
	
	// set zindex, over the top
	zindex 		: 70,
	
	update : function () {
		
	},
	
	/**
	 * overrides Entity's draw function
	 */ 
	draw : function () {
		
		var bodyPos 	= this.body.GetPosition();
		var angle 		= this.body.GetAngle();
		    
		// save body positions in a helper object    
		var position = {
			x : bodyPos.x * world.scale,
			y : bodyPos.y * world.scale,
		}    
		
		// rotate and translate context to draw our Coconut rotated
		context.translate( position.x, position.y );
		context.rotate(	angle );
		
		// draw our sprite, with the context rotated	
		drawSprite( 'coconutA.png', 0, 0 );
		
		//  rotate and translate the context backwards
		context.rotate(	-angle );
		context.translate( - position.x, - position.y );
	},
	
	/**
	 * creates our physics object
	 */ 
	createSphere : function ( pX, pY ) {
		
		// set the Box2D body definition
		var bodyDef 	= new b2BodyDef();
		bodyDef.position.Set(pX,pY);
		bodyDef.type 	= b2Body.b2_dynamicBody;
		bodyDef.bullet 	= true;	// set it as Bullet for continuos collisions
		
		// set the fixture definition for our body
		var circleShape	= new b2CircleShape( 16 / world.scale );	// 16px radius because our map is made of 32px tiles
		var fixtureDef	= new b2FixtureDef();
		fixtureDef.shape= circleShape;
		fixtureDef.density 		= 1;
		fixtureDef.restitution	= 0.5;
		fixtureDef.friction		= 1;
		
		// we create the body in our Box2D world 
		this.body = world.b2world.CreateBody( bodyDef );
		this.body.CreateFixture( fixtureDef );
		
		// play the "Coconut creation" sound
		playSoundInstance("sounds/coconut.mp3", false);
	}
});

// add this class to gGameEngine factory
gGameEngine.factory['Coconut'] = CoconutClass;