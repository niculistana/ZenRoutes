var ZenPlace = function(id){
	this.id = id;
	this.geometry = {};
	this.name = '';
	this.types = [];
	this.formatted_address = '';
	this.formatted_phone_number = '';
	this.website = '';
	this.mainPhotoUrl = '';
	this.zenLevel = -1;
	this.options = {
		saved: false,
		promoted: false,
		last_accessed: Date.now()
	}
};

ZenPlace.prototype = {
	setZenLevel: function(overall_rating, geotag_count) {
		this.zenLevel = overall_rating+geotag_count;
	}
};

module.exports = ZenPlace;