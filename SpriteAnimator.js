var Animator = function(_material, _scale, _startOffset, _offsetDelta, _period, _linesCount)
{
	var material    = _material;
	var scale       = _scale;
	var startOffset = _startOffset;
	var offsetDelta = _offsetDelta;
	var period      = _period;
	var time        = 0;
	var forCount    = 0;

	_linesCount     = _linesCount || 1;

	material.uvOffset.x = startOffset;
	material.uvScale.x  = scale;

	material.uvOffset.y = 1.0 - 1.0 / _linesCount;
	material.uvScale.y  = 1.0 / _linesCount;

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
			if(material.uvOffset.x > 1 - 2 * offsetDelta)
			{
				forCount++;
			}
			time = 0;
		}
	};

	this.setLine = function(lineNumber)
	{
		if(lineNumber > _linesCount)
		{
			lineNumber = _linesCount;
		}

		material.uvOffset.y = 1.0 - lineNumber / _linesCount;
	}
	
	this.isFirst = function()
	{
		return (forCount == 0);
	};
	
	this.setForCount = function(c)
	{
		forCount = c;
	};
};