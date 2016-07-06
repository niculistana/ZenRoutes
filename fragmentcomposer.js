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