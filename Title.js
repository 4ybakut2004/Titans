var Title = function()
{
	var title = [];
	var nameTitle = new Array('textures/music.png', 'textures/inet.png', 'textures/teh.png', 'textures/avtor.png');
	var titPos = [];
	
	var createHand = function(path, x, y, _alignment)
	{
		var texture = THREE.ImageUtils.loadTexture(path);
		texture.anisotropy = 16;
		var material = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: true, alignment: _alignment, transparent: true});
		var hand = new THREE.Sprite(material);
		hand.position.set(x, y, 0);
		hand.scale.set(512, 256, 1.0); // imageWidth, imageHeight
		return hand;
	};
		
	var generate = function()
	{	
		for(var i = 0; i < 4; i++)
		{
			var titleF = createHand(nameTitle[i], -256, window.innerHeight + 400 * (i + 1), THREE.SpriteAlignment.bottomLeft);		
			titPos.push(window.innerHeight + 400 * (i + 1));
			title.push(titleF);
		}
	};

	this.getMesh = function(type_mesh)
	{
		return title[type_mesh];
	};

	generate();
	
	this.update = function(delta) 
	{	
		delta *= 0.1;

		for(var i = 0; i < 4; i++)
		{
			title[i].position.set(-256, titPos[i], 0);
			titPos[i] -= 0.8 * delta;
		}
	};
};