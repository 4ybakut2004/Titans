var Terrain = function()
{
	var terrain;

	var generate = function()
	{
      	var texture = THREE.ImageUtils.loadTexture( "textures/grass.jpg" );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 30, 30 );
      	texture.anisotropy = 16;
      	var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture});
		var geometry = new THREE.PlaneGeometry(3, 3, 30, 30);
		for(var i = 0; i < geometry.vertices.length; i++)
		{
			if(i < 30*25) geometry.vertices[i].z = - Math.random()/35.0 - 0.045;
			else geometry.vertices[i].z = - 0.074;
		}
      	terrain = new THREE.Mesh(geometry, material);
      	terrain.rotation.x = - 3.14 / 2;
	};

	this.getMesh = function()
	{
		return terrain;
	};

	generate();
};