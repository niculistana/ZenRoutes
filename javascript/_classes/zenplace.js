var ZenPlace = function(id){
	this.id = id;
	this.geometry = {};
	this.name = '';
	this.types = [];
	this.formatted_address = '';
	this.formatted_phone_number = '';
	this.website = '';
	this.photos = [];
	this.zen_level = -1;
	this.options = {
		saved: false,
		promoted: false,
		last_accessed: Date.now()
	}
};

if (typeof(Number.prototype.toRad) === 'undefined') {
	Number.prototype.toRad = function() {
		return this * Math.PI / 180;
	}
};

ZenPlace.prototype = {
	setZenLevel: function(overall_rating, geotag_count) {
		this.zen_level = overall_rating+geotag_count;
	}
};

module.exports = ZenPlace;