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