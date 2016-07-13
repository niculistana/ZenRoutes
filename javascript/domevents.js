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
				CacheUtility.storeQuery(query);
				MapView.MarkerView().clearAllMarkers();
				resultsContainer.innerHTML = '';

				if (Globals.geocodeCache[query] && Globals.zenPlacesResultCache[query]) {
					var [x, y] = Globals.geocodeCache[query].split(',').map(parseFloat);
					var origin = {lat: x, lng: y};
					MapController.composeOriginMarker(origin);

					Globals.zenPlacesResultCache[query].forEach(function(result, index){
						var placeDetails = Globals.zenPlaceDetailsCache[result];
						MapController.composeResultMarker(placeDetails);
						var resultFragment = document.createDocumentFragment();
						FragmentController.composeResultFragment(resultFragment, placeDetails, Constants.PLACES);
						resultsContainer.appendChild(resultFragment);
					});
					
					body.style.backgroundPosition = "-500px";
				} else {
					GeocodeController.getGeocodeResult(query, function(coordinates){
						var [x, y] = coordinates.split(',').map(parseFloat);
						var origin = {lat: x, lng: y};

						MapController.composeOriginMarker(origin);

						PlacesController.getPlacesResult(coordinates, function(places){
							FragmentController.composeFullScreenFragment(fullScreenFragment, Constants.DELAY);
							body.insertBefore(fullScreenFragment, body.firstChild);

							places.forEach(function(result, index){
								(function(index){
									setTimeout(function(){
										var placeId = result.place_id;

										PlaceDetailsController.getPlaceDetailsResult(placeId, function(placeDetails){
											MapController.composeResultMarker(placeDetails);
											var resultFragment = document.createDocumentFragment();
											FragmentController.composeResultFragment(resultFragment, placeDetails, Constants.PLACES);
											resultsContainer.appendChild(resultFragment);

											Globals.zenPlacesResult.push(placeDetails.id);
										});

										if (index == places.length-1) { // remove fullScreenFragment
											CacheUtility.storeZenPlacesResult(query, Globals.zenPlacesResult);
											Globals.zenPlacesResult = [];
											body.removeChild(body.firstChild);
											body.style.backgroundPosition = "-500px";
										}

									}, index*600);
								})(index);
							});
						});
					});
				} // end resultFragment
				var resultsMenuFragment = document.createDocumentFragment();
				var lastResultItem = document.getElementsByClassName('.')
				var resultsMenu = document.getElementById('results-menu');
				FragmentController.composeResultMenuFragment(resultsMenuFragment, Constants.INLINE);
				resultsMenu.appendChild(resultsMenuFragment);
			}
		}
	}
}();

module.exports = {
	SearchEvents
};