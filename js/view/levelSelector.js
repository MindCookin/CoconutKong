LevelSelectorClass = Class.extend ({
	
	actualLevel : 0,
	timeLevel	: {},
	timeRecords	: {},
	list 		: null,
	maxLevel 	: 0,
	timer		: null,
	
	setup : function()
	{
		$("#levelsList span.timer").hide();
		gLevelSelector.list = $("#levelsList");
		
		for ( var i = 1; i <= levelURLs.length; i++ )
		{
			gLevelSelector.timeLevel[ i ] 	= 0;
			gLevelSelector.timeRecords[ i ] = Number.MAX_VALUE;
		} 
	},
	
	update : function( levelId ){
		
		if( gLevelSelector.maxLevel < levelId )
			gLevelSelector.maxLevel = levelId;
		
		gLevelSelector.actualLevel = levelId;
		
		gLevelSelector.list.children().each( function( index ) {
			
			index++;
			
			if( index == levelId )
			{
				$(this).removeClass('passed');
				$(this).addClass('active');
				$(this).children('span.timer').show( 500 );
				
				gLevelSelector.timer = $("#levelsList .active span.timer");
			}	
			else if( index < gLevelSelector.maxLevel )
			{
				$(this).removeClass('active');
				$(this).addClass('passed');
				$(this).children('span.timer').hide( 500 );
				
			} else 
			{
				$(this).removeClass('passed');
				$(this).removeClass('active');
			}
		});
		
		Cufon.refresh();
	},
	
	clickHandler : function( ){
		var lvl = $(this).attr('href').substr(1, 2);
		gManager.changeLevel( lvl );
		
		return false;
	},
	
	enableSwitch : function(){
		$("#levelsList a").click( gLevelSelector.clickHandler );
		$("#levelsList a").addClass('completed');
	}, 
	
	updateTime : function( time ){
		
		var text =  gLevelSelector.parseTime( time );
		gLevelSelector.timer.text( text );
		
		gLevelSelector.updateTimeLevel( time );
	}, 
	
	updateTimeLevel  :function( time ){
		gLevelSelector.timeLevel[ gLevelSelector.actualLevel ] = time;
	},
	
	updateTimeRecords : function(){
		
		var levelId = gLevelSelector.actualLevel;
		
		if ( gLevelSelector.timeRecords[ levelId ] > gLevelSelector.timeLevel[ levelId ] )
			gLevelSelector.timeRecords[ levelId ] = gLevelSelector.timeLevel[ levelId ];
		
		var text = gLevelSelector.parseTime( gLevelSelector.timeRecords[ levelId ] );
		$("#levelsList .active a").text( text );
		$("#levelsList .active a").addClass('passed');
		$("#levelsList .active a").removeClass('active');
		
		Cufon.refresh();
	},
	
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
