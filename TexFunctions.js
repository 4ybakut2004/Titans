function loadTexture(path) 
{
	var texture = THREE.ImageUtils.loadTexture(path);
	var material = new THREE.MeshBasicMaterial({map: texture, overdraw: true});

	return material;
}