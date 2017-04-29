const mongoose = require('mongoose');
const Rentable = require('../models/rentable.model');

let flatshareSchema = new mongoose.Schema({
	air_conditioning: Boolean,
	cooker: Boolean,
	essentials: Boolean,
	furnished: Boolean,
	heater: Boolean,
	kitchen: Boolean,
	landline: Boolean,
	parking_space: Boolean,
	tv: Boolean,
	internet: Boolean,
	elevator: Boolean,
	washer: Boolean,
	bathrooms_no: {
		type: Number,
		min: 1,
		max: 20,
	},
	date_posted: {
		type: Date,
		default: Date.now,
	},
	floor_level: Number,
	gender: {
		type: String,
		enum: ['male', 'female'],
	},
	insurance_money: {
		type: Number,
		required: [true, 'this field is required'],
	},
	max_guests: Number,
	no_of_rooms: Number,
	rooms: {
		deposite: Number,
		rent: Number,
		renter_id: String,
		size: Number,
		summary: String,
		amenities: {
			air_conditioning: Boolean,
			desk: Boolean,
			landline: Boolean,
			tv: Boolean,
		},
		service_fees: Number,
		photos: {
			photo_id: String,
			url: String,
		},
		owner_id: String,
		public_trans: Number,
		title: String,
		approved: {
			type: String,
			enum: ['pending', 'approved', 'rejected'],
			default: 'pending',
		},
		display: Boolean,
		rent_reservations: {
		},
	},
});

let Flatshare = module.exports = mongoose.model('flatshare', flatshareSchema);

// read
module.exports.getAllFlatshares = function(callback) {
	Flatshare.find(callback);
};

// read by id
module.exports.getFlatshareById = function(id, callback) {
	Flatshare.findById(id, callback);
};

// update
module.exports.updateFlatshare = function(id, update, callback) {
	Flatshare.findByIdAndUpdate(id, update, callback);
};

// create
module.exports.createFlatshare = function(flatshare, callback) {
	flatshare.save(callback);
};

// delete
module.exports.deleteFlatshare = function(id, callback) {
	Flatshare.findByIdAndRemove(id, function(err) {
		if (err) throw err;
		else
			Rentable.deleteRentable({'flatshare': id, 'rentable_type': 'Room'}, callback);
	});
};


