var Houses = function(type_tree)
{
	var houses;
	var houses_met;

	var ray = new THREE.Raycaster();
	ray.ray.direction.set(0, -1, 0);
	
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
				var texture = THREE.ImageUtils.loadTexture( "textures/house_old.png" );
				var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture, transparent : true, side: THREE.DoubleSide});
				var geometry = new THREE.PlaneGeometry(0.19, 0.20);
				houses = new THREE.Mesh(geometry, material);
				break;
		};
		
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