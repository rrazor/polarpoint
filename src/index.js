import * as THREE from 'three';

var PI = 3.14159;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
var cube = new THREE.Mesh(geometry, material);
cube.position.z = 10;
scene.add(cube);

var addEquator = function () {
	var equatorMaterial = new THREE.LineBasicMaterial({
		color: 0x0000ff,
		linewidth: 2
	});

	var r = 20;

	for (var decl = -75; decl <= 75; decl = decl + 15) {
		var equatorGeometry = new THREE.Geometry();
		var decl_rad = decl / 180.0 * PI;
		for (var theta = 0; theta < 2*PI; theta += PI/16) {
			var x = r * Math.sin(theta),
				y = r * Math.tan(decl_rad),
				z = r * Math.cos(theta);
			console.log( x+','+y+','+z );

			equatorGeometry.vertices.push(new THREE.Vector3(x, y, z));
		}
		var line = new THREE.Line(equatorGeometry, equatorMaterial);
		scene.add(line);
	}
}
addEquator();

// Positional sensors
var alpha, beta, gamma;
var lookX, lookY, lookZ;

var animate = function () {
	requestAnimationFrame(animate);

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	if (Math.abs(beta - 90) > 5) {
		lookX = Math.sin((beta)/180.0*PI)*Math.cos(alpha/180.0*PI)*20;
		lookZ = Math.sin((beta)/180.0*PI)*Math.sin(alpha/180.0*PI)*20;
		lookY = Math.cos((beta)/180.0*PI)*20;
	}
	// camera.rotation.y = (alpha)/180.0*PI;
	// camera.rotation.x = (beta - 90.0)/180.0*PI;
	camera.lookAt(lookX, lookY, lookZ);
	renderer.render(scene, camera);
};

window.addEventListener('resize', function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

window.addEventListener('deviceorientation', function (event) {
	alpha = event.alpha - 90;
	beta = event.beta;
	gamma = event.gamma;
}, false);

animate();
