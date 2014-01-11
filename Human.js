var HumanTypes = 
{
	Soldier: 0,
	Flyer:   1
};

var HumanPosition = 
{
	Run:      0,
	Backward: 1,
    Forward:  2
};

var typeURL = new Array('textures/humans/human_2.png', 'textures/humans/human_1.png', 'textures/humans/human_3.png', 'textures/humans/human_4.png');

var Human = function(humanType, loader)
{
	var human;
	var animator;
	var human_met;
	var redline;
	var behaviuor = 1;
	var isAlive = true;
	var posType = HumanPosition.Forward;
	
	var dying = false;
	var dying_count = 0;
	
	var velocity   = new THREE.Vector3(0, 0, 0); // Направление скорости
	var ray = new THREE.Raycaster();
	ray.ray.direction.set(0, -1, 0);
	
	var blood_anim = new Blood();
	var add_blood = false;
	var flying;
	var timeAtFloor = 0;
	var maxTimeAtFloor = getRandomInt(800, 1500);
	
	var hp;					// живучесть
	var exp;				// урон
	var put;				// опыт за него
	var scalex = 0.006;
	
	var notfast = false;
	
	if(humanType == 0)
	{
		flying = false;
	}
	else
	{
		flying = true;
	}

	// Характеристики Юнита
	var height = 0;
	
	var fromTitan = false;
	var fromTitanTime = 0;
	
	var generate = function(humanType)
	{
		var texURL = '';
		switch(humanType)
		{
			case HumanTypes.Soldier:
				k = getRandomInt(0, 2);
				texURL = typeURL[k];
				height = 0.015;
				hp = 1;
				exp = 1;
				put = 1;
				break;
				
			case HumanTypes.Flyer:
				k = getRandomInt(3, 3);
				texURL = typeURL[k];
				height = 0.015;
				hp = 3;
				exp = 3;
				put = 2;
				
				var texture_l = THREE.ImageUtils.loadTexture('textures/redline.png');
				var material_l = new THREE.SpriteMaterial({map: texture_l, useScreenCoordinates: false, color: 0xffffff,  affectedByDistance: true, transparent : true});
				redline = new THREE.Sprite(material_l);
				redline.scale.set( 0.008, 0.002, 1.0 );
				break;
		}

		var texture = loader.humans['./' + texURL].clone();
		texture.needsUpdate = true;
		texture.anisotropy = 16;
		var material = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: false, color: 0xffffff,  affectedByDistance: true, transparent : true});
		human = new THREE.Sprite(material);
		human.scale.set( height, height, 1.0 );
		
		animator = new Animator(material, 0.1, 0.0, 0.125, 75, (humanType == HumanTypes.Flyer) ? 5 : 4);
		
		var material_met = new THREE.MeshBasicMaterial({color: 0xff0000});
		var geometry_met = new THREE.PlaneGeometry(0.1, 0.1);
		human_met = new THREE.Mesh(geometry_met, material_met);
		human_met.rotation.x = - 3.14 / 2;
	};
	
	this.HpDec = function()
	{
		hp--;
		if(humanType == HumanTypes.Flyer)
		{
			scalex -= 0.002;
			redline.scale.set( scalex, 0.002, 1.0 );
		}
	};
	
	this.setnotfast = function()
	{
		notfast = true;
	};
	
	this.getExp = function()
	{
		return exp;
	};
	
	this.getPut = function()
	{
		return put;
	};
	
	this.getHp = function()
	{
		return hp;
	};
	
	var kill = function()
	{
	    isAlive = false;
	};
	
	this.getAlive = function()
	{
		return isAlive;
	};
	
	this.getPosType = function()
	{
	    return posType;
	};
	
	this.getMesh = function(type_mesh)
	{
		switch(type_mesh)
		{
			case 0: return human_met; break;
			case 1: return human; break;
			case 2: return blood_anim.getMesh(); break;
			case 3: return redline; break;
		}
	};
	
	generate(humanType);
	
	this.setYPositionAfterFall = function(nullPoint)
	{
		velocity.y = 0;
		human.position.y = nullPoint + height / 2;
	};
	
	this.collision = function(objects, humans, number)
	{	
		radiusBetweenPeople(humans, number);
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

	var blood = function(delta, v)
	{
		blood_anim.update(delta, v);
		dying_count ++;
		if(dying_count == 20) kill();
	};
	
	this.setBlood = function(fl)
	{
		dying = fl;
	};
	
	this.getBlood = function()
	{
		return dying;
	};
	
	this.setAddBlood = function(fl)
	{
		add_blood = fl;
	};
	
	this.getAddBlood = function()
	{
		return add_blood;
	};
	
	this.setFromTitan = function(fl)
	{
		fromTitan = fl;
	};
	
	function radiusBetweenPeople(humans, number)
	{
		for(var i = 0; i < humans.length; i++)
		{
			if(i != number && humans[i].getFlying() == flying)
			{
				var dist = Math.pow(Math.pow(human.position.x - humans[i].getMesh(1).position.x, 2) + Math.pow(human.position.z - humans[i].getMesh(1).position.z, 2), 0.5);
				if(dist < 0.05)
				{
					var vec = new THREE.Vector2(human.position.x - humans[i].getMesh(1).position.x, human.position.z - humans[i].getMesh(1).position.z);
					vec = vec.normalize();
					
					humans[i].getMesh(1).position.x -= vec.x * (0.05 - dist);
					humans[i].getMesh(1).position.z -= vec.y * (0.05 - dist);
				}
			}
		}
		
	}
	
	this.runTo = function(delta, camera, level)
	{
		delta *= 0.1;
		
		animator.update(delta * 10);
		
		// Вектор на титана
		var v = new THREE.Vector3(camera.position.x, 0, camera.position.z);
		var toForest = THREE.Vector2();
		
		if(!dying)
		{
			switch(level)
			{
				case 1:
					velocity.x = 0;
					velocity.z = 1.0 * 0.0008 * delta;	
					break;
					
				case 2:
					var dist1 = Math.pow(Math.pow(human.position.x, 2) + Math.pow(human.position.z - 1.5, 2), 0.5);
					var dist2 = Math.pow(Math.pow(human.position.x, 2) + Math.pow(human.position.z + 1.5, 2), 0.5);
					var dist3 = Math.pow(Math.pow(human.position.x + 1.5, 2) + Math.pow(human.position.z, 2), 0.5);
					if(dist1 < dist2 && dist1 < dist3)
					{
						velocity.x = 0;
						velocity.z = 1.0 * 0.0008 * delta;
					}
					if(dist2 < dist1 && dist2 < dist3)
					{
						velocity.x = 0;
						velocity.z = -1.0 * 0.0008 * delta;
					}
					if(dist3 < dist1 && dist3 < dist2)
					{
						velocity.x = -1.0 * 0.0008 * delta;
						velocity.z = 0;
					}
					break;
			}
			velocity.y -= 0.00025 * delta;	
		}
		else
		{
			v.x -= human.position.x;
			v.z -= human.position.z;
		
			v = v.normalize();
			
			velocity.x = v.x * 0.0008 * delta;
			velocity.z = v.z * 0.0008 * delta;
			velocity.y -= 0.00025 * delta;
		}

		setLine(camera, velocity);

		// Двигаем объект
		human.translateX(velocity.x);
		human.translateY(velocity.y); 
		human.translateZ(velocity.z);
		
		if(dying) blood(delta * 10, human.position);
		
		human_met.position.x = human.position.x;
		human_met.position.z = human.position.z;
		
		if(humanType == 1)
		{
			redline.position.x = human.position.x;
			redline.position.z = human.position.z;
			redline.position.y = human.position.y + 0.015;
		}
		return HumanPosition.Forward;
	};
	
	// = 0 - человек бежит
	// = 1 - забежал сзади
	// = 2 - тусняк
	this.update = function(delta, camera) 
	{	
		delta *= 0.1;
		
		animator.update(delta * 10);
		
		if(!flying)
		{
			timeAtFloor += delta;
		}

		if(timeAtFloor > maxTimeAtFloor && !flying && humanType == HumanTypes.Flyer) 
		{
			flying = true;
			velocity.y += 0.0004 * delta;
			timeAtFloor = 0;
			maxTimeAtFloor = getRandomInt(800, 1500);
		}
		
		// Вектор на титана
		var v = new THREE.Vector3(camera.position.x, 0, camera.position.z);
		// Перпендикуляр зрению титана
		var vector = new THREE.Vector3(0, 0, -1);
		
		if(!dying)
		{
			if(!fromTitan)
			{
				v.x -= human.position.x;
				v.z -= human.position.z;
				
				vector.applyQuaternion(camera.quaternion);	
				var per = new THREE.Vector2( - vector.z, vector.x);
				
				// Спереди-Сзади титана
				var humanPos = new THREE.Vector2(human.position.x - camera.position.x, human.position.z - camera.position.z);
				var d  = humanPos.x * per.y - humanPos.y * per.x;
				
				var side = humanPos.x * vector.z - humanPos.y * vector.x;
				
				if(Math.abs(v.z) < 0.01 && Math.abs(v.x) < 0.01)
				{	
					if(d <= 0)
					{
						posType = HumanPosition.Backward;
						return HumanPosition.Backward;
					}
					else
					{ 
						if(humanType == HumanTypes.Flyer && flying)
						{
							posType = HumanPosition.Backward;
						}
						else
						{
							posType = HumanPosition.Forward;
							return posType;
						}
					}
				}
				else
				{
					if(d > 0)
					{
						posType = HumanPosition.Forward;
						if(!flying)
						{
							if(side < 0) v = new THREE.Vector3(camera.position.x + per.x / 10.0, 0, camera.position.z + per.y / 10.0);
							else v = new THREE.Vector3(camera.position.x - per.x / 10.0, 0, camera.position.z - per.y / 10.0);
							v.x -= human.position.x;
							v.z -= human.position.z;
						}
					}
					else
					{
						posType = HumanPosition.Forward;
					}
				}
			}
			else
			{
				v = new THREE.Vector3(-camera.position.x, 0, -camera.position.z);
				v.x += human.position.x;
				v.z += human.position.z;
			}
			
			v = v.normalize();
			if(fromTitan)
			{
				if(!notfast)
				{	
					v.x *= 4;
					v.z *= 4;
				}
				else
				{
					v.x *= 0.1;
					v.z *= 0.1;
				}
				fromTitanTime++;
				if(fromTitanTime > 10) 
				{
					fromTitan = false;
					fromTitanTime = 0;
				}
			}
			
			if(flying && !fromTitan && humanType == HumanTypes.Flyer)
			{
				v.x *= 6;
				v.z *= 6;
			}

			velocity.x = v.x * 0.0005 * delta;
			velocity.z = v.z * 0.0005 * delta;
			if(flying && !fromTitan && humanType == HumanTypes.Flyer)
			{
				velocity.y -= 0.000015 * delta;
			}
			else
			{
				velocity.y -= 0.00025 * delta;
			}
		}
		else
		{
			v.x -= human.position.x;
			v.z -= human.position.z;
		
			v = v.normalize();
			
			velocity.x = v.x * 0.0008 * delta;
			velocity.z = v.z * 0.0008 * delta;
			velocity.y -= 0.00025 * delta;
		}

		setLine(camera, velocity);

		// Двигаем объект
		human.translateX(velocity.x);
		human.translateY(velocity.y); 
		human.translateZ(velocity.z);
		
		if(dying) blood(delta * 10, human.position);
		if(human.position.y < - 0.02 && velocity.y <= 0 && humanType == HumanTypes.Flyer)
		{
			flying = false;
		}
		
		human_met.position.x = human.position.x;
		human_met.position.z = human.position.z;
		
		if(humanType == 1)
		{
			redline.position.x = human.position.x;
			redline.position.z = human.position.z;
			redline.position.y = human.position.y + 0.015;
		}
		return posType;
	};
	
	this.TerrainPart = function()
	{
		return (human.position.z > 1.1 || human.position.z < -1.1 || human.position.x > 1.1 || human.position.x < -1.1);
	};
	
	this.getType = function()
	{
		return humanType;
	};

	function setLine(camera, velocity)
	{
		if(!flying)
		{
			// Выставляем спрайт в зависимости от направления человека отностельно титана
			var vecToTitan = new THREE.Vector3(camera.position.x - human.position.x, 0, camera.position.z - human.position.z);
			var cosAngle = vecToTitan.x * velocity.x + vecToTitan.z * velocity.z;
			cosAngle = cosAngle / (Math.pow(vecToTitan.x * vecToTitan.x + vecToTitan.z * vecToTitan.z, 0.5) * Math.pow(velocity.x * velocity.x + velocity.z * velocity.z, 0.5));
			var angle = Math.acos(cosAngle);
			var side = vecToTitan.x * velocity.z - velocity.x * vecToTitan.z; 
			if(side < 0) angle = -angle;

			if(angle >= - 3.14 / 4 && angle <= 3.14 / 4)
			{
				animator.setLine(1);
			}
			if(angle < - 3 * 3.14 / 4 || angle > 3 * 3.14 / 4)
			{
				animator.setLine(2);
			}
			if(angle >= - 3 * 3.14 / 4 && angle <= - 3.14 / 4)
			{
				animator.setLine(3);
			}
			if(angle > 3.14 / 4 && angle <= 3 * 3.14 / 4)
			{
				animator.setLine(4);
			}
		}
		else
		{
			animator.setLine(5);
		}
	};

	this.getFlying = function()
	{
		return flying;
	};
};