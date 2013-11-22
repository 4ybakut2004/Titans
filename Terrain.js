var Terrain = function()
{
	var terrain;

	var generate = function()
	{
      	var texture = THREE.ImageUtils.loadTexture( "textures/grass.jpg" );
      	texture.anisotropy = 16;
      	var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture});
		var geometry = new THREE.PlaneGeometry(3, 3, 30, 30);
		for(var i = 0; i < geometry.vertices.length; i++)
		{
			geometry.vertices[i].z = Math.random()/35.0 - 0.045;
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