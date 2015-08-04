'use strict';

var assert          = require('assert');
var sinon           = require('sinon');
var mysql           = require('mysql');
var _u              = require('lodash');
var clearDB			= require('../clearDB/clearDB.js');
var unitUnderTest 	= require('../routes/routeHandlers/userHandler.js');

describe('users', function() {
	var fakeRequest, fakeResponse, sandbox;
	before(function() {
		sandbox = sinon.sandbox.create();
	});

	beforeEach(function() {
		fakeRequest = { query : { username : sandbox.stub() } };
		fakeResponse = {
			status : function(code) {
                return this;
            },
			send : sandbox.stub()
		};
	});

	afterEach(function() {
		sandbox.restore();
	});
	it('should return the expected error - fail case', sinon.test(function() {
		var expectedError = new Error('clearDB error');

		this.stub(clearDB, 'getUserByUsername').callsArgWith(1, expectedError, undefined);

		unitUnderTest.getUserByUsername(fakeRequest, fakeResponse);

		// Assert
		assert.ok(clearDB.getUserByUsername.calledOnce);
		assert.ok(fakeResponse.send.calledOnce);
		sinon.assert.calledWith(fakeResponse.send, expectedError);
	}));

	it('should be able to return the expected result - success case', sinon.test(function() {
		var expectedResult = 'SUCCESS';

		this.stub(clearDB, 'getUserByUsername').callsArgWith(1, undefined, expectedResult);

		unitUnderTest.getUserByUsername(fakeRequest, fakeResponse);

		// Assert
		assert.ok(clearDB.getUserByUsername.calledOnce);
		assert.ok(fakeResponse.send.calledOnce);
		sinon.assert.calledWith(fakeResponse.send, expectedResult);
	}));
});