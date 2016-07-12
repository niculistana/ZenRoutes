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

			if (query.length > 0) {
				CacheUtility.storeQuery(query);

				MapView.MarkerView().clearAllMarkers();

				GeocodeController.getGeocodeResult(query, function(coordinates){
					var [x, y] = coordinates.split(',').map(parseFloat);

					var origin = {lat: x, lng: y};

					MapController.composeOriginMarker(origin);

					PlacesController.getPlacesResult(coordinates, function(places){

						var body = document.getElementsByTagName("body")[0];
						var fullScreenFragment = document.createDocumentFragment();
						var resultsContainer = document.getElementById('results');

						FragmentController.composeFullScreenFragment(fullScreenFragment, Constants.DELAY);
						body.insertBefore(fullScreenFragment, body.firstChild);

						resultsContainer.innerHTML = '';

						places.forEach(function(result, index){
							(function(index){
								setTimeout(function(){
									var placeId = result.place_id;

									PlaceDetailsController.getPlaceDetailsResult(placeId, function(placeDetails){
										MapController.composeResultMarker(placeDetails);
										var resultFragment = document.createDocumentFragment();
										FragmentController.composeResultFragment(resultFragment, placeDetails, Constants.DEFAULT);
										resultsContainer.appendChild(resultFragment);
										// var zenPlace = new ZenPlace(AppUtility.generateZenPlaceId());
										// Object.keys(result).map(function(key, index) {
										// 	if (typeof zenPlace[key] !== 'undefined' && key != 'id' && result.hasOwnProperty(key)) {
										// 		zenPlace[key] = result[key];   
										// 	}
										// });

										// CacheUtility.storeZenPlaceResult(zenPlace.id, result);

									});

									if (index == places.length-1) { // remove fullScreenFragment
										body.removeChild(body.firstChild);
										body.style.backgroundPosition = "-500px";
									}

								}, index*600);
							})(index);
						});
					});
				});
			}	

			// 		PlacesService.getPlacesFromRequest(request, function(results) {
			// 			var body = document.getElementsByTagName("body")[0];
			// 			var fullScreenFragment = document.createDocumentFragment();
			// 			var resultsContainer = document.getElementById('results');

			// 			FragmentController.composeFullScreenFragment(fullScreenFragment, Constants.DELAY);
			// 			body.insertBefore(fullScreenFragment, body.firstChild);

			// 			resultsContainer.innerHTML = '';

			// 			results.forEach(function(result, index){
			// 				(function(index){
			// 					setTimeout(function(){
			// 						var placeId = result.place_id;

			// 						PlacesService.getPlaceDetailsFromPlaceId(placeId, function(result) {
			// 							MapController.composeResultMarker(result);
			// 							var resultFragment = document.createDocumentFragment();
			// 							FragmentController.composeResultFragment(resultFragment, result, Constants.DEFAULT);
			// 							resultsContainer.appendChild(resultFragment);
			// 							CacheUtility.storePlaceResult(placeId, result);

			// 							var zenPlace = new ZenPlace(AppUtility.generateZenPlaceId());
			// 							Object.keys(result).map(function(key, index) {
			// 								if (typeof zenPlace[key] !== 'undefined' && key != 'id' && result.hasOwnProperty(key)) {
			// 									zenPlace[key] = result[key];   
			// 								}
			// 							});

			// 							CacheUtility.storeZenPlaceResult(zenPlace.id, result);
			// 						});

			// 						if (index == results.length-1) { // remove fullScreenFragment
			// 							body.removeChild(body.firstChild);
			// 						}

			// 					}, index*600);
			// 				})(index);
			// 			});
			// 		});
			// 	});
			// }
		}
	}
}();

module.exports = {
	SearchEvents
};