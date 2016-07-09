var CacheUtility = require('./cacheutility');
var MapController = require('./_controllers/mapcontroller');
var MapView = require('./_views/mapview');
var GeocodeService = require('./_apiservices/geocodeservice');
var PlacesService = require('./_apiservices/placesservice');
var Constants = require('./_variables/constants');

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

				GeocodeService.getGeocodeFromQuery(query, function(result){
					var originLocation = result.geometry.location;
					CacheUtility.storeGeocodeResult(query,result);
					MapController.composeOriginMarker(originLocation);

					// construct request over here
					var request = {
						location: originLocation,
						radius: 12000,
						keyword: 'tourist attraction'
					};

					PlacesService.getPlacesFromRequest(request, function(results) {
						var body = document.getElementsByTagName("body")[0];
						var fullScreenFragment = document.createDocumentFragment();
						var resultsContainer = document.getElementById('results');

						FragmentController.composeFullScreenFragment(fullScreenFragment, Constants.DELAY);
						body.insertBefore(fullScreenFragment, body.firstChild);

						resultsContainer.innerHTML = '';

						results.forEach(function(result, index){
							(function(index){
								setTimeout(function(){
									var placeId = result.place_id;

									PlacesService.getPlaceDetailsFromPlaceId(placeId, function(result) {
										MapController.composeResultMarker(result);
										var resultFragment = document.createDocumentFragment();
										FragmentController.composeResultFragment(resultFragment, result, Constants.DEFAULT);
										resultsContainer.appendChild(resultFragment);
										CacheUtility.storePlaceResult(placeId, result);
									});

									if (index == results.length-1) { // remove fullScreenFragment
										body.removeChild(body.firstChild);
									}

								}, index*600);
							})(index);
						});
					});
				});
			}
		}
	}
}();

module.exports = {
	SearchEvents
};