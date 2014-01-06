var Sound = function ( sources) 
{
	var audio = document.createElement( 'audio' );
	var pauseFl = true;
	
	for ( var i = 0; i < sources.length; i ++ ) 
	{
		var source = document.createElement( 'source');
		source.src = sources[ i ];
		audio.appendChild( source );
	}
	
	this.play = function () 
	{
		audio.play();
		audio.loop = true;
		pauseFl = true;
	};
	
	this.pause = function () 
	{
		audio.pause();
		pauseFl = false;
	}; 
	
	this.getPause = function()
	{
		return pauseFl;
	}
	
	this.volume = function (vol) 
	{
		if(vol) audio.volume += 0.1;
		else audio.volume -= 0.1;
	};
   
	this.volumeNone = function()
	{
		if(audio.volume == 0) audio.volume = 1;
		else audio.volume = 0;
	};
};