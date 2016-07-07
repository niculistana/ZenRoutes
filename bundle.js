(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
ApiConnection = function() {
	return {
		connect: function(url, callbackName, globalFunction) {
			var script = document.createElement('script');
			script.async = true;
			script.defer = true;
			script.src = url;
			script.type = 'text/javascript';
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(script, s);
			window[callbackName] = globalFunction;
		}
	}
}();

module.exports = ApiConnection;
},{}],2:[function(require,module,exports){
var Globals = require('./globals');
var Constants = require('./constants');

CacheUtility = function() {
	var queryCacheKey = Constants.QUERY_CACHE_KEY;
	return {
		storeQuery: function(query) {
			Globals.queryCache.unshift(query);
			localStorage.setItem(queryCacheKey, JSON.stringify(Globals.queryCache));
		},
		clearQueryCache: function() {
			localStorage[queryCacheKey] = '';
		}	
	}
}();

module.exports = CacheUtility;
},{"./constants":3,"./globals":7}],3:[function(require,module,exports){
const INLINE = 'inline';
const DEFAULT = 'default';

const CARDS_LIST = 'cards list';
const TABLE = 'table';

const QUERY_CACHE_KEY = 'queryCache';
const PLACE_CACHE_KEY = 'placeCache';

module.exports = {
	INLINE,
	DEFAULT,
	CARDS_LIST,
	TABLE,
	QUERY_CACHE_KEY,
	PLACE_CACHE_KEY
};
},{}],4:[function(require,module,exports){
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
},{"./cacheutility":2,"./mapcomposer":9,"./maploader":10,"./mapviewmodes":11}],5:[function(require,module,exports){
var Constants = require('./constants');
var FragmentViewModes = require('./fragmentviewmodes');

FragmentComposer = function() {
	var mainContent = document.getElementById('main-content');
	return {
		composeSearchFragment: function(fragment, viewMode) {
			var viewModeAlert = document.createElement('div');
			viewModeAlert.setAttribute('class', 'alert alert-success fade in');
			viewModeAlert.innerHTML = '<a href="#" class="close" data-dismiss="alert"' + 
				'aria-label="close">&times;</a>';

			if (viewMode === Constants.DEFAULT) {
				FragmentViewModes.SearchViewMode().searchAsDefault(fragment);
				viewModeAlert.innerHTML += '<strong>Default search</strong>';
			} else if (viewMode === Constants.INLINE) {
				FragmentViewModes.SearchViewMode().searchAsInline(fragment);
				viewModeAlert.innerHTML += '<strong>Inline search</strong>';
			}
			mainContent.insertBefore(viewModeAlert, mainContent.firstChild);
		},

		composeResultsFragment: function (list, fragment, viewMode) {
			if (viewMode === Constants.CARDS_LIST) {
				FragmentViewModes.ResultsViewMode().resultsAsCardList(list, fragment);
			} else if (viewMode === Constants.TABLE) {
				FragmentViewModes.ResultsViewMode().resultsAsTable(list, fragment);
			}
		}
	};
}();

module.exports = FragmentComposer;
},{"./constants":3,"./fragmentviewmodes":6}],6:[function(require,module,exports){
var DomEvents = require('./domevents');
var Strings = require('./strings');

var SearchViewMode = function(){
	var goButtonText = Strings.GO_BUTTON_TEXT;
	var settingsButtonText = Strings.SETTINGS_BUTTON_TEXT;

	return {
		searchAsDefault: function(fragment) {
			var search_input = document.createElement('input');
			var search_button = document.createElement('button');
			var search_history = document.createElement('div');

			search_input.setAttribute('id', 'search-input');
			search_input.addEventListener('keyup', function(event) {
				DomEvents.SearchEvents.onSearchSubmit(event);
			});
			search_button.setAttribute('id', 'search-button');
			search_button.innerHTML = goButtonText;
			search_button.addEventListener('click', function() {
				DomEvents.SearchEvents.searchForPlaces();
			});

			search_history.innerHTML = 
				localStorage.getItem('queryCache') ? 'Recent searches: ' 
				+ JSON.parse(localStorage.getItem('queryCache')).slice(0, 5).join(' | ') : '<br />';

			fragment.appendChild(search_input);
			fragment.appendChild(search_button);
			fragment.appendChild(search_history);
		},

		searchAsInline: function(fragment) {
			var search_input = document.createElement('input');
			var search_button = document.createElement('button');
			var search_settings_button = document.createElement('button');

			search_input.setAttribute('id', 'search-input');
			search_input.addEventListener('keyup', function(event) {
				DomEvents.SearchEvents.onSearchSubmit(event);
			});

			search_button.setAttribute('id', 'search-button');
			search_button.innerHTML = goButtonText;
			search_button.addEventListener('click', function() {
				DomEvents.SearchEvents.searchForPlaces();
			});

			search_settings_button.setAttribute('id','search-settings');
			search_settings_button.innerHTML = settingsButtonText;

			fragment.appendChild(search_input);
			fragment.appendChild(search_button);
			fragment.appendChild(search_settings_button);
		}
	}
};

var ResultsViewMode = function(resultList) {
	return {
		resultsAsCardList: function(fragment) {
			var place_card = document.createElement('div');
			var place_info = document.createElement('div');

			fragment.appendChild(place_card);
			place_card.appendChild(place_info);

			resultList.forEach(function(e) {
				var place_name = document.createElement('h1');
				var miles_away = document.createElement('p');
				var save_button = document.createElement('button');

				place_name.innerHTML = e.name;
				miles_away.innerHTML = e.formatted_address;
				save_button.innerHTML = 'Save';

				place_info.appendChild(place_name); 
				place_info.appendChild(miles_away); 
				place_info.appendChild(save_button); 
			});
		},

		resultsAsTable: function(fragment) {
			var table = document.createElement('table');
			table.setAttribute('class', 'table table-hover table-responsive');
			
			var thead = document.createElement('thead');
			var tr_head = document.createElement('tr');

			var tbody = document.createElement('tbody');
			fragment.appendChild(table);
			
			table.appendChild(thead);
			thead.appendChild(tr_head);
			table.appendChild(tbody);

			for (var key in resultList[0]) {
				var th = document.createElement('th');
				th.innerHTML += key;
				tr_head.appendChild(th);
			}

			resultList.forEach(function(e) {
				var tr_body = document.createElement('tr');
				for (var key in e) {
					if (e.hasOwnProperty(key)) {
						tr_body.innerHTML += '<td>' + e[key] + '</td>';
					}
				}
				tbody.appendChild(tr_body); 
			});
		}
	}
};

module.exports = {
	SearchViewMode,
	ResultsViewMode
}
},{"./domevents":4,"./strings":12}],7:[function(require,module,exports){
var Constants = require('./constants');

Globals = function () {
	return  {
		current_results_view: Constants.CARDS_LIST,
		current_search_view: Constants.INLINE,
		queries: [],
		results: [],
		resultsCart:[],
		markers:[],
		queryCache: (localStorage.getItem('queryCache')) ? JSON.parse(localStorage.getItem('queryCache')) : [],
		resultsCache: []
	};
}();

module.exports = Globals;
},{"./constants":3}],8:[function(require,module,exports){
'use strict';
var ApiConnection = require('./apiconnection');
var Globals = require('./globals.js');
var Constants = require('./constants');
var FragmentComposer = require('./fragmentcomposer.js');
var MapLoader = require('./maploader.js');

if (document.readyState !== "loading") {
	initData();
} else {
	document.addEventListener('DOMContentLoaded', function() {
		initData();
	}, false);
}

ApiConnection.connect('https://maps.googleapis.com/maps/api/js?'+
	'key=AIzaSyBgESRsFdB2XZSZtPhiVnKWzG0JeR-nGGM&callback=initGoogleMapApi&'+
	'libraries=places', 'initGoogleMapApi', initComponents);

function initData() {
	console.log('initData');
};

function initComponents() {
	var search = document.getElementById('search');
	var searchFragment = document.createDocumentFragment();

	search.innerHTML = '';
	FragmentComposer.composeSearchFragment(searchFragment, Constants.DEFAULT);
	search.appendChild(searchFragment);

	var searchInput = document.getElementById('search-input');
	var autocomplete = new google.maps.places.Autocomplete(searchInput, {
		types: ['address']
	});


	var styles = [{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#E8DED1"}]},
		{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#E8D7D1"}]},
		{"featureType":"road.highway","elementType":"geometry","stylers":[{"lightness":60},{"color":"#BCB4B5"}]},
		{"featureType":"water","stylers":[{"color":"#4397CE"}]}]


	// Create a new StyledMapType object, passing it the array of styles,
	// as well as the name to be displayed on the map type control.
	var styledMap = new google.maps.StyledMapType(styles,
	{name: "Styled Map"});

	// Create a map object, and include the MapTypeId to add
	// to the map type control.
	var mapOptions = {
		zoom: 13,
		center: new google.maps.LatLng(37.7843179, -122.3951441),
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
		},
		minZoom: 7,
		maxZoom: 17
	};

	window.map = new google.maps.Map(document.getElementById('map'), mapOptions);

	//Associate the styled map with the MapTypeId and set it to display.
	map.mapTypes.set('map_style', styledMap);
	map.setMapTypeId('map_style');


	// MapLoader.loadMap('map', -33.8688, 151.2195);

	// geocoder.geocode({'address': query}), function(results, status) {
	// 	console.log(results);
	// 	console.log(status);
	// }
};
},{"./apiconnection":1,"./constants":3,"./fragmentcomposer.js":5,"./globals.js":7,"./maploader.js":10}],9:[function(require,module,exports){
var Constants = require('./constants');
var Globals = require('./globals');

MapComposer = function() {
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
			var defaultIcon = {
				url: result.icon,
				scaledSize: new google.maps.Size(35, 35),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(15, 15)
			};

			console.log(defaultIcon);

			var marker = new google.maps.Marker({
				map: window.map,
				position: result.geometry.location,
				animation: google.maps.Animation.DROP,
				icon: (result.photos) ? result.photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35}) : defaultIcon
			});	
			Globals.markers.push(marker);
		}
	};
}();

module.exports = MapComposer;
},{"./constants":3,"./globals":7}],10:[function(require,module,exports){
MapLoader = function() {
	return {
		loadMap: function (domElementId, lat, lng){
			var origin = new google.maps.LatLng(lat,lng);

			var myMapOptions = {
				scrollwheel:false,
				zoom: 15,
				center: origin,
				mapTypeControl: true,
				mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
				position: google.maps.ControlPosition.RIGHT_TOP
				},
				navigationControl: true,
				navigationControlOptions: {
				style: google.maps.NavigationControlStyle.SMALL,
				position: google.maps.ControlPosition.LEFT_CENTER
				},
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			var map = new google.maps.Map(document.getElementById(domElementId),myMapOptions);

			return({
				container:map.getDiv(),
				map:map
			});
		}
	}
}();

module.exports = MapLoader;
},{}],11:[function(require,module,exports){
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


},{"./domevents":4,"./globals":7,"./strings":12}],12:[function(require,module,exports){
const GO_BUTTON_TEXT = 'GO';
const SETTINGS_BUTTON_TEXT = 'SETTINGS';

const ALERT_DEFAULT = 'DEFAULT';

module.exports = {
	GO_BUTTON_TEXT,
	SETTINGS_BUTTON_TEXT
};
},{}]},{},[8]);
