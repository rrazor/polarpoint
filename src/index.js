import * as dat from 'dat.gui';
import * as celestial from './celestial';
import * as THREE from 'three';
import * as util from './util';
import DeviceOrientationControls from './vendor/three/DeviceOrientationControls';

var scene, camera, controls, renderer;
var sphereDistance = 200;
var celestialNorth = {};
var celestialNorthColor = 0x9DC06B;
var orbitalNorthColor = 0x8CB3AA;
var now = new Date();
var variables = {
  lat: 45.0,
  lon: -99,
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  day: now.getDate(),
  hour: now.getHours(),
  minute: now.getMinutes(),
  second: now.getSeconds(),
  useCurrentTime: true
};

window.onload = function () {
  document.getElementById('proceed').addEventListener('click', function () {
    initWithOrientation();
  }, false);

  // Uncomment for development.
  // initWithOrientation();
};

function initWithOrientation () {
  document.getElementById('splash').style.display = 'none';
  document.getElementById('statusBar').style.display = 'block';

  init();
  animate();

  var gui = new dat.GUI();
  var folder = gui.addFolder('Location');

  folder.add(variables, 'lat', -90, 90)
    .step(0.01)
    .onChange(updateCoords)
    .listen();
  folder.add(variables, 'lon', -180, 180)
    .step(0.1)
    .onChange(updateCoords)
    .listen();

  if ('geolocation' in navigator) {
    variables.lookupLatLonFromGPS = updateLatLonFromGPS;
    folder.add(variables, 'lookupLatLonFromGPS')
      .name('Get from GPS');
  }

  folder.open();

  var nowFolder = gui.addFolder('Time');

  nowFolder.add(variables, 'year', 1000, 3000)
    .step(1)
    .onChange(updateCoords)
    .listen();
  nowFolder.add(variables, 'month', 1, 12)
    .step(1)
    .onChange(updateCoords)
    .listen();
  nowFolder.add(variables, 'day', 1, 31)
    .step(1)
    .onChange(updateCoords)
    .listen();
  nowFolder.add(variables, 'hour', 0, 23)
    .step(1)
    .onChange(updateCoords)
    .listen();
  nowFolder.add(variables, 'minute', 0, 59)
    .step(1)
    .onChange(updateCoords)
    .listen();
  nowFolder.add(variables, 'second', 0, 59)
    .step(1)
    .onChange(updateCoords)
    .listen();
  nowFolder.add(variables, 'useCurrentTime')
    .name('Current Time')
    .onChange(updateCoords);
  nowFolder.open();

  gui.close();
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
  updateCoords();

  window.addEventListener('resize', resize, false);
}

function buildScene (scene) {
  addCelestialNorth(scene);
  addEquator(scene);
}

function addCelestialNorth (scene) {
  var geometry = new THREE.BoxGeometry(10, 10, 10);
  var material = new THREE.MeshBasicMaterial({color: celestialNorthColor});

  celestialNorth.object = new THREE.Mesh(geometry, material);
  scene.add(celestialNorth.object);
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

  if (variables.useCurrentTime === true) {
    now = new Date();
    variables.year = now.getFullYear();
    variables.month = now.getMonth() + 1;
    variables.day = now.getDate();
    variables.hour = now.getHours();
    variables.minute = now.getMinutes();
    variables.second = now.getSeconds();
  }
}

function resize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateCoords () {
  var coords = celestial.getNorthPoleObserverCoords(variables.lat, variables.lon);

  celestialNorth.azimuth = coords.azimuth;
  celestialNorth.elevation = coords.elevation;

  celestialNorth.object.position.x = 0;
  celestialNorth.object.position.y = 0;
  celestialNorth.object.position.z = 0;
  celestialNorth.object.rotation.x = 0;
  celestialNorth.object.rotation.y = 0;
  celestialNorth.object.rotation.z = 0;
  celestialNorth.object.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), util.deg2rad(-1 * celestialNorth.elevation));
  celestialNorth.object.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), util.deg2rad(celestialNorth.azimuth));
  celestialNorth.object.translateZ(100);
}

function updateLatLonFromGPS () {
  navigator.geolocation.getCurrentPosition(function (position) {
    variables.lat = position.coords.latitude;
    variables.lon = position.coords.longitude;
  });
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
