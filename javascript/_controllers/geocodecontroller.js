var CacheUtility = require('./../_utility/cacheutility');
var GeocodeService = require('./../_apiservices/geocodeservice');

GeocodeController = function() {
	return{
		getGeocodeResult: function(query, callback) {
			GeocodeService.getGeocodeFromQuery(query, function(result){
				var coordinates = [result.geometry.location.lat(), result.geometry.location.lng()].toString();
				CacheUtility.storeGeocodeCoordinates(query, coordinates);
				callback(coordinates);
			});
		}
	}
}();

module.exports = GeocodeController;