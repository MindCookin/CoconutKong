
/*********************************************
 *	
 * LevelClass handles Level changes, 
 * and contains references to all the levels.
 * 
 * Ensures scenario creation.
 * 
 ************************************************/

// Object types used as constants 
// for TiledMap objects
var END 		= "end";
var PLAYER		= "player";
var PLATFORM	= "platform";

// gLevels['ID'] 
//
// Will return the LevelClass object associated
// to that ID, assuming that it exists.
var gLevels = {};

LevelClass = Class.extend({

	// the unique ID for this level
	id: 0,
	
	// the JSON map
	mapJSON : null,
	
	// our atlas image
	atlasImage : null,
	
	// our physics objects
	mappedObjects: [],

	/**
	 * Loads our level
	 * 
 	 * @param {id} int
 	 * @param {JSON} mapData
 	 * @param {Image} image
	 */ 
	load: function ( id, mapData, image ) {

        this.id = id;
		this.mapJSON = mapData;
		this.atlasImage = image;

		gLevels[ id ] = this;
	},

	/**
	 * Used to parse our JSON atlas
	 * 
 	 * @param {JSON} atlasJSON 
	 */
	parseAtlasDefinition: function ( atlasJSON ) {

		var key, object, layer, tileset;
        var parsed = JSON.parse(atlasJSON);

		// we iterate through our objects and layers
		// and set our physics objects 
		for( key in parsed.layers) {
			
			layer = parsed.layers[key];
			
			if ( layer && layer.visible )
			{
				// object groups for collision
				if( layer.type === "objectgroup" )
				{
					for( var i in layer.objects )
					{
						object = layer.objects[i];
						
						// we create a new object
						if( object.type && object.visible )
							this.defObject( object.type, object.x, object.y, object.width, object.height, object.ellipse );
					}	
				}
			}
		}
	},
	
	/**
	 * This function creates an object 
	 * and adds it to our mappedObjects array
	 * 
 	 * @param {String} id
 	 * @param {int} x
 	 * @param {int} y
 	 * @param {int} w
 	 * @param {int} h
 	 * @param {Boolean} ellipse 
	 */
	defObject : function ( type, x, y, w, h, ellipse ){
		
		var object = {
			"type": type,
			"x": x + w / 2,
			"y": y + h / 2,
			"w": w / 2,
			"h": h / 2,
			"ellipse" : ellipse
		};

		// add our object to the mappedObjects array
		this.mappedObjects.push( object );
	}
});

/**
 * Global function used to create the entire scenario, both graphics and physics. 
 *   
 * @param {uint} id
 */
function createScenario( id )
{
	// Hack for no existing id 
	// ( same as "Player has finished the game")
	if( !gLevels[ id ] )
	{
		// if the player has not finished yet
		// we show him a Kongratulations popup
		if( !gManager.finished)
		{
			gButtons.showFinishPopup();
			return false;
		}
		// else, we restart from level 1
		else
		{
			gManager.actualLevel = 1;
			id = 1;
		}
	}
	
	// if we have not loaded the map objects yet, 
	// we load them into our mappedObjects array
	if( gLevels[ id ].mappedObjects.length == 0 )
		gLevels[ id ].parseAtlasDefinition( gLevels[ id ].mapJSON );
	
	// load the map graphics
    gMap.load( gLevels[ id ].mapJSON, gLevels[ id ].atlasImage );
    
    // restart our main entity ( Roller )
    gGameEngine.getEntity('Roller').createBody();
	
	// we create the physics objects
	var sceneObjects = gLevels[ id ].mappedObjects;
	for ( var key in sceneObjects )
		__createObject( sceneObjects[key] );
		
	return true;
}

/**
 * Private function used to create 
 * our physics objects, related  
 *   
 * @param {Object} objectMapped
 */
function __createObject( objectMapped )
{
	// offset for centering in the canvas
	var offsetX = (canvas.width - gMap.pixelSize.x) / 2;	
	var offsetY = (canvas.height - gMap.pixelSize.y) / 2;
	
	// aux object for final positions	
	var aux = {
		x : ( objectMapped.x + offsetX ) / world.scale,
		y : ( objectMapped.y + offsetY ) / world.scale,
		w : objectMapped.w / world.scale,
		h : objectMapped.h / world.scale
	};
	
	// switch between our entities
	// depending on objectMapped type
	switch( objectMapped.type )
	{ 
		case END			: gGameEngine.getEntity('Roller').addBox( aux.x, aux.y, aux.w, aux.h, true );		break;
		case PLAYER			: gGameEngine.getEntity('Coconut').createSphere( aux.x, aux.y );						break;
		case PLATFORM 		: gGameEngine.getEntity('Roller').addBox( aux.x, aux.y, aux.w, aux.h, false );		break;
	}
}