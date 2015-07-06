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

	it('should return the expected error - fail case', sinon.test(function() {
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
		sinon.assert.calledWith(fakeRes.send, expectedError);
	}));

	it('should be able to return the expected result - success case', sinon.test(function() {
		var expectedResult = 'SUCCESSFULL';
		var fakeReq = { params : { isbn : 12345 } };
		var fakeRes = { send : this.stub() };

		// Arrange
		this.stub(clearDB, 'getBookByISBN').callsArgWith(1, null, expectedResult);

		// Act
		unitUnderTest.getBookByISBN(fakeReq, fakeRes);

		// Assert
		assert.ok(clearDB.getBookByISBN.calledOnce);
		assert.ok(fakeRes.send.calledOnce);
		sinon.assert.calledWith(fakeRes.send, expectedResult);
	}));
	
});