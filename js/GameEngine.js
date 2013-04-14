
/*********************************************
 *	
 * Based on GameEngineClass from Udacitiy
 * 
 ************************************************/

GameEngineClass = Class.extend({

	// entities array
	entities: [],
	
	// factory of entities
    factory: {},
    
    // dictionary of types for entities
    dictionary: {},

	/**
	 * Initialization function 
	 */
	setup: function () {
		
		// create new entities objects 
		// and update dictionary
		gGameEngine.spawnEntity('Roller');
		gGameEngine.spawnEntity('Coconut');

		// call to create Roller method
		gGameEngine.getEntity('Roller').create();
	},

	/**
	 * create a new entity object
	 * and adds it to the dictionary
 	 * @param {String} typename
	 */
    spawnEntity: function (typename) {
        
        var ent = new (gGameEngine.factory[typename])();

        gGameEngine.entities.push(ent);
        gGameEngine.dictionary[ typename ] = ent;

        return ent;
    },
    /**
     * get the entity from its typename 
 	 * @param {Object} typename
     */
    getEntity : function( typename){
    	return  gGameEngine.dictionary[ typename ];
    },

	/**
	 * update all entities in the factory 
	 */
    update: function () {
    	
        gGameEngine.entities.forEach(function(entity) {
            entity.update();
        });

    },

	/**
	 * draw all entities in the factory 
	 */
    draw: function () {
        
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