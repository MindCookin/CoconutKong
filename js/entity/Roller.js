/*********************************************
 *	
 * Coconut entity
 * 
 * Handles drawing and physics creation  
 * 
 ************************************************/

RollerClass = EntityClass.extend({
	
	zindex 	: 1,
	
	// the body joint, to rotate our Roller
	joint : null,
	
	// roller center b2Vec2
	rolyCenter : null,
	
	// body shape 
	polygonShape : null,
	
	// body fixture definition
	fixtureDef	 : null,
	
	// As the Kong is a part of the scenario
	// we add it to our Roller entity 
	// kong fixture definition
	kongFixture : null,
	
	// variables for sprite animation
	tickCounter		: 0,
	frame			: 1,
	maxFrames		: 5,
	
	/**
	 * overrides Entity's update function
	 */  
	update 	: function(){
		
		// if we are playinig in Mouse Mode 
		// we update the Joint speed  
		if( gInputEngine.useMouse )
			this.joint.SetMotorSpeed ( ( gInputEngine.mouse.x - ( this.rolyCenter.x * world.scale ) ) / 300 );
			
	},
	
	/**
	 * overrides Entity's draw function
	 */ 
	draw : function(){
		
		// update tick counter for sprite animation
		this.tickCounter++; 
		
		// set Kong frame
		if( this.tickCounter > 5 )
		{
			if( !gManager._paused)
				this.frame++;
				
			this.tickCounter = 0;
		}
		
		if( this.frame > this.maxFrames )
			this.frame = 1;
		
		// get positions of kong body
		var bodyPos = this.kongFixture.GetAABB().GetCenter();
		
		// get roller angle
		var angle 	= this.body.GetAngle();
		    
		// kong position aux object
		var position = {
			x : bodyPos.x * world.scale,
			y : bodyPos.y * world.scale,
		}
		
		
		// rotate and translate context to draw our Kong rotated
		context.translate( position.x, position.y );
		context.rotate(	angle );
			
		// draw our kong sprite, 
		// and change the frame
		drawSprite( 'kong_0' + this.frame + '.png', 0, 10 );
		
		//  rotate and translate the context backwards
		context.rotate(	-angle );
		context.translate( - position.x, - position.y );
	},
	
	/**
	 * Roller creation function.
	 */ 
	create	: function(){
		
		// set rolyCenter variable
		this.rolyCenter = new b2Vec2( canvas.width/2, canvas.height/2 );
		this.rolyCenter.Multiply( 1 / world.scale );
	},
	
	/**
	 * Whole Roller body creation
	 */ 
	createBody : function(){
		
		// body definition
		var bodyDef = new b2BodyDef();
		bodyDef.type= b2Body.b2_dynamicBody;
		bodyDef.position = this.rolyCenter; // we locate the body at the center
		
		// create body
		this.body = world.b2world.CreateBody( bodyDef );
		
		//set fixture definitions
		this.polygonShape			= new b2PolygonShape();
		this.fixtureDef 			= new b2FixtureDef();
		this.fixtureDef.shape		= this.polygonShape;
		this.fixtureDef.density		= 1;
		this.fixtureDef.restitution	= 0;
		this.fixtureDef.friction	= 1;
		
		// set our RevoluteJoint, 
		// it will handle the rotation 
		// of the whole Roller body
		var containerJoint 			= new b2RevoluteJointDef();
		containerJoint.localAnchorA = new b2Vec2(0,0);
		containerJoint.localAnchorB = this.rolyCenter;
		containerJoint.bodyA		= this.body;
		containerJoint.bodyB		= world.b2world.GetGroundBody();
		
		// set our motor capabilities
		containerJoint.enableMotor	= true;
		containerJoint.maxMotorTorque=900000;
		containerJoint.motorSpeed	= 0;
		
		// add the joint to our world
		this.joint = world.b2world.CreateJoint( containerJoint );
	},
	
	/**
	 * Add boxes bodies
	 * 
	 * @param{int} x
	 * @param{int} y
	 * @param{int} w
	 * @param{int} h
	 * @param{Boolean} isEnd
	 * 
	 */ 
	addBox : function ( x, y, w, h, isEnd )
	{	
		// if isEnd is true, it means this is the Kong. 
		// Kong needs to be a Sensor 
		// to advice us collsions with Coconut 
		// (see World.beginContactHandler )
		this.fixtureDef.isSensor = ( isEnd );
		
		// create our box 
		// we simply add a fixture to the Roller body
		// don't need to create a body for each box
		this.polygonShape.SetAsOrientedBox( w, h, new b2Vec2( x - this.rolyCenter.x, y  - this.rolyCenter.y), 0 );
		var fixture = this.body.CreateFixture( this.fixtureDef );
		
		// if isEnd it means this is the Kong, 
		// so this fixture is kongFixture
		if( isEnd )
			this.kongFixture = fixture;
	},
})

// add this class to gGameEngine factory
gGameEngine.factory['Roller'] = RollerClass;