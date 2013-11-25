var SkyBox = function (path)
{
	var skyBox = new THREE.Mesh(new THREE.CubeGeometry(6, 6, 6, 7, 7, 7),
								new THREE.MeshFaceMaterial([
										loadTexture( path + 'grimmnight_rt.png' ), // right
										loadTexture( path + 'grimmnight_lf.png' ), // left
										loadTexture( path + 'grimmnight_up.png' ), // top
										loadTexture( path + 'grimmnight_dn.jpg' ), // bottom
										loadTexture( path + 'grimmnight_bk.png' ), // back
										loadTexture( path + 'grimmnight_ft.png' )  // front
									]));
	skyBox.rotation.y = 3.14 / 2;
	skyBox.scale.x = - 1;

	this.getMesh = function()
	{
		return skyBox;
	};

	this.update = function(position)
	{
		skyBox.position.x = position.x;
		skyBox.position.y = position.y + 0.5;
		skyBox.position.z = position.z;
	};
};