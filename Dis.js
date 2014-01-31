var Dis = function(scren)
{
	var mapFrame;				// ðàìêà äëÿ êàðòû
	var downDiv;				// íèæíÿÿ äèâêà
	var redC, greenC;			// êðàñíûé è çåëåíûå êðóãè
	var skillFrame = [];		// ðàìêà ñêèëà
	var Step;					// ôðàçà ñòóïåíü
	var stepName;				// ïîÿñíåíèå ê ñòóïåíè
	var genOput;				// начальная полоска опыта

	var texLive;
	var textHung;
	
	var arrayStep = new Array('textures/dis/level1.png', 'textures/dis/level2.png', 'textures/dis/level3.png');
	var arraySkill = new Array('textures/dis/1.png', 'textures/dis/2.png', 'textures/dis/3.png', 'textures/dis/4.png');
	
	var create = function(path, x, y, _alignment)
	{
		var texture = THREE.ImageUtils.loadTexture(path);
		texture.anisotropy = 16;
		var material = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: true, alignment: _alignment, transparent: true});
		var tmp = new THREE.Sprite(material);
		tmp.position.set(x, y, 0); 
		return tmp;
	};

	var generate = function(scren)
	{	
		mapFrame = create('textures/dis/frame.png', -128, -128, THREE.SpriteAlignment.topLeft);
		mapFrame.scale.set(248, 248, 1.0);	
		scren.add(mapFrame);

		for(var i = 0; i < 4; i++)
		{
			var TskillFrame = create(arraySkill[i], window.innerWidth / 2 - 115 + i * 50, window.innerHeight - 30, THREE.SpriteAlignment.bottomLeft);
			TskillFrame.scale.set(41, 46, 1.0);	
			scren.add(TskillFrame);
			skillFrame.push(TskillFrame);	
			skillFrame[i].position.set(window.innerWidth / 2 - 115 + i * 50, window.innerHeight - 30, -5.0);
		}

		downDiv = create('textures/dis/frame_down.png', window.innerWidth / 2 - 482, window.innerHeight + 50, THREE.SpriteAlignment.bottomLeft);
		downDiv.scale.set(482, 130, 1.0);
		downDiv.position.z = -20;	
		scren.add(downDiv);

		Step = create('textures/dis/gen_text.png', window.innerWidth - 339 , 15, THREE.SpriteAlignment.topLeft);
		Step.scale.set(153, 24, 1.0);	
		scren.add(Step);

		stepName = create('textures/dis/level1.png', window.innerWidth - 155 , 15, THREE.SpriteAlignment.topLeft);
		stepName.scale.set(93, 24, 1.0);	
		scren.add(stepName);	

		genOput	= create('textures/dis/oput_gen.png', window.innerWidth - 260 - 121.5, 10, THREE.SpriteAlignment.topLeft);
		genOput.scale.set(243, 8, 1.0);	
		scren.add(genOput);

		textHung = create('textures/dis/hungText.png', window.innerWidth / 2 + 482 / 2 - 157, window.innerHeight - 98, THREE.SpriteAlignment.topLeft);
		textHung.scale.set(68, 19, 1.0);	
		scren.add(textHung);

		texLive = create('textures/dis/liveText.png', window.innerWidth / 2 - 219, window.innerHeight - 98, THREE.SpriteAlignment.topLeft);
		texLive.scale.set(68, 19, 1.0);	
		scren.add(texLive);

	};

	generate(scren);

	this.update = function()
	{
		downDiv.position.set(window.innerWidth / 2 - 482, window.innerHeight + 50, -20);

		for(var  i = 0; i < 4; i++)
		{
			skillFrame[i].position.set(window.innerWidth / 2 - 115 + i * 50, window.innerHeight - 30, -5.0);
		}

		stepName.position.set(window.innerWidth - 155 , 15, 0);
		Step.position.set(window.innerWidth - 339 , 15, 0);
		genOput.position.set(window.innerWidth - 260 - 121.5, 10, 0);

		textHung.position.set(window.innerWidth / 2 + 482 / 2 - 157, window.innerHeight - 98, 0);
		texLive.position.set(window.innerWidth / 2 - 219, window.innerHeight - 98, 0);
	}

	this.updateLevel = function(numb, screnD)
	{
		screnD.remove(stepName);
		stepName = create(arrayStep[numb], window.innerWidth - 155 , 15, THREE.SpriteAlignment.topLeft);
		stepName.scale.set(93, 24, 1.0);	
		screnD.add(stepName); 
	}
};