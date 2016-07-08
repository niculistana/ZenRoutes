PlacesService = function() {
	return {
		getPlacesFromRequest: function(request, callback) {
			var service = new google.maps.places.PlacesService(map);
			service.nearbySearch(request, function (results, status) {
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					callback(results);
				} else {
					console.log('nearbySearch was not successful due to the following: ' + status);
				}
			});
		},
		getPlaceDetailsFromPlaceId: function(placeId, callback) {
			var service = new google.maps.places.PlacesService(map);
			service.getDetails({
				placeId: placeId
			}, function(result,status) {
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					callback(result);
				} else {
					console.log('getDetails was not successful due to the following: ' + status);
				}
			});
		}
	}
}();

module.exports = PlacesService;