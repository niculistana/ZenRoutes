var DomEvents = require('./../domevents');
var Strings = require('./../_variables/strings');
var Globals = require('./../_variables/globals');

var MarkerViewMode = function() {
	return {
		markerAsAll: function() {
			console.log('markerAsAll ' , resultList);
		},
		markerAsSelected: function() {
			console.log('markerAsSelected ' , resultList);
		},
		markerAsNotSelected: function() {
			console.log('markerAsNotSelected ' , resultList);
		},
		clearAllMarkers: function() {
			for (var i = 0; i < Globals.markers.length; i++ ) {
				Globals.markers[i].setMap(null);
			}
			Globals.markers = [];
		}	
	}
};

var InfoWindowViewMode = function(map, resultList) {
};

module.exports = {
	MarkerViewMode,
	InfoWindowViewMode
}

