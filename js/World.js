
/*********************************************
 *	
 * WorldClass handles Box2D environment  
 * 
 ************************************************/


WorldClass = Class.extend({
	
	// my b2world
	b2world : null,
	
	// the world's scale
	scale	: 30.0,
	
	// listeners
	destructionListener : 	null,
	contactListener : 		null,
	
	// flag to destroy items
	setDestroy		: false,
	
	createWorld : function() 
	{
		// initialize world and listeners
        this.b2world 				= new b2World( new b2Vec2(0, 10), false );
        this.destructionListener 	= new Box2D.Dynamics.b2DestructionListener;
        this.contactListener 		= new Box2D.Dynamics.b2ContactListener;
        
        // sinitialize debugDraw
        var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite( context );
		debugDraw.SetDrawScale( this.scale );
		debugDraw.SetFillAlpha( 0.5 );
		debugDraw.SetLineThickness( 1.0 );
		debugDraw.SetFlags( b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit );
		this.b2world.SetDebugDraw( debugDraw );
		
		// set listeners
		this.contactListener.BeginContact 			= this.beginContactHandler;
		this.destructionListener.SayGoodbyeFixture	= this.fixtureGoodbyeHandler;
		
		this.b2world.SetDestructionListener( this.destructionListener );
		this.b2world.SetContactListener( this.contactListener );
	},
	
	/**
	 *	reset gravity to initial values,
	 *  to handle game mode switch 
	 *  from tilt mode to mouse mode 
	 */
	resetGravity : function(){
		this.b2world.SetGravity( new b2Vec2( 0, 10 ) );
	},
	
	/**
	 *	reset gravity to initial values,
	 *  to handle game mode switch 
	 *  from mouse mode to tilt mode  
	 */
	resetRotations : function(){

	  	for ( var joint = this.b2world.GetJointList(); joint; joint = joint.GetNext() )
  			joint.SetMotorSpeed(0);
  			
  		for ( var body = this.b2world.GetBodyList(); body; body = body.GetNext() )
  			body.SetAngle(0);
	},
	
	/** 
	 * update b2world 
	 */
	update : function () {
		
		
		// if use orientation we change gravity
		if( gInputEngine.useOrientation )
			this.b2world.SetGravity( new b2Vec2( gInputEngine.orientationPosition.x, gInputEngine.orientationPosition.y ) );
        
        // update world step
        this.b2world.Step( 1/30, 10, 10);
//		this.b2world.DrawDebugData();
		this.b2world.ClearForces();
		
		// check if it's time to destroy the world
		// muahahahahahaha!
		if( this.setDestroy )
		{
			// destroy it
  			world.destroy();
  			
  			// hack to check if our destruction
  			// has been completed, sometimes 
  			// it is not inmediate
  			if( world.b2world.GetBodyCount() == 0 )
  			{
  				world.setDestroy = false;	
  				gManager.goNextLevel();	
  			}
		}
  	},
  	/**
  	 * Contact Listener
 	 * @param {b2Contact} contact
  	 */
  	beginContactHandler : function( contact ){
  		
  		// if is sensor then we have collide with the Kong
  		if( contact.IsSensor() )
  		{
  			// this means we have completed the level
  			gManager.completedLevel();
  			world.setDestroy = true;
  			
  			// play the nifty sound
			playSoundInstance("sounds/win.mp3", false);	
  		}
  	},
  	/**
  	 * Fixture destruction listener,
  	 * only for debugging purposes
 	 * @param {Object} fixture
  	 */
  	fixtureGoodbyeHandler : function( fixture ){
//  		console.log( "fixtureGoodbyeHandler", world.b2world.GetBodyCount() );
  	},
  	
  	/**
  	 * The Destruction function  
  	 */
  	destroy : function(){
  		
  		// iterate through our joints 
  		// and destroy all of them
	  	for ( var joint = this.b2world.GetJointList(); joint; joint = joint.GetNext() )
  			this.b2world.DestroyJoint( joint );
  			
  		// iterate through our bodies
  		// and destroy all of them
  		for ( var body = this.b2world.GetBodyList(); body; body = body.GetNext() )
  			this.b2world.DestroyBody( body );
  	}
});
