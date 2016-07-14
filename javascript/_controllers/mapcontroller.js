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
			var iconUrl = (result.mainPhotoUrl !== '') ? result.mainPhotoUrl.slice(0, -12) + 'w35-h35-k/' :  './assets/icons/markers.png';

			var defaultIcon = {
				url: iconUrl,
				scaledSize: new google.maps.Size(20, 20),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(10, 10)
			};

			var marker = new google.maps.Marker({
				map: window.map,
				position: result.geometry.location,
				animation: google.maps.Animation.DROP,
				icon: defaultIcon
			});	
			Globals.markers.push(marker);
		},

		composeRouteCircle: function(zenPlaceId){
			var routeItem = Globals.zenPlaceDetailsCache[zenPlaceId];
			
			var cityCircle = new google.maps.Circle({
				strokeColor: '#B73830',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#F7685C',
				fillOpacity: 0.35,
				map: window.map,
				center: {lat: routeItem.geometry.location.lat, lng: routeItem.geometry.location.lng},
				radius: 500
			});
			Globals.routeCircles[zenPlaceId] = cityCircle;
		},

		removeRouteCircle: function(zenPlaceId){
			Globals.routeCircles[zenPlaceId].setMap(null);
		}
	};
}();

module.exports = MapController;