var assert          = require('assert');
var sinon           = require('sinon');
var mysql           = require('mysql');
var _u          = require('lodash');
var unitUnderTest   = require('../clearDB/clearDB.js');

// *********** start getUserByUsernameAndPassword tests *********** //
describe('getUserByUsernameAndPassword', function() {
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

        // act
        unitUnderTest.getUserByUsernameAndPassword('username', 'password', function(error, result) {
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
        poolConnectionError     = null;
        dbQueryError            = 'DB Query Error';
        queryResult             = null;
        connectionObject.query  = sandbox.stub().callsArgWith(1, dbQueryError, queryResult);

        // Act
        unitUnderTest.getUserByUsernameAndPassword('username', 'password', function(error, result) {
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
        unitUnderTest.getUserByUsernameAndPassword('username', 'password', function(error, result) {
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
// *********** end getUserByUsernameAndPassword tests*********** //

// *********** start getUserByUsernameAndEmail tests *********** //
describe('getUserByUsernameAndEmail', function() {
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

        // act
        unitUnderTest.getUserByUsernameAndEmail('username', 'password', function(error, result) {
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
        poolConnectionError     = null;
        dbQueryError            = 'DB Query Error';
        queryResult             = null;
        connectionObject.query  = sandbox.stub().callsArgWith(1, dbQueryError, queryResult);

        // Act
        unitUnderTest.getUserByUsernameAndEmail('username', 'password', function(error, result) {
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
        unitUnderTest.getUserByUsernameAndEmail('username', 'password', function(error, result) {
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
// *********** end getUserByUsernameAndEmail tests*********** //

// *********** start postUser tests *********** //
describe('postUser', function() {
    var assertionTests      = false,
        connectionObject    = null,
        poolConnectionError = null,
        dbSelectError       = null,
        dbInsertUserInfoErr = null,
        dbInsertUserAccErr  = null,
        dbSelectError       = null,
        dbSelectResult      = null,
        sandbox             = sinon.sandbox.create(),
        fakePool;

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
        
        // act
        unitUnderTest.postUser({}, function(error, result) {
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
        poolConnectionError     = null;
        dbSelectError           = 'DB Query Error';
        dbSelectResult          = null;
        connectionObject.query  = sandbox.stub().callsArgWith(2, dbSelectError, dbSelectResult);

        // Act
        unitUnderTest.postUserIntoUserInfo({}, function(error, expectedResult) {
            assert.ok(unitUnderTest.getPool.calledOnce, 'getPool was not called once'); 
            assert.ok(error === dbSelectError);
            assert.ok(connectionObject.release.calledOnce);
            assert.ok(expectedResult === null);
            assertionTests = true;
        });

        // assert
        assert.ok(assertionTests, 'Tests inside callback did not get run');
    }));

    // it('should get duplicated user error as expected result', sinon.test(function() {
    //     // Arrange
    //     poolConnectionError     = null;
    //     dbSelectError           = null;
    //     dbSelectResult          = 'Duplicate User';
    //     post                    = {};
    //     connectionObject.query  = sandbox.stub().callsArgWith(1, dbSelectError, dbSelectResult);
    //     sandbox.stub(_u, 'find').returns(dbSelectResult);

    //     // Act
    //     unitUnderTest.postUser(post, function(error, result) {
    //         assert.ok(unitUnderTest.getPool.calledOnce, 'getPool was not called once'); 
    //         assert.ok(error.message === dbSelectResult, 'there should be no call back error');
    //         assert.ok(connectionObject.release.calledOnce, 'connection.release() should have been called inside the query callback');
    //         assert.ok(result === null, 'callback\'s result from lodash\'s find function should equal the expectation' + dbQueryResult);
    //         assertionTests = true;
    //     });

    //     // assert
    //     assert.ok(assertionTests, 'Tests inside callback did not get run');
    // }));

	// it('should fail to insert into userinfo table', sinon.test(function() {
	// 	// Arrange
	// 	poolConnectionError 	= null;
	// 	dbSelectError       	= null;
	// 	dbSelectResult			= null;
	// 	post                	= {};
	// 	dbInsertUserInfoErr 	= 'Insert into UserInfo table error';
	// 	connectionObject.query  = sandbox.stub().callsArgWith(1, dbSelectError, dbSelectResult);
	// 	sandbox.stub(_u, 'find').returns(dbSelectResult);



	// 	// Act

	// 	// Assert
	// }));
});
// *********** end postUser tests *********** //



















