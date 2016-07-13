var CacheUtility = require('./../cacheutility');
var Globals = require('./../_variables/globals');

GeocodeService = function() {
	return {		
		getGeocodeFromQuery: function(query, callback) {
			var geocoder = new google.maps.Geocoder();

			geocoder.geocode({'address': query}, function(results, status){
				if (status === google.maps.GeocoderStatus.OK && results[0].geometry) {
					callback(results[0]);
				} else {
					alert('Geocoder service was not successful due to the following: ' + status);
				}
			});
		}
	}
}();

module.exports = GeocodeService;