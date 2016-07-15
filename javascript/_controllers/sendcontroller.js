var Globals = require('./../_variables/globals');

SendController = function() {
	return {
		sendRoutesToNumber:function(number) {
			var validNumber = '+' + number; // should probably add more validation than this...
			// TODO
		}, sendRoutesToEmail:function(email) {
			// validate email using regex...
			var message = '';
			for (var key in Globals.route) {
			    message+=(Globals.route[key].name) + ', ';
			}

			message = message.slice(0, -2);

			window.open('mailto:' + email + '?body='+ message);
		}
	}
}();

module.exports = SendController;