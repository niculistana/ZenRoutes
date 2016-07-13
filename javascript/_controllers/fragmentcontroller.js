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
				FragmentView.ResultView().resultsAsRoutes(fragment, result);
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