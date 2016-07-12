var DomEvents = require('./../domevents');
var Strings = require('./../_variables/strings');

var SearchView = function(){
	var goButtonText = Strings.GO_BUTTON_TEXT;
	var settingsButtonText = Strings.SETTINGS_BUTTON_TEXT;

	return {
		searchAsDefault: function(fragment) {
			var input_group = document.createElement('div');
			var input_group_addon = document.createElement('span');
			var glyphicon = document.createElement('i');
			var search_input = document.createElement('input');

			input_group.setAttribute('class', 'input-group input-group-lg');
			input_group_addon.setAttribute('class', 'input-group-addon');
			glyphicon.setAttribute('class', 'glyphicon glyphicon-search');
			search_input.setAttribute('type', 'text');
			search_input.setAttribute('class', 'form-control');
			search_input.setAttribute('id', 'search-input');
			search_input.setAttribute('placeholder', Strings.SEARCH_PLACEHOLDER_TEXT);
			search_input.setAttribute('autofocus', true);

			input_group.appendChild(input_group_addon);
			input_group_addon.appendChild(glyphicon);
			input_group.appendChild(search_input);

			fragment.appendChild(input_group);
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
		}
	}
};

var ResultView = function() {
	return {
		resultsAsCard: function(fragment, result) {
			var place_card = document.createElement('div');
			var place_info = document.createElement('div');
			var place_name = document.createElement('h1');
			var miles_away = document.createElement('p');
			var save_button = document.createElement('button');

			place_name.innerHTML = result.name;
			miles_away.innerHTML = result.formatted_address;
			save_button.innerHTML = 'Save';

			place_info.appendChild(place_name); 
			place_info.appendChild(miles_away); 
			place_info.appendChild(save_button); 
			place_card.appendChild(place_info);

			fragment.appendChild(place_card);
		},

		resultsAsTableItem: function(fragment) {
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
	FullScreenView
}