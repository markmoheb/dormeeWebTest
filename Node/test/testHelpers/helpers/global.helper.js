var Rentable = require('../../server/models/rentable.model');
var User = require('../../server/models/user.model');
var Flatshare = require('../../server/models/flatshare.model');
var rentRequest = require('../../server/models/rentRequest.model');

module.exports.clearDatabase = function () {
    Rentable.remove({}, (err) => { if (err) console.log(err); });
    User.remove({}, (err) => { if (err) console.log(err); });
    Flatshare.remove({}, (err) => { if (err) console.log(err); });
    rentRequest.remove({}, (err) => { if (err) console.log(err); });
}