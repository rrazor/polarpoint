/* eslint-env jest */
import * as celestial from '../src/celestial';

test('celestial.getNorthPoleObserverCoords', () => {
  var testCoordinates = [
    [90.0, 0.0, 'North Pole'],
    [51.4826, -0.0077, 'Greenwich, UK'],
    [44.9778, -93.2650, 'Minneapolis, USA'],
    [-23.5505, -46.6333, 'São Paulo, Brazil'],
    [-37.8136, 144.9631, 'Melbourne, AU'],
    [-90.0, 0.0, 'South Pole']
  ];
  var now = new Date();

  testCoordinates.forEach(function (c) {
    var coords = celestial.northPole(c[0], c[1], now);
    expect(coords.azimuth).toBeCloseTo(0, 3);
    expect(coords.altitude).toBeCloseTo(c[0], 3);
  });
});
