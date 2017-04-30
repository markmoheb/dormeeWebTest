const mongoose = require('mongoose');

let rentRequest = new mongoose.Schema({
  rentable_id: {                     // reference to rentable
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rentable',
  },
  request_date: {
    type: Date,
    required: true,
  },
  userId: {                     // reference to user
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['Accepted', 'Rejected', 'Pending_Acceptance'],
    default: 'Pending_Acceptance',
  },
  duration: {
    type: Number,
    required: true,
  },
});

rentRequest = mongoose.model('rentRequest', rentRequest);
module.exports = rentRequest;

// Create

// Use Case# 1: Add student requests to the rentRequest

module.exports.addStudentRequest = function(newRentRequest, callback) {
  newRentRequest.save(callback);
};

// Use Case #3 View all studens' requests for my rentable

module.exports.getAllStudentRequest = function(query, callback) {
  rentRequest.findOne(query, callback);
};


// Get A Particular Student request
module.exports.getStudentRequest = function(query, callback) {
  rentRequest.find(query, callback);
};

// Use Case 2: view Student's Request Status
module.exports.getStudentRequestStatus = function(query, callback) {
  rentRequest.findOne(query, 'status', callback);
};

// Update

// Update a student adjusting his request

module.exports.updateStudentRequest = function(requestInfo, callback) {
  let studentId = requestInfo.userId;
  let rentableId = requestInfo.rentable_id;
  let updatedRequestInfo = requestInfo.requests;

  rentRequest.update({'requests.userId': studentId, 'rentable_id': rentableId},
    {$set: {'requests': updatedRequestInfo}}, callback);
};

// Use Case # 4: Update Acceptance of A student's rental request

// module.exports.updateRentRequestStatus = function(query, update, callback) {
//   rentRequest.update(query, update, callback);
// };
module.exports.updateRentRequestStatus = function(query, update, callback) {
  rentRequest.findOneAndUpdate(query, update, callback);
};

// Update Student's request's request_info


module.exports.updateStudentRequest = function(req, callback) {
  let requestInfo = req.body;
  let requestId = requestInfo.request_id;
  let rDate = req.body.request_date;
  let newDuration = req.body.duration;
  let updatedRequest =
    {
      request_date: rDate,
      duration: newDuration,
    };
  rentRequest.update({_id: requestId},
    {'$set': updatedRequest}, callback);
};


// Delete

// delete the entire record must look at domino effect!!!!!!!

module.exports.removeRentRequest = function(id, callback) {
  rentRequest.findByIdAndRemove(id, callback);
};

// Other methods

module.exports.countInstances = function(query, callback) {
  rentRequest.find(query, callback);
};

module.exports.getRentRequestById = function(id, callback) {
  rentRequest.findById(id, callback);
};

// added by Nada
module.exports.getRentRequest = function(query, callback) {
  rentRequest.findOne(query, callback);
};

// check the status of the request of the student to give him/her exclusive information about the owner
module.exports.checkStatus = function(id, ownerId, status, callback) {
  rentRequest.find({'userId': id, 'status': status}, callback);
};

module.exports.getStudentRequests = function(query, callback) {
  rentRequest.find(query).populate('rentable_id').exec(callback);
};

// Read
module.exports.getnAccepted = (query, callback) => {
    rentRequest.find(query, callback);
};

module.exports.rejectOtherRequests = (specific, status, callback) => {
   rentRequest.update(specific, status, callback);
};
