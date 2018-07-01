import * as THREE from 'three';
import OrbitControls from './vendor/three/OrbitControls';

var scene, camera, controls, renderer;
var alpha, beta, gamma;
var lookX, lookY, lookZ;
var cube;

init();
animate();

function init () {
  // Positional sensors
  alpha = 0;
  beta = 0;
  gamma = 0;
  lookX = 0;
  lookY = 0;
  lookZ = 20;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, .001);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  buildScene(scene);

  window.addEventListener('resize', resize, false);
  window.addEventListener('deviceorientation', reorient, false);
}

function buildScene (scene) {
  addCube(scene);
  addEquator(scene);
}

function addCube (scene) {
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshBasicMaterial({color: 0x00ff00});

  cube = new THREE.Mesh(geometry, material);
  cube.position.z = 10;

  scene.add(cube);
}

function addEquator (scene) {
  var equatorMaterial = new THREE.LineBasicMaterial({
    color: 0x0000ff,
    linewidth: 2
  });

  var r = 20;

  for (var decl = -75; decl <= 75; decl = decl + 15) {
    var equatorGeometry = new THREE.Geometry();
    var radDec = decl / 180.0 * Math.PI;
    for (var theta = 0; theta < 2.1 * Math.PI; theta += Math.PI / 16.0) {
      var x = r * Math.sin(theta);
      var y = r * Math.tan(radDec);
      var z = r * Math.cos(theta);

      equatorGeometry.vertices.push(new THREE.Vector3(x, y, z));
    }
    var line = new THREE.Line(equatorGeometry, equatorMaterial);
    scene.add(line);
  }
}

function animate () {
  window.requestAnimationFrame(animate);

  controls.update();

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  if (Math.abs(beta - 90) > 5) {
    lookX = Math.sin((beta) / 180.0 * Math.PI) * Math.cos(alpha / 180.0 * Math.PI) * 20;
    lookZ = Math.sin((beta) / 180.0 * Math.PI) * Math.sin(alpha / 180.0 * Math.PI) * 20;
    lookY = Math.cos((beta) / 180.0 * Math.PI) * 20;
  }
  // camera.rotation.y = (alpha)/180.0*Math.PI;
  // camera.rotation.x = (beta - 90.0)/180.0*Math.PI;
  // camera.lookAt(lookX, lookY, lookZ);

  renderer.render(scene, camera);
}

function resize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function reorient (e) {
  alpha = e.alpha - 90;
  beta = e.beta;
  gamma = e.gamma;
}
