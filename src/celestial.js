import coord from 'astronomia/lib/coord';
import globe from 'astronomia/lib/globe';
import julian from 'astronomia/lib/julian';
import sidereal from 'astronomia/lib/sidereal';
import * as util from './util';

export function getNorthPoleObserverCoords (lat, lon) {
  return {
    azimuth: 0,
    elevation: lat
  };
}

export function getNorthPoleObserverCoordsNew (lat, lon, date) {
  // RA = 0, Decl = 90 is equatorial/celestial north pole
  var equatorial = new coord.Equatorial(util.deg2rad(0), util.deg2rad(90.0));

  // Our position on the globe
  var latRad = util.deg2rad(lat);
  var lonRad = util.deg2rad(lon);
  var g = new globe.Coord(latRad, lonRad);

  // [Julian Day](https://en.wikipedia.org/wiki/Julian_day)
  var jd = julian.DateToJD(date);
  // [Greenwich Mean Sidereal Time](https://en.wikipedia.org/wiki/Sidereal_time#Sidereal_time_definition)
  var st = sidereal.mean(jd);
  // Convert RA = 0, DEC = 90º to horizontal
  var horizontal = equatorial.toHorizontal(g, st);

  var coords = {
    // Horizontal coordinate system has azimuth 0º due South,
    // convert to 0º = due North.
    azimuth: util.normalizeAzimuth(util.rad2deg(horizontal.az) - 180.0),
    elevation: util.normalizeDegrees(util.rad2deg(horizontal.alt), 180.0)
  };

  return coords;
}
