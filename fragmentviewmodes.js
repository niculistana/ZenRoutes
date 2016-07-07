var DomEvents = require('./domevents');
var Strings = require('./strings');

var SearchViewMode = function(){
	var goButtonText = Strings.GO_BUTTON_TEXT;
	var settingsButtonText = Strings.SETTINGS_BUTTON_TEXT;

	return {
		searchAsDefault: function(fragment) {
			var search_input = document.createElement('input');
			var search_button = document.createElement('button');
			var search_history = document.createElement('div');

			search_input.setAttribute('id', 'search-input');
			search_input.addEventListener('keyup', function(event) {
				DomEvents.SearchEvents.onSearchSubmit(event);
			});
			search_button.setAttribute('id', 'search-button');
			search_button.innerHTML = goButtonText;
			search_button.addEventListener('click', function() {
				DomEvents.SearchEvents.searchForPlaces();
			});

			search_history.innerHTML = 
				localStorage.getItem('queryCache') ? 'Recent searches: ' 
				+ JSON.parse(localStorage.getItem('queryCache')).slice(0, 5).join(' | ') : '<br />';

			fragment.appendChild(search_input);
			fragment.appendChild(search_button);
			fragment.appendChild(search_history);
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

var ResultsViewMode = function(resultList) {
	return {
		resultsAsCardList: function(fragment) {
			var place_card = document.createElement('div');
			var place_info = document.createElement('div');

			fragment.appendChild(place_card);
			place_card.appendChild(place_info);

			resultList.forEach(function(e) {
				var place_name = document.createElement('h1');
				var miles_away = document.createElement('p');
				var save_button = document.createElement('button');

				place_name.innerHTML = e.name;
				miles_away.innerHTML = e.formatted_address;
				save_button.innerHTML = 'Save';

				place_info.appendChild(place_name); 
				place_info.appendChild(miles_away); 
				place_info.appendChild(save_button); 
			});
		},

		resultsAsTable: function(fragment) {
			var table = document.createElement('table');
			table.setAttribute('class', 'table table-hover table-responsive');
			
			var thead = document.createElement('thead');
			var tr_head = document.createElement('tr');

			var tbody = document.createElement('tbody');
			fragment.appendChild(table);
			
			table.appendChild(thead);
			thead.appendChild(tr_head);
			table.appendChild(tbody);

			for (var key in resultList[0]) {
				var th = document.createElement('th');
				th.innerHTML += key;
				tr_head.appendChild(th);
			}

			resultList.forEach(function(e) {
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

module.exports = {
	SearchViewMode,
	ResultsViewMode
}