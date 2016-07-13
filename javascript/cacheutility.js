var Globals = require('./_variables/globals');
var Constants = require('./_variables/constants');

CacheUtility = function() {
	var queryCacheKey = Constants.QUERY_CACHE_KEY;
	var geocodeCacheKey = Constants.GEOCODE_CACHE_KEY;
	var placesCacheKey = Constants.PLACES_CACHE_KEY;
	var zenPlaceCacheKey = Constants.ZEN_PLACE_CACHE_KEY;
	var zenPlaceDetailsCacheKey = Constants.ZEN_PLACE_DETAILS_CACHE_KEY;
	var zenPlacesResultCacheKey = Constants.ZEN_PLACES_RESULT_CACHE_KEY;

	return {
		storeQuery: function(query) {
			Globals.queryCache.unshift(query);
			localStorage.setItem(queryCacheKey, JSON.stringify(Globals.queryCache));
		},
		clearQueryCache: function() {
			localStorage[queryCacheKey] = '';
		},
		storeGeocodeCoordinates: function(query, coordinates) {
			Globals.geocodeCache[query] = coordinates;
			localStorage.setItem(geocodeCacheKey, JSON.stringify(Globals.geocodeCache));
		},
		clearGeocodeCache: function() {
			localStorage[geocodeCacheKey] = '';
		},
		storePlacesResult: function(coordinates, result) {
			Globals.placesCache[coordinates] = result;
			localStorage.setItem(placesCacheKey, JSON.stringify(Globals.placesCache));
		},
		clearPlacesCache: function() {
			localStorage[placesCacheKey] = '';
		},
		storeZenPlaceResult: function(placeId, result) {
			Globals.zenPlaceCache[placeId] = result;
			localStorage.setItem(zenPlaceCacheKey, JSON.stringify(Globals.zenPlaceCache));
		},
		clearZenPlaceCache: function() {
			localStorage[zenPlaceCacheKey] = '';
		},
		storeZenPlaceDetailsResult: function(zenPlaceId, result) {
			Globals.zenPlaceDetailsCache[zenPlaceId] = result;
			localStorage.setItem(zenPlaceDetailsCacheKey, JSON.stringify(Globals.zenPlaceDetailsCache));
		},
		clearZenPlaceDetailsCache: function() {
			localStorage[zenPlaceDetailsCacheKey] = '';
		},
		storeZenPlacesResult: function(query, result) {
			Globals.zenPlacesResultCache[query] = result;
			localStorage.setItem(zenPlacesResultCacheKey, JSON.stringify(Globals.zenPlacesResultCache));
		},
		clearZenPlacesResultCache: function() {
			localStorage[zenPlacesResultCacheKey] = '';
		}	
	}
}();

module.exports = CacheUtility;