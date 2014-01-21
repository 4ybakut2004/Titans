// Класс поверхности Three.js
// Здесь создается рендер, объекты мира, а так же происходит отрисовка

var text_level = new Array(
"Второй уровень. Внимание! За твоей спиной новые враги! Они умнее и изворотливее прежних! Берегись! "
+ "К тому же они умеют управлять УПМ. Но ты тоже не остался прежним! Теперь ты умеешь защищать свое тело броней."
+ "Для активации используйте 'q'.",
"Третий уровень. Что же это? Чувствуешь прилив силы? Этой аурой наделили тебя умершие люди. Теперь ты можешь волной "
+ "отталкивать окружающие предметы, но эта сила не бесконечна! Так что пользуйся осмотрительно. Для активации испльзуй 'e'"
+ "К тому же тебя ждут новые опасности, люди все сильнее ополчаются против тебя. Теперь с домов на тебя наведен прицел."
+ "В самых неподходящий момент в спину может угодить снаряд. К тому же урон, армия летунов тоже возросла в силе!"
);
//----------------------------------------------------------------------------------------------------
var getRandomInt = function(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

var Dislocations = 
{
	Cannons: 0,
	Terrain: 1
};

var state_titan = new Array ("Сутпень развития: Безмозглый", "Сутпень развития: Среднячок", "Сутпень развития: Разумный");
 
var level_up = 0;
var game_over_flag = 0;
var firstError = false;
var Surface = function()
{
	// Все кординаты загоняются в один предел. Делятся на значение переменной max.
	var max = 1000;
	// Границы мира
	var borders = new THREE.Vector4(-1.0, -1.0, 1.2, 1.0);

	// Переменная, отвечающая за то, открыто меню, или нет
	var prioritet = 0;

	var scene, camera, minScene, disScene, mapCamera, renderer, controls, time, fireScene;
	var clock = new THREE.Clock();
	var humanSpawnTime0 = 0;
	var humanSpawnTime1 = 0;
	var humanSpawnTime2 = 0;
	var maxHumans       = 10;
	var maxFlyingHumans = 5;
	var flyingHumansCount = 0;
	var disChangeLine   = 25;
	
	var humanDislocation = Dislocations.Terrain;

	var skyBox;
	var engine;

	// Массивы объектов
	var objects = [];
	var humans = [];
	var fires = [];
	var fireFly = false;
	var addTitanFire = false;
	var TitanFire;
	
	var disine;
	var titleEnd;
	var titleAdd = false;
	var countAddtitle = 0;
	var count_fire = 10;
	
	// Размеры мини-карты
	var mapWidth = 200;
	var mapHeight = 200;
	
	// Свет
	var dirLight, spotLight, ambientLight, sunLight;
	
	// Идентификатор процесса рендеринга
	var id;
	
	// время, за которое пройден 1 уровень!
	var levelTime = 0;
	
	var floor;
	var modelsLoader;

	var endFirePositions = [];
	var endFireCount = 30;
	var humanSpeed = 1.0;
	var humanPower = 1.0;
	
	this.setPrioritet = function(serArg)
	{
		prioritet = serArg;
	};

	var onDocumentMouseDown = function(event) 
	{
		if(prioritet > 0)
		{
			if(index < count_story)
			{
				$('.leaning').eq(index).css('display', 'none');
				index++;
				$('.leaning').eq(index).css('display', 'block');
			}
			else 
			{
				$('.leaning').eq(index).css('display', 'none');
				$('#bouble').css('display', 'none');
				index++;
				controls.mouseDown(event, humans);
			}
		}
	};
	
	var onDocumentKeyDown = function(event) 
	{
		controls.onKeyDown(event, humans);
	};

	var onWindowResize = function() 
	{
	    camera.aspect = window.innerWidth / window.innerHeight;
	    camera.updateProjectionMatrix();

	    disine.update();
	    renderer.setSize( window.innerWidth, window.innerHeight );
	    
	    //var z = window.innerHeight/window.innerWidth;
	};

	var lightPosY = -0.10;
	// Здесь задается весь свет на карте
	var lightInit = function()
	{
		spotLight = new THREE.SpotLight(0xCD6600, 2.5); //#CD6600 F4A460
		spotLight.position.set(0.0, -0.25, 0);
		spotLight.target.position.set(0, -0.5, 0);	
		
		spotLight.shadowCameraNear = 0.1;
		spotLight.shadowCameraFar = 15;
		
		spotLight.shadowMapBias = 0.003885;
		spotLight.shadowMapWidth = 512;
		spotLight.shadowMapHeight = 512;
		
		spotLight.castShadow = false;
		spotLight.shadowDarkness = 0.0;

		sunLight = new THREE.SpotLight(0x000000, 1.0); //#CD6600 F4A460
		sunLight.position.set(0.0, 3, -3);
		sunLight.target.position.set(0, 0, 0);	
		
		sunLight.shadowCameraNear = 0.1;
		sunLight.shadowCameraFar = 15;
		
		sunLight.shadowMapBias = 0.003885;
		sunLight.shadowMapWidth = 512;
		sunLight.shadowMapHeight = 512;
		
		sunLight.castShadow = true;
		sunLight.shadowDarkness = 0.4;
		//spotLight.shadowCameraVisible = true;		
		
		dirLight = new THREE.DirectionalLight(0xFAFAD2, 0.9);
		dirLight.position.set(0, 4.5, -5);
		dirLight.target.position.set(1, 0, -1);		

        ambientLight = new THREE.AmbientLight(0x666666);	
	}

	// Создает человечка заданного типа
	var spawnHuman = function(humanType, object, side, loader)
	{
		var human = new Human(humanType, loader);
		humans.push(human);

		if(humanType == HumanTypes.Soldier)
		{
			switch(side)
			{
				case (0):
					human.getMesh(1).position.x = -1.3;
					human.getMesh(1).position.z = -1.0 + getRandomInt(0, 2000) / 1000;
					break;
				case (1):
					human.getMesh(1).position.x = -1.0 + getRandomInt(0, 2000) / 1000;
					human.getMesh(1).position.z = -1.3;
					break;
				case (2):
					human.getMesh(1).position.x = -1.0 + getRandomInt(0, 2000) / 1000;
					human.getMesh(1).position.z = 1.3;
					break;
			}
		}

		if(humanType == HumanTypes.Flyer)
		{
			switch(side)
			{
				case (0):
					human.getMesh(1).position.x = -1.3;
					human.getMesh(1).position.z = controls.getObject().position.z - 0.2 + getRandomInt(0, 400) / 1000;//-1.0 + getRandomInt(0, 2000) / 1000;
					break;
				case (1):
					human.getMesh(1).position.x = controls.getObject().position.x - 0.2 + getRandomInt(0, 400) / 1000;
					human.getMesh(1).position.z = -1.3;
					break;
				case (2):
					human.getMesh(1).position.x = controls.getObject().position.x - 0.2 + getRandomInt(0, 400) / 1000;
					human.getMesh(1).position.z = 1.3;
					break;
			}
		}

		if(humanType == 1)
		{
			human.getMesh(1).position.y = 0.045;
			
			human.getMesh(3).position.y = human.getMesh(1).position.y + 0.015;
			human.getMesh(3).position.x = human.getMesh(1).position.x;
			human.getMesh(3).position.z = human.getMesh(1).position.z;
			
			scene.add(human.getMesh(3));
		}
		else human.getMesh(1).position.y = - 0.03;
		
		human.getMesh(0).position.x = human.getMesh(1).position.x;
		human.getMesh(0).position.z = human.getMesh(1).position.z;
		human.getMesh(0).position.y = 0.4;
		
		scene.add(human.getMesh(1));
		minScene.add(human.getMesh(0));
	};

	function candle()
	{
		var can = 
		{
			positionStyle  : Type.SPHERE,
			positionBase   : new THREE.Vector3( 0, -0.06, 0 ),
			positionRadius : 0.05,
			
			velocityStyle  : Type.CUBE,
			velocityBase   : new THREE.Vector3(0,0.4,0),
			velocitySpread : new THREE.Vector3(0.01,0,0.01),
			
			particleTexture : modelsLoader.fire['./textures/candle.png'].clone(), //THREE.ImageUtils.loadTexture( 'textures/candle.png' ),
			
			sizeTween    : new Tween( [0, 0.06, 0.5], [0.018, 0.25, 0.09] ),
			opacityTween : new Tween( [0.9, 5.5], [1, 0] ),
			colorTween   : new Tween( [0.5, 1.0], [ new THREE.Vector3(0.02, 1, 0.5), new THREE.Vector3(0.05, 1, 0) ] ),
			blendStyle : THREE.AdditiveBlending,  
			
			particlesPerSecond : 50,
			particleDeathAge   : 0.5,		
			emitterDeathAge    : 60
		};

		can.particleTexture.needsUpdate = true;

		return can;
	}

	var spawnFireTitan = function(vect, scene)
	{	
		var tr = new THREE.Vector3(0.0, 0, 0.0);
		tr.x = vect.x;
		tr.z = vect.z;
		
		engine = new ParticleEngine();
		engine.setValues( candle(), tr ); 

		engine.initialize(scene);
	};

	// Создает огонь
	var spawnFire = function(numbFire, scene)
	{
		var tr = new THREE.Vector3( 0.0, 0, 0.0);
		tr.x = (getRandomInt(10, 40)  + 120) / 100.0;
		tr.z = (- 95 + numbFire * (290.0/(count_fire) - 5)) / 100.0;
		
		var engine1 = new ParticleEngine();
		engine1.setValues( candle(), tr ); 

		engine1.initialize(scene);
		fires.push(engine1);
		
		var material_met = new THREE.MeshBasicMaterial({color: 0xF4A460});
		var geometry_met = new THREE.PlaneGeometry(0.04, 0.04);
		var fire_met = new THREE.Mesh(geometry_met, material_met);
		fire_met.rotation.x = - 3.14 / 2;
		
		fire_met.position.x = tr.x - 0.06;
		fire_met.position.z = tr.z;
		fire_met.position.y = 0.4;
		
		minScene.add(fire_met);
	}

	var endFireSpace = function(position, scene)
	{
		var engine1 = new ParticleEngine();
		engine1.setValues( candle(), position ); 

		engine1.initialize(scene);
		fires.push(engine1);
	}

	// Тут вся инициализация
	var init = function(loader)
	{
		modelsLoader = loader;
		
		scene = new THREE.Scene(); 
		minScene = new THREE.Scene();
		fireScene = new THREE.Scene(); 
		disScene = new THREE.Scene(); 
		
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.0001, 7);
		renderer = new THREE.WebGLRenderer({'antialias':true});  
		
		controls = new THREE.FirstPersonControls(camera, borders, minScene, disScene);
		scene.add(controls.getObject());
		
		// Камера миникарты
		mapCamera = new THREE.OrthographicCamera(-1.5, 1.5, 1.5, -1.5, -1.5, 7.0); // Left Right Top Bottom Near Far          	
		mapCamera.up = new THREE.Vector3(0,0,-1);
		mapCamera.lookAt(new THREE.Vector3(0,-1,0));
		minScene.add(mapCamera);
		
		var texture = THREE.ImageUtils.loadTexture( "textures/wall.png" );
      	var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture, transparent : true});
		var geometry = new THREE.PlaneGeometry(2.6, 0.5);
      	var minWall = new THREE.Mesh(geometry, material);
      	
		minWall.position.x = 0.0;
		minWall.position.z = 1.25;
		minWall.position.y = 1.0;
		minWall.rotation.x = - 3.14 / 2;
		
		minScene.add(minWall);
		
		disine = new Dis(disScene);
		
		time = Date.now();
		
		// Настройки рендера
		renderer.setSize(window.innerWidth, window.innerHeight); 
		
		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.physicallyBasedShading = true;
		renderer.shadowMapCullFace = THREE.CullFaceBack;
		
		renderer.autoClear = false;
	    $(document.body).append(renderer.domElement);

		lightInit();
		
		scene.add(dirLight);
		scene.add(ambientLight);
		scene.add(sunLight);
		scene.add(spotLight);
		
	    skyBox = new SkyBox(loader);
		scene.add(skyBox.getMesh());
		
		floor = new Terrain(scene, loader, minScene);
		objects.push(floor.getMesh(1));
		
		for(var i = 0; i < count_fire; i++)
		{
			spawnFire(i, fireScene);
		}
		
		titleEnd = new Title();
		$(window).bind( 'resize', onWindowResize);
		$(window).bind( 'mousedown', onDocumentMouseDown);
		$(window).bind('keydown', onDocumentKeyDown);
	};

	var anl = 0;
	var render = function() 
	{
		id = requestAnimationFrame(render);		
		var delta = clock.getDelta() * 1000.0;
		if(delta > 200) delta = 200;

		if(prioritet>0 && !controls.getTheEnd())
		{
			if(controls.getHP() <= 0)
			{
				gameOver(state_titan[controls.getLevel()], controls.getEXPpart(), controls.getRung(), controls.getLevel());
			}

			// Обрабатываем движение главного героя
			controls.update(delta);	
			controls.collision(objects);
			if((controls.getLevel() == 1 && controls.getObject().position.z > 0.9) || 
			   (controls.getLevel() == 2 && (controls.getObject().position.z > 0.9 || controls.getObject().position.z < -0.9 ||
											 controls.getObject().position.x > 0.9 || controls.getObject().position.x < -0.9)))
			{
				humanDislocation = Dislocations.Terrain;
				if(controls.getLevel() == 2)
				{
					if(controls.getObject().position.z < -0.9)
					{
						for(var i = 0; i < maxFlyingHumans / 2 && flyingHumansCount <= maxFlyingHumans; i++)
						{
							spawnHuman(HumanTypes.Flyer, controls.getObject(), 1, modelsLoader);
							flyingHumansCount++;
						}
					}
					
					if(controls.getObject().position.x < -0.9)
					{
						for(var i = 0; i < maxFlyingHumans / 2 && flyingHumansCount <= maxFlyingHumans; i++)
						{
							spawnHuman(HumanTypes.Flyer, controls.getObject(), 0, modelsLoader);
							flyingHumansCount++;
						}
					}
				}
			}

			// Двигаем скайбокс вместе с камерой
			skyBox.update(controls.getObject().position);
			if(index > count_story)
			{
				// Обрабатываем поведение людей
				for(var i = 0; i < humans.length; i++)
				{					
					if(controls.getLevel() != 0 && !humans[i].TerrainPart() && humanDislocation == Dislocations.Cannon)
					{
						humans[i].runTo(delta, controls.getObject(), controls.getLevel());
					}
					else
					{
						var result = humans[i].update(delta, controls.getObject(), humanSpeed);
						if(result == HumanPosition.Backward)
						{
							controls.decreaseHP(humans[i].getExp() * humanPower, delta);
						}
					}
					if(humans[i].getBlood()&&!humans[i].getAddBlood())
					{
						scene.add(humans[i].getMesh(2));
						humans[i].setAddBlood(true);
					}
					
					if(humans[i].getAlive() == false)
					{
						if(humans[i].getType() == HumanTypes.Flyer)
						{
							scene.remove(humans[i].getMesh(3));
							flyingHumansCount--;
						}
						scene.remove(humans[i].getMesh(2));
						scene.remove(humans[i].getMesh(1));
						minScene.remove(humans[i].getMesh(0));
						controls.encreaseEXP(delta, humans[i].getPut(), levelTime);
						if(controls.getEXPpart() >= disChangeLine)
						{
							humanDislocation = Dislocations.Cannon;
							disChangeLine += 25;
						}
						if(controls.getLevel() == 2 && controls.getEXPpart() > 50 && humanPower == 1.0)
						{
							humanPower = 1.2;
						}
						humans.splice(i, 1);
						if(controls.getEXP() < 1 && controls.getLevel() < 3)
						{
							humanDislocation = Dislocations.Cannon;
							disChangeLine = 25;
							gameLevel();
							humanSpeed += 0.25;
						}
					}

					humans[i].collision(objects, humans, i);
				}

				if(humanSpawnTime0 > 2000)
				{
					if(humans.length <= maxHumans) spawnHuman(HumanTypes.Soldier, controls.getObject(), 0, modelsLoader);
					humanSpawnTime0 = 0;
				}
				humanSpawnTime0 += Math.pow((3 - controls.getDistFromSide(0)), 3) * delta * 0.1;

				if(humanSpawnTime1 > 2000)
				{
					if(humans.length <= maxHumans) spawnHuman(HumanTypes.Soldier, controls.getObject(), 1, modelsLoader);
					humanSpawnTime1 = 0;
				}
				humanSpawnTime1 += Math.pow((3 - controls.getDistFromSide(1)), 3) * delta * 0.1;

				if(humanSpawnTime2 > 2000)
				{
					if(humans.length <= maxHumans) spawnHuman(HumanTypes.Soldier, controls.getObject(), 2, modelsLoader);
					humanSpawnTime2 = 0;
				}
				humanSpawnTime2 += Math.pow((3 - controls.getDistFromSide(2)), 3) * delta * 0.1;
			}
			
			for(var i = 0; i < count_fire; i++)
			{
				fires[i].update(0.008, controls);
			}
			
			floor.updateCannon(delta, controls.getObject(), scene, controls);
			
			// Отрисовываем сцену
			var w = window.innerWidth, h = window.innerHeight;

			renderer.setViewport( 0, 0, w, h );
			renderer.clear();
			
			renderer.render(scene, camera);
			renderer.render(fireScene, camera);
			
			if(!fireFly)
			{
				floor.collision();
				fireFly = true;
			}
			
			renderer.setViewport( 0, 0, w, h );
			renderer.render( disScene, camera );

			renderer.setViewport( 18, h - mapHeight - 20, mapWidth, mapHeight );
			renderer.render( minScene, mapCamera );
		}
		else
		{
			if(controls.getTheEnd())
			{	
				if(prioritet > 0)
				{
					spotLight.position.set(controls.getObject().position.x, lightPosY, controls.getObject().position.z);
					spotLight.target.position.set(controls.getObject().position.x, -0.5, controls.getObject().position.z);
					if(lightPosY < 2.5) lightPosY += 0.00004 * delta; //2.5
					else gameOver(state_titan[controls.getLevel()], controls.getEXPpart(), controls.getRung(), controls.getLevel());
					if(!addTitanFire)
					{
						// пошла анимация заставки
						soundEnd.play();
						sound.pause();
						for(var i = 0; i < count_fire; i++)
						{
							fires[i].destroy(fireScene);
						}
						count_fire = 0;
						fires = [];
						controls.setZeroRotation();
						floor.clearCannon(scene);
						$('#skillPush').css('display', 'none');
						$('#skillMight').css('display', 'none');
				
						addTitanFire = true;
						TitanFire = new titanFire(modelsLoader);
						scene.add(TitanFire.getMesh());
						TitanFire.getMesh().position.x = controls.getObject().position.x;
						TitanFire.getMesh().position.z = controls.getObject().position.z;
						
						camera.position.x = -0.35;
						camera.position.y = 0.04;
						controls.getObject().position.y = 0.08;
						camera.position.z = -0.35;
						
						fireFly = false;
						
						floor.deleteForest(scene);

						for(var f = 0; f < endFireCount + 10; f++)
						{
							endFirePositions.push({
								position: new THREE.Vector3(getRandomInt(0, 200) / 100.0 - 1.3,
								                                    0.0,
								                                    getRandomInt(0, 200) / 100.0 - 1.3),
								inMap: false
							});

							if(endFirePositions[f].position.x < 0.15 && endFirePositions[f].position.x > -0.15)
							{
								endFirePositions[f].position.x = 0.15;
							}

							if(endFirePositions[f].position.z < 0.15 && endFirePositions[f].position.z > -0.15)
							{
								endFirePositions[f].position.z = 0.15;
							}
						}

						var vaect = new THREE.Vector3(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z);
						spawnFireTitan(vaect, scene);
					}

					// добавление огней от титана)
					for(var f = 0; f < endFireCount + 10; f++)
					{
						if(!endFirePositions[f].inMap)
						{
							var dist = Math.pow(Math.pow(controls.getObject().position.x - endFirePositions[f].position.x, 2) + 
								                Math.pow(controls.getObject().position.z - endFirePositions[f].position.z, 2), 0.5);

							if(dist <= lightPosY + 0.1 )
							{
								endFireSpace(endFirePositions[f].position, fireScene);
								endFirePositions[f].inMap = true;
								count_fire++;
							}
						}
					}
					// --------------------------------

					skyBox.update(TitanFire.getMesh().position);
					
					for(var j = 0; j < humans.length; j++)
					{
						humans[j].collision(objects, humans, j);
						humans[j].setnotfast();
						humans[j].setFromTitan(true);
						humans[j].update(delta, TitanFire.getMesh());
					}
					
					for(var i = 0; i < count_fire; i++)
					{	
						fires[i].update(delta / 5000);
					}
					
					if(countAddtitle == 400)
					{
						for(var j = 0; j < 4; j++)
						{
							scene.add(titleEnd.getMesh(j));
							titleAdd = true;
						}
					}
					else countAddtitle ++;
					
					if(titleAdd)
					{
						titleEnd.update(delta);
					}
					
					engine.update(delta / 5000);
					var w = window.innerWidth, h = window.innerHeight;
					
					camera.position.x += 0.008 * Math.cos(anl);
					camera.position.z += 0.008 * Math.sin(anl);
					camera.position.y = 0.04;
					controls.getObject().position.y = 0.08;
					
					camera.lookAt(new THREE.Vector3(0,0,0));
					anl += 0.015;
					renderer.setViewport( 0, 0, w, h );
					renderer.clear();
			
					renderer.render(scene, camera);
					renderer.render(fireScene, camera);

					if(!fireFly)
					{
						TitanFire.collision(objects);
						fireFly = true;
					}
				}
			}
		}
	};

	this.start = function(loader)
	{
		init(loader);
		render();
	};
	
	this.stop_render = function()
	{
		cancelAnimationFrame(id);
		renderer.domElement.remove();
	};
};

var surface;
var loader;
var sound;
var soundEnd;
var count_story = 2;
var index = 0;

// Обработка захвата указателя ------------------------------------------------------------------
function pointerLockChange() 
{
	if (document.mozPointerLockElement === elem || document.webkitPointerLockElement === elem)
	{
	    console.log("Pointer Lock was successful.");
	    surface.setPrioritet(1);
		if(index == 0)
		{
			$('.leaning').eq(index).css('display', 'block');
			$('#bouble').css('display', 'block');
			$('.errorMgsFull').eq(0).css('display', 'none');
			firstError = true;
		}
	} 
	else 
	{
		if(game_over_flag)
		{
			$('#myModal_over').modal('show');
		}
		else
		{
			if(!level_up)
			{
				$('#myModal').modal('show');
			}
			else
			{
				$('#myModal_level_up').modal('show');
				level_up = 0;
			}
			
		}
		
		surface.setPrioritet(0);
	}
}

function gameLevel()
{
	document.exitPointerLock = document.exitPointerLock    ||
							   document.mozExitPointerLock ||
                               document.webkitExitPointerLock;
    document.exitPointerLock();
	
	level_up = 1;
}

function gameOver(level_over, oput_over, sp, endLevel)
{
	document.exitPointerLock = document.exitPointerLock    ||
							   document.mozExitPointerLock ||
                               document.webkitExitPointerLock;
    document.exitPointerLock();
	
	game_over_flag = 1;

	var g = "";
	var s = "<div style = \"background-color: #FFFFFF; width: 350px; height: \"";

	if(endLevel == 1)
	{
		oput_over += 30;
	}
	if(endLevel == 2)
	{
		oput_over += 90;
	}
	if(sp.length == 0)
	{
		s += "190px\">";
		
		s += "<table CELLPADDING = 5 > <tr><td align =  \"center\"> Титан-тамагочи! </td>";
		g += "<table CELLPADDING = 5 style = \"width: 98%;\">";
		
		g += "<tr><td style = \"padding-left: 40px;\">" + level_over  + "</td></tr>";
		g += "<tr><td style = \"padding-left: 40px;\">Опыт: " + oput_over + "</td></tr>";
		g += "<tr><td align = \"center\"><b style = \"font-size: 18px;\">Звания</b></td></tr>"; 
		
		g += "<tr><td align = \"center\">Увы, ваша игра не смогла ничем выделиться.</td></tr>";
		
		s += "<tr><td>" + level_over  + "</td></tr>";
		s += "<tr><td>Опыт: " + oput_over + "</td></tr>";
		s += "<tr><td align = \"center\"><b>Звания</b></td></tr>";
		s += "<tr><td>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspУвы, ваша игра не смогла ничем выделиться.</td></tr>"; //
	}
	else
	{
		var len = 220;
		for(var i = 1 ; i < sp.length; i++) len += 35; 
		
		s += len.toString() + "px\">";
		
		s += "<table CELLPADDING = 5> <tr><td align =  \"center\"> Титан-тамагочи! </td>";
		g += "<table CELLPADDING = 5 style = \"width: 98%;\">";
	
		g += "<tr><td style = \"padding-left: 40px;\">" + level_over  + "</td></tr>";
		g += "<tr><td style = \"padding-left: 40px;\">Опыт: " + oput_over + "</td></tr>";
		g += "<tr><td align = \"center\"><b style = \"font-size: 18px;\">Звания</b></td></tr>"; 
		
		s += "<tr><td>" + level_over  + "</td></tr>";
		s += "<tr><td>Опыт: " + oput_over + "</td></tr>";
		s += "<tr><td align = \"center\"><b>Звания</b></td></tr>";
		
		for(var i = 0 ; i < sp.length; i++) s += "<tr><td>" + sp[i] + "</td></tr>";
		for(var i = 0 ; i < sp.length; i++) g += "<tr><td style = \"padding-left: 40px;\">" + sp[i] + "</td></tr>";
	}
	
	g += "</table>";
	$('#textOver').html(g);
	
	s += "<tr><td align =  \"center\"><a href = \"\"> Играть </a></td></tr>";
	s += "</table></div>";
	$('#relis').text(s);
}

document.addEventListener('pointerlockchange', pointerLockChange, false);
document.addEventListener('mozpointerlockchange', pointerLockChange, false);
document.addEventListener('webkitpointerlockchange', pointerLockChange, false);

function pointerLockError()
{
	console.log("Error while locking pointer.");
}

document.addEventListener('pointerlockerror', pointerLockError, false);
document.addEventListener('mozpointerlockerror', pointerLockError, false);
document.addEventListener('webkitpointerlockerror', pointerLockError, false);

function lockPointer()
{
	elem = document.getElementById("pointer-lock-element");
	elem.requestPointerLock = elem.requestPointerLock    ||
                              elem.mozRequestPointerLock ||
                              elem.webkitRequestPointerLock;
    elem.requestPointerLock();
}
// --------------------------------------------------------------------------------------------

function restart()
{
	game_over_flag = 0;
	
	if(!sound.getPause())
	{
		sound.play();
		soundEnd.pause();
	}
	
	surface.stop_render();
	
	$('.errorMgsFull').eq(0).css('display', 'none');
	$('.models-loading').eq(0).css('display', '');
	$('#bouble').css('display', 'none');
	for(var i = 0; i < 3; i++)
	{
		$('.leaning').eq(i).css('display', 'none');
	}
	surface = new Surface();
	loader  = new ModelsLoader(surface, false);
	if(firstError) $('.errorMgsFull').eq(0).css('display', 'none');
	index = 0;
	lockPointer();
}

$(document).ready(function() 
{
	// Проверка поддержки веб джееля
	if(!Detector.webgl)
	{
		var errorElement = document.getElementById("GLerror");
		errorElement.style.display = "block";
		Detector.addGetWebGLMessage({parent: errorElement});
		return;
	}

	// Проверка поддержки захвата указателя
	if(!('pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document))
	{
		document.getElementById("PointerLockError").style.display = "block";
		return;
	}

	$('.errorMgsFull').eq(0).css('display', 'none');
	$('.models-loading').eq(0).css('display', 'block');
	surface = new Surface();
	loader = new ModelsLoader(surface, true);
	
	sound = new Sound(['audio/1.ogg']);
	//sound.play();

	soundEnd = new Sound(['audio/end.ogg']);
});