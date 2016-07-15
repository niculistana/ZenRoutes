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
			cardImage.setAttribute('title', 'Click to view in map');

			cardImageContainer.setAttribute('class', 'card-image-container');
			cardImageContainer.appendChild(cardImage);

			cardImageContainer.addEventListener('click', function(){
				MapController.setCenter(result.geometry.location);
				MapController.closeAllInfoWindows();

				var searchInput = document.getElementById('search-input');
				var query = searchInput.value;

				var index = Globals.zenPlacesResultCache[query].indexOf(result.id);
				MapController.showInfoWindow(index+1);
			});

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
				if (addToRouteButton.className === 'btn btn-add') {
					addToRouteButton.className = 'btn btn-remove';
					addToRouteButton.innerHTML = Strings.REMOVE_FROM_ROUTE_TEXT;
					result.options.inRoute = true;
					RouteController.addToRoute(result);
					MapController.composeRouteCircle(result);
				} else {
					addToRouteButton.className = 'btn btn-add'
					addToRouteButton.innerHTML = Strings.ADD_TO_ROUTE_TEXT;
					result.options.inRoute = false;
					RouteController.removeFromRoute(result);
					MapController.removeRouteCircle(result);
				}
				
				if (Object.keys(Globals.route).length > 0) {
					ResultMenuController.enableResultMenuItem(Constants.RESULT_MENU_ROUTE);
					ResultMenuController.enableResultMenuItem(Constants.RESULT_MENU_SAVE);
				} else{
					ResultMenuController.disableResultMenuItem(Constants.RESULT_MENU_ROUTE);
					ResultMenuController.disableResultMenuItem(Constants.RESULT_MENU_SAVE);
					ResultMenuController.setResultMenuItemAsActive(Constants.RESULT_MENU_PLACES);
					var searchInput = document.getElementById('search-input');
					var query = searchInput.value;
					var resultsContainer = document.getElementById('results');
					resultsContainer.innerHTML = '';
					if (Globals.zenPlacesResultCache[query]) {
							Globals.zenPlacesResultCache[query].forEach(function(result, index){
							var placeDetails = Globals.zenPlaceDetailsCache[result];
							var resultFragment = document.createDocumentFragment();
							FragmentController.composeResultFragment(resultFragment, placeDetails, Constants.PLACES_RESULT_VIEW);
							resultsContainer.appendChild(resultFragment);
						});
					}
				}

				var [placeControl,routeControl,saveControl] = document.getElementsByClassName('nav navbar-nav')[0].children;
				routeControl.firstChild.innerHTML = Strings.ROUTES_BUTTON_TEXT + ' (' + Object.keys(Globals.route).length + ')';
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

		resultsAsRoute: function(fragment, result) {
			var routeContainer = document.createElement('div');
			var routeInfo = document.createElement('div');
			var routeName = document.createElement('h3');
			var addToRouteButton = document.createElement('button');

			addToRouteButton.setAttribute('class', 'btn btn-remove');
			addToRouteButton.innerHTML = '<i class=\"glyphicon glyphicon-remove\" aria-label=\"' + Strings.REMOVE_FROM_ROUTE_TEXT + '\"></i>';	

			routeName.innerHTML = result.name;

			routeInfo.setAttribute('class', 'route-info');
			routeInfo.appendChild(routeName);
			routeInfo.appendChild(addToRouteButton);

			routeContainer.setAttribute('class', 'route-container');
			routeContainer.appendChild(routeInfo);

			addToRouteButton.addEventListener('click', function() {
				addToRouteButton.className = 'btn btn-add'
				addToRouteButton.innerHTML = Strings.ADD_TO_ROUTE_TEXT;
				result.options.inRoute = false;
				RouteController.removeFromRoute(result);	
				MapController.removeRouteCircle(result);

				var resultsContainer = document.getElementById('results');
				resultsContainer.innerHTML = '';
				Object.keys(Globals.route).forEach(function(key, index){
					var placeDetails = Globals.route[key];
					var resultFragment = document.createDocumentFragment();
					FragmentController.composeResultFragment(resultFragment, placeDetails, Constants.ROUTE_RESULT_VIEW);
					resultsContainer.appendChild(resultFragment);
				});

				if (Object.keys(Globals.route).length > 0) {
					ResultMenuController.enableResultMenuItem(Constants.RESULT_MENU_ROUTE);
					ResultMenuController.enableResultMenuItem(Constants.RESULT_MENU_SAVE);
				} else{
					ResultMenuController.disableResultMenuItem(Constants.RESULT_MENU_ROUTE);
					ResultMenuController.disableResultMenuItem(Constants.RESULT_MENU_SAVE);
					ResultMenuController.setResultMenuItemAsActive(Constants.RESULT_MENU_PLACES);
					var searchInput = document.getElementById('search-input');
					var query = searchInput.value;
					var resultsContainer = document.getElementById('results');
					resultsContainer.innerHTML = '';
					if (Globals.zenPlacesResultCache[query]) {
							Globals.zenPlacesResultCache[query].forEach(function(result, index){
								var placeDetails = Globals.zenPlaceDetailsCache[result];
								var resultFragment = document.createDocumentFragment();
								FragmentController.composeResultFragment(resultFragment, placeDetails, Constants.PLACES_RESULT_VIEW);
								resultsContainer.appendChild(resultFragment);
						});
					}
				}

				var [placeControl,routeControl,saveControl] = document.getElementsByClassName('nav navbar-nav')[0].children;
				routeControl.firstChild.innerHTML = Strings.ROUTES_BUTTON_TEXT + ' (' + Object.keys(Globals.route).length + ')';
			});

			fragment.appendChild(routeContainer);

			// var cardContainer = document.createElement('div');
			// var cardInfo = document.createElement('div');
			// var cardImageContainer = document.createElement('div');
			// var cardImage = document.createElement('img');
			// var cardName = document.createElement('h3');
			// var address = document.createElement('p');
			// var addToRouteButton = document.createElement('button');

			// if (result.mainPhotoUrl) {
			// 	cardImage.setAttribute('src', result.mainPhotoUrl);
			// } else {
			// 	var location = result.geometry.location.lat + "," + result.geometry.location.lng;
			// 	cardImage.setAttribute('src', 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + location + '&heading=200&&fov=100&pitch=20&key=AIzaSyBgESRsFdB2XZSZtPhiVnKWzG0JeR-nGGM');
			// }

			// cardImage.setAttribute('alt', 'A photo of ' + result.name);
			// cardImage.setAttribute('title', 'Click to view in map');

			// cardImageContainer.setAttribute('class', 'cardImageContainer');
			// cardImageContainer.appendChild(cardImage);

			// cardImageContainer.addEventListener('click', function(){
			// 	MapController.setCenter(result.geometry.location);
			// 	MapController.closeAllInfoWindows();

			// 	var searchInput = document.getElementById('search-input');
			// 	var query = searchInput.value;

			// 	var index = Globals.zenPlacesResultCache[query].indexOf(result.id);
			// 	MapController.showInfoWindow(index+1);
			// });

			// cardName.innerHTML = result.name;
			// address.innerHTML = result.formatted_address;
			
			// if (!result.options.inRoute) {
			// 	addToRouteButton.setAttribute('class', 'btn btn-add');
			// 	addToRouteButton.innerHTML = Strings.ADD_TO_ROUTE_TEXT;	
			// } else {
			// 	addToRouteButton.setAttribute('class', 'btn btn-remove');
			// 	addToRouteButton.innerHTML = Strings.REMOVE_FROM_ROUTE_TEXT;	
			// }

			// addToRouteButton.addEventListener('click', function() {
			// 	if (addToRouteButton.className === 'btn btn-add') {
			// 		addToRouteButton.className = 'btn btn-remove'
			// 		addToRouteButton.innerHTML = Strings.REMOVE_FROM_ROUTE_TEXT;
			// 		result.options.inRoute = true;
			// 		RouteController.addToRoute(result);
			// 		MapController.composeRouteCircle(result);
			// 	} else {
			// 		addToRouteButton.className = 'btn btn-add'
			// 		addToRouteButton.innerHTML = Strings.ADD_TO_ROUTE_TEXT;
			// 		result.options.inRoute = false;
			// 		RouteController.removeFromRoute(result);	
			// 		MapController.removeRouteCircle(result);

			// 		var resultsContainer = document.getElementById('results');
			// 		resultsContainer.innerHTML = '';
			// 		Object.keys(Globals.route).forEach(function(key, index){
			// 			var placeDetails = Globals.route[key];
			// 			var resultFragment = document.createDocumentFragment();
			// 			FragmentController.composeResultFragment(resultFragment, placeDetails, Constants.ROUTE_RESULT_VIEW);
			// 			resultsContainer.appendChild(resultFragment);
			// 		});
			// 	}

			// 	if (Object.keys(Globals.route).length > 0) {
			// 		ResultMenuController.enableResultMenuItem(Constants.RESULT_MENU_ROUTE);
			// 		ResultMenuController.enableResultMenuItem(Constants.RESULT_MENU_SAVE);
			// 	} else{
			// 		ResultMenuController.disableResultMenuItem(Constants.RESULT_MENU_ROUTE);
			// 		ResultMenuController.disableResultMenuItem(Constants.RESULT_MENU_SAVE);
			// 		ResultMenuController.setResultMenuItemAsActive(Constants.RESULT_MENU_PLACES);
			// 		var searchInput = document.getElementById('search-input');
			// 		var query = searchInput.value;
			// 		var resultsContainer = document.getElementById('results');
			// 		resultsContainer.innerHTML = '';
			// 		if (Globals.zenPlacesResultCache[query]) {
			// 				Globals.zenPlacesResultCache[query].forEach(function(result, index){
			// 					var placeDetails = Globals.zenPlaceDetailsCache[result];
			// 					var resultFragment = document.createDocumentFragment();
			// 					FragmentController.composeResultFragment(resultFragment, placeDetails, Constants.PLACES_RESULT_VIEW);
			// 					resultsContainer.appendChild(resultFragment);
			// 			});
			// 		}
			// 	}

			// 	var [placeControl,routeControl,saveControl] = document.getElementsByClassName('nav navbar-nav')[0].children;
			// 	routeControl.firstChild.innerHTML = Strings.ROUTES_BUTTON_TEXT + ' (' + Object.keys(Globals.route).length + ')';
			// });

			// cardInfo.setAttribute('class', 'card-info');
			// cardInfo.appendChild(cardImageContainer); 
			// cardInfo.appendChild(cardName); 
			// cardInfo.appendChild(address); 
			// cardInfo.appendChild(addToRouteButton); 

			// cardContainer.setAttribute('class', 'card-container');
			// cardContainer.appendChild(cardInfo);

			// fragment.appendChild(cardContainer);
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