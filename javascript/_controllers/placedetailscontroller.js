var Globals = require('../_variables/globals');
var CacheUtility = require('../cacheutility');
var PlaceDetailsService = require('../_apiservices/placedetailsservice');
var AppUtility = require('../_utility/apputility');
var ZenPlace = require('../_classes/zenplace');

PlaceDetailsController = function() {
	return{
		getPlaceDetailsResult: function(placeId, callback) {
			if (Globals.zenPlaceCache[placeId]) {
				var zenPlaceKey = Globals.zenPlaceCache[placeId];
				var zenPlaceDetails = Globals.zenPlaceDetailsCache[zenPlaceKey];
				callback(zenPlaceDetails);
			} else {
				PlaceDetailsService.getPlaceDetailsFromPlaceId(placeId, function(result) {
				var zenPlaceId = AppUtility.generateZenPlaceId();
					while (Globals.zenPlaceDetailsCache[zenPlaceId]) {
						zenPlaceId = AppUtility.generateZenPlaceId();
					}

					var zenPlaceDetails = new ZenPlace(zenPlaceId);

					Object.keys(result).map(function(key, index) {
						if (typeof zenPlaceDetails[key] !== 'undefined' && key != 'id' && result.hasOwnProperty(key)) {
							zenPlaceDetails[key] = result[key];   
						}
					});

					if (result.photos) {
						zenPlaceDetails.mainPhotoUrl = result.photos[0].getUrl({'maxWidth': 500, 'maxHeight': 500});
					}
					
					CacheUtility.storeZenPlaceResult(placeId,zenPlaceId);
					CacheUtility.storeZenPlaceDetailsResult(zenPlaceId,zenPlaceDetails);
					callback(zenPlaceDetails);
				});
			}
		}
	}
}();

module.exports = PlaceDetailsController;