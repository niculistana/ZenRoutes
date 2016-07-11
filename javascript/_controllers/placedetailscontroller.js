var Globals = require('../_variables/globals');
var CacheUtility = require('../cacheutility');
var PlaceDetailsService = require('../_apiservices/placedetailsservice');

PlaceDetailsController = function() {
	return{
		getPlaceDetailsResult: function(placeId, callback) {
			if (Globals.placeDetailsCache[placeId]) {
				var places = Globals.placeDetailsCache[placeId];
				callback(places);
			} else {
				PlaceDetailsService.getPlaceDetailsFromPlaceId(placeId, function(result) {
					var placeDetails = result;
					CacheUtility.storePlaceDetailsResult(placeId,placeDetails);
					callback(placeDetails);
				});
			}
		}
	}
}();

module.exports = PlaceDetailsController;