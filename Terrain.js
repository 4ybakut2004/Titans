var Terrain = function(_scene, loader)
{
	var terrain;

	var count_trees = 15 * 2;
	//var count_houses = 5;
	var count_cannons = 5;
	
	var cannon = [];
	var trees  = [];
	var dist = 0;
	
	var forestR = [];
	
	var cannonPosK;

	var createForest = function(x, y, z, rotation, width)
	{
		texture = loader.trees['./textures/forest.png'].clone();
		texture.needsUpdate = true;
      	texture.anisotropy = 16;
      	var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture, transparent : true, side: THREE.DoubleSide});
      	material.alphaTest = 0.5;
		var geometry = new THREE.PlaneGeometry(width, 0.26);
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
		var tree = new Trees(treeType, loader);
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
		
		tree.getMesh(1).position.y = -0.055;
		
		tree.getMesh(0).position.x = tree.getMesh(1).position.x;
		tree.getMesh(0).position.z = tree.getMesh(1).position.z;
		tree.getMesh(0).position.y = 0.4;
		
		return tree;
	};

	// Создает дом
	var pred_houses = 0;
	var spawnHouse = function(houseType, number)
	{
		var house = new Houses(houseType, loader.houses);

		if(houseType == 0)
		{
			house.getMesh().rotation.y = 3.14 / 6;
		}

		house.getMesh().position.z = 2.2;
		
		return house;
	};

	var spawnCannon = function(number)
	{
		var cannon = new Cannon(loader.cannons[0], loader);

		cannon.getObject().rotation.y = - 3.14 / 2;

		cannon.getObject().position.x = -0.9 + number * 0.4;
		//cannon.getObject().position.z = 1.2 + Math.abs(number - 2.5) / 10;
		switch(number)
		{
			case 0:
				cannon.getObject().position.z = 1.32;
			    break;
			case 1:
				cannon.getObject().position.z = 1.25;
			    break;
			case 2:
				cannon.getObject().position.z = 1.24;
			    break;
			case 3:
				cannon.getObject().position.z = 1.27;
			    break;
			case 4:
				cannon.getObject().position.z = 1.35;
			    break;
		}
		cannon.getObject().position.y = 0.09;

		return cannon;
	};
	
	var generate = function(_scene)
	{
      	var texture = loader.floor['./textures/grass.jpg'];
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 30, 30 );
      	texture.anisotropy = 16;
      	var material = new THREE.MeshLambertMaterial({color: 0xffffff, map: texture});//MeshBasicMaterial({color: 0xffffff, map: texture});
		var geometry = new THREE.PlaneGeometry(3.5, 3.5, 30, 30);
		for(var i = 0; i < geometry.vertices.length; i++)
		{
			if(i < 30*24 || i > 30*28) geometry.vertices[i].z = - Math.random()/35.0 - 0.045;
			else geometry.vertices[i].z = - 0.074;
		}
      	terrain = new THREE.Mesh(geometry, material);
      	terrain.rotation.x = - 3.14 / 2;
		//terrain.castShadow = false;
		terrain.receiveShadow = true;
		_scene.add(terrain);
		
		var forest = createForest(0, 0.05, -1.5, 0, 3); // x, y, z, rotation
		_scene.add(forest);
		forestR.push(forest);
		forest = createForest(-1.5, 0.05, 0, 3.14 / 2, 3); // x, y, z, rotation
		_scene.add(forest);
		forestR.push(forest);
		forest = createForest(0, 0.05, -1.8, 3.14, 3.5); // x, y, z, rotation
		_scene.add(forest);
		forestR.push(forest);
		forest = createForest(-1.8, 0.05, 0, 3.14 / 2 + 3.14, 3.5); // x, y, z, rotation
		_scene.add(forest);
		forestR.push(forest);
		forest = createForest(0, 0.05, -2.1, 0, 4.0); // x, y, z, rotation
		_scene.add(forest);
		forestR.push(forest);
		forest = createForest(-2.1, 0.05, 0, 3.14 / 2, 4.0); // x, y, z, rotation
		_scene.add(forest);
		forestR.push(forest);

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
			trees.push(tree);
			_scene.add(tree.getMesh(1));
			_scene.add(tree.getMesh(0));
		}

		var house = spawnHouse(0, 0);
		_scene.add(house.getMesh());

		for(var i = 0; i < count_cannons; i++)
		{
			var cannon_copy = spawnCannon(i);
			_scene.add(cannon_copy.getObject());
			cannon.push(cannon_copy);
		}
	};

	this.deleteForest = function(sceneR)
	{
		for(var i = 0; i < 6; i++)
		{
			sceneR.remove(forestR[i]);
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
	
	this.collision = function()
	{
		for(var i = 0; i < count_trees; i++)
		{
			trees[i].collision([terrain]);
		}
	};

	this.updateCannon = function(delta, camera, _scene_n, controls)
	{
		for(var i = 0; i < count_cannons; i++)
		{
			// активация пушек только после первого уровня!
			if(controls.getLevel() > 0)
			{
				cannon[i].update(delta, camera);
				if(cannon[i].visibleHole())
				{
					if(!cannon[i].addVis())
					{
						// типа тут выстрел
						cannon[i].getMeshHole().position.x = cannon[i].getObject().position.x;
						cannon[i].getMeshHole().position.y = cannon[i].getObject().position.y + 0.01;
						cannon[i].getMeshHole().position.z = cannon[i].getObject().position.z;
						_scene_n.add(cannon[i].getMeshHole());
						cannon[i].setaddVis(true);
						
						controls.setFullGun();
						// запомнить вектор от пушки к титану
							
						cannonPosK = new THREE.Vector3(- cannon[i].getObject().position.x + camera.position.x, - cannon[i].getObject().position.y + camera.position.y - 0.01, - cannon[i].getObject().position.z + camera.position.z);
						cannon[i].setVectorHole(cannonPosK);
					}
					
					dist = Math.pow(Math.pow(cannon[i].getMeshHole().position.x - cannon[i].getObject().position.x, 2) + Math.pow(cannon[i].getMeshHole().position.z - cannon[i].getObject().position.z, 2), 0.5);
					
					if(dist > 1.0 || cannon[i].getMeshHole().position.y < 0)
					{
						// взрыв
						cannon[i].setVecBoom(cannon[i].getMeshHole());
						_scene_n.add(cannon[i].getMeshBoom());
						cannon[i].holeBoomF(delta);
						
						_scene_n.remove(cannon[i].getMeshHole());
						dist = 0;
						cannon[i].setaddVis(false);
					}
					var disHvT = Math.pow(Math.pow(cannon[i].getMeshHole().position.x - camera.position.x, 2) + Math.pow(cannon[i].getMeshHole().position.z - camera.position.z, 2), 0.5);
					
					if(disHvT < 0.05)
					{
						_scene_n.remove(cannon[i].getMeshHole());
						dist = 0;
						cannon[i].setaddVis(false);
						controls.decreaseHP(15);
						controls.setGun();
					}
					
					if(cannon[i].getBoom() > 0 )
					{
						cannon[i].holeBoomF(delta);
					}
				}
			}
		}
	}
};
