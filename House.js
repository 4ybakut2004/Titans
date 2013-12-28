var Houses = function(type_tree, models)
{
	var houses;
	
	var generate = function()
	{
		houses = models[type_tree].dae.clone();
		houses.castShadow = true;
		houses.receiveShadow = false;
	};

	this.getMesh = function()
	{
		return houses;
	};

	generate();
};