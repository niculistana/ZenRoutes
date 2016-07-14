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

			result.options.inRoute = false;
			
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
					MapController.composeRouteCircle(result);
				} else {
					addToRouteButton.className = 'btn btn-add'
					addToRouteButton.innerHTML = Strings.ADD_TO_ROUTE_TEXT;
					result.options.inRoute = false;
					RouteController.removeFromRoute(result);	
					MapController.removeRouteCircle(result);
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

		resultsAsRoute: function(fragment, result) {
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
				var [placeControl,routeControl,saveControl] = document.getElementsByClassName('nav navbar-nav')[0].children;
				if (addToRouteButton.className === 'btn btn-add') {
					addToRouteButton.className = 'btn btn-remove'
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
									FragmentController.composeResultFragment(resultFragment, placeDetails, Constants.PLACES_RESULT_VIEW);
									resultsContainer.appendChild(resultFragment);
								});
							}
						}else if (result === routesButtonText) {
							Object.keys(Globals.route).forEach(function(key, index){
								var placeDetails = Globals.route[key];
								var resultFragment = document.createDocumentFragment();
								FragmentController.composeResultFragment(resultFragment, placeDetails, Constants.ROUTE_RESULT_VIEW);
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