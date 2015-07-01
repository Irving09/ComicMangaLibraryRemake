'use strict';

var assert          = require('assert');
var sinon           = require('sinon');
var mysql           = require('mysql');
var _u              = require('lodash');
var clearDB			= require('../clearDB/clearDB.js');
var unitUnderTest   = require('../routes/routeHandlers/bookHandler.js');

describe('books', function() {
	beforeEach(function() {
		
	});
	
	afterEach(function() {

	});

	it('should callback with an error', sinon.test(function() {
		var expectedError = new Error('clearDB error');
		var fakeReq = { params : { isbn : 12345 } };
		var fakeRes = { send : this.stub() };
		// Arrange
		this.stub(clearDB, 'getBookByISBN').callsArgWith(1, expectedError, null);

		// Act
		unitUnderTest.getBookByISBN(fakeReq, fakeRes);

		// Assert
		assert.ok(clearDB.getBookByISBN.calledOnce);
		assert.ok(fakeRes.send.calledOnce);
	}));

	
});