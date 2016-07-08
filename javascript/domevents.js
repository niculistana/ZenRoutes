var CacheUtility = require('./cacheutility');
var MapComposer = require('./_composers/mapcomposer');
var MapViewModes = require('./_viewmodes/mapviewmodes');
var GeocodeService = require('./_apiservices/geocodeservice');
var PlacesService = require('./_apiservices/placesservice');

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

				MapViewModes.MarkerViewMode().clearAllMarkers();

				GeocodeService.getGeocodeFromQuery(query, function(result){
					var originLocation = result.geometry.location;
					CacheUtility.storeGeocodeResult(query,result);
					MapComposer.composeOriginMarker(originLocation);

					// construct request over here
					var request = {
						location: originLocation,
						radius: 12000,
						keyword: 'tourist attraction'
					};

					PlacesService.getPlacesFromRequest(request, function(results) {
						results.forEach(function(result, index){
							(function(index){
								setTimeout(function(){
									var placeId = result.place_id;
									PlacesService.getPlaceDetailsFromPlaceId(placeId, function(result) {
										MapComposer.composeResultMarker(result);
										CacheUtility.storePlaceResult(placeId, result);
									});
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