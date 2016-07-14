var Constants = require('./constants');

Globals = function () {
	return  {
		current_results_view: Constants.CARDS_LIST,
		current_search_view: Constants.INLINE,
		queries: [],
		results: [],
		markers:[],
		infoWindows:[],
		route:{},
		routeCircles:[],
		zenPlacesResult:[],
		queryCache: (localStorage.getItem(Constants.QUERY_CACHE_KEY)) ? JSON.parse(localStorage.getItem(Constants.QUERY_CACHE_KEY)) : [],
		geocodeCache: (localStorage.getItem(Constants.GEOCODE_CACHE_KEY)) ? JSON.parse(localStorage.getItem(Constants.GEOCODE_CACHE_KEY)) : {},
		// placesCache: (localStorage.getItem(Constants.PLACES_CACHE_KEY)) ? JSON.parse(localStorage.getItem(Constants.PLACES_CACHE_KEY)) : {},
		// zenPlaceCache: (localStorage.getItem(Constants.ZEN_PLACE_CACHE_KEY)) ? JSON.parse(localStorage.getItem(Constants.ZEN_PLACE_CACHE_KEY)) : {},
		zenPlaceDetailsCache: (localStorage.getItem(Constants.ZEN_PLACE_DETAILS_CACHE_KEY)) ? JSON.parse(localStorage.getItem(Constants.ZEN_PLACE_DETAILS_CACHE_KEY)) : {},
		zenPlacesResultCache: (localStorage.getItem(Constants.ZEN_PLACES_RESULT_CACHE_KEY)) ? JSON.parse(localStorage.getItem(Constants.ZEN_PLACES_RESULT_CACHE_KEY)) : {}
	};
}();

module.exports = Globals;