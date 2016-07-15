var Strings = require('./../_variables/strings');
var Globals = require('./../_variables/globals');

var MarkerView = function() {
	return {
		markerAsOrigin: function(result) {

			var marker = new google.maps.Marker({
				map: window.map,
				position: {lat: result.lat, lng: result.lng},
				animation: google.maps.Animation.DROP
			});	
			Globals.markers.push(marker);
		},

		markerAsResult: function(result) {
			var defaultIcon = {
				url: './assets/icons/markers.png',
				scaledSize: new google.maps.Size(20, 20),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(10, 10)
			};

			var photoIcon = {
				url: result.mainPhotoUrl.slice(0, -12) + 'w35-h35-k/',
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(10, 10)
			}

			var marker = new google.maps.Marker({
				map: window.map,
				position: result.geometry.location,
				animation: google.maps.Animation.DROP,
				icon: (result.mainPhotoUrl) ? photoIcon : defaultIcon
			});	
			Globals.markers.push(marker);
		}
	}
};

module.exports = {
	MarkerView
}

