var Trees = function(type_tree)
{
	var trees;
	var trees_met;

	var generate = function()
	{
		switch(type_tree)
		{
			case 0:
				var texture = THREE.ImageUtils.loadTexture( "textures/tree.png" );
				var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture, transparent : true, side: THREE.DoubleSide});
				var geometry = new THREE.PlaneGeometry(0.05, 0.12);
				trees = new THREE.Mesh(geometry, material);
				break;
			case 1:
				var texture = THREE.ImageUtils.loadTexture( "textures/tree_small.png" );
				var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture, transparent : true, side: THREE.DoubleSide});
				var geometry = new THREE.PlaneGeometry(0.04, 0.08);
				trees = new THREE.Mesh(geometry, material);
				break;
		};
		
		var material_met = new THREE.MeshBasicMaterial({color: 0x00ff00});
		var geometry_met = new THREE.PlaneGeometry(0.04, 0.04);
		trees_met = new THREE.Mesh(geometry_met, material_met);
		trees_met.rotation.x = - 3.14 / 2;
	};

	this.getMesh = function(type_mesh)
	{
		if(type_mesh) return trees;
		else return trees_met;
	};

	generate();
};