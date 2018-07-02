import coord from 'astronomia/lib/coord';
import globe from 'astronomia/lib/globe';
import julian from 'astronomia/lib/julian';
import nutation from 'astronomia/lib/nutation';
import sidereal from 'astronomia/lib/sidereal';
import * as util from './util';

export function obliquity (date) {
  var JDE = julian.DateToJDE(date);
  var obliquity = nutation.meanObliquityLaskar(JDE);

  return obliquity;
}

export function northPole (lat, lon, date) {
  var o = obliquity(date);

  var latRad = util.deg2rad(lat);
  // * -1 because astronomia has westward longitudes positive
  var lonRadReverse = util.deg2rad(lon) * -1;

  // Now we have the obliquity of the ecliptic. Let's express orbital north in ecliptic coordinates.
  var ecliptic = new coord.Ecliptic(0.0, util.deg2rad(90.0));

  // Use the obliquity of the ecliptic to convert to equatorial
  var equatorial = ecliptic.toEquatorial(o);

  // Our position on the globe
  var g = new globe.Coord(latRad, lonRadReverse);

  // [Julian Day](https://en.wikipedia.org/wiki/Julian_day)
  var jd = julian.DateToJD(date);
  // [Greenwich Mean Sidereal Time](https://en.wikipedia.org/wiki/Sidereal_time#Sidereal_time_definition)
  var st = sidereal.mean(jd);

  var horizontal = equatorial.toHorizontal(g, st);

  var coords = {
    // Horizontal coordinate system has azimuth 0º due South,
    // convert to 0º = due North.
    azimuth: util.normalizeAzimuth(util.rad2deg(horizontal.az) - 180.0),
    altitude: util.normalizeDegrees(util.rad2deg(horizontal.alt), 180.0)
  };

  // Define behavior at latitude +-90º where azimuth doesn't matter
  if (lat === 90.0 || lat === -90.0) {
    coords.azimuth = 0.0;
  }

  return coords;
}
