
/*********************************************
 *	
 * LevelSelectorClass is used to handle 
 * the sidebar level selector
 * 
 ************************************************/

LevelSelectorClass = Class.extend ({
	
	// reference to the actualLevel
	actualLevel : 0,
	
	// dictionary that stores time per level
	timeLevel	: {},
	
	// dictionary that stores records-time per level
	timeRecords	: {},
	
	// jQuery DOM ul list
	list 		: null,
	
	// reference to the last level
	// the user has reached
	maxLevel 	: 0,
	
	// reference to timer DOM object
	timer		: null,
	
	
	/**
	 *	Initilization function 
	 */
	setup : function()
	{
		// hide timer
		$("#levelsList span.timer").hide();
		
		//set list variable
		gLevelSelector.list = $("#levelsList");
		
		// set our dictionaries to 
		// its initial values
		for ( var i = 1; i <= levelURLs.length; i++ )
		{
			gLevelSelector.timeLevel[ i ] 	= 0;
			gLevelSelector.timeRecords[ i ] = Number.MAX_VALUE;
		} 
	},
	
	/**
	 *
	 * Handles Level passing,
	 * it rearrange the list items
	 * and set the new max level
	 * 
 	 * @param {int} levelId
	 */
	update : function( levelId ){
		
		// set our maxLevel, 
		// if it's superior than the last mxLevel
		if( gLevelSelector.maxLevel < levelId )
			gLevelSelector.maxLevel = levelId;
		
		// set actualLevel as the level passed by parameter
		gLevelSelector.actualLevel = levelId;
		
		// iterates through the list 
		// to change the pertinent classes
		// and set timer
		gLevelSelector.list.children().each( function( index ) {
			
			// increments the index by one 
			// to be related with the levels values 
			index++;
			
			if( index == levelId )	// if this is the li for this level...
			{
				// remove other classes and set this
				// li as active 
				$(this).removeClass('passed');
				$(this).addClass('active');
				
				// show timer on this li
				$(this).children('span.timer').show( 500 );
				
				// set gLevelSelector.timer as this timer
				gLevelSelector.timer = $("#levelsList .active span.timer");
			}	
			else if( index < gLevelSelector.maxLevel ) 	// if this level has been passed...
			{
				
				// remove other classes and set this
				// li as passed
				$(this).removeClass('active');
				$(this).addClass('passed');
				
				// hide this li's timer
				$(this).children('span.timer').hide( 500 );
				
			} else 	// we haven't reach this level yet
			{
				// remove all classes
				$(this).removeClass('passed');
				$(this).removeClass('active');
			}
		});
	},
	/**
	 * Click Event handler
	 * just used when switching mode is enabled
	 */
	clickHandler : function( ){
		
		// get the level from "href" attribute
		var lvl = $(this).attr('href').substr(1, 2);
		
		// change the game level
		gManager.changeLevel( lvl );
		
		// prevent anchor navigation
		return false;
	},
	/**
	 *	Enable switch level mode 
	 */
	enableSwitch : function(){
		
		// add click listener
		$("#levelsList a").click( gLevelSelector.clickHandler );
		
		// add completed class ( for CSS )
		$("#levelsList a").addClass('completed');
	}, 
	/**
	 * update our time text
 	 * @param {int} time
	 */
	updateTime : function( time ){
		
		// get the text parsed
		var text =  gLevelSelector.parseTime( time );
		
		// set the text of the timer DOM
		gLevelSelector.timer.text( text );
		
		// update this level time dictionaries
		gLevelSelector.updateTimeLevel( time );
	}, 
	/**
	 * update this level dictionary 
 	 * @param {int} time
	 */
	updateTimeLevel  :function( time ){
		gLevelSelector.timeLevel[ gLevelSelector.actualLevel ] = time;
	},
	/**
	 * update records dictionary 
	 */
	updateTimeRecords : function(){
		
		// get the level ID
		var levelId = gLevelSelector.actualLevel;
		
		// check if we have achieved a new record
		// if so, we change the records dictionary value
		if ( gLevelSelector.timeRecords[ levelId ] > gLevelSelector.timeLevel[ levelId ] )
			gLevelSelector.timeRecords[ levelId ] = gLevelSelector.timeLevel[ levelId ];
		
		// parse this level time
		var text = gLevelSelector.parseTime( gLevelSelector.timeRecords[ levelId ] );
		
		// set the active element text with the new time values
		$("#levelsList .active a").text( text );
		$("#levelsList .active a").addClass('passed');
		$("#levelsList .active a").removeClass('active');
	},
	/**
	 * helper to convert int miliseconds 
	 * to minutes, seconds and decimals 
	 * and return it as String
 	 * @param {int} time
	 */
	parseTime : function( time ){
		var totalDecims 	= Math.floor( time / 10 );
		var totalSeconds 	= Math.floor( time / 1000 );
		var totalMinutes 	= Math.floor( totalSeconds / 60 );
		var remainingSeconds = totalSeconds - ( totalMinutes * 60 );
		var remainingDecims  = totalDecims -  ( totalSeconds * 100 );
		
		remainingSeconds= ( remainingSeconds < 10 ) ? '0' + remainingSeconds : remainingSeconds;
		remainingDecims = ( remainingDecims < 10 ) ? '0' + remainingDecims : remainingDecims;
		totalMinutes	= ( totalMinutes <= 0 ) ? "" : totalMinutes + ':';  
		
		return totalMinutes + remainingSeconds + ':' + remainingDecims;
	}
});

gLevelSelector = new LevelSelectorClass();
