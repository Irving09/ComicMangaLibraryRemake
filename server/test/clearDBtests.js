'use strict';

var assert          = require('assert');
var sinon           = require('sinon');
var mysql           = require('mysql');
var _u              = require('lodash');
var unitUnderTest   = require('../clearDB/clearDB.js');

// *********** start getUserByUsernameAndPassword tests *********** //
describe('getUserByUsernameAndPassword', function() {
    var poolConnectionError = null,
        assertionTests      = false,
        connectionObject    = null,
        dbQueryError        = null,
        dbQueryResult       = null,
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
        dbQueryResult             = null;
        connectionObject.query  = sandbox.stub().callsArgWith(1, dbQueryError, dbQueryResult);

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
    var assertionTests      = false,
        connectionObject    = null,
        poolConnectionError = null,
        dbQueryError        = null,
        dbQueryResult       = null,
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
        dbQueryResult             = null;
        connectionObject.query  = sandbox.stub().callsArgWith(1, dbQueryError, dbQueryResult);

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
describe('postUserIntoUserInfo', function() {
    var assertionTests      = false,
        connectionObject    = null,
        poolConnectionError = null,
        dbSelectError       = null,
        dbInsertUserInfoErr = null,
        dbInsertUserAccErr  = null,
        dbSelectError       = null,
        dbSelectResult      = null,
        dbPostInput         = null,
        dbPostError         = null,
        dbPostResult        = null,
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
        unitUnderTest.postUserIntoUserInfo({}, function(error, result) {
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

    it('should return the function callback\'s expected result - success case', sinon.test(function() {
        // Arrange
        var expectedUsername    = 'Hello';
        var expectedPassword    = 'Password';

        poolConnectionError     = null;
        dbPostError             = null;
        dbPostInput             = { userName : expectedUsername, userPassword : expectedPassword, insertId : 99999 };
        dbPostResult            = { Username : expectedUsername, Pw : expectedPassword, UserNo : 99999 };
        connectionObject.query  = sandbox.stub().callsArgWith(2, dbPostError, dbPostInput);

        // Act
        unitUnderTest.postUserIntoUserInfo({
            userName : expectedUsername,
            userPassword : expectedPassword
        }, function(actualError, actualResult) {
            assert.ok(unitUnderTest.getPool.calledOnce, 'getPool was not called once'); 
            assert.ok(connectionObject.release.calledOnce, 'connection.release was not invoked');

            assert.ok(actualError === dbPostError, 'Expected error does not match ' + actualError);
            assert.ok(_u.isEqual(actualResult, dbPostResult), 'Expected result does not match ' + JSON.stringify(actualResult));
            assertionTests = true;
        });

        // Assert
        assert.ok(assertionTests, 'Tests inside callback did not get run');
    }));
});
// *********** end postUser tests *********** //

// *********** start postUserIntoUserAccount tests *********** //
describe('postUserIntoUserAccount', function() {
    var assertionTests      = false,
        connectionObject    = null,
        poolConnectionError = null,
        dbSelectError       = null,
        dbInsertUserInfoErr = null,
        dbInsertUserAccErr  = null,
        dbSelectError       = null,
        dbSelectResult      = null,
        dbPostInput         = null,
        dbPostError         = null,
        dbPostResult        = null,
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
        unitUnderTest.postUserIntoUserAccount({}, sinon.test(function(error, result) {
            assert.ok(unitUnderTest.getPool.calledOnce);
            assert.ok(error === poolConnectionError);
            assert.ok(connectionObject.release.calledOnce);
            assert.ok(null === result);
            assertionTests = true;
        }));

        // assert
        assert.ok(assertionTests, 'Tests inside callback did not get run');
    }));

    it('should fail to query - query error', sinon.test(function() {
        // Arrange
        poolConnectionError     = null;
        dbPostError           = 'DB Query Error';
        dbPostResult          = null;
        connectionObject.query  = sandbox.stub().callsArgWith(2, dbPostError, dbPostResult);

        // Act
        unitUnderTest.postUserIntoUserAccount({}, function(error, expectedResult) {
            assert.ok(unitUnderTest.getPool.calledOnce, 'getPool was not called once'); 
            assert.ok(connectionObject.release.calledOnce);

            assert.ok(error === dbPostError);
            assert.ok(expectedResult === dbPostResult);
            
            assertionTests = true;
        });

        // assert
        assert.ok(assertionTests, 'Tests inside callback did not get run');
    }));

    it('should return the function callback\'s expected result - success case', sinon.test(function() {
        // Arrange
        var expectedUsername    = 'Hello';
        var expectedPassword    = 'Password';
        var expectedInsertId    = 99999;
        var inputPost           = { 
                                    userName : expectedUsername,
                                    userPassword : expectedPassword,
                                    UserNo : expectedInsertId
                                  };

        poolConnectionError     = null;
        dbPostError             = null;
        dbPostInput             = { userName : expectedUsername, userPassword : expectedPassword, insertId : 99999 };
        dbPostResult            = { Username : expectedUsername, Pw : expectedPassword, UserNo : 99999 };
        connectionObject.query  = sandbox.stub().callsArgWith(2, dbPostError, dbPostInput);

        // Act
        unitUnderTest.postUserIntoUserAccount(inputPost, function(actualError, actualResult) {
            assert.ok(unitUnderTest.getPool.calledOnce, 'getPool was not called once'); 
            assert.ok(connectionObject.release.calledOnce, 'connection.release was not invoked');

            assert.ok(actualError === dbPostError, 'Expected error does not match ' + actualError);
            assert.ok(_u.isEqual(actualResult, inputPost), 'Expected result does not match ' + JSON.stringify(actualResult));
            assertionTests = true;
        });

        // Assert
        assert.ok(assertionTests, 'Tests inside callback did not get run');
    }));
});
// *********** end postUserIntoUserAccount tests *********** //

// *********** start postUserIntoUserAccount tests *********** //
describe('registerUser', function() {
    var assertionTests      = false,
        connectionObject    = null,
        poolConnectionError = null,
        dbSelectError       = null,
        dbSelectResult      = null,
        dbInsertUserInfoErr = null,
        dbInsertUserInfoRes = null,
        dbInsertUserAccErr  = null,
        dbInsertUserAccRes  = null,
        dbPostInput         = null,
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

    it('should fail to get first promise - getUserByUserNameAndEmail reject', sinon.test(function(done) {
        // Arrange
        dbSelectError = 'Rejected Promise';
        dbSelectResult = null;

        sandbox.stub(unitUnderTest, 'getUserByUsernameAndEmail').callsArgWith(2, dbSelectError, dbSelectResult);

        // Act
        unitUnderTest.registerUser({
            Username : 'test1',
            Email : 'test2',
            Password : 'test3'
        }, function(promise) { //All promises should be propagated in the promise callback regardless if its rejected or not
            // Assert
            promise.then(function(fulfilledValue) {/*Not invoked*/}, function(rejectedReason) {
                assert.ok(dbSelectError === rejectedReason);
            }).done(function() {
                // Assert
                assertionTests = true;
                assert.ok(assertionTests, 'Tests inside callback did not get run');
                done();
            });
        });
    }));

    it('should fail to get second promise - postUserIntoUserInfo reject', sinon.test(function(done) {
        // Arrange
        dbSelectError       = null;
        dbSelectResult      = 'Fulfilled dbSelectResult';
        dbInsertUserInfoErr = 'Rejected dbInsertUserInfo';
        dbInsertUserInfoRes = null;

        sandbox.stub(unitUnderTest, 'getUserByUsernameAndEmail').callsArgWith(2, dbSelectError, dbSelectResult);
        sandbox.stub(unitUnderTest, 'postUserIntoUserInfo').callsArgWith(1, dbInsertUserInfoErr, dbInsertUserInfoRes);

        // Act
        unitUnderTest.registerUser({}, function(promise) {
            // Assert
            promise.then(function(fulfilledValue) {
                assert.ok(dbSelectResult === fulfilledValue);
            }).then(function(fulfilledValue) {/* Not invoked */}, function(rejectedReason) {

                assert.ok(rejectedReason === dbInsertUserInfoErr);
                assertionTests = true;
            }).done(function() {
                // Assert
                assert.ok(assertionTests, 'Tests inside callback did not get run');
                done();
            });
        });
    }));
























});
// *********** end postUserIntoUserAccount tests *********** //