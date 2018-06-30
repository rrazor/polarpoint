function getNorthPoleObserverCoords(lat, lon) {
	// longitude not needed
	var azimuth, elevation;

	return {
		azimuth: 0,
		elevation: lat
	};
}

module.exports = {
	getNorthPoleObserverCoords: getNorthPoleObserverCoords
};
