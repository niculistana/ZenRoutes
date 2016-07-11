var Globals = require('../_variables/globals');
var CacheUtility = require('../cacheutility');
var GeocodeService = require('../_apiservices/geocodeservice');

GeocodeController = function() {
	return{
		getGeocodeResult: function(query, callback) {
			if (Globals.geocodeCache[query]) {
				var coordinates = Globals.geocodeCache[query];
				callback(coordinates);
			} else {
				GeocodeService.getGeocodeFromQuery(query, function(result){
					var coordinates = [result.geometry.location.lat(), result.geometry.location.lng()].toString();
					CacheUtility.storeGeocodeResult(query,coordinates);
					callback(coordinates);
				});
			}
		}
	}
}();

module.exports = GeocodeController;