var DomEvents = require('./../domevents');
var Strings = require('./../_variables/strings');

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
			var milesAway = document.createElement('p');
			var saveButton = document.createElement('button');

			if (result.mainPhotoUrl) {
				cardImage.setAttribute('src', result.mainPhotoUrl);
			} else {
				var location = result.geometry.location.lat + "," + result.geometry.location.lng;
				console.log(location);
				cardImage.setAttribute('src', 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + location + '&heading=200&&fov=100&pitch=20&key=AIzaSyBgESRsFdB2XZSZtPhiVnKWzG0JeR-nGGM');
			}

			cardImage.setAttribute('alt', 'A photo of ' + result.name);

			cardImageContainer.setAttribute('class', 'cardImageContainer');
			cardImageContainer.appendChild(cardImage);

			cardName.innerHTML = result.name;
			milesAway.innerHTML = result.formatted_address;
			saveButton.setAttribute('class', 'btn btn-primary');
			saveButton.innerHTML = 'Add to route';

			cardInfo.setAttribute('class', 'card-info');
			cardInfo.appendChild(cardImageContainer); 
			cardInfo.appendChild(cardName); 
			cardInfo.appendChild(milesAway); 
			cardInfo.appendChild(saveButton); 

			cardContainer.setAttribute('class', 'card-container');
			cardContainer.appendChild(cardInfo);

			fragment.appendChild(cardContainer);
		},

		resultsAsRoutes: function(fragment) {
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
			var navbarContainer = document.createElement('div');
			var navbarList = document.createElement('ul');

			navbar.setAttribute('class', 'navbar navbar-default');
			navbarContainer.setAttribute('class', 'container-fluid');
			navbarList.setAttribute('class', 'nav navbar-nav');

			var menuItems = [placesButtonText,routesButtonText,saveButtonText];

			menuItems.forEach(function(result, index) {
				var navBarListItem = document.createElement('li');
				var navBarListItemLink = document.createElement('a');
				if (index === 0) {
					navBarListItem.setAttribute('class', 'active');
				} else {
					// navBarListItem.setAttribute('class', 'disabled');
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
				});

				navBarListItem.appendChild(navBarListItemLink);
				navbarList.appendChild(navBarListItem);
			});

			navbarContainer.appendChild(navbarList);
			navbar.appendChild(navbarContainer);
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