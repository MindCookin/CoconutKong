PlayerClass = EntityClass.extend({

	body		: null,
	zindex 		: 70,
	
	update : function () {
		
	},
	
	draw : function () {
		
		var bodyPos 	= this.body.GetPosition();
		var angle 		= this.body.GetAngle();
		    
		var position = {
			x : bodyPos.x * world.scale,
			y : bodyPos.y * world.scale,
		}    
		
		context.translate( position.x, position.y );
		context.rotate(	angle );
			
		drawSprite( 'coconutA.png', 0, 0 );
//		drawSprite( 'coconutB.png', 0, 0 );
		
		context.rotate(	-angle );
		context.translate( - position.x, - position.y );
	},
	
	createSphere : function ( pX, pY ) {
		
		var bodyDef 	= new b2BodyDef();
		bodyDef.position.Set(pX,pY);
		bodyDef.type 	= b2Body.b2_dynamicBody;
		bodyDef.bullet 	= true;
		
		var circleShape	= new b2CircleShape( 16 / world.scale );
		var fixtureDef	= new b2FixtureDef();
		fixtureDef.shape= circleShape;
		fixtureDef.density 		= 1;
		fixtureDef.restitution	= 0.5;
		fixtureDef.friction		= 1;
		
		this.body = world.b2world.CreateBody( bodyDef );
		this.body.CreateFixture( fixtureDef );
		
		playSoundInstance("sounds/coconut.mp3", false);
	}
});

gGameEngine.factory['Player'] = PlayerClass;