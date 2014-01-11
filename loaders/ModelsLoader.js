function ModelsLoader(surface, first)
{
	var modelsCount       = 22;
	var housesCount       = 0;
	var cannonsCount      = 0;
	var loadedModelsCount = 0;
	this.houses           = [];
	this.cannons          = [];
	this.humans           = {};
	this.trees            = [];
	this.skybox           = {};
	this.floor            = {};
	this.fireTitan        = {};
	this.fire        	  = {};
	this.trees            = {};
	this.treemodels       = {};
	var scope             = this;

	var paths = 
	[
		{'path': './models/houses/4/models/model.dae',        'type': 'house'},
		{'path': './models/trees/1/tree-obj.js',              'type': 'treemodels'},
		{'path': './models/cannons/1/models/32lb Cannon.dae', 'type': 'cannon'},
		{'path': './textures/humans/human_2.png',             'type': 'humans'},
		{'path': './textures/humans/human_1.png',             'type': 'humans'},
		{'path': './textures/humans/human_3.png',             'type': 'humans'},
		{'path': './textures/humans/human_4.png',             'type': 'humans'},
		{'path': './skybox/grimmnight_rt.jpg',                'type': 'skybox'},
		{'path': './skybox/grimmnight_lf.jpg',                'type': 'skybox'},
		{'path': './skybox/grimmnight_up.jpg',                'type': 'skybox'},
		{'path': './skybox/grimmnight_dn.jpg',                'type': 'skybox'},
		{'path': './skybox/grimmnight_bk.jpg',                'type': 'skybox'},
		{'path': './skybox/grimmnight_ft.jpg',                'type': 'skybox'},
		{'path': './textures/grass.jpg',                      'type': 'floor'},
		{'path': './textures/humans/fireTitan.png',           'type': 'fireTitan'},
		{'path': './textures/humans/fireTitan3.png',          'type': 'fireTitan'},
		{'path': './textures/fire.png',                       'type': 'fire'},
		{'path': './textures/fire2.png',                      'type': 'fire'},
		{'path': './textures/fire3.png',                      'type': 'fire'},
		{'path': './textures/tree.png',                       'type': 'trees'},
		{'path': './textures/tree_small.png',                 'type': 'trees'},
		{'path': './textures/forest.png',                     'type': 'trees'}
	];

	var load = function(path)
	{
		switch(path.type)
		{
			case 'cannon':
			case 'house':
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
							case './models/houses/4/models/model.dae':
								scope.houses[housesCount].dae.scale.x = scope.houses[housesCount].dae.scale.z = 0.018;
								scope.houses[housesCount].dae.scale.y = 0.012;
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
					$('.models-loading').eq(0).css('background', 'linear-gradient(90deg, #B0C4DE 0%, #B0C4DE ' + (100 * loadedModelsCount / modelsCount) + '%, #ffffff 0%, #ffffff 100%)');
					if(loadedModelsCount < modelsCount)
					{
						load(paths[loadedModelsCount]);
					}
					else
					{	
						surface.start(scope);
						$('.errorMgsFull').eq(0).css('display', '');
						$('.models-loading').eq(0).css('display', 'none');
						if(first) $('#myModal').modal('show');
					}
				});
				break;
				
			case 'skybox':
			case 'humans':
			case 'floor':
			case 'fireTitan':
			case 'fire':
			case 'trees':
				scope[path.type][path.path] = THREE.ImageUtils.loadTexture(path.path, undefined, function(){
					loadedModelsCount++;
					$('.models-loading').eq(0).css('background', 'linear-gradient(90deg, #B0C4DE 0%, #B0C4DE ' + (100 * loadedModelsCount / modelsCount) + '%, #ffffff 0%, #ffffff 100%)');
					if(loadedModelsCount < modelsCount)
					{
						load(paths[loadedModelsCount]);
					}
					else
					{	
						surface.start(scope);
						$('.errorMgsFull').eq(0).css('display', '');
						$('.models-loading').eq(0).css('display', 'none');
						if(first) $('#myModal').modal('show');
					}
				});
				break;

			case 'treemodels':
		        var loader = new THREE.JSONLoader( true );
   				loader.load( path.path, function( geometry, materials ) {
   					var material = new THREE.MeshFaceMaterial(materials);
   					for(var i = 0; i < materials.length; i++)
   					{
   						materials[i].alphaTest = 0.5;
   					}
		            scope.treemodels[path.path] = new THREE.Mesh(geometry, material);
		            scope.treemodels[path.path].scale.set( 0.015, 0.015, 0.015 );
		            scope.treemodels[path.path].castShadow = true;
		            console.log(scope.treemodels[path.path].children.length);
		            loadedModelsCount++;
					$('.models-loading').eq(0).css('background', 'linear-gradient(90deg, #B0C4DE 0%, #B0C4DE ' + (100 * loadedModelsCount / modelsCount) + '%, #ffffff 0%, #ffffff 100%)');
					if(loadedModelsCount < modelsCount)
					{
						load(paths[loadedModelsCount]);
					}
					else
					{	
						surface.start(scope);
						$('.errorMgsFull').eq(0).css('display', '');
						$('.models-loading').eq(0).css('display', 'none');
						if(first) $('#myModal').modal('show');
					}
		        });
				break;
		}
	};

	load(paths[loadedModelsCount]);
}