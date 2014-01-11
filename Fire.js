var Fire = function(typeFireNumb, loader)
{
	var fire;
	var animator;
	
	var ray = new THREE.Raycaster();
	ray.ray.direction.set(0, -1, 0);
	
	var typeFire = new Array('textures/fire.png', 'textures/fire2.png', 'textures/fire3.png');
	var generate = function()
	{
		var texture = loader.fire['./' + typeFire[typeFireNumb]].clone();
		texture.needsUpdate = true;
		texture.anisotropy = 16;
		var material = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: false, color: 0xffffff,  affectedByDistance: true, transparent : true});
		// blending: THREE.NormalBlending, depthTest: false
		fire = new THREE.Sprite(material);
		switch(typeFireNumb)
		{
			case 0:
				fire.scale.set( 0.3, 0.3, 1.0 );
				animator = new Animator(material, 0.0625, 0.0625 * getRandomInt(0, 16), 0.0625, 75);
			break;
			case 1:
				fire.scale.set( 0.025, 0.05, 1.0 );
				animator = new Animator(material, 0.125, 0.125 * getRandomInt(0, 8), 0.125, 75);
			break;
			case 2:
				fire.scale.set( 0.025, 0.05, 1.0 );
				animator = new Animator(material, 0.125, 0.125 * getRandomInt(0, 8), 0.125, 75);
			break;
		}
	};
	
	this.getMesh = function()
	{
		return fire;
	};
	
	generate();

	this.update = function(delta, controls) 
	{	
		animator.update(delta);
		if(typeFireNumb > 0)
		{
			var distance = Math.pow(Math.pow(fire.position.x - controls.getObject().position.x, 2) + Math.pow(fire.position.z - controls.getObject().position.z, 2), 0.5);
			if(distance < 0.01)
			{
				controls.decreaseHP(5);
			}
		}
		return true;
	};

	this.setYPositionAfterFall = function(nullPoint)
	{
		fire.position.y = nullPoint + 0.015;
	};
	
	this.collision = function(objects)
	{	
		var copy = new THREE.Vector3(fire.position.x, fire.position.y, fire.position.z);
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
	
	this.setOpt = function()
	{
		fire.material.opacity = 0;
	};
	
	this.opt = function(objects)
	{
		var distance = Math.pow(Math.pow(fire.position.x - objects.position.x, 2) + Math.pow(fire.position.z - objects.position.z, 2), 0.5);
		var fl = true;
		
		if(fire.material.opacity < 1)
		{
			if(distance < 0.1)
			{
				fire.material.opacity += 0.01;
				fl = false;
			}
			
			if(distance >= 0.1 && distance < 0.3)
			{
				fire.material.opacity += 0.005;
				fl = false;
			}
			
			if(distance >= 0.3 && distance < 0.8)
			{
				fire.material.opacity += 0.003;
				fl = false;
			}
			
			if(distance >= 0.8 && distance < 1.2)
			{
				fire.material.opacity += 0.005;
				fl = false;
			}
			
			if(distance >= 1.2)
			{
				fire.material.opacity += 0.001;
				fl = false;
			}
		}
		return fl;
	};
};