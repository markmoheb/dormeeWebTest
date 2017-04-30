const mongoose = require('mongoose');

let rentableSchema = mongoose.Schema({
  rentable_type: {
    type: String,
    enum: ['Apartment', 'Room'],
    required: [true, 'The rentable type is required.'],
  },
  verified_by_admin: {
    type: String,
    enum: ['true', 'false'],
  },
  address: {
    type: String,
    required: [true, 'The address is required.'],
  },
  district: String,
  size: {
    type: Number,
    required: [true, 'The rentable size is required.'],
  },
  floor_level: Number,
  public_transportation: Number, // time to nearest transportation point
  insurance: Number,
  posting_date: {
    type: Date,
    default: Date.now,
  },
  number_of_rooms: Number,
  number_of_bathrooms: Number,
  amenities: {
    furnished: {
      type: String,
      lowercase: true,
      trim: true,
      enum: ['true', 'false'],
      default: 'false',
    },
    air_conditioning: {
      type: String,
      lowercase: true,
      trim: true,
      enum: ['true', 'false'],
      default: 'false',
    },
    cooker: {
      type: String,
      lowercase: true,
      trim: true,
      enum: ['true', 'false'],
      default: 'false',
    },
    heater: {
      type: String,
      lowercase: true,
      trim: true,
      enum: ['true', 'false'],
      default: 'false',
    },
    washer: {
      type: String,
      lowercase: true,
      trim: true,
      enum: ['true', 'false'],
      default: 'false',
    },
    landline: {
      type: String,
      lowercase: true,
      trim: true,
      enum: ['true', 'false'],
      default: 'false',
    },
    internet: {
      type: String,
      lowercase: true,
      trim: true,
      enum: ['true', 'false'],
      default: 'false',
    },
    TV: {
      type: String,
      lowercase: true,
      trim: true,
      enum: ['true', 'false'],
      default: 'false',
    },
    parking: {
      type: String,
      lowercase: true,
      trim: true,
      enum: ['true', 'false'],
      default: 'false',
    },
    elevator: {
      type: String,
      lowercase: true,
      trim: true,
      enum: ['true', 'false'],
      default: 'false',
    },
  },
  summary: String,
  rent_info: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'rentRequest',
  },
  photo_path: String,
  ratings: [{
    value: {
      type: Number,
      min: 0,
      max: 5,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  reviews: [{
    content: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  average_rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  flatshare: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'flatshare',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vacant: {
    type: String,
    enum: ['true', 'false'],
    default: 'true',
  },
  rent_price: {
    type: Number,
    required: [true, 'The rent amount is required.'],
  },
  verified_by_admin: {
    type: String,
    enum: ['true', 'false'],
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
});

rentableSchema.index({'$**': 'text'});

let Rentable = module.exports = mongoose.model('Rentable', rentableSchema);

// Create

module.exports.saveRentable = function(rentable, callback) {
  rentable.save(callback);
};

// Read

module.exports.getAllRentables = function(callback) {
  Rentable.find(callback);
};

module.exports.getAllRentablesForVisitors = function(query, options, callback) {
  Rentable.find(query, options, callback);
};

module.exports.getRentableById = function(id, callback) {
  Rentable.findById(id, callback);
};

module.exports.getRentableByIdForVisitors = function(id, options, callback) {
  Rentable.findById(id, options, callback);
};

module.exports.getRentables = function(query, options, callback) {
  Rentable.find(query, options, callback);
};

module.exports.getRentable = function(query, callback) {
  Rentable.findOne(query, callback);
};

// Update

module.exports.getRentableAndUpdate = function(query, options, update, callback) {
  Rentable.findOneAndUpdate(query, options, update, callback);
};

module.exports.updateRentable = function(id, update, options, callback) {
  Rentable.findByIdAndUpdate(id, update, options, callback);
};

// Delete

module.exports.deleteRentable = function(query, callback) {
  Rentable.remove(query, callback);
};

// Helpers

module.exports.updateAvgRating = function(id, callback) {
  let pipeline = [{
    $match: {
      _id: mongoose.Types.ObjectId(id),
    },
  },
  {
    $unwind: '$ratings',
  },
  {
    $group: {
      _id: '$_id',
      avg_rating: {
        $avg: '$ratings.value',
      },
    },
  },
  ];

  Rentable.aggregate(pipeline, function(err, results) {
    if (err) {
      return;
    }

    if (results.length == 0)
      avg = 0;
    else
      avg = results[0].avg_rating;

    let update = {
      $set: {
        average_rating: avg,
      },
    };
    let options = {
      new: true,
    };
    Rentable.findByIdAndUpdate(id, update, options, callback);
  });
};

module.exports.getSomeAttributes = function(query, projection, callback) {
  Rentable.findOne(query, projection, callback);
};
module.exports.getReviewsByOwnerId = function(OwnerId, callback) {
  let query = {owner: OwnerId};
  Rentable.find(query, {'reviews': 1, 'ratings': 1}, callback);
};

module.exports.getQuery = function(query, callback) {
  Rentable.find(query, callback);
};

module.exports.verifyAd = function(query, update, callback) {
  Rentable.findOneAndUpdate(query, update, callback);
};

module.exports.getApartmentsByOwnerId = function(ownerId, callback) {
  let query = {owner: ownerId, rentable_type: 'Apartment'};
  Rentable.find(query, callback);
};

module.exports.getRoomsByOwnerId = function(ownerId, callback) {
  let query = {owner: ownerId, rentable_type: 'Room'};
  Rentable.find(query, callback);
};

module.exports.getRentablesByOwnerId = function(ownerId, callback) {
  let query = {owner: ownerId};
  Rentable.find(query, callback);
};
