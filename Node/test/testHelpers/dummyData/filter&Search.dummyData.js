var User = require('../../server/models/user.model');
var Rentable = require('../../server/models/rentable.model');

var owner = new User({
    username: "ownerTest",
    email: "ownerTest@gmail.com",
    password: "1234",
    role: "owner"
});

module.exports.createTestOwner = function (callback) {
    owner.save(callback);
}

var apartments =
    [{
        rentable_type: "Apartment",
        rent_price: 2211,
        district: "Fifth Settlement",
        size: 154,
        address: "234 Remsen Avenue",
        average_rating: 2.27,
        owner: owner._id
    },
    {
        rentable_type: "Apartment",
        rent_price: 3319,
        district: "Zamalek",
        size: 128,
        address: "918 Ridge Court",
        average_rating: 1.96,
        owner: owner._id
    },
    {
        rentable_type: "Apartment",
        rent_price: 1916,
        district: "Shubra",
        size: 252,
        address: "973 Perry Place",
        average_rating: 1.33,
        owner: owner._id
    },
    {
        rentable_type: "Apartment",
        rent_price: 4566,
        district: "Ain Shams",
        size: 243,
        address: "483 Woodbine Street",
        average_rating: 0.26,
        owner: owner._id
    },
    {
        rentable_type: "Apartment",
        rent_price: 2538,
        district: "Maadi",
        size: 183,
        address: "942 Hornell Loop",
        average_rating: 3.61,
        owner: owner._id
    },
    {
        rentable_type: "Apartment",
        rent_price: 2035,
        district: "Abbassia",
        size: 290,
        address: "768 Stone Avenue",
        average_rating: 4.1,
        owner: owner._id
    }];

module.exports.createTestApartments = function () {
    Rentable.insertMany(apartments)
        .catch(function (err) {
            console.log(err.message);
        });
}