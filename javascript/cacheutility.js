var Globals = require('./_variables/globals');
var Constants = require('./_variables/constants');

CacheUtility = function() {
	var queryCacheKey = Constants.QUERY_CACHE_KEY;
	var geocodeCacheKey = Constants.GEOCODE_CACHE_KEY;
	var placeCacheKey = Constants.PLACE_CACHE_KEY;

	return {
		storeQuery: function(query) {
			Globals.queryCache.unshift(query);
			localStorage.setItem(queryCacheKey, JSON.stringify(Globals.queryCache));
		},
		clearQueryCache: function() {
			localStorage[queryCacheKey] = '';
		},
		storeGeocodeResult: function(query, result) {
			Globals.geocodeCache[query] = result;
			localStorage.setItem(geocodeCacheKey, JSON.stringify(Globals.geocodeCache));
		},
		clearGeocodeCache: function() {
			localStorage[geocodeCacheKey] = '';
		},	
		storePlaceResult: function(placeId, result) {
			Globals.placeCache[placeId] = result;
			localStorage.setItem(placeCacheKey, JSON.stringify(Globals.placeCache));
		},
		clearPlaceCache: function() {
			localStorage[placeCacheKey] = '';
		}		
	}
}();

module.exports = CacheUtility;