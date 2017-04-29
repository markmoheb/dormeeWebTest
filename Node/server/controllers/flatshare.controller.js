const Flatshare = require('../models/flatshare.model');
const passportConfig = require('../../config/passport');
const User = require('../models/user.model');


// CRUD OPERATIONS

// Read

module.exports.getAllFlatshares = function(req, res) {
	Flatshare.getAllFlatshares(function(err, flatshares) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.json(flatshares);
		}
	});
};

// Read by ID

module.exports.getFlatshareById = function(req, res) {
	let id = req.params.id;
	Flatshare.getFlatshareById(id, function(err, flatshare) {
		if (err) {
			res.send(err);
		}

		if (!flatshare)
			res.send('no such flatshare');
		else
			res.json(flatshare);
	});
};


// update

module.exports.updateFlatshare = function(req, res) {
	let id = req.params.id;
	let update = {$set: req.body};
	Flatshare.updateFlatshare(id, update, function(err, flatshare) {
		if (err)
			res.send(err);
		if (!flatshare)
			res.send('no such flatshare');
		else {
			res.json(flatshare);
		}
	});
};


// Create

module.exports.createFlatshare = function(req, res) {
	let flatshare = new Flatshare(req.body);
	req.checkBody('insurance_money', 'Please add the insurance money.').notEmpty();
	Flatshare.createFlatshare(flatshare, function(err, flatshare) {
		if (err) {
			res.json(err);
		} else {
			res.json(flatshare);
		}
	});
};

// Delete

module.exports.deleteFlatshare = function(req, res) {
	passportConfig.decodeJWT(req, (id) => {
		User.getUserById(id, (err, user) => {
			if (err) res.send(err);
			if (!user) res.send('no such user.');
			if (user.role && user.role == !'admin')
				res.json({
					message: 'not an admin',
				});

			Flatshare.deleteFlatshare(req.body.flatshare_id, function(err) {
				if (err)
					res.json(err);
				else {
					res.json('Deleted');
				}
			});
		});
	});
};
