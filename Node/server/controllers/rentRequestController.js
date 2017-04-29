
const Model = require('../models/rentRequest.model');
const User = require('../models/user.model');
const Rentable = require('../models/rentable.model');
const passportConfig = require('../../config/passport');

displayError = function(res, err) {
  if (err.name == 'ValidationError') {
    let message = '';
    for (field in err.errors)
      message = message + err.errors[field].message + '\n';
    console.log(message);
    res.send(message+ 'You stink potter');
  } else
    res.send(err.message);
};

module.exports.checkRedundant = function(req, res){
   passportConfig.decodeJWT(req, (id) => {
    let rentableId = req.params.id;
    let userId = id;
    let query = {userId: userId, rentable_id: rentableId};
        Model.countInstances(query, function(err, results) {
          let count = results.length;
          if (count > 0)
            return res.status(400).json({message: 'Only one request per apartment is allowed'});
          else
            return res.status(200).json({message: "You may proceed"});
  });
})};


// #Use case 1: student reserves a room

module.exports.addStudentRequest = function(req, res) {
  passportConfig.decodeJWT(req, (id) => {
    let request = req.body;
    console.log(request);
    let userId = id;
    let rDate = request.request_date;
    let duration = request.duration;
    let rentableId = request.rentable_id;
    let newRequest = new Model({
      rentable_id: rentableId,
      userId: userId,
      request_date: rDate,
      duration: duration,
    });
    User.getUserById(id, function(err, user) {
      if (user.role !== 'student')
        return res.status(401).json({message: 'Unauthorised'});

        let query = {userId: userId, rentable_id: rentableId};
        Model.countInstances(query, function(err, results) {
          let count = results.length;
          if (count > 0)
            return res.status(400).json({message: 'Only one request per apartment is allowed'});
          else {
            Model.addStudentRequest(newRequest, function(err, oldRentRequest) {
              if (err) {
                return res.status(400).json({message: err.message});
                displayError(res, err);
              } else {
                return res.status(200).json(oldRentRequest);
              }
            });
          }
        });
    });
  });
};


// Get a rentRequest instance
module.exports.getStudentRequest = function(req, res) {
  let requestId = req.params.id;
  let query = {'_id': requestId};
  Model.getStudentRequest(query, function(err, studentRequest) {
    if (studgetUserByIdentRequest == null || studentRequest.length == 0)
      res.send('Inexisting record');
    else if (err)
      res.send(err.message);
    else
      res.json(studentRequest);
  });
};


// Use case 2: Student checks his rent request status

module.exports.getStudentRequestStatus = function(req, res) {
  passportConfig.decodeJWT(req, (id) => {
    let query = {'_id': req.params.id};// rentRequest id
    Model.getRentRequestById(req.params.id, function(err, rentRequestInstance) {
      if (rentRequestInstance == null || rentRequestInstance.length == 0)
        res.send('inexisting record');
      else if (err)
        res.send(err.message);
      else if (rentRequestInstance.userId == id) {
        Model.getStudentRequestStatus(query, function(err, studentRequest) {
          if (studentRequest == null)
            res.send('inexisting record');
          else if (err)
            res.send(err.message);
          else
            res.json(studentRequest);
        });
      } else res.send('Unauthorized access');
    });
  });
};


// Use case 2: Student checks his rent request status

module.exports.getStudentRequests = function(req, res) {
  passportConfig.decodeJWT(req, (id) => {
    let query = {userId: id};
    console.log(id);
   User.getUserById(id, function(err, user) {
      if(user == null || err)
        return res.status(400).json({error: 'Please try again later'});
      if (user.role !== 'student')
        return res.status(401).json({error: 'Unauthorised'});
    Model.getStudentRequests(query, function(err, studentRequest) {
          if (studentRequest == null)
            return res.status(400).json({error: 'inexisting record'});
          else if (err)
            return res.status(400).json({error: err.message});
          return res.status(200).json(studentRequest);
        });
    });
  });
};


// Use Case 3: See all student requests for an apartment/room

// get all students' request for a particular apartment
module.exports.getAllStudentRequest = function(req, res) {
  passportConfig.decodeJWT(req, (id) => {
    let rentableId = req.params.id;
    let query = {rentable_id: rentableId};
    let ownerId = id;
    Rentable.getRentableById(rentableId, function(err, rentable) {
      if (rentable == null || rentable.length == 0)
        res.send('inexisting record');
      else if (err)
        res.send(err.message);
      else if (rentable.owner == ownerId) {
        Model.getAllStudentRequest(query, function(err, studentRequest) {
          if (studentRequest == null)
            res.send('Well Either no one wants your rentable or simply inexisting rentable');
          else if (err)
            res.send(err.message);
          else
            res.json(studentRequest);
        });
      } else {
        res.send('Unauthorized access');
      }
    });
  });
};

// Use Case 4: Update acceptness status of a rentable
module.exports.updateRentRequestStatus = function(req, res) {
  passportConfig.decodeJWT(req, (id) => {
    let ownerId = id;
    let requestInfo = req.body;
    let rentableId = requestInfo.rentableId;
    let requestId = requestInfo.requestId;
    let updatedStatus = requestInfo.status;
    let update = {$set: {status: updatedStatus}};
    let query = {_id: requestId};
    Rentable.getRentableById(rentableId, function(err, rentable) {
      if (rentable == null || rentable.length == 0)
        res.send('inexisting record');
      else if (err)
        res.send(err.message);
      else if (rentable.owner == ownerId) {
        Model.updateRentRequestStatus(query, update, function(err, studentRequest) {
          if (studentRequest == null)
            res.send('inexisting record');
          else if (err)
            displayError(res, err);
          else
            res.json(studentRequest);
        });
      } else res.send('Unauthorized access');
    });
  });
};

// CRUD

// Update

// Update a student adjusting his request
module.exports.updateStudentRequest = function(req, res) {
  Model.updateStudentRequest(req, function(err, updatedRequest) {
    if (err)
      displayError(res, err);
    else
      res.json(updatedRequest);
  }
  );
};


// Delete Owner's rentRequest records

module.exports.removeRentRequest = function(req, res) {
  let id = req.params.id;
  Model.removeRentRequest(id, function(err, result) {
    if (err)
      res.send(err.message);
    else
      res.json(result);
  });
};


////////////////////////////////////////////////////////////////
module.exports.acceptRentRequestStatus = (req, res) => {

    Model.getRentRequestById(req.params.id, (err, request) => {

      if (err) res.send(err);
      let query = {'_id': req.params.id};
      let update = {$set: {status: 'Accepted'}};

      Model.updateRentRequestStatus(query, update, (err) => {
        if (err) res.send(err);
        res.json({message: 'Request accepted!'});
      });

    });
};

module.exports.rejectRentRequestStatus = (req, res) => {
    Model.getRentRequestById(req.params.id, (err, request) => {

      if (err) res.send(err);
      let query = {'_id': req.params.id};
      let update = {$set: {status: 'Rejected'}};
      Model.updateRentRequestStatus(req.params.id, status, (err) => {
        if (err) res.send(err);
        res.json({message: 'Request rejected!'});
      });

    });

};

// non accepted requests
module.exports.unacceptedStudentRequest = (req, res) => {
    Model.getnAccepted('Pending_Acceptance', (err, rentRequests) => {
        if (err)
            res.send(err.message);
        else
            res.json(rentRequests);
    });
};
