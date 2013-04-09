WorldClass = Class.extend({
	
	b2world : null,
	scale	: 30.0,
	
	destructionListener : 	null,
	contactListener : 		null,
	
	setDestroy		: false,
	
	createWorld : function() 
	{
        this.b2world 				= new b2World( new b2Vec2(0, 10), false );
        this.destructionListener 	= new Box2D.Dynamics.b2DestructionListener;
        this.contactListener 		= new Box2D.Dynamics.b2ContactListener;
        
        var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite( context );
		debugDraw.SetDrawScale( this.scale );
		debugDraw.SetFillAlpha( 0.5 );
		debugDraw.SetLineThickness( 1.0 );
		debugDraw.SetFlags( b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit );
		this.b2world.SetDebugDraw( debugDraw );
		
		this.contactListener.BeginContact 			= this.beginContactHandler;
		this.destructionListener.SayGoodbyeFixture	= this.fixtureGoodbyeHandler;
		
		this.b2world.SetDestructionListener( this.destructionListener );
		this.b2world.SetContactListener( this.contactListener );
	},
	
	update : function () {
        
        this.b2world.Step( 1/30, 10, 10);
//		this.b2world.DrawDebugData();
		this.b2world.ClearForces();
		
		if( this.setDestroy )
		{
  			world.destroy();
  			
  			if( world.b2world.GetBodyCount() == 0 )
  			{
  				world.setDestroy = false;	
  				gManager.goNextLevel();	
  			}
		}
  	},
  	
  	beginContactHandler : function( contact ){
  		
  		if( contact.IsSensor() )
  		{
  			gManager.completedLevel();
  			world.setDestroy = true;
  			
			playSoundInstance("sounds/win.mp3", false);	
  		}
  	},
  	
  	fixtureGoodbyeHandler : function( fixture ){
//  		console.log( "fixtureGoodbyeHandler", world.b2world.GetBodyCount() );
  	},
  	
  	destroy : function(){
  		
	  	for ( var joint = this.b2world.GetJointList(); joint; joint = joint.GetNext() )
  			this.b2world.DestroyJoint( joint );
  			
  		for ( var body = this.b2world.GetBodyList(); body; body = body.GetNext() )
  			this.b2world.DestroyBody( body );
  	}
});
