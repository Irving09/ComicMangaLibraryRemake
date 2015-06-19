var assert 			= require('assert');
var sinon			= require('sinon');
var mysql			= require('mysql');
var unitUnderTest	= require('../clearDB/clearDB.js');

describe('getUser', function() {
	var fakePool,
		assertionTests = false,
		connectionObject = null,
		poolConnectionError = null,
		dbQueryError = null,
		queryResult = null;

	before(function() {
		// connectionObject = {
		// 	release : sinon.stub(),
		// 	query : sinon.stub().callsArgWith(1, dbQueryError, queryResult)
		// };

		// fakePool = {
		// 	getConnection : function(connectionCallback) {
		// 		connectionCallback(poolConnectionError, connectionObject);
		// 	}
		// };

		// sinon.stub(unitUnderTest, 'getPool').returns(fakePool);
	});

	beforeEach(function() {
		connectionObject = {
			release : sinon.stub(),
			query : sinon.stub().callsArgWith(1, dbQueryError, queryResult)
		};

		fakePool = {
			getConnection : function(connectionCallback) {
				connectionCallback(poolConnectionError, connectionObject);
			}
		};

		sinon.stub(unitUnderTest, 'getPool').returns(fakePool);
	});

	afterEach(function() {
		// console.log(connectionObject.release.restore());
		// connectionObject.release
		// connectionObject.query 
	});

	it('should fail to connect to the pool - connection error', sinon.test(function() {
		poolConnectionError = 'Pool Connection Error';

		// act
		unitUnderTest.getUser('username', 'password', function(error, result) {
			assert.ok(unitUnderTest.getPool.calledOnce);
			assert.ok(error === poolConnectionError);
			assert.ok(connectionObject.release.calledOnce);
			assert.ok(null === result);
			assertionTests = true;
		});

		assert.ok(assertionTests, 'Tests inside callback did not get run');
	}));

	it('should fail to query - query error', sinon.test(function() {
		unitUnderTest.getUser('username', 'password', function(error, result) {
			assert.ok(unitUnderTest.getPool.calledOnce);	
			// assert.ok(error === poolConnectionError);
			// assert.ok(connectionRelease.release.calledOnce);
			// assert.ok(null === result);
		});		
	}));
});