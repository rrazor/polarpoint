/* eslint-env jest */
import * as celestial from '../src/celestial';

test('celestial.getNorthPoleObserverCoords', () => {
  var testCoordinates = [
    [44.9778, -93.2650, 'Minneapolis'],
    [-23.5505, -46.6333, 'São Paulo']
  ];

  testCoordinates.forEach(function (c) {
    var coords = celestial.getNorthPoleObserverCoords(c[0], c[1]);
    expect(coords.azimuth).toBe(0);
    expect(coords.elevation).toBe(c[0]);
  });
});
