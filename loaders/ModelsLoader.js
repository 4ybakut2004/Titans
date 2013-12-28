function ModelsLoader(surface, first)
{
	var modelsCount       = 4;
	var housesCount       = 0;
	var cannonsCount      = 0;
	var loadedModelsCount = 0;
	this.houses           = [];
	this.cannons          = [];
	this.trees            = [];
	var scope             = this;

	var paths = 
	[
		{'path': './models/houses/1/Herrengasse_41 (1).dae',                 'type': 'house'},
		{'path': './models/houses/2/fachwerk.dae',                           'type': 'house'},
		{'path': './models/houses/3/models/simpel houten huis.dae',          'type': 'house'},
		{'path': './models/cannons/1/models/32lb Cannon.dae',                'type': 'cannon'}
	];

	var load = function(path)
	{
		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;

		console.log(path.type);


		loader.load(path.path, function(collada){
			var col = {
				'dae':  collada.scene,
				'skin': collada.skins[0]
			}

			if(path.type == 'house')
			{
				scope.houses.push(col);
				switch(path.path)
				{
					case './models/houses/1/Herrengasse_41 (1).dae':
						scope.houses[housesCount].dae.scale.x = scope.houses[housesCount].dae.scale.y = scope.houses[housesCount].dae.scale.z = 0.0003;
						break;

					case './models/houses/2/fachwerk.dae':
						scope.houses[housesCount].dae.scale.x = scope.houses[housesCount].dae.scale.y = scope.houses[housesCount].dae.scale.z = 0.0003;
						break;

					case './models/houses/3/models/simpel houten huis.dae':
						scope.houses[housesCount].dae.scale.x = scope.houses[housesCount].dae.scale.y = scope.houses[housesCount].dae.scale.z = 0.005;
						break;
				}

				scope.houses[housesCount].dae.updateMatrix();
				housesCount++;
			}

			if(path.type == 'cannon')
			{
				scope.cannons.push(col);
				scope.cannons[cannonsCount].dae.scale.x = scope.cannons[cannonsCount].dae.scale.y = scope.cannons[cannonsCount].dae.scale.z = 0.0003;
				scope.cannons[cannonsCount].dae.updateMatrix();
				cannonsCount++;
			}

			loadedModelsCount++;
			if(loadedModelsCount < modelsCount)
			{
				load(paths[loadedModelsCount]);
			}
			else
			{	
				surface.start(scope);
				if(first) $('#myModal').modal('show');
			}
		});
	};

	load(paths[loadedModelsCount]);
}