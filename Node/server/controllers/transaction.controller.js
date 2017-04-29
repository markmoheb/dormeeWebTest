const Model = require('../models/transaction.model');
const RentRequest = require('../models/rentRequest.model');
const User = require('../models/user.model');
const Rentable = require('../models/rentable.model');
const passportConfig = require('../../config/passport');

// stripe keys
const keyPublishable = 'pk_test_VN6FYFcqrnBOzuslAsMjH01H';
const keySecret = 'sk_test_yrt62BNk1eQYa8puNCtUaoPQ';
const stripe = require('stripe')(keySecret);


// Create charges


// Create

module.exports.saveTransaction = function(req, res) {
  passportConfig.decodeJWT(req, function(userId, err) {
    let request = req.body;
    let charge = stripe.charges.create({
      amount: request.amount,
      currency: request.currency,
      description: request.description,
      source: request.stripeToken,
    }, function(err, charge) {
      if (err)
        res.json(err);
      else {
        console.log(charge);
        let moneyPaid = request.amount;
        let stripeId = charge.id;
        let studentId = userId;
        let rentRequestId = request.rentRequestId;

        RentRequest.getRentRequestById(rentRequestId, function(err, rentRequestInstance) {
          if (err){
            res.json(err);
            console.log(err.message);
        }
          else {
            let rentableId = rentRequestInstance.rentable_id;

            Rentable.getRentableById(rentableId, function(err, rentableInstance) {
              if (err)
                res.json(err);
              else {
                let ownerId = rentableInstance.owner;
                let moneyDue = rentableInstance.rent_price;
                let update = {
                  $set: {vacant: 'false'},
                };
                let options = {
                  new: true,
                };
                Rentable.updateRentable(rentableId, update, options, function(err, rentable) {
                  if (err){
                    res.json(err.message);
                    console.log('Failure at finding rentable');
                }
                  else {
                    let transaction = new Model({
                      owner: ownerId,
                      student: studentId,
                      rentRequest: rentRequestId,
                      amount_due: moneyDue * rentRequestInstance.duration,
                      amount_paid: moneyPaid,
                      currency: 'EGP',
                      stripe_reciepts_ids: [stripeId],
                    });
                    Model.saveTransaction(transaction, function(err, result) {
                      if (err){
                        res.json(err);
                        console.log(err.message+" FAILED");
                    }
                      else {
                        console.log('WORKED');
                        res.json(result);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
};

// get All of the user's transactions

module.exports.getMyTransactions = function(req, res) {
  passportConfig.decodeJWT(req, function(id, err) {
    let userId = id;

    User.getUserById(id, function(err, instance) {
      if (instance == null || instance.length == 0)
        res.json('Inexistant user');
      else if (err)
        res.json(err);
      else {
        console.log(instance);
        if (instance.role == 'owner') {
          let query = {'owner': userId};
          Model.getMyTransactions(query, function(err, results) {
            if (err)
              res.json(err);
            else res.json(results);
          });
        } else if (instance.role == 'student') {
          let query = {'student': userId};
          console.log(query);
          Model.getMyTransactions(query, function(err, results) {
            if (err)
              res.json(err);
            else res.json(results);
          });
        } else {
          res.json('No transactions for you');
        }
      }
    });
  });
};

// add stripe id + new paid amount
module.exports.addRecieptAndAddMoney = function(req, res) {
  let request = req.body;
  let transactionId = request.transactionId;
  let stripeId = request.stripeId;
  let moneyPaid = request.moneyPaid;
  let options = {
    new: true,
  };
  Model.addRecieptAndAddMoney(transactionId, moneyPaid, stripeId, options, function(err, results) {
    if (err)
      res.json(err.message);
    else
      res.json(results);
  });
};
