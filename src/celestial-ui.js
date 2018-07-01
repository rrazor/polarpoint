import * as dat from 'dat.gui';
import celestial from './celestial.js';

// Global current latitude and longitude for the display.
var variables = {
  lat: 45.0,
  lon: -99.0
};

// Requests new celestial pointing coordinates and updates the display.
var update = function () {
  var coords = celestial.getNorthPoleObserverCoords(variables.lat, variables.lon);

  document.getElementById('azimuth').innerHTML = coords.azimuth;

  if (coords.elevation < 0) {
    document.getElementById('absElevation').innerHTML = coords.elevation * -1;
    document.getElementById('aboveOrBelow').innerHTML = 'below';
  } else {
    document.getElementById('absElevation').innerHTML = coords.elevation;
    document.getElementById('aboveOrBelow').innerHTML = 'above';
  }
};

// Look up latitude and longitude from the GPS once.
var lookupLatLonFromGPS = function () {
  navigator.geolocation.getCurrentPosition(function (position) {
    variables.lat = position.coords.latitude;
    variables.lon = position.coords.longitude;
    update();
  });
};

window.onload = function () {
  var gui = new dat.GUI();
  var folder = gui.addFolder('Location');

  folder.add(variables, 'lat', -90, 90)
    .step(0.01)
    .onChange(update)
    .listen();
  folder.add(variables, 'lon', -180, 180)
    .step(0.1)
    .onChange(update)
    .listen();

  if ('geolocation' in navigator) {
    variables.lookupLatLonFromGPS = lookupLatLonFromGPS;
    folder.add(variables, 'lookupLatLonFromGPS')
      .name('Use GPS')
      .onChange(update);
  }

  folder.open();
  update();
};
