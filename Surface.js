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
var Surface = function()
{
	// Все кординаты загоняются в один предел. Делятся на значение переменной max.
	var max = 1000;
	// Границы мира
	var borders = new THREE.Vector4(-1.0, -1.0, 1.2, 1.0);

	// Переменная, отвечающая за то, открыто меню, или нет
	var prioritet = 0;

	var scene, camera, mapCamera, renderer, controls, time;
	var clock = new THREE.Clock();
	var humanSpawnTime0 = 0;
	var humanSpawnTime1 = 0;
	var humanSpawnTime2 = 0;
	var maxHumans       = 15;
	var maxFlyingHumans = 5;
	var flyingHumansCount = 0;
	var disChangeLine   = 20;
	
	var endFire = 150;
	
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
	
	var titleEnd;
	var titleAdd = false;
	var countAddtitle = 0;
	var count_humans = 1;
	var count_fire = 20;
	
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

	    renderer.setSize( window.innerWidth, window.innerHeight );
	    
	    var z = window.innerHeight/window.innerWidth;
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
			human.getMesh(1).position.y = 0.05;
			
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
		scene.add(human.getMesh(0));
	};
	
	// Создает огонь
	var spawnFire = function(numbFire)
	{
		var fire = new Fire(0, modelsLoader);
		fires.push(fire);
		fire.getMesh().position.x = (getRandomInt(10, 40)  + 100) / 100.0;
		fire.getMesh().position.z = (- 100 + numbFire * (300.0/(count_fire - 10) - 5)) / 100.0;
		
		fire.getMesh().rotation.y =  -3.14 / 2;
		
		scene.add(fire.getMesh());
	};
	
	// создается огонь на поле
	
	var spawnFireSpace = function(numbFire)
	{
		var fire = new Fire(getRandomInt(0, 1) + 1, modelsLoader);
		fires.push(fire);
		fire.getMesh().position.x = (- 100 + getRandomInt(0, 200)) / 100.0;
		fire.getMesh().position.z = (- 100 + getRandomInt(0, 200)) / 100.0;
		fire.getMesh().position.y = -0.05;
		
		fire.getMesh().rotation.y =  -3.14 / 2;
		
		scene.add(fire.getMesh());
	};
	
	var endFireSpace = function()
	{
		var fire = new Fire(getRandomInt(0, 1) + 1, modelsLoader);
		fires.push(fire);
		fire.getMesh().position.x = (- 170 + getRandomInt(0, 340)) / 100.0;
		fire.getMesh().position.z = (- 170 + getRandomInt(0, 290)) / 100.0;
		fire.getMesh().position.y = -0.05;
		
		fire.getMesh().rotation.y =  -3.14 / 2;
		
		scene.add(fire.getMesh());
	};
	// Тут вся инициализация
	var init = function(loader)
	{
		modelsLoader = loader;
		scene = new THREE.Scene(); 
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.0001, 7);
		renderer = new THREE.WebGLRenderer({'antialias':true});  
		
		controls = new THREE.FirstPersonControls(camera, borders);
		scene.add(controls.getObject());
		
		// Камера миникарты
		mapCamera = new THREE.OrthographicCamera(-1.5, 1.5, 1.5, -1.5, -1.5, 7.0); // Left Right Top Bottom Near Far          	
		mapCamera.up = new THREE.Vector3(0,0,-1);
		mapCamera.lookAt(new THREE.Vector3(0,-1,0));
		scene.add(mapCamera);
	
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
		
	    skyBox = new SkyBox(loader);
		scene.add(skyBox.getMesh());
		
		floor = new Terrain(scene, loader);
		objects.push(floor.getMesh(1));
		
		for(var i = 0; i < count_fire - 10; i++)
		{
			spawnFire(i);
		}
		
		for(var i = 10; i < count_fire; i++)
		{
			spawnFireSpace(i);
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
				gameOver(state_titan[controls.getLevel()], controls.getEXPpart(), controls.getHPpart(), controls.getRung());
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
			$('#live').css('backgroundImage', 'linear-gradient(0deg, #448844 0%, #448844 ' + controls.getHPpart() + '%, #884444 0%, #884444 100%');
			if(index > count_story)
			{
				// Обрабатываем поведение людей
				for(var i = 0; i < humans.length; i++)
				{
					humans[i].collision(objects, humans, i);
					
					if(controls.getLevel() != 0 && !humans[i].TerrainPart() && humanDislocation == Dislocations.Cannon)
					{
						humans[i].runTo(delta, controls.getObject(), controls.getLevel());
					}
					else
					{
						var result = humans[i].update(delta, controls.getObject());
						if(result == HumanPosition.Backward)
						{
							controls.decreaseHP(humans[i].getExp());
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
						scene.remove(humans[i].getMesh(0));
						controls.encreaseEXP(humans[i].getPut(), levelTime);
						if(controls.getEXPpart() >= disChangeLine)
						{
							humanDislocation = Dislocations.Cannon;
							disChangeLine += 20;
						}
						humans.splice(i, 1);
						$('#oput').css('backgroundImage', 'linear-gradient(0deg, #888844 0%, #888844 ' + controls.getEXPpart() + '%, #444444 0%, #444444 100%');
						if(controls.getEXP() < 1 && controls.getLevel() < 3)
						{
							// level up
							$('#level').text(text_level[controls.getLevel()]);
							$('#state').text(state_titan[controls.getLevel()]);
							humanDislocation = Dislocations.Cannon;
							disChangeLine = 20;
							gameLevel();
						}
					}
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
				fires[i].update(delta, controls);
			}
			
			floor.updateCannon(delta, controls.getObject(), scene, controls);
			
			// Отрисовываем сцену
			var w = window.innerWidth, h = window.innerHeight;

			renderer.setViewport( 0, 0, w, h );
			renderer.clear();
			
			renderer.render(scene, camera);
			
			if(!fireFly)
			{
				for(var i = 10; i < count_fire; i++)
				{
					fires[i].collision(objects);
				}
				floor.collision();
				fireFly = true;
			}
			renderer.setViewport( 10, h - mapHeight - 10, mapWidth, mapHeight );
			renderer.render( scene, mapCamera );
		}
		else
		{
			if(controls.getTheEnd())
			{	
				if(prioritet > 0)
				{
					spotLight.position.set(controls.getObject().position.x, lightPosY, controls.getObject().position.z);
					spotLight.target.position.set(controls.getObject().position.x, -0.5, controls.getObject().position.z);
					if(lightPosY < 2.5) lightPosY += 0.001; //2.5
					else gameOver(state_titan[controls.getLevel()], controls.getEXPpart(), controls.getHPpart(), controls.getRung());
					if(!addTitanFire)
					{
						// пошла анимация заставки
						soundEnd.play();
						sound.pause();
						controls.noneDis();
						controls.setZeroRotation();
						$('#skillPush').css('display', 'none');
						$('#skillMight').css('display', 'none');
						$('#live').css('display', 'none');
						$('#oput').css('display', 'none');
						$('#stateP').css('display', 'none');
						
						scene.remove(mapCamera);
						scene.add(spotLight);
				
						addTitanFire = true;
						TitanFire = new titanFire(modelsLoader);
						scene.add(TitanFire.getMesh());
						TitanFire.getMesh().position.x = controls.getObject().position.x;
						TitanFire.getMesh().position.z = controls.getObject().position.z;
						TitanFire.getMesh().position.y = 0.01;
						
						camera.position.x = -0.35;
						camera.position.z = -0.35;
						
						for(var i = count_fire; i < count_fire + endFire; i++)
						{
							endFireSpace();
							fires[i].setOpt();
						}
						
						fireFly = false;
						
						floor.deleteForest(scene);
						
						engine = new ParticleEngine();
						engine.setValues( Examples.smoke );
						engine.initialize(scene);
					}

					skyBox.update(TitanFire.getMesh().position);
					
					
					for(var j = 0; j < humans.length; j++)
					{
						humans[j].collision(objects, humans, j);
						humans[j].setnotfast();
						humans[j].setFromTitan(true);
						humans[j].update(delta, TitanFire.getMesh());
					}
					
					for(var i = 0; i < count_fire + endFire; i++)
					{	
						fires[i].update(delta, controls);
						if(i > count_fire)
						{
							fires[i].opt(TitanFire.getMesh())
						}
					}
					
					if(countAddtitle == 600)
					{
						for(var j = 0; j < 2; j++)
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
					
					TitanFire.update(delta, scene);
					engine.update( delta / 1000 );
					var w = window.innerWidth, h = window.innerHeight;
					
					camera.position.x += 0.008 * Math.cos(anl);
					camera.position.z += 0.008 * Math.sin(anl);
					camera.position.y = 0.05;
					
					camera.lookAt(new THREE.Vector3(0,0,0));
					anl += 0.015;
					renderer.setViewport( 0, 0, w, h );
					renderer.clear();
			
					renderer.render(scene, camera);
					if(!fireFly)
					{
						for(var i = count_fire; i < count_fire + endFire; i++)
						{
							fires[i].collision(objects);
						}
						fireFly = true;
					}
				}
			}
		}
	};

	this.start = function(loader)
	{
		init(loader);
		$('#live').css('backgroundImage', 'linear-gradient(0deg, #448844 0%, #448844 ' + 100 + '%, #884444 0%, #884444 100%');
		$('#oput').css('backgroundImage', 'linear-gradient(0deg, #888844 0%, #888844 ' + 0 + '%, #444444 0%, #444444 100%');
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

function gameOver(level_over, oput_over, hp, sp)
{
	document.exitPointerLock = document.exitPointerLock    ||
							   document.mozExitPointerLock ||
                               document.webkitExitPointerLock;
    document.exitPointerLock();
	
	game_over_flag = 1;

	var g = "";
	var s = "<div style = \"background-color: #FFFFFF; width: 350px; height: \"";
	var gs = "";
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
		for(var i = 1 ; i < countSp; i++) len += 35; 
		
		s += len.toString() + "px\">";
		
		s += "<table CELLPADDING = 5> <tr><td align =  \"center\"> Титан-тамагочи! </td>";
		g += "<table CELLPADDING = 5 style = \"width: 98%;\">";
	
		g += "<tr><td style = \"padding-left: 40px;\">" + level_over  + "</td></tr>";
		g += "<tr><td style = \"padding-left: 40px;\">Опыт: " + oput_over + "</td></tr>";
		g += "<tr><td align = \"center\"><b style = \"font-size: 18px;\">Звания</b></td></tr>"; 
		
		s += "<tr><td>" + level_over  + "</td></tr>";
		s += "<tr><td>Опыт: " + oput_over + "</td></tr>";
		s += "<tr><td align = \"center\"><b>Звания</b></td></tr>";
		
		gs = "";
		
		for(var i = 0 ; i < countSp; i++) s += "<tr><td>" + sp[i] + "</td></tr>";
		for(var i = 0 ; i < countSp; i++) g += "<tr><td style = \"padding-left: 40px;\">" + sp[i] + "</td></tr>";

		g += gs;
		s += gs;
	}
	
	g += "</table></div>";
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
	surface = new Surface();
	loader  = new ModelsLoader(surface, false);

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
	
	$('#state').text(state_titan[0]);
	$('#live').css('backgroundImage', 'linear-gradient(0deg, #448844 0%, #448844 ' + 100 + '%, #884444 0%, #884444 100%');
	$('#oput').css('backgroundImage', 'linear-gradient(0deg, #888844 0%, #888844 ' + 0 + '%, #444444 0%, #444444 100%');
});