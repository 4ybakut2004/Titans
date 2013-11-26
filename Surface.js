// Класс поверхности Three.js
// Здесь создается рендер, объекты мира, а так же происходит отрисовка

var Surface = function()
{
	// Все кординаты загоняются в один предел. Делятся на значение переменной max.
	var max = 1000;
	// Границы мира
	var borders = new THREE.Vector4(-1.0, -1.0, 1.0, 1.0);

	// Переменная, отвечающая за то, открыто меню, или нет
	var prioritet = 0;

	var scene;
	var camera;
	var mapCamera
	var renderer;
	var controls;
	var time;
	var clock = new THREE.Clock();

	var skyBox;

	// Массивы объектов
	var objects = [];
	var humans = [];
	var trees = [];
	var houses = [];
	
	count_humans = 10;
	count_trees = 40 * 2;
	count_houses = 20;
	
	// Размеры мини-карты
	var mapWidth = 200;
	var mapHeight = 200;
	
	// Свет
	var dirLight;
	var spotLight;
	
	// Идентификатор процесса рендеринга
	var id;

	this.setPrioritet = function(serArg)
	{
		prioritet = serArg;
	};

	var getRandomInt = function(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
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
				index++;
			}
		}
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
	var spawnHuman = function(humanType)
	{
		var human = new Human(humanType)
		humans.push(human);
		human.getMesh(1).position.x = (getRandomInt(40, 260) - 150) / 100.0;
		human.getMesh(1).position.z = (getRandomInt(40, 260) - 150) / 100.0;
		
		human.getMesh(0).position.x = human.getMesh(1).position.x;
		human.getMesh(0).position.z = human.getMesh(1).position.z;
		human.getMesh(0).position.y = 0.4;
		
		scene.add(human.getMesh(1));
		scene.add(human.getMesh(0));
	};

	// Создает дерево
	var spawnTree = function(treeType, numbTree)
	{
		trees.push(new Trees(treeType));
		if(numbTree < count_trees / 2.0)
		{
			trees[trees.length - 1].getMesh(1).position.x = (getRandomInt(10, 290) - 150) / 100.0;
			trees[trees.length - 1].getMesh(1).position.z = (getRandomInt(10, 50)  - 150) / 100.0;
		}
		else
		{
			trees[trees.length - 1].getMesh(1).position.x = (getRandomInt(10, 50)  - 150) / 100.0;
			trees[trees.length - 1].getMesh(1).position.z = (getRandomInt(10, 290) - 150) / 100.0;
			trees[trees.length - 1].getMesh(1).rotation.y =  -3.14 / 3;
		}
		
		trees[trees.length - 1].getMesh(1).position.y = -0.015;
		
		trees[trees.length - 1].getMesh(0).position.x = trees[trees.length - 1].getMesh(1).position.x;
		trees[trees.length - 1].getMesh(0).position.z = trees[trees.length - 1].getMesh(1).position.z;
		trees[trees.length - 1].getMesh(0).position.y = 0.4;
		
		trees[trees.length - 1].update(Date.now() - time, controls.getObject());
		trees[trees.length - 1].collision(objects);
		
		scene.add(trees[trees.length - 1].getMesh(1));
		scene.add(trees[trees.length - 1].getMesh(0));
	};

	// Создает дом
	var pred_houses = 0;
	var spawnHouse = function(houseType, number)
	{
		houses.push(new Houses(houseType));
		
		houses[houses.length - 1].getMesh(1).position.x = (- 140 + number * (300.0/count_houses - 1)) / 100.0;
		houses[houses.length - 1].getMesh(1).position.z = (getRandomInt(0, 40) + 100) / 100.0;
		if(houses[houses.length - 1].getMesh(1).position.z != pred_houses) houses[houses.length - 1].getMesh(1).position.z += 10.0/100.0;
		
		pred_houses = houses[houses.length - 1].getMesh(1).position.z;
		
		houses[houses.length - 1].getMesh(1).position.y = - 0.074 + 0.05;
		
		houses[houses.length - 1].getMesh(0).position.x = houses[houses.length - 1].getMesh(1).position.x;
		houses[houses.length - 1].getMesh(0).position.z = houses[houses.length - 1].getMesh(1).position.z;
		houses[houses.length - 1].getMesh(0).position.y = 0.4;
		
		scene.add(houses[houses.length - 1].getMesh(1));
		scene.add(houses[houses.length - 1].getMesh(0));
	};
	
	// Тут вся инициализация
	var init = function()
	{
		scene = new THREE.Scene(); 
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.0001, 7);
		renderer = new THREE.WebGLRenderer({'antialias':true});  
		
		controls = new THREE.FirstPersonControls(camera, borders);
		scene.add(controls.getObject());
		
		// Камера миникарты
		mapCamera = new THREE.OrthographicCamera(
			-1.5,  				// Left
			1.5,  				// Right
			1.5,  				// Top
			-1.5, 				// Bottom
			-1.5,               // Near 
			7.0);             	// Far
		mapCamera.up = new THREE.Vector3(0,0,-1);
		mapCamera.lookAt( new THREE.Vector3(0,-1,0) );
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
		
		var floor = new Terrain();
		scene.add(floor.getMesh());
		objects.push(floor.getMesh());
		
		// Начальный состав людской армии
		for(var i = 0; i < count_humans; i++)
		{
			spawnHuman(HumanTypes.Soldier);
		}
		
		for(var i = 0; i < count_trees; i++)
		{
			if(i < (count_trees)/ 2)
			{
				spawnTree(0, i);
			}
			else
			{
				spawnTree(1, i);
			}
		}
		
		for(var i = 0; i < count_houses; i++)
		{
			spawnHouse(getRandomInt(0, 1), i);
		}
		
		$(window).bind( 'resize', onWindowResize);
		$(window).bind( 'mousedown', onDocumentMouseDown);
	};

	var render = function() 
	{
		id = requestAnimationFrame(render);		
		
		var delta = clock.getDelta() * 1000.0;
		if(delta > 200) delta = 200;
		console.log(delta);
		if(prioritet>0)
		{
			// Обрабатываем движение главного героя
			controls.update(delta);	
			controls.collision(objects);

			// Двигаем скайбокс вместе с камерой
			skyBox.update(controls.getObject().position);

			if(index > count_story)
			// Обрабатываем поведение людей
			for(var i = 0; i < humans.length; i++)
			{
				if(!humans[i].update(delta, controls.getObject()))
				{
					scene.remove(humans[i].getMesh(1));
					scene.remove(humans[i].getMesh(0));
					humans.splice(i, 1);
					none_opt += 10;
					$('#oput').css('backgroundImage', 'linear-gradient(0deg, #888844 0%, #888844 ' + none_opt + '%, #444444 0%, #444444 100%');
					if(none_opt == 100) none_opt = 0;
					spawnHuman(HumanTypes.Soldier);
				}
				else humans[i].collision(objects);
			}
			
			// Отрисовываем сцену
			var w = window.innerWidth, h = window.innerHeight;

			renderer.setViewport( 0, 0, w, h );
			renderer.clear();
			
			renderer.render(scene, camera);
			
			renderer.setViewport( 10, h - mapHeight - 10, mapWidth, mapHeight );
			renderer.render( scene, mapCamera );
		}
	};

	this.start = function()
	{
		init();
		render();
	};
	
	this.stop_render = function()
	{
		cancelAnimationFrame(id);
		renderer.domElement.remove();
	};
};

var surface;
var sound;
var full_live = 100;					// сколько жизни
var none_opt = 0;						// сколько опыта
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
		}
	} 
	else 
	{
	    console.log("Pointer Lock was lost.");
	    surface.setPrioritet(0);
	    $('#myModal').modal('show');
	}
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
	surface.stop_render();
	
	surface = new Surface();
	surface.start();

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
	surface.start();

	$('#myModal').modal('show');
	
	sound = new Sound(['audio/1.ogg']);
	sound.play();

	$('#live').css('backgroundImage', 'linear-gradient(0deg, #448844 0%, #448844 ' + full_live + '%, #884444 0%, #884444 100%');
});
