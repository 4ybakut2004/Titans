var Grass = function(loader)
{
	var grass = new THREE.Object3D();

	var ray = new THREE.Raycaster();
	ray.ray.direction.set(0, -1, 0);
	
	var generate = function()
	{

		for(var i = 0; i < 4; i++)
		{
			var texture = loader.grass['./textures/miniGrass.png'].clone();
			texture.needsUpdate = true;
	      	texture.anisotropy = 16;
	      	var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture, transparent : true, side: THREE.DoubleSide});
	      	material.alphaTest = 0.5;
			var geometry = new THREE.PlaneGeometry(0.05, 0.0375);
	      	var mgrass = new THREE.Mesh(geometry, material);
	      	mgrass.rotation.y = i * 3.14 / 4;
	      	grass.add(mgrass);
      	}

	};

	this.getMesh = function()
	{
		return grass;
	};

	generate();
	
	this.setYPositionAfterFall = function(nullPoint)
	{
		grass.position.y = nullPoint + height;
	};
	
	this.collision = function(objects)
	{	
		var copy = new THREE.Vector3(grass.position.x, grass.position.y, grass.position.z);
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