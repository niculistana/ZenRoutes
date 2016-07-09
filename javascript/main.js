'use strict';
var ApiConnection = require('./apiconnection');
var Globals = require('./_variables/globals.js');
var Constants = require('./_variables/constants');
var DomEvents = require('./domevents');
var FragmentController = require('./_controllers/fragmentcontroller.js');
var Strings = require('./_variables/strings');

ApiConnection.connect('https://maps.googleapis.com/maps/api/js?'+
	'key=AIzaSyBgESRsFdB2XZSZtPhiVnKWzG0JeR-nGGM&callback=initGoogleMapApi&'+
	'libraries=places', 'initGoogleMapApi', initComponents);

function initComponents() {
	var searchContainer = document.getElementById('search');
	var searchFragment = document.createDocumentFragment();

	searchContainer.innerHTML = '';
	FragmentController.composeSearchFragment(searchFragment, Constants.DEFAULT);
	searchContainer.appendChild(searchFragment);

	var searchInput = document.getElementById('search-input');
	var autocomplete = new google.maps.places.Autocomplete(searchInput, {
		types: ['(cities)']
	});


	google.maps.event.addListener(autocomplete, 'place_changed', function () {
		var result = autocomplete.getPlace();
		if (result.geometry) {
			DomEvents.SearchEvents.searchForPlaces();

		} else {
			document.getElementById('search-input').placeholder = Strings.SEARCH_PLACEHOLDER_TEXT;
		}
	});

	var styles = [{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#E8DED1"}]},
		{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#E8D7D1"}]},
		{"featureType":"road.highway","elementType":"geometry","stylers":[{"lightness":60},{"color":"#BCB4B5"}]},
		{"featureType":"water","stylers":[{"color":"#4397CE"}]}]

	var styledMap = new google.maps.StyledMapType(styles,
	{name: "Styled Map"});

	var mapOptions = {
		zoom: 12,
		center: new google.maps.LatLng(37.7843179, -122.3951441),
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
		},
		minZoom: 7,
		maxZoom: 17,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false
	};

	window.map = new google.maps.Map(document.getElementById('map'), mapOptions);

	map.mapTypes.set('map_style', styledMap);
	map.setMapTypeId('map_style');
};