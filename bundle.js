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
			Globals.queryCache.push(query);
			localStorage.setItem(queryCacheKey, JSON.stringify(Globals.queryCache));
		},
		clearQueryCache: function() {
			localStorage[queryCacheKey] = '';
		}	
	}
}();

module.exports = CacheUtility;
},{"./constants":3,"./globals":6}],3:[function(require,module,exports){
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

SearchEvents = function() {
	return {
		onSearchSubmit: function(event) {
			var eventCode = event.which || event.keyCode;
			if (eventCode == 13) {
				this.searchForPlaces();
			}
		},

		searchForPlaces: function () {
			var searchInput = document.getElementById('search-input');
			var query = searchInput.value;

			if (query.length > 0) {
				CacheUtility.storeQuery(query);
			}
		}
	}
}();

module.exports = {
	SearchEvents
};
},{"./cacheutility":2}],5:[function(require,module,exports){
var Constants = require('./constants');
var ViewModes = require('./viewmodes');

FragmentComposer = function() {
	var main_content = document.getElementById('main-content');
	var viewModeAlert = document.createElement('div');
	return {
		composeSearchFragment: function(fragment, viewMode) {
			viewModeAlert.setAttribute('class', 'alert alert-success fade in');
			viewModeAlert.innerHTML = '<a href="#" class="close" data-dismiss="alert"' + 
				'aria-label="close">&times;</a>';

			if (viewMode === Constants.DEFAULT) {
				ViewModes.searchAsDefault(fragment);
				viewModeAlert.innerHTML += '<strong>Default search</strong>';
			} else if (viewMode === Constants.INLINE) {
				ViewModes.searchAsInline(fragment);
				viewModeAlert.innerHTML += '<strong>Inline search</strong>';
			}
			main_content.insertBefore(viewModeAlert, main_content.firstChild);
		},

		composePlacesFragment: function (list, fragment, viewMode) {
			if (viewMode === Constants.CARDS_LIST) {
				ViewModes.placesAsCardList(list, fragment);
			} else if (viewMode === Constants.TABLE) {
				ViewModes.placesAsTable(list, fragment);
			}
		}
	};
}();

module.exports = FragmentComposer;
},{"./constants":3,"./viewmodes":9}],6:[function(require,module,exports){
var Constants = require('./constants');

Globals = function () {
	return  {
		current_results_view: Constants.CARDS_LIST,
		current_search_view: Constants.INLINE,
		queries: [],
		results: [],
		queryCache: [],
		resultsCache: []
	};
}();

module.exports = Globals;
},{"./constants":3}],7:[function(require,module,exports){
'use strict';
var ApiConnection = require('./apiconnection');
var Globals = require('./globals.js');
var Constants = require('./constants');
var FragmentComposer = require('./fragmentcomposer.js');

if (document.readyState !== "loading") {
	initData();
} else {
	document.addEventListener('DOMContentLoaded', function() {
		initData();
	}, false);
}

ApiConnection.connect('https://maps.googleapis.com/maps/api/js?'+
	'key=AIzaSyBgESRsFdB2XZSZtPhiVnKWzG0JeR-nGGM&callback=initGoogleMapApi&'+
	'libraries=places', 'initGoogleMapApi', initSearch);

function initData() {
	var search = document.getElementById('search');
	var searchFragment = document.createDocumentFragment();

	search.innerHTML = '';
	FragmentComposer.composeSearchFragment(searchFragment, Constants.DEFAULT);
	search.appendChild(searchFragment);
}

function initSearch() {
	var search = document.getElementById('search');
	var searchInput = document.getElementById('search-input');
	var autocomplete = new google.maps.places.Autocomplete(searchInput, {
		types: ['(cities)']
	});
}
},{"./apiconnection":1,"./constants":3,"./fragmentcomposer.js":5,"./globals.js":6}],8:[function(require,module,exports){
const GO_BUTTON_TEXT = 'GO';
const SETTINGS_BUTTON_TEXT = 'SETTINGS';

module.exports = {
	GO_BUTTON_TEXT,
	SETTINGS_BUTTON_TEXT
};
},{}],9:[function(require,module,exports){
var DomEvents = require('./domevents');
var Strings = require('./strings');

ViewModes = function(){
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

			search_history.innerHTML = 'Search History: ' + localStorage.getItem('test');

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
		},

		placesAsCardList: function(list, fragment) {
			var place_card = document.createElement('div');
			var place_info = document.createElement('div');

			fragment.appendChild(place_card);
			place_card.appendChild(place_info);

			list.forEach(function(e) {
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

		placesAsTable: function(list, fragment) {
			var table = document.createElement('table');
			table.setAttribute('class', 'table table-hover table-responsive');
			
			var thead = document.createElement('thead');
			var tr_head = document.createElement('tr');

			var tbody = document.createElement('tbody');
			fragment.appendChild(table);
			
			table.appendChild(thead);
			thead.appendChild(tr_head);
			table.appendChild(tbody);

			for (var key in list[0]) {
				var th = document.createElement('th');
				th.innerHTML += key;
				tr_head.appendChild(th);
			}

			list.forEach(function(e) {
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
}();

module.exports = ViewModes;
},{"./domevents":4,"./strings":8}]},{},[7]);
