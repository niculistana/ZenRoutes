(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var CacheUtility = require('./../cacheutility');
var Globals = require('./../_variables/globals');

GeocodeService = function() {
	return {		
		getGeocodeFromQuery: function(query, callback) {
			var geocoder = new google.maps.Geocoder();

			geocoder.geocode({'address': query}, function(results, status){
				if (status === google.maps.GeocoderStatus.OK && results[0].geometry) {
					callback(results[0]);
				} else {
					alert('Geocoder service was not successful due to the following: ' + status);
				}
			});
		}
	}
}();

module.exports = GeocodeService;
},{"./../_variables/globals":13,"./../cacheutility":18}],2:[function(require,module,exports){
PlaceDetailsService = function() {
	return {
		getPlaceDetailsFromPlaceId: function(placeId, callback) {
			var service = new google.maps.places.PlacesService(map);
			service.getDetails({
				placeId: placeId
			}, function(result,status) {
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					callback(result);
				} else {
					alert('getDetails was not successful due to the following: ' + status);
				}
			});
		}
	}
}();

module.exports = PlaceDetailsService;
},{}],3:[function(require,module,exports){
PlacesService = function() {
	return {
		getPlacesFromCoordinates: function(coordinates, callback) {
			var [x, y] = coordinates.split(',').map(parseFloat);
			var origin = {lat: x, lng: y};
			
			var request = {
				location: origin,
				radius: 12000,
				keyword: 'tourist attraction',
				type: 'point_of_interest'
			};

			var service = new google.maps.places.PlacesService(map);
			service.nearbySearch(request, function (results, status) {
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					callback(results);
				} else {
					alert('nearbySearch was not successful due to the following: ' + status);
				}
			});
		}
	}
}();

module.exports = PlacesService;
},{}],4:[function(require,module,exports){
var ZenPlace = function(id){
	this.id = id;
	this.geometry = {};
	this.name = '';
	this.types = [];
	this.formatted_address = '';
	this.formatted_phone_number = '';
	this.website = '';
	this.mainPhotoUrl = '';
	this.zenLevel = -1;
	this.options = {
		inRoute: false,
		promoted: false,
		last_accessed: Date.now()
	}
};

ZenPlace.prototype = {
	setZenLevel: function(overall_rating, geotag_count) {
		this.zenLevel = overall_rating+geotag_count;
	}
};

module.exports = ZenPlace;
},{}],5:[function(require,module,exports){
var Constants = require('./../_variables/constants');
var FragmentView = require('./../_views/fragmentview');

FragmentController = function() {
	var mainContent = document.getElementById('main-content');

	return {
		composeSearchFragment: function(fragment, view) {
			if (view === Constants.DEFAULT) {
				FragmentView.SearchView().searchAsDefault(fragment);
			} else if (view === Constants.INLINE) {
				FragmentView.SearchView().searchAsInline(fragment);
			}
		},

		composeResultFragment: function (fragment, result, view) {
			if (view === Constants.PLACES) {
				FragmentView.ResultView().resultsAsPlaces(fragment, result);
			} else if (view === Constants.ROUTES) {
				FragmentView.ResultView().resultsAsRoute(fragment, result);
			}
		},

		composeResultMenuFragment: function (fragment, view) {
			if (view === Constants.INLINE) {
				FragmentView.ResultMenuView().resultMenuAsInline(fragment);
			}
		},

		composeFullScreenFragment: function (fragment, view) {
			if (view === Constants.DELAY) {
				FragmentView.FullScreenView().fullScreenAsDelay(fragment);
			} else if (view === Constants.DIM) {
				FragmentView.FullScreenView().fullScreenAsDim(fragment);
			}
		}
	};
}();

module.exports = FragmentController;
},{"./../_variables/constants":12,"./../_views/fragmentview":15}],6:[function(require,module,exports){
var CacheUtility = require('../cacheutility');
var GeocodeService = require('../_apiservices/geocodeservice');

GeocodeController = function() {
	return{
		getGeocodeResult: function(query, callback) {
			GeocodeService.getGeocodeFromQuery(query, function(result){
				var coordinates = [result.geometry.location.lat(), result.geometry.location.lng()].toString();
				CacheUtility.storeGeocodeCoordinates(query, coordinates);
				callback(coordinates);
			});
		}
	}
}();

module.exports = GeocodeController;
},{"../_apiservices/geocodeservice":1,"../cacheutility":18}],7:[function(require,module,exports){
var Globals = require('./../_variables/globals');

MapController = function() {
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
			var iconUrl = (result.mainPhotoUrl !== '') ? result.mainPhotoUrl.slice(0, -12) + 'w35-h35-k/' :  './assets/icons/markers.png';

			var defaultIcon = {
				url: iconUrl,
				scaledSize: new google.maps.Size(20, 20),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(10, 10)
			};

			var marker = new google.maps.Marker({
				map: window.map,
				position: result.geometry.location,
				animation: google.maps.Animation.DROP,
				icon: defaultIcon
			});	
			Globals.markers.push(marker);
		},

		composeRouteCircle: function(zenPlaceId){
			var routeItem = Globals.zenPlaceDetailsCache[zenPlaceId];
			
			var cityCircle = new google.maps.Circle({
				strokeColor: '#B73830',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#F7685C',
				fillOpacity: 0.35,
				map: window.map,
				center: {lat: routeItem.geometry.location.lat, lng: routeItem.geometry.location.lng},
				radius: 500
			});
			Globals.routeCircles[zenPlaceId] = cityCircle;
		},

		removeRouteCircle: function(zenPlaceId){
			Globals.routeCircles[zenPlaceId].setMap(null);
		}
	};
}();

module.exports = MapController;
},{"./../_variables/globals":13}],8:[function(require,module,exports){
var Globals = require('../_variables/globals');
var CacheUtility = require('../cacheutility');
var PlaceDetailsService = require('../_apiservices/placedetailsservice');
var AppUtility = require('../_utility/apputility');
var ZenPlace = require('../_classes/zenplace');

PlaceDetailsController = function() {
	return{
		getPlaceDetailsResult: function(placeId, callback) {
			PlaceDetailsService.getPlaceDetailsFromPlaceId(placeId, function(result) {
				var zenPlaceId = AppUtility.generateZenPlaceId();
				while (Globals.zenPlaceDetailsCache[zenPlaceId]) {
					zenPlaceId = AppUtility.generateZenPlaceId();
				}

				var zenPlaceDetails = new ZenPlace(zenPlaceId);

				Object.keys(result).map(function(key, index) {
					if (typeof zenPlaceDetails[key] !== 'undefined' && key != 'id' && result.hasOwnProperty(key)) {
						zenPlaceDetails[key] = result[key];   
					}
				});
				
				if (result.photos) {
					zenPlaceDetails.mainPhotoUrl = result.photos[0].getUrl({'maxWidth': 500, 'maxHeight': 500});
				}

				CacheUtility.storeZenPlaceDetailsResult(zenPlaceId,zenPlaceDetails);
				callback(zenPlaceDetails);
			});
		}
	}
}();

module.exports = PlaceDetailsController;
},{"../_apiservices/placedetailsservice":2,"../_classes/zenplace":4,"../_utility/apputility":11,"../_variables/globals":13,"../cacheutility":18}],9:[function(require,module,exports){
var PlacesService = require('../_apiservices/placesservice');

PlacesController = function() {
	return{
		getPlacesResult: function(coordinates, callback) {
			PlacesService.getPlacesFromCoordinates(coordinates, function(result) {
				var places = result;
				callback(places);
			});
		}
	}
}();

module.exports = PlacesController;
},{"../_apiservices/placesservice":3}],10:[function(require,module,exports){
var Globals = require('../_variables/globals');

RouteController = function() {
	return{
		addToRoute: function(route) {
			Globals.route[route.id] = route;
		},
		removeFromRoute: function(route) {
			delete Globals.route[route.id];
		}
	}
}();

module.exports = RouteController;
},{"../_variables/globals":13}],11:[function(require,module,exports){
AppUtility = function(){
		if (typeof(Number.prototype.toRad) === 'undefined') {
			Number.prototype.toRad = function() {
				return this * Math.PI / 180;
			}
		};

	return {
		generateMetaTag: function() {
			var m = document.createElement('meta'); 
			m.name = 'description'; 
			m.content = 'This tutorial has some helpful information for you, if you want to track how many hits come from browsers where JavaScript has been disabled.'; 
			document.head.appendChild(m);
		},
		generateZenPlaceId: function(){
			var uniqueId = 'xxxxxxxxxxxxxxxxxxxxzpxxxxxxxxxx'.replace(/[x]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});

			return uniqueId;
		},
		getDistanceBetween: function (firstLocation, secondLocation) {
				var R = 3961;
				var x1 = secondLocation.location.lat-firstLocation.location.lat;
				var dLat = x1.toRad();  
				var x2 = secondLocation.location.lng-firstLocation.location.lng;
				var dlng = x2.toRad();  
				var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
						Math.cos(firstLocation.location.lat.toRad()) * Math.cos(secondLocation.location.lat.toRad()) * 
						Math.sin(dlng/2) * Math.sin(dlng/2);  
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
				var distanceBetween = R * c; 
				return distanceBetween;
		}
	}
}();

module.exports = AppUtility;
},{}],12:[function(require,module,exports){
const INLINE = 'inline';
const DEFAULT = 'default';

const PLACES = 'places';
const ROUTES = 'routes';

const DELAY = 'delay';
const DIM = 'dim';

const QUERY_CACHE_KEY = 'queryCache';
const GEOCODE_CACHE_KEY = 'geocodeCache';
const PLACES_CACHE_KEY = 'placesCache';
const ZEN_PLACE_CACHE_KEY = 'zenPlaceCache';
const ZEN_PLACE_DETAILS_CACHE_KEY = 'zenPlaceDetailsCache';
const ZEN_PLACES_RESULT_CACHE_KEY = 'zenPlacesResultCache';

module.exports = {
	INLINE,
	DEFAULT,
	PLACES,
	ROUTES,
	DELAY,
	DIM,
	QUERY_CACHE_KEY,
	GEOCODE_CACHE_KEY,
	PLACES_CACHE_KEY,
	ZEN_PLACE_CACHE_KEY,
	ZEN_PLACE_DETAILS_CACHE_KEY,
	ZEN_PLACES_RESULT_CACHE_KEY
};
},{}],13:[function(require,module,exports){
var Constants = require('./constants');

Globals = function () {
	return  {
		current_results_view: Constants.CARDS_LIST,
		current_search_view: Constants.INLINE,
		queries: [],
		results: [],
		markers:[],
		route:{},
		routeCircles:[],
		zenPlacesResult:[],
		queryCache: (localStorage.getItem(Constants.QUERY_CACHE_KEY)) ? JSON.parse(localStorage.getItem(Constants.QUERY_CACHE_KEY)) : [],
		geocodeCache: (localStorage.getItem(Constants.GEOCODE_CACHE_KEY)) ? JSON.parse(localStorage.getItem(Constants.GEOCODE_CACHE_KEY)) : {},
		// placesCache: (localStorage.getItem(Constants.PLACES_CACHE_KEY)) ? JSON.parse(localStorage.getItem(Constants.PLACES_CACHE_KEY)) : {},
		// zenPlaceCache: (localStorage.getItem(Constants.ZEN_PLACE_CACHE_KEY)) ? JSON.parse(localStorage.getItem(Constants.ZEN_PLACE_CACHE_KEY)) : {},
		zenPlaceDetailsCache: (localStorage.getItem(Constants.ZEN_PLACE_DETAILS_CACHE_KEY)) ? JSON.parse(localStorage.getItem(Constants.ZEN_PLACE_DETAILS_CACHE_KEY)) : {},
		zenPlacesResultCache: (localStorage.getItem(Constants.ZEN_PLACES_RESULT_CACHE_KEY)) ? JSON.parse(localStorage.getItem(Constants.ZEN_PLACES_RESULT_CACHE_KEY)) : {}
	};
}();

module.exports = Globals;
},{"./constants":12}],14:[function(require,module,exports){
const SEARCH_PLACEHOLDER_TEXT = 'Which city are you visiting?'

const LOADING_RESULTS = 'Hang on for a sec while we gather places to go to...';

const GO_BUTTON_TEXT = 'GO';
const PLACES_BUTTON_TEXT = 'PLACES';
const ADD_TO_ROUTE_TEXT = 'ADD TO ROUTE';
const REMOVE_FROM_ROUTE_TEXT = 'REMOVE FROM ROUTE';
const ROUTES_BUTTON_TEXT = 'ROUTE';
const SAVE_BUTTON_TEXT = 'SAVE';
const SETTINGS_BUTTON_TEXT = 'SETTINGS';


module.exports = {
	SEARCH_PLACEHOLDER_TEXT,
	LOADING_RESULTS,
	GO_BUTTON_TEXT,
	PLACES_BUTTON_TEXT,
	ADD_TO_ROUTE_TEXT,
	REMOVE_FROM_ROUTE_TEXT,
	ROUTES_BUTTON_TEXT,
	SAVE_BUTTON_TEXT,
	SETTINGS_BUTTON_TEXT
};
},{}],15:[function(require,module,exports){
var DomEvents = require('./../domevents');
var Strings = require('./../_variables/strings');
var RouteController = require('./../_controllers/routecontroller');
var Constants = require('./../_variables/constants');

var SearchView = function(){
	var goButtonText = Strings.GO_BUTTON_TEXT;
	var settingsButtonText = Strings.SETTINGS_BUTTON_TEXT;

	return {
		searchAsDefault: function(fragment) {
			var inputContainer = document.createElement('div');
			var inputContainerAddon = document.createElement('span');
			var glyphicon = document.createElement('i');
			var searchInput = document.createElement('input');

			inputContainer.setAttribute('class', 'input-group input-group-lg');
			inputContainerAddon.setAttribute('class', 'input-group-addon');
			glyphicon.setAttribute('class', 'glyphicon glyphicon-search');
			searchInput.setAttribute('type', 'text');
			searchInput.setAttribute('class', 'form-control');
			searchInput.setAttribute('id', 'search-input');
			searchInput.setAttribute('placeholder', Strings.SEARCH_PLACEHOLDER_TEXT);
			searchInput.setAttribute('autofocus', true);

			inputContainer.appendChild(inputContainerAddon);
			inputContainerAddon.appendChild(glyphicon);
			inputContainer.appendChild(searchInput);

			fragment.appendChild(inputContainer);
		},

		searchAsInline: function(fragment) {
			var searchInput = document.createElement('input');
			var searchButton = document.createElement('button');
			var searchSettingsButton = document.createElement('button');

			searchInput.setAttribute('id', 'search-input');
			searchInput.addEventListener('keyup', function(event) {
				DomEvents.SearchEvents.onSearchSubmit(event);
			});

			searchButton.setAttribute('id', 'search-button');
			searchButton.innerHTML = goButtonText;
			searchButton.addEventListener('click', function() {
				DomEvents.SearchEvents.searchForPlaces();
			});

			searchSettingsButton.setAttribute('id','search-settings');
			searchSettingsButton.innerHTML = settingsButtonText;

			fragment.appendChild(searchInput);
			fragment.appendChild(searchButton);
			fragment.appendChild(searchSettingsButton);
		}
	}
};

var ResultView = function() {
	return {
		resultsAsPlaces: function(fragment, result) {
			var cardContainer = document.createElement('div');
			var cardInfo = document.createElement('div');
			var cardImageContainer = document.createElement('div');
			var cardImage = document.createElement('img');
			var cardName = document.createElement('h3');
			var address = document.createElement('p');
			var addToRouteButton = document.createElement('button');

			if (result.mainPhotoUrl) {
				cardImage.setAttribute('src', result.mainPhotoUrl);
			} else {
				var location = result.geometry.location.lat + "," + result.geometry.location.lng;
				cardImage.setAttribute('src', 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + location + '&heading=200&&fov=100&pitch=20&key=AIzaSyBgESRsFdB2XZSZtPhiVnKWzG0JeR-nGGM');
			}

			cardImage.setAttribute('alt', 'A photo of ' + result.name);

			cardImageContainer.setAttribute('class', 'cardImageContainer');
			cardImageContainer.appendChild(cardImage);

			cardName.innerHTML = result.name;
			address.innerHTML = result.formatted_address;

			if (!result.options.inRoute) {
				addToRouteButton.setAttribute('class', 'btn btn-add');
				addToRouteButton.innerHTML = Strings.ADD_TO_ROUTE_TEXT;	
			} else {
				addToRouteButton.setAttribute('class', 'btn btn-remove');
				addToRouteButton.innerHTML = Strings.REMOVE_FROM_ROUTE_TEXT;	
			}

			addToRouteButton.addEventListener('click', function() {
				var [placeControl,routeControl,saveControl] = document.getElementsByClassName('nav navbar-nav')[0].children;
				if (addToRouteButton.className === 'btn btn-add') {
					addToRouteButton.className = 'btn btn-remove'
					addToRouteButton.innerHTML = Strings.REMOVE_FROM_ROUTE_TEXT;
					result.options.inRoute = true;
					RouteController.addToRoute(result);
					MapController.composeRouteCircle(result.id);
				} else {
					addToRouteButton.className = 'btn btn-add'
					addToRouteButton.innerHTML = Strings.ADD_TO_ROUTE_TEXT;
					result.options.inRoute = false;
					RouteController.removeFromRoute(result);	
					MapController.removeRouteCircle(result.id);
				}

				routeControl.className = (Object.keys(Globals.route).length > 0) ? '' : 'disabled';
				routeControl.firstChild.innerHTML = (Object.keys(Globals.route).length > 0) ? Strings.ROUTES_BUTTON_TEXT + ' (' + Object.keys(Globals.route).length + ')' : Strings.ROUTES_BUTTON_TEXT;
				saveControl.className = (Object.keys(Globals.route).length > 0) ? '' : 'disabled';
			});

			cardInfo.setAttribute('class', 'card-info');
			cardInfo.appendChild(cardImageContainer); 
			cardInfo.appendChild(cardName); 
			cardInfo.appendChild(address); 
			cardInfo.appendChild(addToRouteButton); 

			cardContainer.setAttribute('class', 'card-container');
			cardContainer.appendChild(cardInfo);

			fragment.appendChild(cardContainer);
		},

		resultsAsRoute: function(fragment) {
			var table = document.createElement('table');
			table.setAttribute('class', 'table table-hover table-responsive');
			
			var thead = document.createElement('thead');
			var tr_head = document.createElement('tr');

			var tbody = document.createElement('tbody');
			fragment.appendChild(table);
			
			table.appendChild(thead);
			thead.appendChild(tr_head);
			table.appendChild(tbody);

			for (var key in result[0]) {
				var th = document.createElement('th');
				th.innerHTML += key;
				tr_head.appendChild(th);
			}

			result.forEach(function(e) {
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

var ResultMenuView = function() {
	var placesButtonText = Strings.PLACES_BUTTON_TEXT;
	var routesButtonText = Strings.ROUTES_BUTTON_TEXT;
	var saveButtonText = Strings.SAVE_BUTTON_TEXT;

	return {
		resultMenuAsInline: function(fragment, result) {
			var navbar = document.createElement('nav');
			var navbarList = document.createElement('ul');

			navbar.setAttribute('class', 'navbar navbar-default');
			navbarList.setAttribute('class', 'nav navbar-nav');

			var menuItems = [placesButtonText,routesButtonText,saveButtonText];

			menuItems.forEach(function(result, index) {
				var navBarListItem = document.createElement('li');
				var navBarListItemLink = document.createElement('a');
				if (index === 0) {
					navBarListItem.setAttribute('class', 'active');
				} else {
					navBarListItem.setAttribute('class', 'disabled');
				}
				navBarListItemLink.innerHTML = result;

				navBarListItemLink.addEventListener('click', function(e){
					if (e.target.parentElement.className !== 'disabled' && e.target.parentElement.className !== 'active') {
						var listLength = e.target.parentElement.parentElement.children.length;
						for (var i=0; i < listLength; i++) {
							if (e.target.parentElement.parentElement.children[i].className === 'active') {
								e.target.parentElement.parentElement.children[i].className = '';
							}
						}
						e.target.parentElement.className = 'active';
					}

					if (e.target.parentElement.className !== 'disabled') {
						var searchInput = document.getElementById('search-input');
						var query = searchInput.value;
						var resultsContainer = document.getElementById('results');
						resultsContainer.innerHTML = '';

						if (result === placesButtonText) {
							if (Globals.zenPlacesResultCache[query]) {
								Globals.zenPlacesResultCache[query].forEach(function(result, index){
									var placeDetails = Globals.zenPlaceDetailsCache[result];
									var resultFragment = document.createDocumentFragment();
									FragmentController.composeResultFragment(resultFragment, placeDetails, Constants.PLACES);
									resultsContainer.appendChild(resultFragment);
								});
							}
							console.log('places');
						}else if (result === routesButtonText) {
							Object.keys(Globals.route).forEach(function(key, index){
								var placeDetails = Globals.route[key];
								var resultFragment = document.createDocumentFragment();
								FragmentController.composeResultFragment(resultFragment, placeDetails, Constants.PLACES);
								resultsContainer.appendChild(resultFragment);
							});
						} else {
							console.log('save')
							// Create entry in mongo database with route_id | [route]
						}
					}
				});

				navBarListItem.appendChild(navBarListItemLink);
				navbarList.appendChild(navBarListItem);
			});

			navbar.appendChild(navbarList);
			fragment.appendChild(navbar);
		}
	}
};

var FullScreenView = function() {
	var loadingMessage = Strings.LOADING_RESULTS;
	return {
		fullScreenAsDelay: function(fragment, result) {
			var delayOverlay = document.createElement('div');
			var delayOverlayMessage = document.createElement('h1');

			delayOverlay.setAttribute('class', 'fullscreen delayOverlay');
			delayOverlayMessage.innerHTML = loadingMessage;

			delayOverlay.appendChild(delayOverlayMessage);
			fragment.appendChild(delayOverlay);
		}
	}
};

module.exports = {
	SearchView,
	ResultView,
	ResultMenuView,
	FullScreenView
}
},{"./../_controllers/routecontroller":10,"./../_variables/constants":12,"./../_variables/strings":14,"./../domevents":19}],16:[function(require,module,exports){
var Strings = require('./../_variables/strings');
var Globals = require('./../_variables/globals');

var MarkerView = function() {
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

var InfoWindowView = function(map, resultList) {
};

module.exports = {
	MarkerView,
	InfoWindowView
}


},{"./../_variables/globals":13,"./../_variables/strings":14}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
var Globals = require('./_variables/globals');
var Constants = require('./_variables/constants');

CacheUtility = function() {
	var queryCacheKey = Constants.QUERY_CACHE_KEY;
	var geocodeCacheKey = Constants.GEOCODE_CACHE_KEY;
	var placesCacheKey = Constants.PLACES_CACHE_KEY;
	var zenPlaceCacheKey = Constants.ZEN_PLACE_CACHE_KEY;
	var zenPlaceDetailsCacheKey = Constants.ZEN_PLACE_DETAILS_CACHE_KEY;
	var zenPlacesResultCacheKey = Constants.ZEN_PLACES_RESULT_CACHE_KEY;

	return {
		storeQuery: function(query) {
			Globals.queryCache.unshift(query);
			localStorage.setItem(queryCacheKey, JSON.stringify(Globals.queryCache));
		},
		clearQueryCache: function() {
			localStorage[queryCacheKey] = '';
		},
		storeGeocodeCoordinates: function(query, coordinates) {
			Globals.geocodeCache[query] = coordinates;
			localStorage.setItem(geocodeCacheKey, JSON.stringify(Globals.geocodeCache));
		},
		clearGeocodeCache: function() {
			localStorage[geocodeCacheKey] = '';
		},
		storePlacesResult: function(coordinates, result) {
			Globals.placesCache[coordinates] = result;
			localStorage.setItem(placesCacheKey, JSON.stringify(Globals.placesCache));
		},
		clearPlacesCache: function() {
			localStorage[placesCacheKey] = '';
		},
		storeZenPlaceResult: function(placeId, result) {
			Globals.zenPlaceCache[placeId] = result;
			localStorage.setItem(zenPlaceCacheKey, JSON.stringify(Globals.zenPlaceCache));
		},
		clearZenPlaceCache: function() {
			localStorage[zenPlaceCacheKey] = '';
		},
		storeZenPlaceDetailsResult: function(zenPlaceId, result) {
			Globals.zenPlaceDetailsCache[zenPlaceId] = result;
			localStorage.setItem(zenPlaceDetailsCacheKey, JSON.stringify(Globals.zenPlaceDetailsCache));
		},
		clearZenPlaceDetailsCache: function() {
			localStorage[zenPlaceDetailsCacheKey] = '';
		},
		storeZenPlacesResult: function(query, result) {
			Globals.zenPlacesResultCache[query] = result;
			localStorage.setItem(zenPlacesResultCacheKey, JSON.stringify(Globals.zenPlacesResultCache));
		},
		clearZenPlacesResultCache: function() {
			localStorage[zenPlacesResultCacheKey] = '';
		}	
	}
}();

module.exports = CacheUtility;
},{"./_variables/constants":12,"./_variables/globals":13}],19:[function(require,module,exports){
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
},{"./_classes/zenplace":4,"./_controllers/geocodecontroller":6,"./_controllers/mapcontroller":7,"./_controllers/placedetailscontroller":8,"./_controllers/placescontroller":9,"./_utility/apputility":11,"./_variables/constants":12,"./_variables/globals":13,"./_views/mapview":16,"./cacheutility":18}],20:[function(require,module,exports){
'use strict';
var ApiConnection = require('./apiconnection');
var Globals = require('./_variables/globals.js');
var Constants = require('./_variables/constants');
var DomEvents = require('./domevents');
var FragmentController = require('./_controllers/fragmentcontroller.js');
var Strings = require('./_variables/strings');

ApiConnection.connect('https://maps.googleapis.com/maps/api/js?'+
	'key=AIzaSyBgESRsFdB2XZSZtPhiVnKWzG0JeR-nGGM&callback=initGoogleMapApi&'+
	'libraries=places', 'initGoogleMapApi', initComponents);

function initComponents() {
	var searchContainer = document.getElementById('search');
	var searchFragment = document.createDocumentFragment();

	searchContainer.innerHTML = '';
	FragmentController.composeSearchFragment(searchFragment, Constants.DEFAULT);
	searchContainer.appendChild(searchFragment);

	var searchInput = document.getElementById('search-input');
	var autocomplete = new google.maps.places.Autocomplete(searchInput, {
		types: ['(cities)']
	});


	google.maps.event.addListener(autocomplete, 'place_changed', function () {
		var result = autocomplete.getPlace();
		if (result.geometry) {
			DomEvents.SearchEvents.searchForPlaces();
		} else {
			document.getElementById('search-input').placeholder = Strings.SEARCH_PLACEHOLDER_TEXT;
		}
	});

	var styles = [{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#E8DED1"}]},
		{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#E8D7D1"}]},
		{"featureType":"road.highway","elementType":"geometry","stylers":[{"lightness":60},{"color":"#BCB4B5"}]},
		{"featureType":"water","stylers":[{"color":"#4397CE"}]}]

	var styledMap = new google.maps.StyledMapType(styles,{name: "Zen Places Style"});

	var mapOptions = {
		zoom: 12,
		center: new google.maps.LatLng(37.7843179, -122.3951441),
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
		},
		minZoom: 7,
		maxZoom: 17,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false
	};

	window.map = new google.maps.Map(document.getElementById('map'), mapOptions);

	map.mapTypes.set('map_style', styledMap);
	map.setMapTypeId('map_style');
};
},{"./_controllers/fragmentcontroller.js":5,"./_variables/constants":12,"./_variables/globals.js":13,"./_variables/strings":14,"./apiconnection":17,"./domevents":19}]},{},[20]);
