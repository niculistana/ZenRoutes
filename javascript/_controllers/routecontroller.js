var Globals = require('../_variables/globals');

RouteController = function() {
	return{
		addToRoute: function(route) {
			Globals.route[route.id] = route;
		},
		removeFromRoute: function(route) {
			delete Globals.route[route.id];
		}
	}
}();

module.exports = RouteController;