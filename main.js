'use strict';
var ApiConnection = require('./apiconnection');
var Globals = require('./globals.js');
var Constants = require('./constants');
var FragmentComposer = require('./fragmentcomposer.js');

if (document.readyState !== "loading") {
	initData();
} else {
	document.addEventListener('DOMContentLoaded', function() {
		initData();
	}, false);
}

ApiConnection.connect('https://maps.googleapis.com/maps/api/js?'+
	'key=AIzaSyBgESRsFdB2XZSZtPhiVnKWzG0JeR-nGGM&callback=initGoogleMapApi&'+
	'libraries=places', 'initGoogleMapApi', initSearch);

function initData() {
	var search = document.getElementById('search');
	var searchFragment = document.createDocumentFragment();

	search.innerHTML = '';
	FragmentComposer.composeSearchFragment(searchFragment, Constants.DEFAULT);
	search.appendChild(searchFragment);
}

function initSearch() {
	var search = document.getElementById('search');
	var searchInput = document.getElementById('search-input');
	var autocomplete = new google.maps.places.Autocomplete(searchInput, {
		types: ['(cities)']
	});
}