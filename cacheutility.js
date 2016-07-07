var Globals = require('./globals');
var Constants = require('./constants');

CacheUtility = function() {
	var queryCacheKey = Constants.QUERY_CACHE_KEY;
	return {
		storeQuery: function(query) {
			Globals.queryCache.unshift(query);
			localStorage.setItem(queryCacheKey, JSON.stringify(Globals.queryCache));
		},
		clearQueryCache: function() {
			localStorage[queryCacheKey] = '';
		}	
	}
}();

module.exports = CacheUtility;