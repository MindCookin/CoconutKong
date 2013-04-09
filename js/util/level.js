/// object types
 var END 		= "end";
 var PLAYER		= "player";
 var PLATFORM	= "platform";

// gLevels['LEVEL_URL'] 
//
// would return the LevelClass object associated
// to that ID, assuming that it exists.
var gLevels = {};

//-----------------------------------------
LevelClass = Class.extend({

    // The URL path that we grabbed our map
    // from.
	id: 0,
	
	// JSON map to load Map
	mapJSON : null,
	
	atlasImage : null,
	
    // An array of all the mappedObjects in our map.
	mappedObjects: [],
	
    // An array of all the entities in our map.
	entities: [],
	
	//-----------------------------------------
	init: function () {},

	//-----------------------------------------
	load: function ( id, mapData, image ) {
		// Store the URL of the spritesheet we want.
        this.id = id;
		this.mapJSON = mapData;
		this.atlasImage = image;

        // Store this LevelClass in our global
        // dictionary gLevels defined above.
		gLevels[ id ] = this;
	},

	//-----------------------------------------
    // Parse the JSON file passed in as 'atlasJSON'
    // that is associated to this map.
	parseAtlasDefinition: function ( atlasJSON ) {
        // Parse the input 'atlasJSON' using the
        // JSON.parse method and store it in a
        // variable.

		var key, object, layer, tileset;
        var parsed = JSON.parse(atlasJSON);
        
        /*
		for( key in parsed.tilesets) {
			
			tileset = parsed.tilesets[ key ];
			
			this.defTileSet( tileset.firstgid, tileset.image, tileset.imageheight, tileset.imagewidth, tileset.tileheight, tileset.tilewidth );
		}*/

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
						
						if( object.type && object.visible )
							this.defObject( object.type, object.x, object.y, object.width, object.height, object.ellipse );
					}	
				}
	/*			
				if ( layer.type === "tilelayer")
				{
					this.defTileLayer( layer.name, layer.x, layer.y, layer.width, layer.height, layer.data );
				}
	*/		}
		}
	},
	
	defObject : function ( type, x, y, w, h, ellipse ){
		
		var object = {
			"type": type,
			"x": x + w / 2,
			"y": y + h / 2,
			"w": w / 2,
			"h": h / 2,
			"ellipse" : ellipse
		};

        // We push this new object into
        // our array of mappedObjects,
        // at the end of the array.
		this.mappedObjects.push( object );
	}, 
	
	defTileLayer : function ( name, x, y, h, w, data )
	{
		
	}, 
	
	defTileSet : function ( firstgid, image, imageheight, imagewidth, tileheight, tilewidth )
	{
		
	}
});

function createScenario( id )
{
	if( !gLevels[ id ] )
	{
		if( !gManager.finished)
		{
			gButtons.showFinishPopup();
			return false;
		}
		else
		{
			gManager.actualLevel = 1;
			id = 1;
		}
	}
	
	if( gLevels[ id ].mappedObjects.length == 0 )
		gLevels[ id ].parseAtlasDefinition( gLevels[ id ].mapJSON );
	
    gMap.load( gLevels[ id ].mapJSON, gLevels[ id ].atlasImage );
    gGameEngine.getEntity('Roller').createBody();
	
	var sceneObjects = gLevels[ id ].mappedObjects;
	for ( var key in sceneObjects )
		__createObject( sceneObjects[key] );
		
	return true;
}

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
	
	switch( objectMapped.type )
	{ 
		case END			: gGameEngine.getEntity('Roller').addBox( aux.x, aux.y, aux.w, aux.h, true );		break;
		case PLAYER			: gGameEngine.getEntity('Player').createSphere( aux.x, aux.y );						break;
		case PLATFORM 		: gGameEngine.getEntity('Roller').addBox( aux.x, aux.y, aux.w, aux.h, false );		break;
	}
}