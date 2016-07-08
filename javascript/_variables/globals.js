var Constants = require('./constants');

Globals = function () {
	return  {
		current_results_view: Constants.CARDS_LIST,
		current_search_view: Constants.INLINE,
		queries: [],
		results: [],
		resultsCart:[],
		markers:[],
		queryCache: (localStorage.getItem('queryCache')) ? JSON.parse(localStorage.getItem('queryCache')) : [],
		geocodeCache: (localStorage.getItem('geocodeCache')) ? JSON.parse(localStorage.getItem('geocodeCache')) : {},
		placeCache: (localStorage.getItem('placeCache')) ? JSON.parse(localStorage.getItem('placeCache')) : {}
	};
}();

module.exports = Globals;