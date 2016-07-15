var Constants = require('./../_variables/constants');
var ResultMenuView = require('./../_views/resultmenuview');
var Strings = require('./../_variables/strings');

ResultMenuController = function() {
	var mainContent = document.getElementById('main-content');

	return {
		composeResultMenuFragment: function (fragment, view) {
			if (view === Constants.INLINE) {
				ResultMenuView.resultMenuAsInline(fragment)
			}
		},

		enableResultMenuItem:function(menuItem){
			var [placeControl,routeControl,saveControl] = document.getElementsByClassName('nav navbar-nav')[0].children;
			if (menuItem === Constants.RESULT_MENU_PLACES) {
				placeControl.classList.remove('disabled');
			} else if(menuItem === Constants.RESULT_MENU_ROUTE) {
				routeControl.classList.remove('disabled');
			} else if (menuItem === Constants.RESULT_MENU_SAVE) {
				saveControl.classList.remove('disabled');
			}
		},

		disableResultMenuItem:function(menuItem){
			var [placeControl,routeControl,saveControl] = document.getElementsByClassName('nav navbar-nav')[0].children;

			if (menuItem === Constants.RESULT_MENU_PLACES) {
				placeControl.classList.add('disabled');
			} else if(menuItem === Constants.RESULT_MENU_ROUTE) {
				routeControl.classList.add('disabled');
				routeControl.setAttribute('title',Strings.NO_ROUTES);
			} else if (menuItem === Constants.RESULT_MENU_SAVE) {
				saveControl.classList.add('disabled');
				saveControl.setAttribute('title',Strings.NO_ROUTES);
			}
		},

		setResultMenuItemAsActive:function(menuItem){
			var [placeControl,routeControl,saveControl] = document.getElementsByClassName('nav navbar-nav')[0].children;
			if (menuItem === Constants.RESULT_MENU_PLACES) {
				placeControl.classList.add('active');
				routeControl.classList.remove('active');
				saveControl.classList.remove('active');
			} else if (menuItem === Constants.RESULT_MENU_ROUTE) {
				placeControl.classList.remove('active');
				routeControl.classList.add('active');
				saveControl.classList.remove('active');
			} else if (menuItem === Constants.RESULT_MENU_SAVE) {
				placeControl.classList.remove('active');
				routeControl.classList.remove('active');
				saveControl.classList.add('active');
			} 
		},

		updateResultMenuFragment:function(fragment,view){
			if (view === Constants.RESULT_MENU_PLACES) {
				ResultMenuView.resultMenuAsPlacesActive(fragment);
			} else if (view === Constants.RESULT_MENU_ROUTE) {
				ResultMenuView.resultMenuAsRouteActive(fragment);
			} else if (view === Constants.RESULT_MENU_SAVE) {
				ResultMenuView.resultMenuAsSaveActive(fragment);
			}
		}
	};
}();

module.exports = ResultMenuController;