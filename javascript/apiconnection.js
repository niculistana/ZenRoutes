ApiConnection = function() {
	return {
		connect: function(url, callbackName, globalFunction) {
			var script = document.createElement('script');
			script.async = true;
			script.defer = true;
			script.src = url;
			script.type = 'text/javascript';
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(script, s);
			window[callbackName] = globalFunction;
		}
	}
}();

module.exports = ApiConnection;