var should = require('chai').should();
var expect = require('chai').expect();
var supertest = require('supertest');
var api = supertest('http://localhost:3000');

var Rentable = require('../server/models/rentable.model');
var User = require('../server/models/user.model');

var dummyData = require('./testHelpers/dummyData/filter&Search.dummyData');
var globalHelper = require('./testHelpers/helpers/global.helper');

var config = require('../config/config');
var database = require("../config/database");

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

describe('', function () {
	//the 'before' hook runs once before all the tests
	before(function (done) {
		mongoose.connect(database.databaseURL);

		//clear the database
		globalHelper.clearDatabase();

		//create an owner
		dummyData.createTestOwner(done);

		// populate the database with dummy apartments
		dummyData.createTestApartments();

		mongoose.connection.close();

		done();
	})


	// deal with the 'describe' as a header
	//testing the Filter apartments
	describe('Filter Apartments', function () {
		it('no query, should return all retnables', function (done) {
			api.get('/rentables/filter')
				.end((err, res) => {
					res.body.should.be.a('array');
					res.body.length.should.be.eql(6);
					done();
				});
		})

		describe('by district', function () {
			it('dis = Zamalek, should return all retnables in the zamalek district and there is one', function (done) {
				api.get('/rentables/filter')
					.query({ dis: 'Zamalek' })
					.end((err, res) => {
						res.body.should.be.a('array');
						res.body.length.should.be.eql(1);
						done();
					});
			})

			it('dis = Neverland, should return all retnables in the \'Neverland\' district and there is none', function (done) {
				api.get('/rentables/filter')
					.query({ dis: 'Neverland' })
					.end((err, res) => {
						res.body.should.be.a('array');
						res.body.length.should.be.eql(0);
						done();
					});
			})
		});
		describe('by rating', function () {
			it('rat = 0, should return all retnables with a rating above 0 (all of them)', function (done) {
				api.get('/rentables/filter')
					.query({ rat: 0 })
					.end((err, res) => {
						res.body.should.be.a('array');
						res.body.length.should.be.eql(6);
						done();
					});
			})

			it('rat = 5, should return all retnables with a rating above 5 (none of them)', function (done) {
				api.get('/rentables/filter')
					.query({ rat: 5 })
					.end((err, res) => {
						res.body.should.be.a('array');
						res.body.length.should.be.eql(0);
						done();
					});
			})

			it('rat = 2.52, should return all retnables with a rating above 2.52', function (done) {
				api.get('/rentables/filter')
					.query({ rat: 2.52 })
					.end((err, res) => {
						res.body.should.be.a('array');
						res.body.length.should.be.eql(2);
						done();
					});
			})

			it('rat = test, should return an error', function (done) {
				api.get('/rentables/filter')
					.query({ rat: 'test' })
					.end((err, res) => {
						res.body.should.be.a('object');
						done();
					});
			})
		});
		describe('by price', function () {
			it('prices between 1000 and 2000', function (done) {
				api.get('/rentables/filter')
					.query({ pl: 1000 })
					.query({ ph: 2000 })
					.end((err, res) => {
						res.body.should.be.a('array');
						res.body.length.should.be.eql(1);
						done();
					});
			});
		});
	});
	describe('Search Apartments', function () {
		it('no query, should return all retnables', function (done) {
			api.get('/rentables/search')
				.end((err, res) => {
					res.body.should.be.a('array');
					res.body.length.should.be.eql(6);
					done();
				});
		});

		it('str=Remsen, should return all retnables with keyword Remsen', function (done) {
			api.get('/rentables/search')
				.query({ str: 'Remsen' })
				.end((err, res) => {
					res.body.should.be.a('array');
					res.body.length.should.be.eql(1);
					done();
				});
		});

		it('str=Zamalek, should return all retnables with keyword Zamalek', function (done) {
			api.get('/rentables/search')
				.query({ str: 'Zamalek' })
				.end((err, res) => {
					res.body.should.be.a('array');
					res.body.length.should.be.eql(1);
					done();
				});
		});

		it('str=zamalek, should return all retnables with keyword zamalek (case insensitive)', function (done) {
			api.get('/rentables/search')
				.query({ str: 'zamalek' })
				.end((err, res) => {
					res.body.should.be.a('array');
					res.body.length.should.be.eql(1);
					done();
				});
		});
	});
});