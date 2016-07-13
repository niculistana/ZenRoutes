PlacesService = function() {
	return {
		getPlacesFromCoordinates: function(coordinates, callback) {
			var [x, y] = coordinates.split(',').map(parseFloat);
			var origin = {lat: x, lng: y};
			
			var request = {
				location: origin,
				radius: 12000,
				keyword: 'tourist attraction',
				type: 'point_of_interest'
			};

			var service = new google.maps.places.PlacesService(map);
			service.nearbySearch(request, function (results, status) {
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					callback(results);
				} else {
					alert('nearbySearch was not successful due to the following: ' + status);
				}
			});
		}
	}
}();

module.exports = PlacesService;