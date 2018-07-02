import * as dat from 'dat.gui';

export function init (variables, updateCoords, updateLatLonFromGPS) {
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
    .onChange(updateCoords)
    .listen();
  nowFolder.add(variables, 'day', 0, 31)
    .step(1)
    .onChange(updateCoords)
    .listen();
  nowFolder.add(variables, 'hour', 0, 23)
    .onChange(updateCoords)
    .listen();
  nowFolder.add(variables, 'minute', 0, 59)
    .onChange(updateCoords)
    .listen();
  nowFolder.add(variables, 'second', 0, 59)
    .onChange(updateCoords)
    .listen();
  nowFolder.add(variables, 'useCurrentTime')
    .name('Current Time')
    .onChange(updateCoords);
  nowFolder.open();

  gui.close();
}

export function hideSplashScreen () {
  document.getElementById('splash').style.display = 'none';
  document.getElementById('statusBar').style.display = 'block';
}
