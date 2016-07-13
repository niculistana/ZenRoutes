var Globals = require('./../_variables/globals');

MapController = function() {
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
				url: './assets/icons/markers.png',
				scaledSize: new google.maps.Size(20, 20),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(10, 10)
			};

			var iconUrl = (result.mainPhotoUrl !== '') ? result.mainPhotoUrl.slice(0, -12) + 'w35-h35-k/' : defaultIcon;

			var marker = new google.maps.Marker({
				map: window.map,
				position: result.geometry.location,
				animation: google.maps.Animation.DROP,
				icon: iconUrl
			});	
			Globals.markers.push(marker);
		}
	};
}();

module.exports = MapController;