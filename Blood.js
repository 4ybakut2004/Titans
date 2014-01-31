var Blood = function(loader)
{
	var blood;
	var animator;
	
	var generate = function()
	{
		height = 0.01;

		var texture = loader.blood['./textures/humans/blood.png'].clone();
		texture.needsUpdate = true;
		texture.anisotropy = 16;
		var material = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: false, color: 0xffffff,  affectedByDistance: true});
		blood = new THREE.Sprite(material);
		blood.scale.set( height * 2, height, 1.0 );
		
		animator = new Animator(material, 0.1, 0.0, 0.1, 100);
	};
	
	this.getMesh = function()
	{
		return blood;
	};
	
	generate();
	
	this.update = function(delta, v) 
	{			
		animator.update(delta);
		
		blood.position.x = v.x;
		blood.position.y = v.y + 0.009; 
		blood.position.z = v.z;
	};
};