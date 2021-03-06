
/*********************************************
 *	
 * 	A copy of the original Udacity's
 * 	SpriteSheetClass, with modifications on assets loading
 * 
 ************************************************/


var TILEDMapClass = Class.extend({
    // This is where we store the full parsed
    // JSON of the map.json file.
    currMapData: null,

    // tilesets stores each individual tileset
    // from the map.json's 'tilesets' Array.
    // The structure of each entry of this
    // Array is explained below in the
    // parseAtlasDefinition method.
    tilesets: [],

    // This is where we store the width and
    // height of the map in tiles. This is
    // in the 'width' and 'height' fields
    // of map.json, respectively.
    // The values 100 here are just set
    // so these fields are initialized to
    // something, rather than null.
    numXTiles: 15,
    numYTiles: 15,

    // The size of each individual map
    // tile, in pixels. This is in the
    // 'tilewidth' and 'tileheight' fields
    // of map.json, respectively.
    // The values 64 here are just set
    // so these fields are initialized to
    // something, rather than null.
    tileSize: {
        "x": 32,
        "y": 32
    },

    // The size of the entire map,
    // in pixels. This is calculated
    // based on the 'numXTiles', 'numYTiles',
    // and 'tileSize' parameters.
    // The values 64 here are just set
    // so these fields are initialized to
    // something, rather than null.
    pixelSize: {
        "x": 32,
        "y": 32
    },

    // Counter to keep track of how many tile
    // images we have successfully loaded.
    image: null,

    // Boolean flag we set once our tile images
    // has finished loading.
    fullyLoaded: false,

	//--------------- MODIFIED --------------
    // Load the json file at passed as parameter
    // and the imageAtlas related
    //-----------------------------------------
    
    load: function (map, image ) {
    	
    	gMap.image = image;
    	gMap.parseMapJSON(map);
    },

    //-----------------------------------------
    // Parses the map data from 'mapJSON', then
    // stores that data in a number of members
    // of our 'TILEDMapClass' that are defined
    // above.
    parseMapJSON: function (mapJSON) {
    	
    	gMap.imgLoadCount = 0;
    	gMap.fullyLoaded = false;
    	 
        // Call JSON.parse on 'mapJSON' and store
        // the resulting map data
        gMap.currMapData = JSON.parse(mapJSON);

        var map = gMap.currMapData;
      
        // Set 'numXTiles' and 'numYTiles' from the
        // 'width' and 'height' fields of our parsed
        // map data.
        gMap.numXTiles = map.width;
        gMap.numYTiles = map.height;
      
        // Set the 'tileSize.x' and 'tileSize.y' fields
        // from the 'tilewidth' and 'tileheight' fields
        // of our parsed map data.
        gMap.tileSize.x = map.tilewidth;
        gMap.tileSize.y = map.tileheight;
      
        // Set the 'pixelSize.x' and 'pixelSize.y' fields
        // by multiplying the number of tiles in our map
        // by the size of each tile in pixels.
        gMap.pixelSize.x = gMap.numXTiles * gMap.tileSize.x;
        gMap.pixelSize.y = gMap.numYTiles * gMap.tileSize.y;

        // Loop through 'map.tilesets', an Array...
        for(var i = 0; i < map.tilesets.length; i++) {
			
			//------------ MODIFIED ---------
			// we don't need to load images, 
			// as we only have one atlas sheet 
			// and all our objects are contained there
			//--------------------------------
			 
		    gMap.fullyLoaded = true;
                    
            // This is the javascript object we'll create for
            // the 'tilesets' Array above. First, fill in the
            // given fields with the corresponding fields from
            // the 'tilesets' Array in 'currMapData'.
            var ts = {
                "firstgid": gMap.currMapData.tilesets[i].firstgid,

                // 'image' should equal the Image object we
                // just created.

                "image": gMap.image,
                "imageheight": gMap.currMapData.tilesets[i].imageheight,
                "imagewidth": gMap.currMapData.tilesets[i].imagewidth,
                "name": gMap.currMapData.tilesets[i].name,

                // These next two fields are tricky. You'll
                // need to calculate this data from the
                // width and height of the overall image and
                // the size of each individual tile.
                // 
                // Remember: This should be an integer, so you
                // might need to do a bit of manipulation after
                // you calculate it.

                "numXTiles": Math.floor(gMap.currMapData.tilesets[i].imagewidth / gMap.tileSize.x),
                "numYTiles": Math.floor(gMap.currMapData.tilesets[i].imageheight / gMap.tileSize.y)
            };

            // After that, push the newly created object into
            // the 'tilesets' Array above. Javascript Arrays
            // have a handy method called, appropriately, 'push'
            // that does exactly this. It takes the object
            // we'd like to put into the Array as a parameter.
            // 
            gMap.tilesets.push(ts);
        }
    },

    //-----------------------------------------
    // Grabs a tile from our 'layer' data and returns
    // the 'pkt' object for the layer we want to draw.
    // It takes as a parameter 'tileIndex', which is
    // the id of the tile we'd like to draw in our
    // layer data.
    getTilePacket: function (tileIndex) {

        // We define a 'pkt' object that will contain
        // 
        // 1) The Image object of the given tile.
        // 2) The (x,y) values that we want to draw
        //    the tile to in map coordinates.
        var pkt = {
            "img": null,
            "px": 0,
            "py": 0
        };

        // The first thing we need to do is find the
        // appropriate tileset that we want to draw
        // from.
        //
        // Remember, if the tileset's 'firstgid'
        // parameter is less than the 'tileIndex'
        // of the tile we want to draw, then we know
        // that tile is not in the given tileset and
        // we can skip to the next one.
        var tile = 0;
        for(tile = gMap.tilesets.length - 1; tile >= 0; tile--) {
            if(gMap.tilesets[tile].firstgid <= tileIndex) break;
        }

        // Next, we need to set the 'img' parameter
        // in our 'pkt' object to the Image object
        // of the appropriate 'tileset' that we found
        // above.
        pkt.img = gMap.tilesets[tile].image;


        // Finally, we need to calculate the position to
        // draw to based on:
        //
        // 1) The local id of the tile, calculated from the
        //    'tileIndex' of the tile we want to draw and
        //    the 'firstgid' of the tileset we found earlier.
        var localIdx = tileIndex - gMap.tilesets[tile].firstgid;

        // 2) The (x,y) position of the tile in terms of the
        //    number of tiles in our tileset. This is based on
        //    the 'numXTiles' of the given tileset. Note that
        //    'numYTiles' isn't actually needed here. Think about
        //    how the tiles are arranged if you don't see this,
        //    It's a little tricky. You might want to use the 
        //    modulo and division operators here.
        var lTileX = Math.floor(localIdx % gMap.tilesets[tile].numXTiles);
        var lTileY = Math.floor(localIdx / gMap.tilesets[tile].numXTiles);

        // 3) the (x,y) pixel position in our tileset image of the
        //    tile we want to draw. This is based on the tile
        //    position we just calculated and the (x,y) size of
        //    each tile in pixels.
        pkt.px = (lTileX * gMap.tileSize.x);
        pkt.py = (lTileY * gMap.tileSize.y);

        return pkt;
    },

    //-----------------------------------------
    // Draws all of the map data to the passed-in
    // canvas context, 'ctx'.
    draw: function (ctx) {
    	
    	if(!gMap.fullyLoaded) return;
    	
        // ...Now, for every single layer in the 'layers' Array
        // of 'currMapData'...
        for(var layerIdx = 0; layerIdx < gMap.currMapData.layers.length; layerIdx++) {
            // Check if the 'type' of the layer is "tilelayer". If it isn't, we don't
            // care about drawing it...
            if(gMap.currMapData.layers[layerIdx].type != "tilelayer") continue;

            // ...Grab the 'data' Array of the given layer...
            var dat = gMap.currMapData.layers[layerIdx].data;

            // ...For each tileID in the 'data' Array...
            for(var tileIDX = 0; tileIDX < dat.length; tileIDX++) {
                // ...Check if that tileID is 0. Remember, we don't draw
                // draw those, so we can skip processing them...
                var tID = dat[tileIDX];
                if(tID === 0) continue;

                // ...If the tileID is not 0, then we grab the
                // packet data using getTilePacket.
                var tPKT = gMap.getTilePacket(tID);

                // Now we need to calculate the (x,y) position we want to draw
                // to in our game world.
                //
                // We've performed a similar calculation in 'getTilePacket',
                // think about how to calculate this based on the tile id and
                // various tile properties that our TILEDMapClass has.
                //
                var worldX = Math.floor( tileIDX % this.numXTiles ) * this.tileSize.x;
                var worldY = Math.floor( tileIDX / this.numXTiles ) * this.tileSize.x;
                

                // Now, we're finally drawing the map to our canvas! The 'drawImage'
                // method of our 'ctx' object takes nine arguments:
                
                ctx.drawImage( tPKT.img, tPKT.px, tPKT.py, this.tileSize.x, this.tileSize.y, worldX - 240, worldY - 240, this.tileSize.x, this.tileSize.y );
                
            }
        }
    }

});

var gMap = new TILEDMapClass();

