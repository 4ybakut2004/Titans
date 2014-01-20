var titanFire = function(loader)
{
	var fire;
	var ray = new THREE.Raycaster();
	ray.ray.direction.set(0, -1, 0);
	
	var generate = function()
	{
		fire = loader.fireTitan[0].clone();
		fire.castShadow = true;
	
		fire.position.y = -0.06;
	};
	
	this.getMesh = function()
	{
		return fire;
	};
	
	generate();

	this.setYPositionAfterFall = function(nullPoint)
	{
		fire.position.y = nullPoint;
	};
	
	this.collision = function(objects)
	{	
		var copy = new THREE.Vector3(fire.position.x, fire.position.y, fire.position.z);
		copy.y += 1.0;

		ray.ray.origin.copy(copy);
		var intersections = ray.intersectObjects(objects);
		
		if (intersections.length > 0) 
		{
			var distance = intersections[0].distance;
			this.setYPositionAfterFall(intersections[0].point.y);
		}
	};
};