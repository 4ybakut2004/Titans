/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.FirstPersonControls = function(camera, borders) 
{
	// ��������� �� ����
	var scope = this;

	// ���������
	var PI_2 = Math.PI / 2;

    // ��������� ����
	var coordDivisor = 1000; // �� ������� ��� �������� ���
	var worldBorders = new THREE.Vector4(borders.x, borders.y, borders.z, borders.w); // x1, z1, x2, z2

    // ��������� ����������
	var mouseSensitivity = 0.004; // ���������������� ����
	
    // ��������� �������� ��������
	var ggHeight  = 40;             // ������ �������� �����
	var walkSpeed = 0.24;           // �������� ������
	var runSpeed  = walkSpeed * 3;  // �������� ����
	var jumpPower = 10;             // ���� ������
	var energy    = 1000;           // ����� �������
	var hp        = 100;
	var maxhp     = 100;
	var exp       = 0;
	var maxexp    = 50;
	
	// ������� ����������
	var velocity   = new THREE.Vector3(0, 0, 0); // ����������� ��������
	var speed      = walkSpeed;                  // �������� ��������
	var usedEnergy = 0;                          // ������������ �������

    // �����
	var moveForward  = false;
	var moveBackward = false;
	var moveLeft     = false;
	var moveRight    = false;

	var isOnObject   = false;
	var canJump      = false;
	var isRunning    = false;
	
	var dista = 0;
	var znack = 4;

	// �������
	var l_hand;
	var r_hand;
	var mini_titan;
	
	// ������� ����������
	var pitchObject = new THREE.Object3D();
	pitchObject.add(camera);

	var yawObject = new THREE.Object3D();
	yawObject.add(pitchObject);
	yawObject.position.y = 2 * ggHeight / coordDivisor;
	
	var ray = new THREE.Raycaster();
	ray.ray.direction.set(0, -1, 0);
	
	projector = new THREE.Projector();

	var initialize = function()
	{
		var createHand = function(path, x, y, _alignment)
		{
			var texture = THREE.ImageUtils.loadTexture(path);
			texture.anisotropy = 16;
			var material = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: true, alignment: _alignment});
			var hand = new THREE.Sprite(material);
			hand.position.set(x, y, 0);
			hand.scale.set(200, 256, 1.0); // imageWidth, imageHeight
			return hand;
		};

		l_hand = createHand('textures/humans/l_hand.png', 50, window.innerHeight + 180, THREE.SpriteAlignment.bottomLeft);		
		pitchObject.add(l_hand);
		r_hand = createHand('textures/humans/r_hand.png', window.innerWidth - 100, window.innerHeight + 180, THREE.SpriteAlignment.bottomRight);		
		pitchObject.add(r_hand);
		
		var texture = THREE.ImageUtils.loadTexture('textures/humans/face.png');
		texture.anisotropy = 16;
		material = new THREE.MeshBasicMaterial({map: texture, color: 0xffffff, transparent : true});
		mini_titan = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.2), material);
		mini_titan.rotation.x = - 3.14 / 2;
		mini_titan.position.y = 0.5;
		
		yawObject.add(mini_titan);
	};

	initialize();
	
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
				if(canJump) isRunning = true; // ���� �� �� �����, �� �������� ���
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
		var vector = new THREE.Vector3(0, 0, -1);
		vector.applyQuaternion(yawObject.quaternion);	
		 
		for(var i = 0; i < objects.length; i++)
		{
		    if(objects[i].getPosType() == HumanPosition.Forward)
			{
				var distance = Math.pow(Math.pow(yawObject.position.x - objects[i].getMesh(1).position.x, 2) + Math.pow(yawObject.position.z - objects[i].getMesh(1).position.z, 2), 0.5);
				if(distance < 0.05)
				{
				    objects[i].kill();
				}
			}
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
		// �������� �� ������� --------------------------------------------------------------------
		canJump = false;
		
		// ������� ������� ������
		ray.ray.origin.copy(yawObject.position);
		
		// ���� ����������� � ����������
		var intersections = ray.intersectObjects(objects);
		
		// ���� ���� �����������, ������������
		if (intersections.length > 0) 
		{
			var distance = intersections[0].distance;

			// ���� ��� ���� �����������, � �� ������ ����, �� �� ������ ������
			if (distance > 0 && distance < ggHeight / coordDivisor && velocity.y <= 0) 
			{
				this.setYPositionAfterFall(intersections[0].point.y);
			}
		}
		
		// �� ���� ����� �� ������� ����
		if(yawObject.position.x < worldBorders.x) yawObject.position.x = worldBorders.x;
		if(yawObject.position.x > worldBorders.z) yawObject.position.x = worldBorders.z;
		if(yawObject.position.z < worldBorders.y) yawObject.position.z = worldBorders.y;
		if(yawObject.position.z > worldBorders.w) yawObject.position.z = worldBorders.w;

		// ���� �� �� ����, �� ������ ������
		/*if ( yawObject.position.y < ggHeight / coordDivisor) 
		{
			this.setYPositionAfterFall( 0 );	
		}*/
		// ------------------------------------------------------------------------------------
	};

	this.update = function(delta) 
	{	
		if (scope.enabled === false) return;
		$('#vunos').css('backgroundImage', 'linear-gradient(90deg, #444488 0%, #444488 ' + (100 * (energy - usedEnergy) / energy) + '%, #884488 0%, #884488 100%');
		
		// ���� ����� ������, ������� ������
		// ���� ������, ���� �� ������
		speed = walkSpeed;
		if(!isRunning) usedEnergy -= 2;
		if(isRunning && (usedEnergy < energy))
		{
			speed = runSpeed;
			usedEnergy += 5;
		}
		
		delta *= 0.1;

		// ��������� ��������� ��������, ����� ���������������
		velocity.x += (-velocity.x) * 0.08 * delta;
		velocity.z += (-velocity.z) * 0.08 * delta;

		// ���� ���� ������ ����, �� ������������ �������� �� ����� ������
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
		// �������������� ������� �� ����� ���� �������������
		usedEnergy = Math.max(0, usedEnergy);
		
		// ��������� ������
		velocity.y -= 0.25 * delta / coordDivisor;

		// ������� ������
		yawObject.translateX(velocity.x);
		yawObject.translateY(velocity.y); 
		yawObject.translateZ(velocity.z);
	};
	
	this.LookVector = function()
	{
		var vector = new THREE.Vector3(0, 0, -1);
		vector.applyQuaternion(camera.quaternion);
		return vector;
	};
	
	this.getHP = function()
	{
		return hp;
	};
	
	this.decreaseHP = function(delta)
	{
		hp -= delta;
		if(hp < 0) hp = 0;
	};
	
	this.getHPpart = function()
	{
		return (100 * hp / maxhp);
	};
	
	this.getEXPpart = function()
	{
		return (100 * exp / maxexp);
	};
	
	this.getEXP = function()
	{
		return exp;
	};
	
	this.encreaseEXP = function(delta)
	{
		exp += delta;
		if(exp > maxexp) exp = 0;
	};
};
