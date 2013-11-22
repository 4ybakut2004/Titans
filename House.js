var Houses = function(type_tree)
{
	var houses;
	var houses_met;

	var generate = function()
	{
		switch(type_tree)
		{
			case 0:
				var texture = THREE.ImageUtils.loadTexture( "textures/house.png" );
				texture.anisotropy = 16;
				var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture, transparent : true, side: THREE.DoubleSide});
				var geometry = new THREE.PlaneGeometry(0.20, 0.19);
				houses = new THREE.Mesh(geometry, material);
				break;
			case 1:
				var texture = THREE.ImageUtils.loadTexture( "textures/tree_small.png" );
				var material = new THREE.MeshBasicMaterial({color: 0x000000, map: texture, transparent : true, side: THREE.DoubleSide});
				var geometry = new THREE.PlaneGeometry(0.04, 0.08);
				trees = new THREE.Mesh(geometry, material);
				break;
		};
		
		houses.rotation.y = 3.14 / 2;
		var material_met = new THREE.MeshBasicMaterial({color: 0x00ff00});
		var geometry_met = new THREE.PlaneGeometry(0.04, 0.04);
		houses_met = new THREE.Mesh(geometry_met, material_met);
		houses_met.rotation.x = - 3.14 / 2;
	};

	this.getMesh = function(type_mesh)
	{
		if(type_mesh) return houses;
		else return houses_met;
	};

	generate();
};