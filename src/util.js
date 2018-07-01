export function deg2rad (degrees) {
  return degrees * Math.PI / 180.0;
}

export function rad2deg (radians) {
  return radians * 180.0 / Math.PI;
}

export function normalizeDegrees (degrees, range) {
  var useRange = range || 360.0;
  var normalDegrees = degrees % useRange;

  return normalDegrees;
}

export function normalizeAzimuth (azimuth) {
  var normalAzimuth = normalizeDegrees(azimuth);

  if (normalAzimuth < 0) {
    normalAzimuth += 360.0;
  }

  return normalAzimuth;
}

export function roundAzimuth (azimuth) {
  return Math.floor(azimuth);
}
