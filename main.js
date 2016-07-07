'use strict';
var ApiConnection = require('./apiconnection');
var Globals = require('./globals.js');
var Constants = require('./constants');
var FragmentComposer = require('./fragmentcomposer.js');
var MapLoader = require('./maploader.js');

if (document.readyState !== "loading") {
	initData();
} else {
	document.addEventListener('DOMContentLoaded', function() {
		initData();
	}, false);
}

ApiConnection.connect('https://maps.googleapis.com/maps/api/js?'+
	'key=AIzaSyBgESRsFdB2XZSZtPhiVnKWzG0JeR-nGGM&callback=initGoogleMapApi&'+
	'libraries=places', 'initGoogleMapApi', initComponents);

function initData() {
	console.log('initData');
};

function initComponents() {
	var search = document.getElementById('search');
	var searchFragment = document.createDocumentFragment();

	search.innerHTML = '';
	FragmentComposer.composeSearchFragment(searchFragment, Constants.DEFAULT);
	search.appendChild(searchFragment);

	var searchInput = document.getElementById('search-input');
	var autocomplete = new google.maps.places.Autocomplete(searchInput, {
		types: ['address']
	});


	var styles = [{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#E8DED1"}]},
		{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#E8D7D1"}]},
		{"featureType":"road.highway","elementType":"geometry","stylers":[{"lightness":60},{"color":"#BCB4B5"}]},
		{"featureType":"water","stylers":[{"color":"#4397CE"}]}]


	// Create a new StyledMapType object, passing it the array of styles,
	// as well as the name to be displayed on the map type control.
	var styledMap = new google.maps.StyledMapType(styles,
	{name: "Styled Map"});

	// Create a map object, and include the MapTypeId to add
	// to the map type control.
	var mapOptions = {
		zoom: 13,
		center: new google.maps.LatLng(37.7843179, -122.3951441),
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
		},
		minZoom: 7,
		maxZoom: 17
	};

	window.map = new google.maps.Map(document.getElementById('map'), mapOptions);

	//Associate the styled map with the MapTypeId and set it to display.
	map.mapTypes.set('map_style', styledMap);
	map.setMapTypeId('map_style');


	// MapLoader.loadMap('map', -33.8688, 151.2195);

	// geocoder.geocode({'address': query}), function(results, status) {
	// 	console.log(results);
	// 	console.log(status);
	// }
};