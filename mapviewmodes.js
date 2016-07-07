var DomEvents = require('./domevents');
var Strings = require('./strings');
var Globals = require('./globals');

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
			console.log('clearing');
		}	
	}
};

var InfoWindowViewMode = function(map, resultList) {
};

module.exports = {
	MarkerViewMode,
	InfoWindowViewMode
}

