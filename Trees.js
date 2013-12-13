var Trees = function(type_tree)
{
	var trees;
	var trees_met;

	var velocity   = new THREE.Vector3(0, 0, 0); // Направление скорости
	var ray = new THREE.Raycaster();
	ray.ray.direction.set(0, -1, 0);
	
	var generate = function()
	{
		switch(type_tree)
		{
			case 0:
				var texture = THREE.ImageUtils.loadTexture( "textures/tree.png" );
				var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture, transparent : true, side: THREE.DoubleSide});
				material.depthWrite = false;
				var geometry = new THREE.PlaneGeometry(0.05, 0.12);
				trees = new THREE.Mesh(geometry, material);
				break;
			case 1:
				var texture = THREE.ImageUtils.loadTexture( "textures/tree_small.png" );
				var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture, transparent : true, side: THREE.DoubleSide});
				material.depthWrite = false;
				var geometry = new THREE.PlaneGeometry(0.04, 0.08);
				trees = new THREE.Mesh(geometry, material);
				break;
		};
		trees.castShadow = true;
		trees.receiveShadow = false;
		//trees.rotation.y =  3.14;
		
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
		velocity.y = 0;
		trees.position.y = nullPoint + 0.07;
	};
	
	this.collision = function(objects)
	{	
		// Достаем позицию
		var copy = trees.position;
		copy.y += 0.0;
		
		ray.ray.origin.copy(copy);
		// Ищем пересечения с предметами
		var intersections = ray.intersectObjects(objects);
		
		// Если есть пересечение, обрабатываем
		if (intersections.length > 0) 
		{
			var distance = intersections[0].distance;

			// Если под нами препятствие, и мы падаем вниз, то не давать падать
			if (distance > 0 && distance < 0.07 && velocity.y <= 0) 
			{
				this.setYPositionAfterFall(intersections[0].point.y);
			}
		}
	};
	
	this.update = function(delta, camera) 
	{	
		delta *= 0.1;

		// Постоянно падаем
		velocity.y -= 0.00025 * delta;

		// Двигаем объект
		trees.translateX(velocity.x);
		trees.translateY(velocity.y); 
		trees.translateZ(velocity.z);
	};
};