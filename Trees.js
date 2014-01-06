var Trees = function(type_tree)
{
	var trees;
	var trees_met;
	var height;

	var ray = new THREE.Raycaster();
	ray.ray.direction.set(0, -1, 0);
	
	var generate = function()
	{
		switch(type_tree)
		{
			case 0:
				var texture = THREE.ImageUtils.loadTexture( "textures/tree.png" );
				/*var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture, transparent : true, side: THREE.DoubleSide});
				material.alphaTest = 0.5;
				var geometry = new THREE.PlaneGeometry(0.05, 0.12);
				trees = new THREE.Mesh(geometry, material);*/
				var material = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: false, color: 0xffffff,  affectedByDistance: true});
				trees = new THREE.Sprite(material);
				trees.scale.set( 0.05, 0.12, 1.0 );
				height = 0.04;
				break;
			case 1:
				var texture = THREE.ImageUtils.loadTexture( "textures/tree_small.png" );
				/*var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture, transparent : true, side: THREE.DoubleSide});
				material.alphaTest = 0.5;
				var geometry = new THREE.PlaneGeometry(0.04, 0.08);
				trees = new THREE.Mesh(geometry, material);*/
				var material = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: false, color: 0xffffff,  affectedByDistance: true});
				trees = new THREE.Sprite(material);
				trees.scale.set( 0.04, 0.08, 1.0 );
				height = 0.03;
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
		trees.position.y = nullPoint + height;
	};
	
	this.collision = function(objects)
	{	
		var copy = new THREE.Vector3(trees.position.x, trees.position.y, trees.position.z);
		copy.y += 1.0;

		ray.ray.origin.copy(copy);
		// Ищем пересечения с предметами
		var intersections = ray.intersectObjects(objects);
		
		// Если есть пересечение, обрабатываем
		if (intersections.length > 0) 
		{
			var distance = intersections[0].distance;
			this.setYPositionAfterFall(intersections[0].point.y);
		}
	};
};