/**
 * @author mrdoob / http://mrdoob.com/
 */

var rungArray = new Array
(
"Ленивый титан - с места не сходил, но сражался достойно.<br/>",
"Титан-мазохист - любитель садо-мазо с участием мечей и пушек.<br/>",
"Титан попрыгунчик - прыгал по полю как зайчик. Очень большой зайчик.<br/>",
"Титан-спринтер - гонял по полю так, будто стометровку сдавал.<br/>",
"Неуязвимый титан - не Бронированный, а похож.<br/>",
"Титан-кончился порох в пороховницах. Много шуму, да мало толка.<br/>",
"Титан-жертва инквизиции - бойцы отправили на костёр, приняв за ведьму.<br/>",
"Титан жнец - одним махом толпу убивахом.<br/>",
"Титан-марафонец - пробежался по первому уровню так, будто там и преград-то никаких не было.<br/>",
"Титан-шатун - пошёл туда, не знаю куда, принёс то, не знаю что/смерть и разрушение/добро и справедливость (нужное подчеркнуть).<br/>",
"Суровый титан - превозмогал лишь своими силами.<br/>",
"Истинный титан - ленился, шлялся и шумел без толку, полностью оправдывая своё имя. <br/>",
"Вожак всех титанов - собрал в себе все лучшие титанские качества.<br/>",
"Титан-ловкач - порхал между снарядов как бабочка.<br/>",
"Титан-собери все патроны – лишил бойцов боеприпасов, героически собрав их своим телом.<br/>"
);

THREE.FirstPersonControls = function(camera, borders, minS) 
{
	//--------------------------------------начало званий--------------------------------------
	var distance = 0;						// сколько всего пробежал
	var hit = 0;							// сколько получил всего ударов /
	var jump = 0;							// сколько всего раз прыгнул	/
	var running = 0;						// сколько раз задействовал бег /
	var damage = 0;							// сколько всего нанесли уровна	/
	var bloomer = 0;						// сколько хлопал руками просто так /
	var fire = false;						// помер от огня
	var killer = 0;							// сколько раз уложил толпу		/
	var bestTime = 0;						// время прохода уровня 1
	var side = 0;							// сколько раз натыкался на дома и лес
	var skill = false;						// если использовал скил, то момо этого звания
	var gun = 0;							// процент пойманых снарядов от пушки
	var fullGun = 0;						// всего выпущено зарядов
	
	//---------------------------------max---------------------------------------------------
	var maxdistance = 100;					// сколько всего пробежал
	var maxhit = 5000;						// сколько получил всего ударов 
	var maxjump = 200;						// сколько всего раз прыгнул	
	var maxrunning = 150;					// сколько раз задействовал бег 
	var maxdamage = 1000;					// сколько всего нанесли уровна	
	var maxbloomer = 200;					// сколько хлопал руками просто так 
	var maxkiller = 10;						// сколько раз уложил толпу		
	var maxbestTime = 10000;				// время прохода уровня 1
	var maxside = 3000;						// сколько раз натыкался на дома и лес
	var maxgun = 30;						// процент пойманых снарядов от пушки
	//--------------------------------------конец званий--------------------------------------
	
	
	// ступени опыта
	var state_opt_level = new Array(30, 60, 120); // 30 60 120
	var level = 0;

	// Указатель на себя
	var scope = this;

	// Константы
	var PI_2 = Math.PI / 2;

    // Настройки мира
	var coordDivisor = 1000; 		// Во сколько раз уменьшен мир
	var worldBorders = new THREE.Vector4(borders.x, borders.y, borders.z, borders.w); // x1, z1, x2, z2

    // Настройки управления
	var mouseSensitivity = 0.004; 	// Чувствительность мыши
	
    // Настройки игрового процесса
	var ggHeight  = 40;             // Высота главного героя
	var walkSpeed = 0.24;           // Скорость ходьбы
	var runSpeed  = walkSpeed * 3;  // Скорость бега
	var jumpPower = 10;             // Сила прыжка
	var energy    = 1000;           // Запас энергии
	var hp        = 100;
	var maxhp     = 100;
	var exp       = 0;
	var maxexp    = 50;
	
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
	
	var sing = 1;
	
	var skillPush = false; 			// скил, который отталкивает все вокруг
	var skillPushTime = 0;			// время недоступности скила
	
	var skillMight = false;			// скил, который дает прикрыться от нападок
	var skillMightTime = 0;			// время недоступности скила
	var skillMightCount = 0;		// время дейсвие скила 
	
	var skillJump = false;			// скилл, который дает убивать пыржком в близи
	var skillJumpTime = 0;			// время недоступности скила
	
	var typeSkill = -1;				// тип скила на втором уровне
	var typeSkillEnd = -1;			// тип скила на третьем уровне
	
	// Объекты
	var l_hand;
	var r_hand;
	var l_blood;
	var r_blood;
	
	var blood_show = false;
	var mini_titan;
	
	var bloodSprite;				// хочу крови!!
	var FullBloodSprite = 250;		// полная полоска жажды
	var constBlood = 0.05;				// константа жажды
	
	var theEnd = false;
	
	// Рабочие переменные
	var pitchObject = new THREE.Object3D();
	pitchObject.add(camera);

	var yawObject = new THREE.Object3D();
	yawObject.add(pitchObject);
	yawObject.position.y = 2 * ggHeight / coordDivisor;
	
	var ray = new THREE.Raycaster();
	ray.ray.direction.set(0, -1, 0);
	
	var move_hand = false;
	projector = new THREE.Projector();

	var initialize = function()
	{
		var createHand = function(path, x, y, _alignment)
		{
			var texture = THREE.ImageUtils.loadTexture(path);
			texture.anisotropy = 16;
			var material = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: true, alignment: _alignment, transparent: true});
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
		
		minS.add(mini_titan);
		
		l_blood = createHand('textures/humans/l_blood.png', -1000, window.innerHeight, THREE.SpriteAlignment.bottomLeft);		
		pitchObject.add(l_blood);
		r_blood = createHand('textures/humans/r_blood.png', window.innerWidth + 1000, window.innerHeight, THREE.SpriteAlignment.bottomRight);		
		pitchObject.add(r_blood);
		l_blood.position.set(-200, window.innerHeight + 180, 0);		
		r_blood.position.set(window.innerWidth + 200, window.innerHeight + 180, 0);
		l_blood.material.opacity = 0;
		r_blood.material.opacity = 0;
		
		bloodSprite = createHand('textures/redline.png', window.innerWidth / 2 - 250, window.innerHeight + 25, THREE.SpriteAlignment.bottomLeft);	
		bloodSprite.scale.set(FullBloodSprite, 50, 1.0);		
		pitchObject.add(bloodSprite);
		
		$('#skillMight').css('display', 'none');
		$('#skillPush').css('display', 'none');
		$('#skillPush').css('backgroundImage', 'linear-gradient(90deg, #008B8B 0%, #008B8B ' + 100 + '%, #00CDCD 0%, #00CDCD 100%');
		$('#skillMight').css('backgroundImage', 'linear-gradient(90deg, #2E8B57 0%, #2E8B57 ' + 100 + '%, #9AFF9A 0%, #9AFF9A 100%');
		
	};

	initialize();
	
	var onMouseMove = function(event) 
	{
		if(!theEnd)
		{
			if (scope.enabled === false) return;

			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			yawObject.rotation.y -= movementX * mouseSensitivity;
			mini_titan.rotation.z = yawObject.rotation.y;
			pitchObject.rotation.x -= movementY * mouseSensitivity;

			pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
		}
	};

	this.onKeyDown = function(event, objects) 
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
				if(level > 1 && typeSkillEnd == 1 && !skillJump)
				{
					// тут убивалка людей
					skill = true;
					skillJump = true;
					SkillJump(objects);
				}
				if (canJump === true)
				{
					velocity.y += jumpPower / coordDivisor;
					jump ++;
				}
				canJump = false;
				break;
				
			case 16: // shift
				if(canJump && level > 0 && typeSkill == 0) isRunning = true; // Если мы на земле, то включаем бег
				break;
				
			case 81: //q доступно только на 3 уровне
				if(level > 1 && !skillPush && typeSkillEnd == 0)
				{
					skill = true;
					skillPush = true;
					SkillPush(objects);
					$('#skillPush').css('backgroundImage', 'linear-gradient(90deg, #008B8B 0%, #008B8B ' + 0 + '%, #00CDCD 0%, #00CDCD 100%');
				}
				break;
				
			case 69: //e доступно только на 2 уровне
				if(level > 0 && typeSkill == 1)
				{
					skillMight = true;
					skill = true;
				}
				break;
		}
	};

	var SkillJump = function(objects)
	{
		if(skillJump)
		{
			var vector = new THREE.Vector3(0, 0, -1);
			vector.applyQuaternion(yawObject.quaternion);	
			 
			for(var i = 0; i < objects.length; i++)
			{
				var distance = Math.pow(Math.pow(yawObject.position.x - objects[i].getMesh(1).position.x, 2) + Math.pow(yawObject.position.z - objects[i].getMesh(1).position.z, 2), 0.5);
				if(distance < 0.04)
				{
					objects[i].setBlood(true);
				}
			}
		}
	}
	
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
	document.addEventListener('keyup', onKeyUp, false);

	this.enabled = true;

	this.getObject = function() 
	{
		return yawObject;
	};
	
	this.mouseDown = function(event, objects)
	{
		if(!move_hand)
		{
			move_hand = true;
			var kol_dae = 0;
			sing = 1;
			
			if(canJump)
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
							objects[i].HpDec();
							if(objects[i].getHp()==0)
							{
								objects[i].setBlood(true);
								kol_dae ++;
							}
						}
					}
				}
				
				if(kol_dae==0) bloomer ++;
				if(kol_dae > 2) killer ++;
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
		// Проверка на падение --------------------------------------------------------------------
		canJump = false;
		
		// Достаем позицию камеры
		ray.ray.origin.copy(yawObject.position);
		
		// Ищем пересечения с предметами
		var intersections = ray.intersectObjects(objects);
		
		// Если есть пересечение, обрабатываем
		if (intersections.length > 0) 
		{
			var _distance = intersections[0].distance;

			// Если под нами препятствие, и мы падаем вниз, то не давать падать
			if (_distance > 0 && _distance < ggHeight / coordDivisor && velocity.y <= 0) 
			{
				this.setYPositionAfterFall(intersections[0].point.y);
			}
		}
		
		// Не даем зайти за пределы мира
		if(yawObject.position.x < worldBorders.x){ yawObject.position.x = worldBorders.x; side++; }
		if(yawObject.position.x > worldBorders.z){ yawObject.position.x = worldBorders.z; fire = true; hp = 0; }
		if(yawObject.position.z < worldBorders.y){ yawObject.position.z = worldBorders.y; side++; }
		if(yawObject.position.z > worldBorders.w){ yawObject.position.z = worldBorders.w; side++; }
		// ------------------------------------------------------------------------------------
	};

	
	this.update = function(delta) 
	{	
		delta *= 0.1;
		if(exp > 0)
		{		
			FullBloodSprite -= constBlood * delta;
			if(FullBloodSprite < 0) FullBloodSprite = 0;
			if(FullBloodSprite <= 125) hp -= 0.07 * delta;
		}
		bloodSprite.scale.set(FullBloodSprite, 50, 1.0);
		bloodSprite.position.set( window.innerWidth / 2 - FullBloodSprite, window.innerHeight + 25, 0 );
		if(hp + 0.05 * delta < maxhp) hp += 0.05 * delta;
		
		if(move_hand)
		{
			r_hand.rotation += delta*sing*0.03;
			l_hand.rotation -= delta*sing*0.03;
			
			if(r_hand.rotation >= 3.14/2)
			{
				r_hand.rotation = 3.14/2;
				l_hand.rotation = -3.14/2;
				sing = -sing;
			}
			
			if(r_hand.rotation <= 0)
			{ 
				r_hand.rotation = 0;
				l_hand.rotation = 0;
				move_hand = false;
			}
		}
		if (scope.enabled === false) return;
		if(typeSkill == 0) $('#skillMight').css('backgroundImage', 'linear-gradient(90deg, #444488 0%, #444488 ' + (100 * (energy - usedEnergy) / energy) + '%, #884488 0%, #884488 100%');
		
		// Если можно бежать, врубаем вторую
		// Если нельзя, едем на первой
		speed = walkSpeed;
		if(!isRunning) usedEnergy -= 2 * delta;
		if(isRunning && (usedEnergy < energy))
		{
			speed = runSpeed;
			usedEnergy += 3 * delta;
		}

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
			var z = delta * znack * 0.4;
			dista += z;
			if(isRunning) dista += z;
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
		
		mini_titan.position.x = yawObject.position.x;
		mini_titan.position.z = yawObject.position.z;
		
		var distDelta = delta * Math.pow(velocity.x*velocity.x + velocity.z*velocity.z, 0.5);
		distance += distDelta;
		if(isRunning)
		{
			running += distDelta;
		}
		
		if(skillPush)
		{		
			skillPushTime += delta;
			$('#skillPush').css('backgroundImage', 'linear-gradient(90deg, #008B8B 0%, #008B8B ' + (100 * skillPushTime / 500) + '%, #00CDCD 0%, #00CDCD 100%');
		}
		
		if(skillPushTime >= 500)
		{
			skillPush = false;
			skillPushTime = 0;
		}
		
		// скилл брони включен
		if(skillMight) 
		{ 
			skillMightCount += delta * 0.2;
			$('#skillMight').css('backgroundImage', 'linear-gradient(90deg, #2E8B57 0%, #2E8B57 ' + (100 * (50 - skillMightCount) / 50) + '%, #9AFF9A 0%, #9AFF9A 100%');
			if(skillMightCount > 50) 
			{
				skillMight = false;
				skillMightTime += delta * 0.4;
				skillMightCount = 0;
			}
		}
		
		if(skillMightTime > 0)
		{
			if(skillMightTime >= 500) skillMightTime = 0;
			else
			{
				skillMightTime += delta * 0.4;
				$('#skillMight').css('backgroundImage', 'linear-gradient(90deg, #2E8B57 0%, #2E8B57 ' + (100 * skillMightTime / 500) + '%, #9AFF9A 0%, #9AFF9A 100%');
			}
		}
		
		if(skillJump)
		{
			if(skillJumpTime < 500)
			{
				skillJumpTime += delta * 0.4;
				$('#skillPush').css('backgroundImage', 'linear-gradient(90deg, #008B8B 0%, #008B8B ' + (100 * skillJumpTime / 500) + '%, #00CDCD 0%, #00CDCD 100%');
			}
			else
			{
				skillJumpTime = 0;
				skillJump = false;
			}
		}
		if(blood_show = true)
		{
			blood_show = false;
			l_blood.material.opacity = 0;
			r_blood.material.opacity = 0;
		}
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
	
	this.decreaseHP = function(_damage, delta)
	{
		if(!skillMight)
		{
			hit ++;
			var dam = _damage * 0.01 * delta;
			damage += dam;
			hp -= dam;
			if(hp < 0) hp = 0;
			
			l_blood.material.opacity = Math.pow(1 - hp / maxhp, 0.25);
			r_blood.material.opacity = Math.pow(1 - hp / maxhp, 0.25);
			blood_show = true;			
		}
	};
	
	this.getHPpart = function()
	{
		return (100 * hp / maxhp);
	};
	
	this.getEXPpart = function()
	{
		return (100 * exp / state_opt_level[level]);
	};
	
	this.getEXP = function()
	{
		return exp;
	};
	
	this.getEXP = function()
	{
		return exp;
	};
	
	this.setGun = function()
	{
		gun ++;
	};
	
	this.setFullGun = function()
	{
		fullGun ++;
	};
	
	this.encreaseEXP = function(delta, newExp, timeLevel)
	{
		exp += newExp;
		if(FullBloodSprite + 0.5 * delta <= 250) FullBloodSprite += 0.5 * delta;
		else FullBloodSprite = 250;
		if(exp >= state_opt_level[level])
		{
			level ++;
			if(level < 3)
			{
				exp = 0;
				
				if(level == 1)
				{
					bestTime = timeLevel;
					typeSkill = getRandomInt(0, 1);
					if(typeSkill == 0) $('#textSkill').text('Драп');
					else $('#textSkill').text('Броня');
					
					$('#skillMight').css('display', 'block');
				}
				if(level == 2)
				{
					typeSkillEnd = getRandomInt(0, 1);
					if(typeSkillEnd == 0) $('#textSkillPush').text('Ударная волна');
					else $('#textSkillPush').text('Прыжок смерти');
					$('#skillPush').css('display', 'block');
					constBlood = 0.01;
				}
			}
			else
			{
				theEnd = true;
				level = 2;
			}
		}
	};
	
	this.getTheEnd = function()
	{
		return theEnd;
	};
	
	this.getLevel = function()
	{
		return level;
	}
	
	var SkillPush = function(objects)
	{
		if(skillPush)
		{
			var vector = new THREE.Vector3(0, 0, -1);
			vector.applyQuaternion(yawObject.quaternion);	
			 
			for(var i = 0; i < objects.length; i++)
			{
				var distance = Math.pow(Math.pow(yawObject.position.x - objects[i].getMesh(1).position.x, 2) + Math.pow(yawObject.position.z - objects[i].getMesh(1).position.z, 2), 0.5);
				if(distance < 0.08)
				{
					objects[i].setFromTitan(true);
				}
			}
		}
	}
	
	this.getRung = function()
	{
		var s = [];
		var loh = 0;
		var neloh = 0;
		
		if(distance <= maxdistance && level != 0){ s.push(rungArray[0]); loh ++; }
		if(hit >= maxhit) s.push(rungArray[1]);
		if(jump >= maxjump) s.push(rungArray[2]);
		if(running >= maxrunning) s.push(rungArray[3]);
		if(damage >= maxdamage){ s.push(rungArray[4]); neloh ++; }
		
		if(bloomer >= maxbloomer){ s.push(rungArray[5]); loh ++; }
		if(fire) s.push(rungArray[6]);
		if(killer >= maxkiller){ s.push(rungArray[7]); neloh ++; }
		//if(bestTime <= maxbestTime && level != 0){ s.push(rungArray[8]); neloh ++; }
		if(side >= maxside){ s.push(rungArray[9]); loh ++; }
		
		if(!skill && level != 0) s.push(rungArray[10]);
		
		if(loh >= 3) s.push(rungArray[11]);
		if(neloh >= 3) s.push(rungArray[12]);
		
		// остались ловкий и минер
		if((gun / fullGun) * 100 < 10 && level == 2) s.push(rungArray[13]);
		if((gun / fullGun) * 100 > 60 && level > 0) s.push(rungArray[14]);
		
		return s;
	};

	this.getDistFromSide = function(side)
	{
		var distance = 0;
		switch(side)
		{
			case 0:
				// x = -1.5
				distance = yawObject.position.x + 1.5;
				break;
			case 1:
				// z = -1.5
				distance = yawObject.position.z + 1.5;
				break;
			case 2:
				// z = 1.5
				distance = 1.5 - yawObject.position.z;
				break;
			case 3:
				// x = 1.5
				distance = 1.5 - yawObject.position.x;
				break;
		}
		return distance;
	};
	
	this.noneDis = function()
	{
		pitchObject.remove(l_blood);
		pitchObject.remove(r_blood);
		pitchObject.remove(l_hand);
		pitchObject.remove(r_hand);
		pitchObject.remove(bloodSprite);
		yawObject.remove(mini_titan);
	};
	
	this.setZeroRotation = function()
	{
		pitchObject.rotation.x = 0;
	};
};
