var Globals = require('../_variables/globals');
var CacheUtility = require('../cacheutility');
var PlacesService = require('../_apiservices/placesservice');

PlacesController = function() {
	return{
		getPlacesResult: function(coordinates, callback) {
			if (Globals.placesCache[coordinates]) {
				var places = Globals.placesCache[coordinates];
				callback(places);
			} else {
				PlacesService.getPlacesFromCoordinates(coordinates, function(result) {
					var places = result;
					CacheUtility.storePlacesResult(coordinates,places);
					callback(places);
				});
			}
		}
	}
}();

module.exports = PlacesController;