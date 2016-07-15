SmsService = function() {
	var client = require('twilio')('ACf5d77be2c47f19cbcc6d2773e46f5043', '338fbafb3c54199bc24b9a129f3acc8e');
	return {		
		getTwilioClient: function() {
			return client;
		}
	}
}();

module.exports = SmsService;