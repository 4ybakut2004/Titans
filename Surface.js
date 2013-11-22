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

	var skyBox;

	// Массивы объектов
	var objects = [];
	var humans = [];
	var trees = [];
	var houses = [];
	
	count_humans = 10;
	count_trees = 40;
	count_houses = 10;
	
	// Размеры мини-карты
	var mapWidth = 200;
	var mapHeight = 200;
	
	// Идентификатор процесса рендеринга
	var id;

	this.setPrioritet = function(serArg)
	{
		prioritet = serArg;
		time = Date.now();
	};

	var getRandomInt = function(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	var onDocumentMouseDown = function(event) 
	{
		controls.mouseDown(event, objects);		
	};

	var onWindowResize = function() 
	{
	    camera.aspect = window.innerWidth / window.innerHeight;
	    camera.updateProjectionMatrix();

	    renderer.setSize( window.innerWidth, window.innerHeight );
	    
	    var z = window.innerHeight/window.innerWidth;
	};


	var init = function()
	{
		scene = new THREE.Scene(); 
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.000001, 5);
		renderer = new THREE.WebGLRenderer({'antialias':true});  
		
		controls = new THREE.FirstPersonControls(camera, borders);
		scene.add(controls.getObject());
		
		mapCamera = new THREE.OrthographicCamera(
		window.innerWidth / -1000,		// Left
		window.innerWidth / 1000,		// Right
		window.innerHeight / 550,		// Top
		window.innerHeight / -550,	// Bottom
		-2.5,            			// Near 
		5.0);           			// Far 
		mapCamera.up = new THREE.Vector3(0,0,-1);
		mapCamera.lookAt( new THREE.Vector3(0,-1,0) );
		scene.add(mapCamera);
	
		time = Date.now();
		
		renderer.setSize(window.innerWidth, window.innerHeight); 
		renderer.autoClear = false;
	    $(document.body).append(renderer.domElement);

	    skyBox = new SkyBox('skybox/');
		scene.add(skyBox.getMesh());
		
		for(var i = 0; i < count_humans; i++)
		{
			humans.push(new Human());
			humans[humans.length - 1].getMesh(1).position.x = (getRandomInt(0, 300) - 150) / 100.0;
			humans[humans.length - 1].getMesh(1).position.z = (getRandomInt(0, 300) - 150) / 100.0;
			
			humans[humans.length - 1].getMesh(0).position.x = humans[humans.length - 1].getMesh(1).position.x;
			humans[humans.length - 1].getMesh(0).position.z = humans[humans.length - 1].getMesh(1).position.z;
			humans[humans.length - 1].getMesh(0).position.y = 0.4;
			
			scene.add(humans[humans.length - 1].getMesh(1));
			scene.add(humans[humans.length - 1].getMesh(0));
		}
		
		for(var i = 0; i < count_trees - 10; i++)
		{
			if(i < (count_trees  - 10)/ 2)
			{
				trees.push(new Trees(0));
			}
			else
			{
				trees.push(new Trees(1));
			}
			trees[trees.length - 1].getMesh(1).position.x = (getRandomInt(0, 300) - 150) / 100.0;
			trees[trees.length - 1].getMesh(1).position.z = (getRandomInt(0, 50)  - 150) / 100.0;
			trees[trees.length - 1].getMesh(1).position.y = -0.015;
			
			trees[trees.length - 1].getMesh(0).position.x = trees[trees.length - 1].getMesh(1).position.x;
			trees[trees.length - 1].getMesh(0).position.z = trees[trees.length - 1].getMesh(1).position.z;
			trees[trees.length - 1].getMesh(0).position.y = 0.4;
			
			scene.add(trees[trees.length - 1].getMesh(1));
			scene.add(trees[trees.length - 1].getMesh(0));
		}
		
		for(var i = 0; i < count_houses; i++)
		{
			houses.push(new Houses(0));
			
			houses[houses.length - 1].getMesh(1).position.x = (getRandomInt(0, 50)  + 100) / 100.0;
			houses[houses.length - 1].getMesh(1).position.z = (- 150 + i * 30) / 100.0;
			houses[houses.length - 1].getMesh(1).position.y = 0.01;
			
			houses[houses.length - 1].getMesh(0).position.x = houses[houses.length - 1].getMesh(1).position.x;
			houses[houses.length - 1].getMesh(0).position.z = houses[houses.length - 1].getMesh(1).position.z;
			houses[houses.length - 1].getMesh(0).position.y = 0.4;
			
			scene.add(houses[houses.length - 1].getMesh(1));
			scene.add(houses[houses.length - 1].getMesh(0));
		}
		var floor = new Terrain();
		scene.add(floor.getMesh());
		objects.push(floor.getMesh());
		
		$(window).bind( 'resize', onWindowResize);
	};

	var render = function() 
	{
		id = requestAnimationFrame(render);		
		
		var dateN;
		if(prioritet>0)
		{
			dateN = Date.now();
			controls.update(Date.now() - time);	
			controls.collision(objects);

			skyBox.update(controls.getObject().position);
			for(var i = 0; i < humans.length; i++)
			{
				humans[i].update(Date.now() - time, controls.getObject());
				humans[i].collision(objects);
			}
			
			var w = window.innerWidth, h = window.innerHeight;

			renderer.setViewport( 0, 0, w, h );
			renderer.clear();
			
			renderer.render(scene, camera);
			
			renderer.setViewport( 10, h - mapHeight - 10, mapWidth, mapHeight );
			renderer.render( scene, mapCamera );
			
			time = dateN;
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

function pointerLockChange() 
{
	if (document.mozPointerLockElement === elem || document.webkitPointerLockElement === elem)
	{
	    console.log("Pointer Lock was successful.");
	    surface.setPrioritet(1);
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

function restart()
{
	
	surface.stop_render();
	
	surface = new Surface();
	surface.start();

	lockPointer();
}

$(document).ready(function() 
{
	surface = new Surface();
	surface.start();

	$('#myModal').modal('show');
	
	sound = new Sound(['audio/1.ogg']);
	//sound.play();

	$('#oput').css('backgroundImage', 'linear-gradient(0deg, #888844 0%, #888844 ' + none_opt + '%, #444444 0%, #444444 100%');
	$('#live').css('backgroundImage', 'linear-gradient(0deg, #888844 0%, #888844 ' + full_live + '%, #444444 0%, #444444 100%');
});