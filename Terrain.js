var Terrain = function(_scene)
{
	var terrain;
	var forest_l;
	var forest_r;

	var count_trees = 40 * 2;
	var count_houses = 20;

	var createForest = function(x, y, z, rotation)
	{
		texture = THREE.ImageUtils.loadTexture( "textures/forest.png" );
      	texture.anisotropy = 16;
      	var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture, transparent : true, side: THREE.DoubleSide});
      	material.depthWrite = false;
		var geometry = new THREE.PlaneGeometry(3, 0.26);
      	var forest = new THREE.Mesh(geometry, material);
		forest.position.x = x;
		forest.position.y = y;
		forest.position.z = z;
		forest.rotation.y = rotation;

		return forest;
	};

	// Создает дерево
	var spawnTree = function(treeType, numbTree)
	{
		var tree = new Trees(treeType);
		if(numbTree < count_trees / 2.0)
		{
			tree.getMesh(1).position.x = (getRandomInt(10, 290) - 150) / 100.0;
			tree.getMesh(1).position.z = (getRandomInt(10, 50)  - 150) / 100.0;
		}
		else
		{
			tree.getMesh(1).position.x = (getRandomInt(10, 50)  - 150) / 100.0;
			tree.getMesh(1).position.z = (getRandomInt(50, 250) - 150) / 100.0;
			tree.getMesh(1).rotation.y =  -3.14 / 3;
		}
		
		tree.getMesh(1).position.y = -0.015;
		
		tree.getMesh(0).position.x = tree.getMesh(1).position.x;
		tree.getMesh(0).position.z = tree.getMesh(1).position.z;
		tree.getMesh(0).position.y = 0.4;
		
		return tree;
	};

	// Создает дом
	var pred_houses = 0;
	var spawnHouse = function(houseType, number)
	{
		var house = new Houses(houseType);
		
		house.getMesh(1).position.x = (- 140 + number * (300.0/count_houses - 1)) / 100.0;
		house.getMesh(1).position.z = (getRandomInt(0, 40) + 100) / 100.0;
		if(house.getMesh(1).position.z != pred_houses) house.getMesh(1).position.z += 10.0/100.0;
		
		pred_houses = house.getMesh(1).position.z;
		
		house.getMesh(1).position.y = - 0.074 + 0.05;
		
		house.getMesh(0).position.x = house.getMesh(1).position.x;
		house.getMesh(0).position.z = house.getMesh(1).position.z;
		house.getMesh(0).position.y = 0.4;
		
		return house;
	};
	
	var generate = function(_scene)
	{
      	var texture = THREE.ImageUtils.loadTexture( "textures/grass.jpg" );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 30, 30 );
      	texture.anisotropy = 16;
      	var material = new THREE.MeshLambertMaterial({color: 0xffffff, map: texture});//MeshBasicMaterial({color: 0xffffff, map: texture});
		var geometry = new THREE.PlaneGeometry(3, 3, 30, 30);
		for(var i = 0; i < geometry.vertices.length; i++)
		{
			if(i < 30*25) geometry.vertices[i].z = - Math.random()/35.0 - 0.045;
			else geometry.vertices[i].z = - 0.074;
		}
      	terrain = new THREE.Mesh(geometry, material);
      	terrain.rotation.x = - 3.14 / 2;
		terrain.castShadow = false;
		terrain.receiveShadow = true;
		
		forest_l = createForest(0, 0.05, -1.5, 0); // x, y, z, rotation
		forest_r = createForest(-1.5, 0.05, 0, 3.14 / 2); // x, y, z, rotation

		for(var i = 0; i < count_trees; i++)
		{
			var tree;
			if(i < (count_trees)/ 2)
			{
				tree = spawnTree(0, i);
			}
			else
			{
				tree = spawnTree(1, i);
			}
			_scene.add(tree.getMesh(1));
			_scene.add(tree.getMesh(0));
		}
		
		for(var i = 0; i < count_houses; i++)
		{
			var house = spawnHouse(getRandomInt(0, 1), i);
			_scene.add(house.getMesh(1));
			_scene.add(house.getMesh(0));
		}
	};

	this.getMesh = function(type_mesh)
	{
		switch(type_mesh)
		{
			case 1: return terrain;
			case 0: return forest_l;
			case 2: return forest_r;
		};
	};

	generate(_scene);
};
