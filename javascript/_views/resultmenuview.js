var DomEvents = require('./../domevents');
var Strings = require('./../_variables/strings');
var Constants = require('./../_variables/constants');

ResultMenuView = function(){
	var placesButtonText = Strings.PLACES_BUTTON_TEXT;
	var routesButtonText = Strings.ROUTES_BUTTON_TEXT;
	var sendButtonText = Strings.SEND_BUTTON_TEXT;

	return {
		resultMenuAsInline: function(fragment) {
			var navbar = document.createElement('nav');
			var navbarList = document.createElement('ul');

			navbar.setAttribute('class', 'navbar navbar-default');
			navbarList.setAttribute('class', 'nav navbar-nav');

			var menuItems = [placesButtonText,routesButtonText,sendButtonText];

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
					if (e.target.parentElement.className !== 'disabled') {
						var searchInput = document.getElementById('search-input');
						var query = searchInput.value;
						var resultsContainer = document.getElementById('results');
						resultsContainer.innerHTML = '';

						var [placeControl,routeControl,saveControl] = document.getElementsByClassName('nav navbar-nav')[0].children;

						if (result === placesButtonText) {
							placeControl.classList.add('active');
							routeControl.classList.remove('active');
							saveControl.classList.remove('active');

							if (Globals.zenPlacesResultCache[query]) {
								Globals.zenPlacesResultCache[query].forEach(function(result, index){
									var placeDetails = Globals.zenPlaceDetailsCache[result];
									var resultFragment = document.createDocumentFragment();
									FragmentController.composeResultFragment(resultFragment, placeDetails, Constants.PLACES_RESULT_VIEW);
									resultsContainer.appendChild(resultFragment);
								});
							}
						}else if (result === routesButtonText) {
							placeControl.classList.remove('active');
							routeControl.classList.add('active');
							saveControl.classList.remove('active');
							
							Object.keys(Globals.route).forEach(function(key, index){
								var placeDetails = Globals.route[key];
								var routeFragment = document.createDocumentFragment();
								FragmentController.composeResultFragment(routeFragment, placeDetails, Constants.ROUTE_RESULT_VIEW);
								resultsContainer.appendChild(routeFragment);
							});
							
						} else {
							placeControl.classList.remove('active');
							routeControl.classList.remove('active');
							saveControl.classList.add('active');

							var sendFragment = document.createDocumentFragment();
							FragmentController.composeResultFragment(sendFragment, null, Constants.SEND_RESULT_VIEW);
							resultsContainer.appendChild(sendFragment);
						}
					}
				});

				navBarListItem.appendChild(navBarListItemLink);
				navbarList.appendChild(navBarListItem);
			});

			navbar.appendChild(navbarList);
			fragment.appendChild(navbar);
		},
	};
}();

module.exports = ResultMenuView;