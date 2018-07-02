import * as THREE from 'three';
import * as celestial from './celestial';
import * as gui from './gui';
import * as orbital from './orbital';
import * as util from './util';
import DeviceOrientationControls from './vendor/three/DeviceOrientationControls';

// three.js objects
var scene, camera, controls, renderer;

// Objects to render in the scene.
var celestialNorth = {
  color: 0x9DC06B,
  coords: {},
  edgeSize: 10
};
var orbitalNorth = {
  color: 0x11ee11,
  coords: {},
  edgeSize: 10
};
var ecliptic = {
  color: 0x11ee11,
  coords: {},
  radius: 200
};

// Bound to the GUI to enable live updates.
var variables = {
  lat: 45.0,
  lon: -99,
  useCurrentTime: true
};

window.onload = function () {
  document.getElementById('proceed').addEventListener('click', function () {
    init();
  }, false);
  // Uncomment for development.
  // init();
};

function init () {
  initVariables();
  initScene();
  initControls();

  addSceneObjects();

  updateSceneObjects();
  animate();

  gui.hideSplashScreen();
  gui.init(variables, updateSceneObjects, updateLatLonFromGPS);

  window.addEventListener('resize', resize, false);
}

function initVariables () {
  dateToVariables(new Date());
}

function initScene () {
  var fov = 75.0;
  var near = 0.1;
  var far = 1000;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);
}

function initControls () {
  controls = new DeviceOrientationControls(camera);
  // In threeJS, camera is looking down its negative Z axis.
  // This will rotate that axis around to look in the positive Z direction.
  controls.alphaOffset = Math.PI;
}

function addSceneObjects () {
  addCelestialNorth();
  addOrbitalNorth();
  addEquator();
  addEcliptic();
}

function addCelestialNorth () {
  var geometry = new THREE.BoxGeometry(celestialNorth.edgeSize, celestialNorth.edgeSize, celestialNorth.edgeSize);
  var material = new THREE.MeshBasicMaterial({color: celestialNorth.color});

  celestialNorth.object = new THREE.Mesh(geometry, material);
  scene.add(celestialNorth.object);
}

function addOrbitalNorth () {
  var geometry = new THREE.BoxGeometry(orbitalNorth.edgeSize, orbitalNorth.edgeSize, orbitalNorth.edgeSize);
  var material = new THREE.MeshBasicMaterial({color: orbitalNorth.color});

  orbitalNorth.object = new THREE.Mesh(geometry, material);
  scene.add(orbitalNorth.object);
}

function addEcliptic () {
  var material = new THREE.LineBasicMaterial({color: ecliptic.color});
  var geometry = new THREE.Geometry();

  addLatitudeVertices(geometry, ecliptic.radius, 0.0);
  ecliptic.object = new THREE.Line(geometry, material);

  scene.add(ecliptic.object);
}

function addEquator () {
  var decl, geometry, line;
  var declStep = 15.0;
  var material = new THREE.LineBasicMaterial({color: 0x0000ff});
  var radius = 200;

  for (decl = -75; decl <= 75; decl += declStep) {
    geometry = new THREE.Geometry();
    addLatitudeVertices(geometry, radius, decl);
    line = new THREE.Line(geometry, material);
    scene.add(line);
  }
}

function addLatitudeVertices (geometry, radius, declination) {
  var theta;
  var thetaStep = Math.PI / 16.0;

  for (theta = 0; theta < 2.1 * Math.PI; theta += thetaStep) {
    var x = ecliptic.radius * Math.sin(theta);
    var y = ecliptic.radius * Math.tan(util.deg2rad(declination));
    var z = ecliptic.radius * Math.cos(theta);

    geometry.vertices.push(new THREE.Vector3(x, y, z));
  }
}

function animate () {
  window.requestAnimationFrame(animate);
  controls.update();
  updateStatusBar();
  renderer.render(scene, camera);

  if (variables.useCurrentTime === true) {
    dateToVariables(new Date());
  }
}

function dateToVariables (date) {
  variables.year = date.getFullYear();
  // JS getMonth() is 0..11. Humans use 1..12.
  variables.month = date.getMonth() + 1;
  variables.day = date.getDate();
  variables.hour = date.getHours();
  variables.minute = date.getMinutes();
  variables.second = date.getSeconds();
}

function variablesToDate () {
  var date = new Date();
  date.setFullYear(variables.year);
  date.setDate(variables.day);
  date.setMonth(variables.month - 1);
  date.setHours(variables.hour);
  date.setMinutes(variables.minute);
  date.setSeconds(variables.second);

  return date;
}

function resize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateSceneObjects () {
  var date = variablesToDate();

  celestialNorth.coords = celestial.northPole(variables.lat, variables.lon, date);

  celestialNorth.object.position.multiplyScalar(0);
  celestialNorth.object.rotation.set(0, 0, 0);
  // Right-hand rule: positive rotation would drop the marker below horizon;
  // invert rotation direction so positive altitude rises _above_ horizon.
  celestialNorth.object.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), util.deg2rad(-1 * celestialNorth.altitude));
  // Right-hand rule would cause + angle to move west;
  // azimuth increases east, so *= -1
  celestialNorth.object.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -1 * util.deg2rad(celestialNorth.azimuth));
  celestialNorth.object.translateZ(100);

  orbitalNorth.coords = orbital.northPole(variables.lat, variables.lon, date);

  orbitalNorth.object.position.multiplyScalar(0);
  orbitalNorth.object.rotation.set(0, 0, 0);
  // Right-hand rule: positive rotation would drop the marker below horizon;
  // invert rotation direction so positive altitude rises _above_ horizon.
  orbitalNorth.object.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), util.deg2rad(-1 * orbitalNorth.coords.altitude));
  orbitalNorth.object.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -1 * util.deg2rad(orbitalNorth.coords.azimuth));
  orbitalNorth.object.translateZ(100);

  ecliptic.object.rotation.set(0, 0, 0);
  ecliptic.object.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), util.deg2rad(orbitalNorth.coords.altitude) * -1);
  // And rotate away from the orbital north pole 90º
  ecliptic.object.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2.0);
  ecliptic.object.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -1 * util.deg2rad(orbitalNorth.coords.azimuth));
}

function updateLatLonFromGPS () {
  navigator.geolocation.getCurrentPosition(function (position) {
    variables.lat = position.coords.latitude;
    variables.lon = position.coords.longitude;
  });
}

function updateStatusBar () {
  var azimuth, altitude, cnpAzimuth, cnpAltitude, onpAzimuth, onpAltitude;

  azimuth = util.roundAzimuth(util.normalizeAzimuth(util.rad2deg(camera.rotation.y - Math.PI)));
  document.getElementById('azimuth').innerHTML = azimuth;

  altitude = Math.floor(util.normalizeDegrees(util.rad2deg(camera.rotation.x), 180));
  document.getElementById('altitude').innerHTML = altitude;

  cnpAzimuth = util.roundAzimuth(util.normalizeAzimuth(celestialNorth.coords.azimuth));
  document.getElementById('cnpAzimuth').innerHTML = cnpAzimuth;

  cnpAltitude = Math.floor(util.normalizeDegrees(celestialNorth.coords.altitude));
  document.getElementById('cnpAltitude').innerHTML = cnpAltitude;

  onpAzimuth = util.roundAzimuth(util.normalizeAzimuth(orbitalNorth.coords.azimuth));
  document.getElementById('onpAzimuth').innerHTML = onpAzimuth;

  onpAltitude = Math.floor(util.normalizeDegrees(orbitalNorth.coords.altitude));
  document.getElementById('onpAltitude').innerHTML = onpAltitude;
}
