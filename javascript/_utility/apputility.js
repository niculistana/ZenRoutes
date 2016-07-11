AppUtility = function(){
	return {
		generateZenPlaceId: function(){
			var uniqueId = 'xxxxxxxxxxxxxxxxxxxxzpxxxxxxxxxx'.replace(/[x]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});

			return uniqueId;
		},
		getDistanceBetween: function (firstLocation, secondLocation) {
				var R = 3961;
				var x1 = secondLocation.location.lat-firstLocation.location.lat;
				var dLat = x1.toRad();  
				var x2 = secondLocation.location.lng-firstLocation.location.lng;
				var dlng = x2.toRad();  
				var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
						Math.cos(firstLocation.location.lat.toRad()) * Math.cos(secondLocation.location.lat.toRad()) * 
						Math.sin(dlng/2) * Math.sin(dlng/2);  
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
				var distanceBetween = R * c; 
				return distanceBetween;
		}
	}
}();

module.exports = AppUtility;