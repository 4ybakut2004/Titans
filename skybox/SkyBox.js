var SkyBox = function (path)
{
	var skyBox = new THREE.Mesh(new THREE.CubeGeometry(6, 6, 6, 7, 7, 7),
								new THREE.MeshFaceMaterial([
										loadTexture( path + 'grimmnight_rt.jpg' ), // right
										loadTexture( path + 'grimmnight_lf.jpg' ), // left
										loadTexture( path + 'grimmnight_up.jpg' ), // top
										loadTexture( path + 'grimmnight_dn.jpg' ), // bottom
										loadTexture( path + 'grimmnight_bk.jpg' ), // back
										loadTexture( path + 'grimmnight_ft.jpg' )  // front
									]));
	skyBox.rotation.y = -3.14 / 2;
	skyBox.scale.x = - 1;

	this.getMesh = function()
	{
		return skyBox;
	};

	this.update = function(position)
	{
		skyBox.position.x = position.x;
		skyBox.position.y = position.y;
		skyBox.position.z = position.z;
	};
};