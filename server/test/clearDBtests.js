var assert 			= require('assert');
var sinon			= require('sinon');
var mysql			= require('mysql');
var _u			= require('lodash');
var unitUnderTest	= require('../clearDB/clearDB.js');

describe('getUser', function() {
	var fakePool,
		assertionTests = false,
		connectionObject = null,
		poolConnectionError = null,
		dbQueryError = null,
		queryResult = null,
		sandbox = sinon.sandbox.create();

	beforeEach(function() {
		connectionObject = {
			release : sandbox.stub(),
		};

		fakePool = {
			getConnection : function(connectionCallback) {
				connectionCallback(poolConnectionError, connectionObject);
			}
		};

		sandbox.stub(unitUnderTest, 'getPool').returns(fakePool);
	});

	afterEach(function() {
		sandbox.restore();
		assertionTests = false;
	});

	it('should fail to connect to the pool - connection error', sinon.test(function() {
		// Arrange
		poolConnectionError = 'Pool Connection Error';
		connectionObject.query = sandbox.stub().callsArgWith(1, dbQueryError, queryResult);
		
		// act
		unitUnderTest.getUser('username', 'password', function(error, result) {
			assert.ok(unitUnderTest.getPool.calledOnce);
			assert.ok(error === poolConnectionError);
			assert.ok(connectionObject.release.calledOnce);
			assert.ok(null === result);
			assertionTests = true;
		});

		// assert
		assert.ok(assertionTests, 'Tests inside callback did not get run');
	}));

	it('should fail to query - query error', sinon.test(function() {
		// Arrange
		poolConnectionError = null;
		dbQueryError = 'DB Query Error';
		queryResult = null;
		connectionObject.query = sandbox.stub().callsArgWith(1, dbQueryError, queryResult);

		// Act
		unitUnderTest.getUser('username', 'password', function(error, result) {
			assert.ok(unitUnderTest.getPool.calledOnce, 'getPool was not called once');	
			assert.ok(error === dbQueryError);
			assert.ok(connectionObject.release.calledOnce);
			assert.ok(null === result);
			assertionTests = true;
		});

		// assert
		assert.ok(assertionTests, 'Tests inside callback did not get run');
	}));

	it('should be able to call back with the expected result', sinon.test(function() {
		// Arrange
		poolConnectionError = null;
		dbQueryError = null;
		dbQueryResult = 'DB Query Result';
		connectionObject.query = sandbox.stub().callsArgWith(1, dbQueryError, dbQueryResult);
		sandbox.stub(_u, 'find').returns(dbQueryResult);

		// Act
		unitUnderTest.getUser('username', 'password', function(error, result) {
			assert.ok(unitUnderTest.getPool.calledOnce, 'getPool was not called once');	
			assert.ok(error === dbQueryError, 'there should be no call back error');
			assert.ok(connectionObject.release.calledOnce, 'connection.release() should have been called inside the query callback');
			assert.ok(dbQueryResult === result, 'callback\'s result from lodash\'s find function should equal the expectation' + dbQueryResult);
			assertionTests = true;
		});

		// assert
		assert.ok(assertionTests, 'Tests inside callback did not get run');
	}));
});