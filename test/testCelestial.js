import test from 'ava';
import celestial from '../src/celestial.js';

test('celestialNorthMinneapolis', t => {
	var testCoordinates = [
			[44.9778, -93.2650, 'Minneapolis'],
			[-23.5505, -46.6333, 'São Paulo']
		],
		coords;

	testCoordinates.forEach(function(c) {
		coords = celestial.getNorthPoleObserverCoords(c[0], c[1]);
		t.is(coords.azimuth, 0);
		t.is(coords.elevation, c[0]);
	});
});
