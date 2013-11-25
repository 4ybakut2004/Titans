/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.FirstPersonControls = function(camera, borders) 
{
	// Указатель на себя
	var scope = this;

	// Константы
	var PI_2 = Math.PI / 2;

    // Настройки мира
	var coordDivisor = 1000; // Во сколько раз уменьшен мир
	var worldBorders = new THREE.Vector4(borders.x, borders.y, borders.z, borders.w); // x1, z1, x2, z2

    // Настройки управления
	var mouseSensitivity = 0.004; // Чувствительность мыши
	
    // Настройки игрового процесса
	var ggHeight  = 40;             // Высота главного героя
	var walkSpeed = 0.24;           // Скорость ходьбы
	var runSpeed  = walkSpeed * 3;  // Скорость бега
	var jumpPower = 10;             // Сила прыжка
	var energy    = 1000;           // Запас энергии
	
	// Текущие показатели
	var velocity   = new THREE.Vector3(0, 0, 0); // Направление скорости
	var speed      = walkSpeed;                  // Значение скорости
	var usedEnergy = 0;                          // Использовано энергии

    // Флаги
	var moveForward  = false;
	var moveBackward = false;
	var moveLeft     = false;
	var moveRight    = false;

	var isOnObject   = false;
	var canJump      = false;
	var isRunning    = false;
	
	var dista = 0;
	var znack = 4;
	
	// Рабочие переменные
	var pitchObject = new THREE.Object3D();
	pitchObject.add(camera);

	var yawObject = new THREE.Object3D();
	yawObject.add(pitchObject);
	yawObject.position.y = 2 * ggHeight / coordDivisor;
	
	
	var ray = new THREE.Raycaster();
	ray.ray.direction.set(0, -1, 0);
	
	projector = new THREE.Projector();
	
	var texture = THREE.ImageUtils.loadTexture('textures/humans/l_hand.png');
	texture.anisotropy = 16;
	var material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true, alignment: THREE.SpriteAlignment.bottomLeft  } );
	var l_hand = new THREE.Sprite( material );
	l_hand.position.set( 50, window.innerHeight + 180, 0 );
	l_hand.scale.set( 200, 256, 1.0 ); // imageWidth, imageHeight
	
	pitchObject.add(l_hand);
	
	texture = THREE.ImageUtils.loadTexture('textures/humans/r_hand.png');
	texture.anisotropy = 16;
	material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: true, alignment: THREE.SpriteAlignment.bottomRight} );
	var r_hand = new THREE.Sprite( material );
	r_hand.position.set( window.innerWidth - 100, window.innerHeight + 180, 0 );
	r_hand.scale.set( 200, 256, 1.0 ); // imageWidth, imageHeight
	
	pitchObject.add(r_hand);
	
	var onMouseMove = function(event) 
	{
		if (scope.enabled === false) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * mouseSensitivity;
		pitchObject.rotation.x -= movementY * mouseSensitivity;

		pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
	};

	var onKeyDown = function(event) 
	{
		switch (event.keyCode) 
		{
			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if (canJump === true) velocity.y += jumpPower / coordDivisor;
				canJump = false;
				break;
				
			case 16: // shift
				if(canJump) isRunning = true; // Если мы на земле, то включаем бег
				break;
		}
	};

	var onKeyUp = function(event) 
	{
		switch(event.keyCode) 
		{
			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // a
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;
				
			case 16: // shift
				isRunning = false;
				break;
		}
	};

	//$(document).bind('mousemove', onMouseMove);
	//$(document).bind('keydown', onKeyDown);
	//$(document).bind('keyup', onKeyUp);

	document.addEventListener('mousemove', onMouseMove, false);
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);

	this.enabled = true;

	this.getObject = function() 
	{
		return yawObject;
	};
	
	this.mouseDown = function(event, objects)
	{
		event.preventDefault();
		var vector = new THREE.Vector3((0.5) * 2 - 1, - (0.5) * 2 + 1, 0.5);
		var raycaster = projector.pickingRay(vector, camera);

		var intersects = raycaster.intersectObjects(objects);

		if (intersects.length > 0) 
		{
			intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
		}
	};

	this.setYPositionAfterFall = function(nullPoint)
	{
		velocity.y = 0;
		yawObject.position.y = nullPoint + ggHeight / coordDivisor;
		canJump = true;
	};
	
	this.collision = function(objects)
	{
		// Проверка на падение --------------------------------------------------------------------
		canJump = false;
		
		// Достаем позицию камеры
		ray.ray.origin.copy(yawObject.position);
		
		// Ищем пересечения с предметами
		var intersections = ray.intersectObjects(objects);
		
		// Если есть пересечение, обрабатываем
		if (intersections.length > 0) 
		{
			var distance = intersections[0].distance;

			// Если под нами препятствие, и мы падаем вниз, то не давать падать
			if (distance > 0 && distance < ggHeight / coordDivisor && velocity.y <= 0) 
			{
				this.setYPositionAfterFall(intersections[0].point.y);
			}
		}
		
		// Не даем зайти за пределы мира
		if(yawObject.position.x < worldBorders.x) yawObject.position.x = worldBorders.x;
		if(yawObject.position.x > worldBorders.z) yawObject.position.x = worldBorders.z;
		if(yawObject.position.z < worldBorders.y) yawObject.position.z = worldBorders.y;
		if(yawObject.position.z > worldBorders.w) yawObject.position.z = worldBorders.w;

		// Если мы на полу, не давать падать
		/*if ( yawObject.position.y < ggHeight / coordDivisor) 
		{
			this.setYPositionAfterFall( 0 );	
		}*/
		// ------------------------------------------------------------------------------------
	};

	this.update = function(delta) 
	{	
		if (scope.enabled === false) return; 
		
		// Если можно бежать, врубаем вторую
		// Если нельзя, едем на первой
		speed = walkSpeed;
		if(!isRunning) usedEnergy -= 2;
		if(isRunning && (usedEnergy < energy))
		{
			speed = runSpeed;
			usedEnergy += 5;
		}
		
		delta *= 0.1;

		// Постоянно уменьшаем скорость, чтобы останавливаться
		velocity.x += (-velocity.x) * 0.08 * delta;
		velocity.z += (-velocity.z) * 0.08 * delta;

		// Если жмем кнопки бега, то поддерживаем скорость на одном уровне
		if (moveForward) velocity.z -= speed * delta / coordDivisor;
		if (moveBackward) velocity.z += speed * delta / coordDivisor;

		if (moveLeft) velocity.x -= speed * delta / coordDivisor;
		if (moveRight) velocity.x += speed * delta / coordDivisor;
		
		if(moveForward||moveBackward||moveLeft||moveRight)
		{
			dista += znack;
			if(isRunning) dista += znack;
			if(dista > 32) dista = 32;
			if(dista < 0) dista = 0;
			if(dista > 31 || dista < 1) znack = - znack;
			l_hand.position.set( 50, window.innerHeight + 180 - dista, 0 );
			r_hand.position.set( window.innerWidth - 100, window.innerHeight + 180 + dista, 0 );
		}
		// Использованная энергия не может быть отрицательной
		usedEnergy = Math.max(0, usedEnergy);
		
		// Постоянно падаем
		velocity.y -= 0.25 * delta / coordDivisor;

		// Двигаем объект
		yawObject.translateX(velocity.x);
		yawObject.translateY(velocity.y); 
		yawObject.translateZ(velocity.z);
	};
};
