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
	var maxHumans       = 25;

	var skyBox;

	// Массивы объектов
	var objects = [];
	var humans = [];
	var fires = [];
	
	var count_humans = 1;
	var count_fire = 10;
	
	// Размеры мини-карты
	var mapWidth = 200;
	var mapHeight = 200;
	
	// Свет
	var dirLight, spotLight;
	
	// Идентификатор процесса рендеринга
	var id;
	
	// время, за которое пройден 1 уровень!
	var levelTime = 0;
	
	var floor;
	
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

	// Здесь задается весь свет на карте
	var lightInit = function()
	{
		spotLight = new THREE.SpotLight(0xFFDEAD, 0.8);
		spotLight.position.set(-1.7, 1.5, 5);
		spotLight.target.position.set(1, -0.3, -3);	
		
		spotLight.shadowCameraNear = 0.1;
		spotLight.shadowCameraFar = 7;
		
		spotLight.shadowMapBias = 0.003885;
		spotLight.shadowMapWidth = 1024;
		spotLight.shadowMapHeight = 1024;
		
		spotLight.castShadow = true;
		// объекты должны отбрасывать тень
		spotLight.shadowDarkness = 0.5;
		//spotLight.shadowCameraVisible = true;		
		
		dirLight = new THREE.DirectionalLight(0xFAFAD2, 0.9);
		dirLight.position.set(1.7, 4.5, -5);
		dirLight.target.position.set(1, 0, -1);			
	}

	// Создает человечка заданного типа
	var spawnHuman = function(humanType, object, side)
	{
		var human = new Human(humanType);
		humans.push(human);

		switch(side)
		{
			case (0):
				human.getMesh(1).position.x = -1.4;
				human.getMesh(1).position.z = -1.0 + getRandomInt(0, 2000) / 1000;
				break;
			case (1):
				human.getMesh(1).position.x = -1.0 + getRandomInt(0, 2000) / 1000;
				human.getMesh(1).position.z = -1.4;
				break;
			case (2):
				human.getMesh(1).position.x = -1.0 + getRandomInt(0, 2000) / 1000;
				human.getMesh(1).position.z = 1.4;
				break;
		}
		human.getMesh(1).position.y = - 0.03;
		
		human.getMesh(0).position.x = human.getMesh(1).position.x;
		human.getMesh(0).position.z = human.getMesh(1).position.z;
		human.getMesh(0).position.y = 0.4;
		
		scene.add(human.getMesh(1));
		scene.add(human.getMesh(0));
	};
	
	// Создает огонь
	var spawnFire = function(numbFire)
	{
		var fire = new Fire()
		fires.push(fire);
		fire.getMesh().position.x = (getRandomInt(10, 40)  + 100) / 100.0;
		fire.getMesh().position.z = (- 100 + numbFire * (300.0/count_fire - 5)) / 100.0;
		
		fire.getMesh().rotation.y =  -3.14 / 2;
		
		scene.add(fire.getMesh());
	};
	
	// Тут вся инициализация
	var init = function(loader)
	{
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
		
		scene.add(spotLight);
		scene.add(dirLight);
		
	    skyBox = new SkyBox('skybox/');
		scene.add(skyBox.getMesh());
		
		floor = new Terrain(scene, loader);
		objects.push(floor.getMesh(1));
		
		for(var i = 0; i < count_fire; i++)
		{
			spawnFire(i);
		}
		
		$(window).bind( 'resize', onWindowResize);
		$(window).bind( 'mousedown', onDocumentMouseDown);
		$(window).bind('keydown', onDocumentKeyDown);
	};

	var render = function() 
	{
		id = requestAnimationFrame(render);		
		
		var delta = clock.getDelta() * 1000.0;
		if(delta > 200) delta = 200;


		if(prioritet>0)
		{
			if(controls.getHP() <= 0)
			{
				gameOver(state_titan[controls.getLevel()], controls.getEXPpart(), controls.getHPpart(), controls.getRung());
			}
			// Обрабатываем движение главного героя
			controls.update(delta);	
			controls.collision(objects);

			// Двигаем скайбокс вместе с камерой
			skyBox.update(controls.getObject().position);
			$('#live').css('backgroundImage', 'linear-gradient(0deg, #448844 0%, #448844 ' + controls.getHPpart() + '%, #884444 0%, #884444 100%');
			if(index > count_story)
			{
				// Обрабатываем поведение людей
				for(var i = 0; i < humans.length; i++)
				{
					humans[i].collision(objects);
					
					var result = humans[i].update(delta, controls.getObject());
					if(result == HumanPosition.Backward)
					{
						humans[i].collision(objects);
						controls.decreaseHP(1);
					}
					
					if(humans[i].getBlood()&&!humans[i].getAddBlood())
					{
						scene.add(humans[i].getMesh(2));
						humans[i].setAddBlood(true);
					}
					
					if(humans[i].getAlive() == false)
					{
						scene.remove(humans[i].getMesh(2));
						scene.remove(humans[i].getMesh(1));
						scene.remove(humans[i].getMesh(0));
						humans.splice(i, 1);
						controls.encreaseEXP(1, levelTime);
						$('#oput').css('backgroundImage', 'linear-gradient(0deg, #888844 0%, #888844 ' + controls.getEXPpart() + '%, #444444 0%, #444444 100%');
						if(controls.getEXP() < 1)
						{
							// level up
							$('#level').text(text_level[controls.getLevel() - 1]);
							$('#state').text(state_titan[controls.getLevel()]);
							gameLevel();
						}
					}
				}

				if(humanSpawnTime0 > 2000)
				{
					if(humans.length <= maxHumans) spawnHuman(HumanTypes.Soldier, controls.getObject(), 0);
					humanSpawnTime0 = 0;
				}
				humanSpawnTime0 += Math.pow((3 - controls.getDistFromSide(0)), 3) * delta * 0.1;

				if(humanSpawnTime1 > 2000)
				{
					if(humans.length <= maxHumans) spawnHuman(HumanTypes.Soldier, controls.getObject(), 1);
					humanSpawnTime1 = 0;
				}
				humanSpawnTime1 += Math.pow((3 - controls.getDistFromSide(1)), 3) * delta * 0.1;

				if(humanSpawnTime2 > 2000)
				{
					if(humans.length <= maxHumans) spawnHuman(HumanTypes.Soldier, controls.getObject(), 2);
					humanSpawnTime2 = 0;
				}
				humanSpawnTime2 += Math.pow((3 - controls.getDistFromSide(2)), 3) * delta * 0.1;
			}
			
			for(var i = 0; i < count_fire; i++)
			{
				fires[i].update(delta);
			}
			
			floor.updateCannon(delta, controls.getObject(), scene, controls);
			
			// Отрисовываем сцену
			var w = window.innerWidth, h = window.innerHeight;

			renderer.setViewport( 0, 0, w, h );
			renderer.clear();
			
			renderer.render(scene, camera);
			
			renderer.setViewport( 10, h - mapHeight - 10, mapWidth, mapHeight );
			renderer.render( scene, mapCamera );
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

	var s = "";
	s += level_over  + "<br/>";
	s += "Опыт: " + oput_over + "<br/>";
	s += "Остатки жизни: " + hp + "<br/>";
	s += "Звания: <br/>" + sp;
	$('#relis').text(s);
	$('#text_over_reil').html(s);
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
	surface.stop_render();
	
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

	surface = new Surface();
	loader = new ModelsLoader(surface, true);
	
	sound = new Sound(['audio/1.ogg']);
	//sound.play();

	$('#state').text(state_titan[0]);
	$('#live').css('backgroundImage', 'linear-gradient(0deg, #448844 0%, #448844 ' + 100 + '%, #884444 0%, #884444 100%');
	$('#oput').css('backgroundImage', 'linear-gradient(0deg, #888844 0%, #888844 ' + 0 + '%, #444444 0%, #444444 100%');
});