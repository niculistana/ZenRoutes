var Constants = require('./constants');

Globals = function () {
	return  {
		current_results_view: Constants.CARDS_LIST,
		current_search_view: Constants.INLINE,
		queries: [],
		results: [],
		queryCache: [],
		resultsCache: []
	};
}();

module.exports = Globals;