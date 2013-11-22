var HumanTypes = 
{
	Soldier: 0,
	Shooter: 1,
	Flyer:   2,
	Spy:     3
};

var Human = function()
{
	var human;
	var human_met;
	
	var velocity   = new THREE.Vector3(0, 0, 0); // Направление скорости
	var ray = new THREE.Raycaster();
	ray.ray.direction.set(0, -1, 0);
	
	var generate = function()
	{
      	var material = new THREE.MeshBasicMaterial({color: 0xffffff});
		var geometry = new THREE.CubeGeometry(0.1, 0.1, 0.1);
      	human = new THREE.Mesh(geometry, material);
		
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
	
	generate();
	
	this.setYPositionAfterFall = function(nullPoint)
	{
		velocity.y = 0;
		human.position.y = nullPoint + 0.07;
	};
	
	this.collision = function(objects)
	{	
		// Достаем позицию
		var copy = human.position;
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
		
		var v = new THREE.Vector3(camera.position.x, 0, camera.position.z);
		v.x -= human.position.x;
		v.z -= human.position.z;
		
		v = v.normalize();

		// Постоянно падаем
		velocity.x = v.x * 0.005;
		velocity.z = v.z * 0.005;
		velocity.y -= 0.00025 * delta;

		// Двигаем объект
		human.translateX(velocity.x);
		human.translateY(velocity.y); 
		human.translateZ(velocity.z);
		
		human_met.position.x = human.position.x;
		human_met.position.z = human.position.z;
	};
};