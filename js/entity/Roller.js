RollerClass = EntityClass.extend({
	
	zindex 	: 1,
	body	: null,
	joint : null,
	
	rolySide : 0,
	rolyPieces : 24,
	rolyRadius : 230,
	rolyCenter : null,
	
	polygonShape : null,
	fixtureDef	 : null,
	
	monkeyFixture : null,
	
	tickCounter		: 0,
	frame			: 1,
	maxFrames		: 5,
	
	update 	: function(){
		
		if( gInputEngine.useMouse )
			this.joint.SetMotorSpeed ( ( gInputEngine.mouse.x - ( this.rolyCenter.x * world.scale ) ) / 300 );
			
	},
	
	draw : function(){
		
		this.tickCounter++; 
		
		if( this.tickCounter > 5 )
		{
			if( !gManager._paused)
				this.frame++;
				
			this.tickCounter = 0;
		}
		
		if( this.frame > this.maxFrames )
			this.frame = 1;
		
		
		var bodyPos = this.monkeyFixture.GetAABB().GetCenter();
		var angle 	= this.body.GetAngle();
		    
		var position = {
			x : bodyPos.x * world.scale,
			y : bodyPos.y * world.scale,
		}
		
		context.translate( position.x, position.y );
		context.rotate(	angle );
			
		drawSprite( 'kong_0' + this.frame + '.png', 0, 10 );
		
		context.rotate(	-angle );
		context.translate( - position.x, - position.y );
	},
	
	create	: function(){
		
		this.rolyCenter = new b2Vec2( canvas.width/2, canvas.height/2 );
		
		var centerAngle = 2 * Math.PI / this.rolyPieces;
		this.rolySide = this.rolyRadius * Math.tan ( centerAngle / 2 ) / world.scale;
		this.rolyCenter.Multiply( 1 / world.scale );
	},
	
	createBody : function(){
		
		var bodyDef = new b2BodyDef();
		bodyDef.type= b2Body.b2_dynamicBody;
		bodyDef.position = this.rolyCenter;
		
		this.body = world.b2world.CreateBody( bodyDef );
		
		//////////// set fixtureDef
		this.polygonShape			= new b2PolygonShape();
		this.fixtureDef 			= new b2FixtureDef();
		this.fixtureDef.shape		= this.polygonShape;
		this.fixtureDef.density		= 1;
		this.fixtureDef.restitution	= 0;
		this.fixtureDef.friction	= 1;
		
		////////// set joint
		var containerJoint 			= new b2RevoluteJointDef();
		containerJoint.localAnchorA = new b2Vec2(0,0);
		containerJoint.localAnchorB = this.rolyCenter;
		containerJoint.bodyA		= this.body;
		containerJoint.bodyB		= world.b2world.GetGroundBody();
		containerJoint.enableMotor	= true;
		containerJoint.maxMotorTorque=900000;
		containerJoint.motorSpeed	= 0;
		
		this.joint = world.b2world.CreateJoint( containerJoint );
	},
	
	
	addBox : function ( x, y, w, h, isEnd )
	{	
		this.fixtureDef.isSensor = ( isEnd );
		
		this.polygonShape.SetAsOrientedBox( w, h, new b2Vec2( x - this.rolyCenter.x, y  - this.rolyCenter.y), 0 );
		var fixture = this.body.CreateFixture( this.fixtureDef );
		
		
		if( isEnd )
			this.monkeyFixture = fixture;
	},
})

gGameEngine.factory['Roller'] = RollerClass;