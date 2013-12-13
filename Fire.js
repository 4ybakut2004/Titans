var Fire = function()
{
	var fire;
	var animator;
	
	var generate = function(humanType)
	{
		var texture = THREE.ImageUtils.loadTexture('textures/fire.png');
		texture.anisotropy = 16;
		var material = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: false, color: 0xffffff,  affectedByDistance: true});
		fire = new THREE.Sprite(material);
		fire.scale.set( 0.3, 0.3, 1.0 );

		animator = new Animator(material, 0.0625, 0.0625 * getRandomInt(0, 16), 0.0625, 75);
	};
	
	this.getMesh = function()
	{
		return fire;
	};
	
	generate();

	this.update = function(delta) 
	{	
		animator.update(delta);
		
		return true;
	};
};