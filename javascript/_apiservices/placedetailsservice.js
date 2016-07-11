PlaceDetailsService = function() {
	return {
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

module.exports = PlaceDetailsService;