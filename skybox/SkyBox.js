var SkyBox = function (loader)
{
    var tex1 = loader.skybox['./skybox/grimmnight_rt.jpg'];
	var tex2 = loader.skybox['./skybox/grimmnight_lf.jpg'];
	var tex3 = loader.skybox['./skybox/grimmnight_up.jpg'];
	var tex4 = loader.skybox['./skybox/grimmnight_dn.jpg'];
	var tex5 = loader.skybox['./skybox/grimmnight_bk.jpg'];
	var tex6 = loader.skybox['./skybox/grimmnight_ft.jpg'];
	var skyBox = new THREE.Mesh(new THREE.CubeGeometry(6, 6, 6, 7, 7, 7),
								new THREE.MeshFaceMaterial([
										new THREE.MeshBasicMaterial({map: tex1, overdraw: true}),
										new THREE.MeshBasicMaterial({map: tex2, overdraw: true}),
										new THREE.MeshBasicMaterial({map: tex3, overdraw: true}),
										new THREE.MeshBasicMaterial({map: tex4, overdraw: true}),
										new THREE.MeshBasicMaterial({map: tex5, overdraw: true}),
										new THREE.MeshBasicMaterial({map: tex6, overdraw: true})
									]));
	skyBox.rotation.y = 3.14 / 2 + 5 * 3.14 / 4;
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