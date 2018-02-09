var scene, camera, renderer;

var width = window.innerWidth;
var height = window.innerHeight;

var surface;

function init(){

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

	camera.position.z = 50;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);

	surface = new THREE.Mesh(
		new THREE.PlaneGeometry(30, 30, 30),
		new THREE.MeshBasicMaterial({
			color: 0x335566
		})
	);

	for(var i = 0; i < geometry.vertices.length; i++){
		var value = Math.random
	}

	scene.add(surface);

	requestAnimationFrame(render);
}

function render(){
	requestAnimationFrame(render);

	renderer.render(scene, camera);
}

init();