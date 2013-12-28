var Cannon = function(model)
{
	var cannon;
	var velocity   = new THREE.Vector3(0, 0, 0); // Направление скорости
	var ray = new THREE.Raycaster();
	ray.ray.direction.set(0, -1, 0);
	var angl = 0;
	var hole;
	var visible = true;
	var object3d = new THREE.Object3D();
	
	var human;
	var holeVect = new THREE.Vector2(0, 0);
	var holeBoom;
	
	var animator;
	var boom_count = 0;
	
	var addV = false;
	
	var generate = function()
	{
		cannon = model.dae.clone();
		cannon.castShadow = true;
		cannon.receiveShadow = false;
		
		var texture = THREE.ImageUtils.loadTexture( "textures/hole.png" );
		var material = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: false, color: 0xffffff,  affectedByDistance: true});
		
		hole = new THREE.Sprite(material);
		hole.scale.set( 0.007, 0.007, 1.0 );
		
		human = new Human(0);
		human.getMesh(1).position.x += 0.05;
		human.getMesh(1).position.y += 0.005;
		
		texture = THREE.ImageUtils.loadTexture( "textures/holeboom.png" );
		material = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: false, color: 0xffffff,  affectedByDistance: true});
		
		holeBoom = new THREE.Sprite(material);
		holeBoom.scale.set( 0.01, 0.01, 1.0);
		
		animator = new Animator(material, 0.05, 0.0, 0.05, 50);
		
		object3d.add(cannon);
		object3d.add(human.getMesh(1));
	};

	this.getMesh = function()
	{
		return cannon;
	};
	
	this.getObject = function()
	{
		return object3d;
	};
	
	this.getMeshHole = function()
	{
		return hole;
	};
	
	this.getMeshHuman = function()
	{
		return human;
	};
	
	this.getMeshBoom = function()
	{
		return holeBoom;
	};
	
	this.visibleHole = function()
	{
		return visible;
	};
	
	this.addVis = function()
	{
		return addV;
	};
	
	this.setaddVis = function(addVisF)
	{
		addV = addVisF;
	};
	
	this.setVecBoom = function(vectD)
	{
		holeBoom.position.x = vectD.position.x;
		holeBoom.position.y = vectD.position.y;
		holeBoom.position.z = vectD.position.z;
	};
	
	this.holeBoomF = function(delta)
	{
		animator.update(delta);
		boom_count ++;
		if(!animator.isFirst()) 
		{
			animator.setForCount(0);
			boom_count = 0;
			holeBoom.position.y = -20;
		}
	};
	
	this.getBoom = function()
	{
		return boom_count;
	};
	
	this.setVectorHole = function(varVect)
	{
		var v = new THREE.Vector2(varVect.x, varVect.y);
		v = v.normalize();
		holeVect.x = v.x;
		holeVect.y = v.y;
	};
	generate();
	
	this.update = function(delta, camera)
	{
		delta *= 0.1;
		
		// Вектор на титана
		var v = new THREE.Vector3(camera.position.x, 0, camera.position.z);
		// Перпендикуляр зрению титана
		var vector = new THREE.Vector3(0, 0, -1);
		var vectorCan = new THREE.Vector2(0, 1);
		
		var per = new THREE.Vector2( - vector.z, vector.x);
		
		v.x -= object3d.position.x;
		v.z -= object3d.position.z;
				
		var cannonPosK = new THREE.Vector2(object3d.position.x - camera.position.x, object3d.position.z - camera.position.z);
		var cannonPos = new THREE.Vector2( - camera.position.x + object3d.position.x, - camera.position.z + object3d.position.z);
		
		var side = cannonPosK.x * vector.z - cannonPosK.y * vector.x;
		
		var cosanl = (vectorCan.x * cannonPos.x + vectorCan.y * cannonPos.y);
		cosanl = cosanl / (Math.pow(vectorCan.x * vectorCan.x + vectorCan.y * vectorCan.y, 0.5) * Math.pow(cannonPos.x * cannonPos.x + cannonPos.y * cannonPos.y, 0.5));
		
		cosanl = Math.acos(cosanl);
		
		if(visible)
		{
			var x = holeVect.x * 0.003 * delta;
			var y = holeVect.y * 0.003 * delta;
			
			hole.translateX(x);
			hole.translateZ(y);
		}
		
		if(side > 0)
		{
			object3d.rotation.y = - cosanl - 3.14/2;
		}
		
		if(side < 0)
		{
			object3d.rotation.y = cosanl - 3.14/2;
		}
	}
};