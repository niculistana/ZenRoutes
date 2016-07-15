var Globals = require('./../_variables/globals');
var Constants = require('./../_variables/constants');
var MapView = require('./../_views/mapview');

MapController = function() {
	var mainContent = document.getElementById('main-content');

	return {
		composeMarker: function(result, view) {
			if (view === Constants.ORIGIN_MARKER) {
				MapView.MarkerView().markerAsOrigin(result);
			} else if (view === Constants.RESULT_MARKER) {
				MapView.MarkerView().markerAsResult(result);
			}
		},

		clearAllMarkers:function() {
			for (var i = 0; i < Globals.markers.length; i++ ) {
				Globals.markers[i].setMap(null);
			}
			Globals.markers = [];
		},

		composeInfoWindow:function(result, index) {
			var infoWindow = new google.maps.InfoWindow({
				disableAutoPan: true,
				maxWidth: 200
			});

			var marker = Globals.markers[index];

			var resultContentString = (result.website) ? ('<a href=' + result.website + '>' + result.name + '</a>') : result.name;

			var contentItems = (typeof result === 'string') ? result : resultContentString;
			var content = contentItems;

			infoWindow.setContent(content);

			google.maps.event.addListener(marker, 'click', function() {
				infoWindow.open(window.map, marker);
			});

			Globals.infoWindows.push(infoWindow);
		},

		showInfoWindow:function(index){
			var marker = Globals.markers[index];
			Globals.infoWindows[index].open(window.map, marker);			
		},

		closeAllInfoWindows:function() {
			Globals.infoWindows.forEach(function(infoWindow, index) {
				infoWindow.close()
			});			
		},

		clearAllInfoWindows:function(){
			for (var i = 0; i < Globals.infoWindows.length; i++ ) {
				Globals.infoWindows[i].setMap(null);
			}
			Globals.infoWindows = [];
		},

		composeRouteCircle: function(routeItem){
			var cityCircle = new google.maps.Circle({
				strokeColor: '#B73830',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#F7685C',
				fillOpacity: 0.35,
				map: window.map,
				center: routeItem.geometry.location,
				radius: 500
			});
			Globals.routeCircles[routeItem.id] = cityCircle;
		},

		removeRouteCircle: function(routeItem){
			Globals.routeCircles[routeItem.id].setMap(null);
		},

		clearAllRouteCircles: function(){
			for (var key in Globals.routeCircles) {
				if (Globals.routeCircles.hasOwnProperty(key)) {
					Globals.routeCircles[key].setMap(null);
				}
			}

			Globals.routeCircles = {};
		},

		setCenter: function(location){
			window.map.panTo(location);
		}
	};
}();

module.exports = MapController;