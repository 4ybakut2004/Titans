var Trees = function(type_tree, loader)
{
	var trees;
	var trees_met;
	var height = 0.0;

	var ray = new THREE.Raycaster();
	ray.ray.direction.set(0, -1, 0);
	
	var generate = function()
	{
		trees = loader.treemodels[type_tree].clone();
		trees.castShadow = true;
		trees.receiveShadow = false;
		trees.rotation.y = getRandomInt(0, 16) * 3.14 / 8 ;
		
		var material_met = new THREE.MeshBasicMaterial({color: 0x00ff00});
		var geometry_met = new THREE.PlaneGeometry(0.04, 0.04);
		trees_met = new THREE.Mesh(geometry_met, material_met);
		trees_met.rotation.x = - 3.14 / 2;
	};

	this.getMesh = function(type_mesh)
	{
		if(type_mesh) return trees;
		else return trees_met;
	};

	generate();
	
	this.setYPositionAfterFall = function(nullPoint)
	{
		trees.position.y = nullPoint + height;
	};
	
	this.collision = function(objects)
	{	
		var copy = new THREE.Vector3(trees.position.x, trees.position.y, trees.position.z);
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