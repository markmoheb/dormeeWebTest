const mongoose = require('mongoose');

let transactionSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rentRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'rentRequest',
    required: true,
  },
  amount_due: {
      type: Number,
  },
  amount_paid: {
      type: Number,
  },
  currency: {
      type: String,
  },
  stripe_reciepts_ids: [{
      type: String,
    },
  ],

  });

let transaction = module.exports = mongoose.model('transaction', transactionSchema);

// Create

module.exports.saveTransaction = function(newTransaction, callback) {
  newTransaction.save(callback);
};

// Read

module.exports.getMyTransactions = function(query, callback) {
  transaction.find(callback);
  // transaction.find(query,callback);
};

// add stripe id
module.exports.addRecieptAndAddMoney = function(id, moneyPaid, stripeId, options, callback) {
  transaction.findById(id, function(err, instance) {
      if(!err) {
        let moneyAlreadyPaid = instance.amount_paid;
        let totalMoney = +moneyPaid + +moneyAlreadyPaid;
        let update = {
              $push: {'stripe_reciepts_ids': stripeId},
              amount_paid: totalMoney,
                };

  transaction.findByIdAndUpdate(id, update, options, callback);
      }
  });
};
