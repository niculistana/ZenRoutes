var Globals = require('../_variables/globals');

RouteController = function() {
	return{
		removeFromRoute: function(resultId) {
			Globals.route.splice(resultId, 1);
		},
		addToRoute: function(resultId) {
			Globals.route.push(resultId);
		}
	}
}();

module.exports = RouteController;