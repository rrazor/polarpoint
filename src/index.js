import * as THREE from 'three';
import * as util from './util';
import * as celestial from './celestial';
import DeviceOrientationControls from './vendor/three/DeviceOrientationControls';

var scene, camera, controls, renderer;
var sphereDistance = 200;
var compassHeading = 0;
var readingCount = 10;
var celestialNorth = {};
var celestialNorthColor = 0x9DC06B;
var orbitalNorthColor = 0x8CB3AA;

// window.addEventListener('deviceorientation', handleOrientation, false);
document.getElementById('proceed').addEventListener('click', function () {
  initWithOrientation();
}, false);

function initWithOrientation () {
  document.getElementById('splash').style.display = 'none';
  document.getElementById('statusBar').style.display = 'block';
  init();
  animate();
}

function handleOrientation (evt) {
  console.log('event');
  if (typeof evt.webkitCompassHeading !== 'undefined') {
    if (evt.webkitCompassAccuracy >= 0 &&
         evt.webkitCompassAccuracy < 30) {
      if (readingCount === 0) {
        compassHeading = evt.webkitCompassHeading;
        window.removeEventListener('deviceorientation', handleOrientation, false);
        console.log('initWithOrientation called...');
        initWithOrientation();
      } else {
        readingCount--;
      }
    }
  }
}

function init () {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new DeviceOrientationControls(camera);
  // In threeJS, camera is looking down its negative Z axis.
  // This will rotate that axis around to look in the positive Z direction.
  controls.alphaOffset = Math.PI;

  buildScene(scene);

  window.addEventListener('resize', resize, false);
}

function buildScene (scene) {
  addCelestialNorth(scene);
  addEquator(scene);
}

function addCelestialNorth (scene) {
  var geometry = new THREE.BoxGeometry(10, 10, 10);
  var material = new THREE.MeshBasicMaterial({color: celestialNorthColor});

  celestialNorth = celestial.getNorthPoleObserverCoords(45, -93);

  geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 100));
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(util.deg2rad(-1 * celestialNorth.elevation)));
  geometry.applyMatrix(new THREE.Matrix4().makeRotationY(util.deg2rad(celestialNorth.azimuth)));

  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}

function addEquator (scene) {
  var equatorMaterial = new THREE.LineBasicMaterial({
    color: 0x0000ff,
    linewidth: 2
  });

  var r = sphereDistance;

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

  updateStatusBar();

  renderer.render(scene, camera);
}

function resize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateStatusBar () {
  var azimuth, altitude, cnpAzimuth, cnpAltitude;

  azimuth = util.roundAzimuth(util.normalizeAzimuth(util.rad2deg(camera.rotation.y - Math.PI)));
  document.getElementById('azimuth').innerHTML = azimuth;

  altitude = Math.floor(util.normalizeDegrees(util.rad2deg(camera.rotation.x), 180));
  document.getElementById('altitude').innerHTML = altitude;

  cnpAzimuth = util.roundAzimuth(util.normalizeAzimuth(celestialNorth.azimuth));
  document.getElementById('cnpAzimuth').innerHTML = cnpAzimuth;

  cnpAltitude = Math.floor(util.normalizeDegrees(celestialNorth.elevation));
  document.getElementById('cnpAltitude').innerHTML = cnpAltitude;
}
