var HumanTypes = 
{
	Soldier: 0,
	Shooter: 1,
	Flyer:   2,
	Spy:     3
};

var Human = function(humanType)
{
	var human;
	var human_met;
	
	var velocity   = new THREE.Vector3(0, 0, 0); // Направление скорости
	var ray = new THREE.Raycaster();
	ray.ray.direction.set(0, -1, 0);

	// Характеристики Юнита
	var height = 0;
	
	var generate = function(humanType)
	{
		var texURL = '';
		switch(humanType)
		{
			case HumanTypes.Soldier:
				texURL = 'textures/humans/human.png';
				height = 0.015;
				break;
		}

		var texture = THREE.ImageUtils.loadTexture(texURL);
		texture.anisotropy = 16;
		var material = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: false, color: 0xffffff,  affectedByDistance: true});
		human = new THREE.Sprite(material);
		human.scale.set( height / 2, height, 1.0 );
		
		human.material.uvOffset.x = 0.0;
		human.material.uvScale.x = 0.036;
		
		var material_met = new THREE.MeshBasicMaterial({color: 0xff0000});
		var geometry_met = new THREE.PlaneGeometry(0.1, 0.1);
		human_met = new THREE.Mesh(geometry_met, material_met);
		human_met.rotation.x = - 3.14 / 2;
	};
	
	this.getMesh = function(type_mesh)
	{
		if(type_mesh) return human;
		else return human_met;
	};
	
	generate(humanType);
	
	this.setYPositionAfterFall = function(nullPoint)
	{
		velocity.y = 0;
		human.position.y = nullPoint + height / 2;
	};
	
	this.collision = function(objects)
	{	
		// Достаем позицию
		var copy = new THREE.Vector3(human.position.x, human.position.y, human.position.z);
		copy.y += 1.0;
		
		ray.ray.origin.copy(copy);
		// Ищем пересечения с предметами
		var intersections = ray.intersectObjects(objects);
		
		// Если есть пересечение, обрабатываем
		if (intersections.length > 0) 
		{
			var distance = intersections[0].distance;

			// Если под нами препятствие, и мы падаем вниз, то не давать падать
			if (distance > 0 && distance < height / 2 + 1.0 && velocity.y <= 0) 
			{
				this.setYPositionAfterFall(intersections[0].point.y);
			}
		}
	};

	this.update = function(delta, camera) 
	{	
		delta *= 0.1;
		
		human.material.uvOffset.x += 0.125;
		if(human.material.uvOffset.x > 0.875)
		{
		    human.material.uvOffset.x = 0.0;
		}
		
		var v = new THREE.Vector3(camera.position.x, 0, camera.position.z);
		v.x -= human.position.x;
		v.z -= human.position.z;
		
		if(Math.abs(v.z) < 0.01 && Math.abs(v.x) < 0.01) return false;
		v = v.normalize();

		// Постоянно падаем
		velocity.x = v.x * 0.0005 * delta;
		velocity.z = v.z * 0.0005 * delta;
		velocity.y -= 0.00025 * delta;

		// Двигаем объект
		human.translateX(velocity.x);
		human.translateY(velocity.y); 
		human.translateZ(velocity.z);
		
		human_met.position.x = human.position.x;
		human_met.position.z = human.position.z;
		return true;
	};
};