var titanFire = function(loader)
{
	var fire;
	var fireT;
	var ball;
	var animator;
	var animatorFire;
	var animatorDuh;
	
	var first = false;
	
	var generate = function()
	{
		var texture = loader.fireTitan['./textures/humans/fireTitan.png'];
		var material = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: false, color: 0xffffff,  affectedByDistance: true, transparent : true});
		fire = new THREE.Sprite(material);
		//fire.material.alphaTest = 0.5;

		fire.scale.set( 0.08, 0.16, 1.0 );
		animator = new Animator(material, 0.125, 0, 0.125, 250);
		
		texture = loader.fireTitan['./textures/humans/fireTitan3.png'];
		material = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: false, color: 0xffffff,  affectedByDistance: true, transparent : true});
		fireT = new THREE.Sprite(material);
		//fireT.material.alphaTest = 0.5;

		fireT.scale.set( 0.08, 0.16, 1.0 );
		animatorDuh = new Animator(material, 0.125, 0, 0.125, 100);
		
		texture = THREE.ImageUtils.loadTexture('textures/explosion_1.png');
		material = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: false, color: 0xffffff,  affectedByDistance: true, transparent : true});
		ball = new THREE.Sprite(material);
		ball.material.alphaTest = 0.5;

		ball.scale.set( 0.6, 0.8, 1.0);
		animatorFire = new Animator(material, 1.0 / 43.0, 0.0, 1.0 / 43.0, 50);
	};
	
	this.getMesh = function()
	{
		return fire;
	};
	
	generate();

	this.update = function(delta, scene) 
	{	
		if(animator.isFirst())
		{
			animator.update(delta);
		}
		else
		{
			if(!first)
			{
				fireT.position.x = fire.position.x;
				fireT.position.z = fire.position.z;
				fireT.position.y = fire.position.y + 0.01;
				fireT.material.opacity = 0;
				
				ball.position.x = fire.position.x;
				ball.position.z = fire.position.z;
				ball.position.y = 0.03;
				
				scene.add(ball);
				fire.material.opacity = 0;
				scene.add(fireT);
				
				first = true;
			}
		}
		if(first)
		{
			if(animatorFire.isFirst())
			{
				animatorFire.update(delta);
				fireT.material.opacity += 1.0 / 43.0;
				ball.material.opacity -= 1.0 / 43.0;
			}
			else
			{
				scene.remove(ball);
			}
			
			animatorDuh.update(delta);
		}
		//return true;
	};
};