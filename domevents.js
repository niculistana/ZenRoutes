var CacheUtility = require('./cacheutility');
var MapLoader = require('./maploader');
var MapComposer = require('./mapcomposer');
var MapViewModes = require('./mapviewmodes');

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

				var geocoder = new google.maps.Geocoder();

				MapViewModes.MarkerViewMode().clearAllMarkers();

				geocoder.geocode({'address': query}, function(results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						var originLocation = results[0].geometry.location;

						MapComposer.composeOriginMarker(originLocation);

						var request = {
							location: originLocation,
							radius: 12000,
							keyword: "tourist",
							types: "point_of_interest|establishment|natural_feature|park|zoo|aquarium|art_gallery|book_store|museum|spa|university"
						};

						var service = new google.maps.places.PlacesService(map);
						service.nearbySearch(request, function (results, status) {
							if (status === google.maps.places.PlacesServiceStatus.OK) {
								console.log(results.length);
								results.forEach(function(result, index) {
									(function(index) {
										setTimeout(function() {	// delay due to api query limit restrictions
											service.getDetails({
												placeId: result.place_id
											}, function(result, status){
												if (status === google.maps.places.PlacesServiceStatus.OK) {
													if (result.geometry && !result.permanently_closed && !result.types.includes("travel_agency")
														&& !result.types.includes("lodging") && !result.types.includes("real_estate_agency") 
														&& !result.types.includes("gym") && !result.types.includes("food")
														&& !result.types.includes("embassy") && !result.types.includes("insurance_agency")) {
														MapComposer.composeResultMarker(result);
													}
												}
												else{
													console.log("PlacesService was not successful for the following reason: " + status);
												}
											});
										}, index * 400);
									})(index);
								});
							} else {
								console.log("nearbySearch was not successful for the following reason: " + status);
							}
						});
					}
				});
			}
		}
	}
}();

module.exports = {
	SearchEvents
};