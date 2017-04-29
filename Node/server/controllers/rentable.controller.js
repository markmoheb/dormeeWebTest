const User = require('../models/user.model');
const Rentable = require('../models/rentable.model');
// const RentRequest = require('../models/rentRequest.model');

const multerConfig = require('../../config/multer');
const passportConfig = require('../../config/passport');

const validator = require('validator');

// Create
module.exports.createRentable = function(req, res) {
  multerConfig.uploadRentablePhoto(req, res, function(err) {
    if (err) {
      res.send(err.message);
      return;
    }
    if (!req.file) {
      res.status(400).json({error: 'No file'});
      return;
    }

    req.checkBody('rentable_type', 'Please specify the rentable type.').notEmpty();
    req.checkBody('address', 'Please specify the address of the rentable.').notEmpty();
    req.checkBody('size', 'Please specify the size of the rentable.').notEmpty();
    req.checkBody('rent_price', 'Please specify the rent price.').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
      res.json(errors[0].msg);
      return;
    }

    passportConfig.decodeJWT(req, function(userId, hasJWT) {
      if (!hasJWT) {
        res.send('Unauthorized access. Please log in.');
        return;
      }

      User.getUserById(userId, function(err, user) {
        if (err) {
          res.send(err.message);
          return;
        }

        if (!user) {
          res.send('There\'s no user with that id.');
          return;
        }

        if (user.role !== 'owner' && user.role !== 'admin') {
          res.send('Only owners can post rentable ads.');
          return;
        }

        let rentable = new Rentable(req.body);
        let path = req.file.path.split('public/')[1];
        rentable.set('photo_path', path);
        rentable.set('owner', userId);

        Rentable.saveRentable(rentable, function(err, rentable) {
          if (err)
            displayError1(res, err);
          else
            res.json(rentable);
        });
      });
    });
  });
};

// Read

module.exports.getAllRentables = function(req, res) {
  passportConfig.decodeJWT(req, function(userId, hasJWT) {
    if (!hasJWT) {
      let query = {};
      let options = {
        address: 0,
        owner: 0,
      };

      Rentable.getAllRentablesForVisitors(query, options, function(err, rentables) {
        if (err)
          res.send(err.message);
        else
          res.json(rentables);
      });
    } else {
      Rentable.getAllRentables(function(err, rentables) {
        if (err)
          res.send(err.message);
        else
          res.json(rentables);
      });
    }
  });
};

module.exports.getAllApartments = function(req, res) {
  passportConfig.decodeJWT(req, function(userId, hasJWT) {
    let query = {
      rentable_type: 'Apartment',
    };
    let options = {
      address: 0,
      owner: 0,
    };

    if (!hasJWT) {
      Rentable.getRentables(query, options, function(err, rentables) {
        if (err)
          res.send(err.message);
        else
          res.json(rentables);
      });
    } else {
      Rentable.getRentables(query, {}, function(err, rentables) {
        if (err)
          res.send(err.message);
        else
          res.json(rentables);
      });
    }
  });
};


module.exports.getAllRooms = function(req, res) {
  passportConfig.decodeJWT(req, function(userId, hasJWT) {
    let query = {
      rentable_type: 'Room',
    };
    let options = {
      address: 0,
      owner: 0,
    };

    if (!hasJWT) {
      Rentable.getRentables(query, options, function(err, rentables) {
        if (err)
          res.send(err.message);
        else
          res.json(rentables);
      });
    } else {
      Rentable.getRentables(query, {}, function(err, rentables) {
        if (err)
          res.send(err.message);
        else
          res.json(rentables);
      });
    }
  });
};

module.exports.getRentableById = function(req, res) {
  let id = req.params.id;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    res.send('The argument passed is not an id. ' +
      'It must be a single string of 12 bytes or a string of 24 hex characters.');
    return;
  }

  passportConfig.decodeJWT(req, function(userId, hasJWT) {
    if (!hasJWT) {
      let options = {
        address: 0,
        owner: 0,
      };

      Rentable.getRentableByIdForVisitors(id, options, function(err, rentable) {
        if (err)
          res.send(err.message);
        else if (!rentable)
          res.send('There\'s no rentable with this id.');
        else
          res.json(rentable);
      });
    } else {
      Rentable.getRentableById(id, function(err, rentable) {
        if (err)
          res.send(err.message);
        else if (!rentable)
          res.send('There\'s no rentable with this id.');
        else
          res.json(rentable);
      });
    }
  });
};

// Update

module.exports.updateRentable = function(req, res) {
  multerConfig.uploadRentablePhoto(req, res, function(err) {
    if (err) {
      res.send(err.message);
      return;
    }
    let id = req.params.id;
    let user = req.user;
    let update = {
      $set: req.body,
    };
    let options = {
      new: true,
    };

    if (req.file) {
      let path = req.file.path.split('public/')[1];
      update.$set.photo_path = path;
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.send('The argument passed is not an id.');
      return;
    }

    Rentable.getRentableById(id, function(err, rentable) {
      if (err) {
        res.send(err.message);
        return;
      }

      if (!rentable) {
        res.send('There\'s no rentable with that id.');
        return;
      }

      if (!user._id.equals(rentable.owner) && user.role != 'admin') {
        res.send('Unauthorized access!');
        return;
      }

      Rentable.updateRentable(id, update, options, function(err, rentable) {
        if (err)
          displayError1(res, err);
        else if (!rentable)
          res.send('There\'s no rentable with that id.');
        else
          res.json(rentable);
      });
    });
  });
};

// Delete

module.exports.deleteRentable = function(req, res) {
  let id = req.params.id;
  let user = req.user;

  let query = {
    _id: id,
  };

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    res.send('The argument passed is not an id. ' +
      'It must be a single string of 12 bytes or a string of 24 hex characters.');
    return;
  }

  Rentable.getRentableById(id, function(err, rentable) {
    if (err) {
      res.send(err.message);
      return;
    }

    if (!rentable) {
      res.send('There\'s no rentable with that id.');
      return;
    }

    if (!user._id.equals(rentable.owner) && user.role != 'admin') {
      res.send('Unauthorized access!');
      return;
    }

    if (user.role == 'admin') {
      Rentable.deleteRentable({_id: id}, function(err, rentable) {
        if (err)
          res.send(err);
        else
          res.send('Deleted successfully!');
      });
      return;
    }

    if (!rentable) {
      res.send('Only the owner of this rentable can update it.');
      return;
    }

    Rentable.deleteRentable(query, function(err, rentable) {
      if (err)
        res.send(err);
      else
        res.send('Deleted successfully!');
    });
  });
};

// Helpers

displayError1 = function(res, err) {
  if (err.name == 'ValidationError') {
    let message = '';
    for (field in err.errors)
      message = message + err.errors[field].message + '\n';
    res.send(message);
  } else
    res.send(err.message);
};

updateAvgRating = function(id, res) {
  Rentable.updateAvgRating(id, function(err, rentable) {
    if (err)
      res.send(err.message);
    else
      res.json(rentable);
  });
};

module.exports.getRentableReviewsAndRatings = function(req, res) {
  let id = req.params.id;
  let query = {
    _id: id,
  };
  let projection = {
    'reviews': 1,
    'ratings': 1,
    'average_rating': 1,
  };

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    res.send('The argument passed is not an id. ' +
      'It must be a single string of 12 bytes or a string of 24 hex characters.');
    return;
  }

  Rentable.getSomeAttributes(query, projection, function(err, result) {
    if (err)
      res.send(err.message);
    else if (!result)
      res.send('There\'s no rentable with that id.');
    else
      res.json(result);
  });
};

// module.exports.insertReview = function(req, res) {
//   let rentableId = req.params.id;
//   let review = req.body.review;
//   let options = {
//     new: true,
//   };
//
//   if (!rentableId.match(/^[0-9a-fA-F]{24}$/)) {
//     res.send('The argument passed is not an id. ' +
//       'It must be a single string of 12 bytes or a string of 24 hex characters.');
//     return;
//   }
//
//   passportConfig.decodeJWT(req, function(userId, hasJWT) {
//     if (!hasJWT) {
//       res.send('Unauthorized access. Please log in.');
//       return;
//     }
//
//     User.getUserById(userId, function(err, user) {
//       if (err) {
//         res.send(err.message);
//         return;
//       }
//
//       if (!user) {
//         res.send('There\'s no user with that id');
//         return;
//       }
//
//       if (user.role !== 'student' && user.role !== 'admin') {
//         res.send('Only students can review rentables.');
//         return;
//       }
//
//       let query = {
//         rentable_id: rentableId,
//         userId: userId,
//         status: 'Accepted',
//       };
//
//       RentRequest.getRentRequest(query, function(err, rentRequest) {
//         if (err) {
//           res.send(err.message);
//           return;
//         }
//
//         if (!rentRequest) {
//           res.send('Only students who rented this rentable can rate it.');
//           return;
//         }
//
//         query = {
//           _id: rentableId,
//         };
//
//         let update = {
//           $push: {
//             'reviews': {
//               content: review,
//               user: userId,
//             },
//           },
//         };
//
//         Rentable.getRentableAndUpdate(query, update, options, function(err, rentable) {
//           if (err)
//             displayError(res, err);
//           else if (!rentable)
//             res.json('There\'s no rentable with that id');
//           else
//             res.json(rentable);
//         });
//       });
//     });
//   });
// };

// verifying ads
module.exports.verifyAd = function(req, res) {
  passportConfig.decodeJWT(req, (id1) => {
    let id = req.params.id;
    let query = {'_id': id};

    let update = {$set: {verified_by_admin: 'true'}};

    Rentable.verifyAd(query, update, function(err, results) {
      if (err)
        displayError1(err, results);
      else {
        console.log('I reach the back');
        res.json(results);
      }
    });
  });
};

// module.exports.insertRating = function(req, res) {
//   let rentableId = req.params.id;
//   let rating = req.body.rating;
//   let options = {
//     new: true,
//   };
//   let update = {
//     $set: {
//       'ratings.$.value': rating,
//     },
//   };
//
//   if (!rentableId.match(/^[0-9a-fA-F]{24}$/)) {
//     res.send('The argument passed is not an id. ' +
//       'It must be a single string of 12 bytes or a string of 24 hex characters.');
//     return;
//   }
//
//   passportConfig.decodeJWT(req, function(userId, hasJWT) {
//     if (!hasJWT) {
//       res.send('Unauthorized access. Please log in.');
//       return;
//     }
//     User.getUserById(userId, function(err, user) {
//       if (err) {
//         res.send(err.message);
//         return;
//       }
//
//       if (!user) {
//         res.send('There\'s no user with that id');
//         return;
//       }
//
//       if (user.role !== 'student' && user.role !== 'admin') {
//         res.send('Only students can rate rentables.');
//         return;
//       }
//
//       let query = {
//         rentable_id: rentableId,
//         userId: userId,
//         status: 'Accepted',
//       };
//
//       RentRequest.getRentRequest(query, function(err, rentRequest) {
//         if (err) {
//           res.send(err.message);
//           return;
//         }
//
//         if (!rentRequest) {
//           res.send('Only students who rented this rentable can rate it.');
//           return;
//         }
//
//         query = {
//           '_id': rentableId,
//           'ratings.user': userId,
//         };
//
//         Rentable.getRentableAndUpdate(query, update, options, function(err, rentable) {
//           if (err) {
//             displayError(res, err);
//             return;
//           }
//
//           if (!rentable) {
//             query = {
//               _id: rentableId,
//             };
//             update = {
//               $push: {
//                 'ratings': {
//                   value: rating,
//                   user: userId,
//                 },
//               },
//             };
//
//             Rentable.getRentableAndUpdate(query, update, options, function(err, rentable) {
//               if (err) {
//                 displayError(res, err);
//                 return;
//               }
//
//               if (!rentable) {
//                 res.send('There\'s no rentable with that id');
//                 return;
//               }
//
//               updateAvgRating(rentableId, res);
//             });
//           }
//           updateAvgRating(rentableId, res);
//         });
//       });
//     });
//   });
// };
// other methods-----------------------------------------------------

// owner views reviews
module.exports.getReviewRating = function(req, res) {
  passportConfig.decodeJWT(req, (id) => {
    User.getUserById(id, function(err, user) {
      if (err) res.send(err);
      else
        if (!user) res.send('no such owner.');

      Rentable.getReviewsByOwnerId(id, function(err, reviews) {
        if (err)
          res.send(err);
        else
          res.json(reviews);
      });
    });
  });
};

// Filtering according to request query
module.exports.getFilteredRentables = function(req, res) {
  let query = req.query;
  let searchParams = [];
  let valid = true;
  let q = {};

  // Size Parameters
  let sh = parseInt(query.sh);
  let sl = parseInt(query.sl);

  // Price Parameters
  let ph = parseInt(query.ph);
  let pl = parseInt(query.pl);

  // Rating Parameter
  let rating = parseFloat(query.rat);

  // District Parameter
  let district = query.dis;

  if (sl)
    req.checkQuery('sl', 'size must be a number').isNumeric();

  if (sh)
    req.checkQuery('sh', 'size must be a number').isNumeric();

  if (pl)
    req.checkQuery('pl', 'price must be a number').isNumeric();

  if (ph)
    req.checkQuery('ph', 'price must be a number').isNumeric();

  let errors = req.validationErrors();

  if (errors)
    res.json({
      message: 'Error: ' + errors[0].msg,
    });

  else if (query.rat && !validator.isFloat(query.rat)) {
    res.json({
      message: 'Error: ' + 'rating must be a number',
    });
  } else if (rating < 0 || rating > 5) {
    res.json({
      message: 'Error: ' + 'rating must be between 0 and 5',
    });
  } else {
    // Rentable Type Parameters
    if (query.type)
      searchParams.push({
        'rentable_type': query.type,
      });


    if (pl)
      searchParams.push({
        'rent_price': {
          $gte: pl,
        },
      });
    if (ph)
      searchParams.push({
        'rent_price': {
          $lte: ph,
        },
      });

    if (pl && ph && ph < pl)
      valid = false;

    if (sl)
      searchParams.push({
        'size': {
          $gte: sl,
        },
      });
    if (sh)
      searchParams.push({
        'size': {
          $lte: sh,
        },
      });

    if (sl && sh && sh < sl)
      valid = false;

    if (rating)
      searchParams.push({
        'average_rating': {
          $gte: rating,
        },
      });

    if (district)
      searchParams.push({
        'district': district,
      });

    if (searchParams.length != 0)
      q.$and = searchParams;


    if (!valid) {
      res.send('Invalid query parameters!');
      return;
    }

    Rentable.getQuery(q, function(err, apartments) {
      if (err)
        res.send(err.message);
      else
        res.json(apartments);
    });
  }
};

// Searching with Keywords using Text seacrh
module.exports.getSearchResults = function(req, res) {
  let query = {};

  if (req.query.str)
    query = {
      $text: {
        $search: req.query.str,
      },
    };

  Rentable.getQuery(query, function(err, rentables) {
    if (err)
      res.send(err.message);
    else
      res.json(rentables);
  });
};

// get apartments of a certain owner using his ID
module.exports.getOwnerApartments = function(req, res) {
  passportConfig.decodeJWT(req, (id) => {
    User.getUserById(id, (err, user) => {
      if (err) {
        res.send(err);
        return;
      }
      if (!user) {
        res.send('no such user');
        return;
      }
      let query = {
        rentable_type: 'Apartment',
      };
      if (user.role == 'admin') {
        Rentable.getRentables(query, {}, function(err, rentables) {
          if (err)
            res.send(err.message);
          else
            res.json(rentables);
        });
      } else {
        Rentable.getApartmentsByOwnerId(id, function(err, rentables) {
          if (err)
            res.send(err);
          else
            res.json(rentables);
        });
      }
    });
  });
};


module.exports.getOwnerRooms = function(req, res) {
  passportConfig.decodeJWT(req, (id) => {
    User.getUserById(id, (err, user) => {
      if (err) {
        res.send(err);
        return;
      }
      if (!user) {
        res.send('no such user');
        return;
      }
      let query = {
        rentable_type: 'Room',
      };
      if (user.role == 'admin') {
        Rentable.getRentables(query, {}, function(err, rentables) {
          if (err)
            res.send(err.message);
          else
            res.json(rentables);
        });
      } else {
        Rentable.getRoomsByOwnerId(id, function(err, rentables) {
          if (err)
            res.send(err);
          else
            res.json(rentables);
        });
      }
    });
  });
};

module.exports.getOwnerRentables = function(req, res) {
  passportConfig.decodeJWT(req, (id) => {
    User.getUserById(id, (err, user) => {
      if (err) res.send(err);
      if (!user) res.send('no such user');
      if (user.role !== 'owner') res.send('not an owner');
      Rentable.getRentablesByOwnerId(id, function(err, rentables) {
        if (err)
          res.send(err);
        else
          res.json(rentables);
      });
    });
  });
};


module.exports.getUnverifiedApartments = function(req, res) {
  passportConfig.decodeJWT(req, (id) => {
    let query = {verified_by_admin: 'false', rentable_type: 'Apartment'};
    Rentable.getRentables(query, {}, function(err, rentables) {
      if (err)
        res.send(err);
      else
        res.json(rentables);
    });
  });
};

module.exports.getUnverifiedRooms = function(req, res) {
  passportConfig.decodeJWT(req, (id) => {
    let query = {verified_by_admin: 'false', rentable_type: 'Room'};
    Rentable.getRentables(query, {}, function(err, rentables) {
      if (err)
        res.send(err);
      else
        res.json(rentables);
    });
  });
};
