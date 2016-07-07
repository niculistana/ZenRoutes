MapLoader = function() {
	return {
		loadMap: function (domElementId, lat, lng){
			var origin = new google.maps.LatLng(lat,lng);

			var myMapOptions = {
				scrollwheel:false,
				zoom: 15,
				center: origin,
				mapTypeControl: true,
				mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
				position: google.maps.ControlPosition.RIGHT_TOP
				},
				navigationControl: true,
				navigationControlOptions: {
				style: google.maps.NavigationControlStyle.SMALL,
				position: google.maps.ControlPosition.LEFT_CENTER
				},
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			var map = new google.maps.Map(document.getElementById(domElementId),myMapOptions);

			return({
				container:map.getDiv(),
				map:map
			});
		}
	}
}();

module.exports = MapLoader;