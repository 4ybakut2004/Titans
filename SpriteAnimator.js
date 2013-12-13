var Animator = function(_material, _scale, _startOffset, _offsetDelta, _period)
{
	var material    = _material;
	var scale       = _scale;
	var startOffset = _startOffset;
	var offsetDelta = _offsetDelta;
	var period      = _period;
	var time        = 0;

	material.uvOffset.x = startOffset;
	material.uvScale.x  = scale;

	this.update = function(delta)
	{
		time += delta;
		if(time > period)
		{
			material.uvOffset.x += offsetDelta;
			if(material.uvOffset.x > 1 - offsetDelta)
			{
			    material.uvOffset.x = 0.0;
			}
			time = 0;
		}
	};
};