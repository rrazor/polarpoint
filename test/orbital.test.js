/* eslint-env jest */
import * as orbital from '../src/orbital';
import coord from 'astronomia/lib/coord';
import * as util from '../src/util';

test('testEclipticToEquatorial', () => {
  var date = new Date();
  date.setFullYear(2018);
  date.setMonth(6);
  date.setDate(1);
  date.setHours(23);
  date.setMinutes(2);
  date.setSeconds(0);

  var ecliptic = new coord.Ecliptic(0.0, util.deg2rad(90.0));
  var o = orbital.obliquity(date);
  var equatorial = ecliptic.toEquatorial(o);

  expect(util.rad2deg(equatorial.ra)).toBe(18.0 / 24.0 * 360.0);
  expect(util.rad2deg(equatorial.dec)).toBeCloseTo(66 + 33 / 60.0 + 47.21 / 3600.0, 6);
});
