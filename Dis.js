var Dis = function(scren)
{
	var mapFrame;				// рамка дл€ карты
	var downDiv;				// нижн€€ дивка
	var redC, greenC;			// красный и зеленые круги
	var skillFrame = [];		// рамка скила
	var Step;					// фраза ступень
	var stepName;				// по€снение к ступени
	
	var arrayStep = new Array('textures/dis/level1.png', 'textures/dis/level2.png', 'textures/dis/level3.png');
	
	var generate = function(scren)
	{
		var create = function(path, x, y, _alignment)
		{
			var texture = THREE.ImageUtils.loadTexture(path);
			texture.anisotropy = 16;
			var material = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: true, alignment: _alignment, transparent: true});
			var tmp = new THREE.Sprite(material);
			tmp.position.set(x, y, 0); 
			return tmp;
		};
		
		mapFrame = create('textures/dis/frame.png', -128, -128, THREE.SpriteAlignment.topLeft);
		mapFrame.scale.set(248, 248, 1.0);	
		scren.add(mapFrame);

		for(var i = 0; i < 4; i++)
		{
			var TskillFrame = create('textures/dis/skill_zero.png', window.innerWidth / 2 - 115 + i * 50, window.innerHeight - 30, THREE.SpriteAlignment.bottomLeft);
			TskillFrame.scale.set(41, 46, 1.0);	
			scren.add(TskillFrame);
			skillFrame.push(TskillFrame);	
		}

		downDiv = create('textures/dis/frame_down.png', window.innerWidth / 2 - 482, window.innerHeight + 50, THREE.SpriteAlignment.bottomLeft);
		downDiv.scale.set(482, 130, 1.0);
		downDiv.position.z = -20;	
		scren.add(downDiv);

		Step = create('textures/dis/gen_text.png', window.innerWidth - 220 , 20, THREE.SpriteAlignment.topLeft);
		Step.scale.set(103, 23, 1.0);	
		scren.add(Step);

		stepName = create('textures/dis/level1.png', window.innerWidth - 85 , 20, THREE.SpriteAlignment.topLeft);
		stepName.scale.set(50, 23, 1.0);	
		scren.add(stepName);		
	};

	generate(scren);

	this.update = function()
	{
		downDiv.position.set(window.innerWidth / 2 - 482, window.innerHeight + 50, -20);

		for(var  i = 0; i < 4; i++)
		{
			skillFrame[i].position.set(window.innerWidth / 2 - 115 + i * 50, window.innerHeight - 30, 0);
		}

		stepName.position.set(window.innerWidth - 85 , 20, 0);
		Step.position.set(window.innerWidth - 220 , 20, 0);
	}

	this.updateLevel = function(numb)
	{
		scren.remove(stepName);
		stepName = create(stepName[numb], window.innerWidth - 85 , 20, THREE.SpriteAlignment.topLeft);
		stepName.scale.set(50, 23, 1.0);	
		scren.add(stepName); 
	}
};