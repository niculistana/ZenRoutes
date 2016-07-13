var PlacesService = require('../_apiservices/placesservice');

PlacesController = function() {
	return{
		getPlacesResult: function(coordinates, callback) {
			PlacesService.getPlacesFromCoordinates(coordinates, function(result) {
				var places = result;
				callback(places);
			});
		}
	}
}();

module.exports = PlacesController;