GameEngineClass = Class.extend({

	entities: [],
    factory: {},
    dictionary: {},

	//-----------------------------
	setup: function () {
		
		gInputEngine.setup();
		
		gGameEngine.spawnEntity('Roller');
		gGameEngine.spawnEntity('Player');

		gGameEngine.getEntity('Roller').create();
	},

    spawnEntity: function (typename) {
        
        var ent = new (gGameEngine.factory[typename])();

        gGameEngine.entities.push(ent);
        gGameEngine.dictionary[ typename ] = ent;

        return ent;
    },
    
    getEntity : function( typename){
    	return  gGameEngine.dictionary[ typename ];
    },

    update: function () {
    	
        gGameEngine.entities.forEach(function(entity) {
            entity.update();
        });

    },

    //-----------------------------
    draw: function () {
        // Draw map. Note that we're passing a canvas context
        // of 'null' in. This would normally be our game context,
        // but we don't need to grade this here.
        
        // Bucket entities by zIndex
        var zIndex_array = [];
        
        gGameEngine.entities.forEach(function(entity) {
        	zIndex_array[ entity.zindex ] = entity;
        });

        // Draw entities sorted by zIndex
        for ( var i = 0; i < zIndex_array.length; i++ )
        	if( zIndex_array[i] )
            	zIndex_array[i].draw();
    }
});

gGameEngine = new GameEngineClass();

