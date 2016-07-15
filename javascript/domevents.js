var CacheUtility = require('./cacheutility');
var MapController = require('./_controllers/mapcontroller');
var MapView = require('./_views/mapview');
var Constants = require('./_variables/constants');
var Globals = require('./_variables/globals');
var ZenPlace = require('./_classes/zenplace');
var AppUtility = require('./_utility/apputility');
var GeocodeController = require('./_controllers/geocodecontroller');
var PlacesController = require('./_controllers/placescontroller');
var PlaceDetailsController = require('./_controllers/placedetailscontroller');
var RouteController = require('./_controllers/routecontroller');
var ResultMenuController = require('./_controllers/resultmenucontroller');
var Strings = require('./_variables/strings');

SearchEvents = function() {
	return {
		onSearchSubmit: function(event) {
			var eventCode = event.which || event.keyCode;
			if (eventCode == 13) {
				this.searchForPlaces();
			}
		},

		searchForPlaces: function() {
			var searchInput = document.getElementById('search-input');
			var query = searchInput.value;

			var body = document.getElementsByTagName("body")[0];
			var fullScreenFragment = document.createDocumentFragment();
			var resultsContainer = document.getElementById('results');

			if (query.length > 0) {
				if (Object.keys(Globals.route).length > 0) {
					if (!confirm('You are in the middle of selecting routes, looking up another city will revert your current progress.')) {
						searchInput.value = Globals.queryCache[(Globals.queryCache.length-1)];
						return;
					}
				}
				CacheUtility.storeQuery(query);
				MapController.clearAllMarkers();
				MapController.clearAllInfoWindows();
				MapController.clearAllRouteCircles();
				RouteController.clearAllRouteItems();

				var resultsMenuFragment = document.createDocumentFragment();
				var resultsMenu = document.getElementById('results-menu');
				resultsMenu.innerHTML = '';
				ResultMenuController.composeResultMenuFragment(resultsMenuFragment, Constants.INLINE);
				resultsMenu.appendChild(resultsMenuFragment);

				resultsContainer.innerHTML = '';

				if (Globals.geocodeCache[query] && Globals.zenPlacesResultCache[query]) {
					var [x, y] = Globals.geocodeCache[query].split(',').map(parseFloat);
					var origin = {lat: x, lng: y};
					
					MapController.composeMarker(origin, Constants.ORIGIN_MARKER);
					MapController.composeInfoWindow(query, Globals.markers.length-1);
					window.map.setCenter(origin);

					Globals.zenPlacesResultCache[query].forEach(function(result, index){
						var placeDetails = Globals.zenPlaceDetailsCache[result];
						placeDetails.options.inRoute = false;

						MapController.composeMarker(placeDetails, Constants.RESULT_MARKER);
						MapController.composeInfoWindow(placeDetails, Globals.markers.length-1);

						var resultFragment = document.createDocumentFragment();
						FragmentController.composeResultFragment(resultFragment, placeDetails, Constants.PLACES_RESULT_VIEW);
						resultsContainer.appendChild(resultFragment);
					});
					
					body.style.backgroundPosition = "-500px";
				} else {
					GeocodeController.getGeocodeResult(query, function(coordinates){
						var [x, y] = coordinates.split(',').map(parseFloat);
						var origin = {lat: x, lng: y};

						MapController.composeMarker(origin, Constants.ORIGIN_MARKER);
						MapController.composeInfoWindow(query, Globals.markers.length-1);
						window.map.setCenter(origin);

						PlacesController.getPlacesResult(coordinates, function(places){
							FragmentController.composeFullScreenFragment(fullScreenFragment, Constants.DELAY);
							body.insertBefore(fullScreenFragment, body.firstChild);

							places.forEach(function(result, index){
								(function(index){
									setTimeout(function(){
										var placeId = result.place_id;
										PlaceDetailsController.getPlaceDetailsResult(placeId, function(placeDetails){
											MapController.composeMarker(placeDetails, Constants.RESULT_MARKER);
											MapController.composeInfoWindow(placeDetails, Globals.markers.length-1);

											var resultFragment = document.createDocumentFragment();
											FragmentController.composeResultFragment(resultFragment, placeDetails, Constants.PLACES_RESULT_VIEW);
											resultsContainer.appendChild(resultFragment);
											Globals.zenPlacesResult.push(placeDetails.id);

											if (index == places.length-12) {
												body.firstChild.innerHTML = '<h1>' + Strings.TRAVEL_QUOTES[Math.floor(Math.random() * Strings.TRAVEL_QUOTES.length)] + '</h1>';
											}

											if (index == places.length-1) { // remove fullScreenFragment
												CacheUtility.storeZenPlacesResult(query, Globals.zenPlacesResult);
												Globals.zenPlacesResult = [];
												body.removeChild(body.firstChild);
												body.style.backgroundPosition = "-500px";
											}
										});
									}, index*600);
								})(index);
							});
						});
					});
				} // end resultFragment
			}
		}
	}
}();

module.exports = {
	SearchEvents
};