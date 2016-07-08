var Constants = require('./../_variables/constants');
var Globals = require('./../_variables/globals');

MapComposer = function() {
	var mainContent = document.getElementById('main-content');

	return {
		composeOriginMarker: function(location) {
			var marker = new google.maps.Marker({
				map: window.map,
				position: location,
				animation: google.maps.Animation.DROP
			});	

			map.setCenter(location);
			Globals.markers.push(marker);
		},

		composeResultMarker: function(result) {
			var defaultIcon = {
				url: result.icon,
				scaledSize: new google.maps.Size(35, 35),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(15, 15)
			};

			var marker = new google.maps.Marker({
				map: window.map,
				position: result.geometry.location,
				animation: google.maps.Animation.DROP,
				icon: (result.photos) ? result.photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35}) : defaultIcon
			});	
			Globals.markers.push(marker);
		}
	};
}();

module.exports = MapComposer;