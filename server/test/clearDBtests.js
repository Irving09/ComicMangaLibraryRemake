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

// *********** start getUsernameAndEmailPromise tests *********** //
describe('getUsernameAndEmailPromise', function() {
    var assertionTests      = false,
        connectionObject    = null,
        poolConnectionError = null,
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

    it('should fail to get fulfilled promise - rejected case', sinon.test(function(done) {
        var username = 'Hello World';
        var email = 'Hi email';

        // Arrange
        dbSelectError = 'Expected Error';
        sandbox.stub(unitUnderTest, 'getUserByUsernameAndEmail').callsArgWith(2, dbSelectError, dbSelectResult);

        // Act
        var actual = unitUnderTest.getUsernameAndEmailPromise(username, email);

        // Assert
        actual.then(function() {/*NOT INVOKED*/}, function(rejectedReason) {
            assert.ok(rejectedReason === dbSelectError, 'Expected error assertion \'' + dbSelectError + '\' does not match actual: \'' + rejectedReason + '\'');
        }).done(function() {
            assertionTests = true;
            assert.ok(unitUnderTest.getUserByUsernameAndEmail.calledOnce);
            assert.ok(assertionTests, 'Tests inside callback did not get run');
            done();
        });
    }));

    it('should pass to get fulfilled promise - fulfilled case', sinon.test(function(done) {
        var username = 'Hello World';
        var email = 'Hi email';

        // Arrange
        dbSelectError = null;
        dbSelectResult = 'Fulfilled Promise';
        sandbox.stub(unitUnderTest, 'getUserByUsernameAndEmail').callsArgWith(2, dbSelectError, dbSelectResult);

        // Act
        var actual = unitUnderTest.getUsernameAndEmailPromise(username, email);

        // Assert
        actual.then(function(fulfilledPromise) {
            assert.ok(fulfilledPromise === dbSelectResult, 'Expected promise assertion \'' + dbSelectResult + '\' does not match actual: \'' + fulfilledPromise + '\'');
        }, function(rejectedReason) {/*NOT INVOKED*/}).done(function() {
            assertionTests = true;
            assert.ok(unitUnderTest.getUserByUsernameAndEmail.calledOnce);
            assert.ok(assertionTests, 'Tests inside callback did not get run');
            done();
        });
    }));
});
// *********** end getUsernameAndEmailPromise tests *********** //

// *********** start postUserIntoUserInfoPromise tests *********** //
describe('postUserIntoUserInfoPromise', function() {
    var assertionTests      = false,
        connectionObject    = null,
        poolConnectionError = null,
        dbPostError       = null,
        dbPostResult      = null,
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

    it('should fail to get fulfilled promise - rejected case', sinon.test(function(done) {
        // Arrange
        dbPostError = 'Expected Error';
        sandbox.stub(unitUnderTest, 'postUserIntoUserInfo').callsArgWith(1, dbPostError, dbPostResult);

        // Act
        var actual = unitUnderTest.postUserIntoUserInfoPromise({});

        // Assert
        actual.then(function() {/*NOT INVOKED*/}, function(rejectedReason) {
            assert.ok(rejectedReason === dbPostError, 'Expected error assertion \'' + dbPostError + '\' does not match actual: \'' + rejectedReason + '\'');
        }).done(function() {
            assertionTests = true;
            assert.ok(unitUnderTest.postUserIntoUserInfo.calledOnce);
            assert.ok(assertionTests, 'Tests inside callback did not get run');
            done();
        });
    }));

    it('should fail to get fulfilled promise - rejected case', sinon.test(function(done) {
        // Arrange
        dbPostError = null;
        dbPostResult = 'Fulfilled Promise';
        sandbox.stub(unitUnderTest, 'postUserIntoUserInfo').callsArgWith(1, dbPostError, dbPostResult);

        // Act
        var actual = unitUnderTest.postUserIntoUserInfoPromise({});

        // Assert
        actual.then(function(fulfilledPromise) {
            assert.ok(fulfilledPromise === dbPostResult, 'Expected promise assertion \'' + dbPostResult + '\' does not match actual: \'' + fulfilledPromise + '\'');
        }, function() {/*NOT INVOKED*/}).done(function() {
            assertionTests = true;
            assert.ok(unitUnderTest.postUserIntoUserInfo.calledOnce);
            assert.ok(assertionTests, 'Tests inside callback did not get run');
            done();
        });
    }));
});
// *********** end postUserIntoUserInfoPromise tests *********** //

// *********** start postUserIntoUserAccountPromise tests *********** //
describe('postUserIntoUserAccountPromise', function() {
    var assertionTests      = false,
        connectionObject    = null,
        poolConnectionError = null,
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

    it('should fail to get fulfilled promise - rejected case', sinon.test(function(done) {
        // Arrange
        dbPostError = 'Expected Error';
        sandbox.stub(unitUnderTest, 'postUserIntoUserAccount').callsArgWith(1, dbPostError, dbPostResult);

        // Act
        var actual = unitUnderTest.postUserIntoUserAccountPromise({});

        // Assert
        actual.then(function() {/*NOT INVOKED*/}, function(rejectedReason) {
            assert.ok(rejectedReason === dbPostError, 'Expected error assertion \'' + dbPostError + '\' does not match actual: \'' + rejectedReason + '\'');
        }).done(function() {
            assertionTests = true;
            assert.ok(unitUnderTest.postUserIntoUserAccount.calledOnce);
            assert.ok(assertionTests, 'Tests inside callback did not get run');
            done();
        });
    }));

    it('should fail to get fulfilled promise - rejected case', sinon.test(function(done) {
        // Arrange
        dbPostError = null;
        dbPostResult = 'Fulfilled Promise';
        sandbox.stub(unitUnderTest, 'postUserIntoUserAccount').callsArgWith(1, dbPostError, dbPostResult);

        // Act
        var actual = unitUnderTest.postUserIntoUserAccountPromise({});

        // Assert
        actual.then(function(fulfilledPromise) {
            assert.ok(fulfilledPromise === dbPostResult, 'Expected promise assertion \'' + dbPostResult + '\' does not match actual: \'' + fulfilledPromise + '\'');
        }, function() {/*NOT INVOKED*/}).done(function() {
            assertionTests = true;
            assert.ok(unitUnderTest.postUserIntoUserAccount.calledOnce);
            assert.ok(assertionTests, 'Tests inside callback did not get run');
            done();
        });
    }));
});
// *********** end postUserIntoUserAccountPromise tests *********** //

// *********** start registerUser tests *********** //
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
        fakePool            = null,
        sandbox             = sinon.sandbox.create();

    beforeEach(function() {
        connectionObject = {
            release : sandbox.stub()
        };

        fakePool = {
            getConnection : function(connectionCallback) {
                connectionCallback(poolConnectionError, connectionObject);
            }
        };

        sandbox.stub(unitUnderTest, 'getPool').returns(fakePool);
    });

    afterEach(function() {
        assertionTests      = false;
        connectionObject    = null;
        poolConnectionError = null;
        dbSelectError       = null;
        dbSelectResult      = null;
        dbInsertUserInfoErr = null;
        dbInsertUserInfoRes = null;
        dbInsertUserAccErr  = null;
        dbInsertUserAccRes  = null;

        sandbox.restore();
    });

    it('should reject the first promise - getUsernameAndEmailPromise', sinon.test(function(done) {
        dbSelectError = new Error('Promise1 rejected');
        dbSelectResult = null;

        sandbox.stub(unitUnderTest, 'getUserByUsernameAndEmail').callsArgWith(2, dbSelectError, null);

        // // Act
        unitUnderTest.registerUser({Username : 'inno', Email: 'inno@abc.com', Password: 'inno_secret'}, function(promise) {
            promise.done(undefined, function(rejectedReason) {
                assert.ok(rejectedReason === dbSelectError);
                assertionTests = true;
                assert.ok(assertionTests, 'Assertions did not get run');
                done();
            });
        });
    }));

    it('should reject the second promise - getUsernameAndEmailPromise', sinon.test(function(done) {
        dbSelectError = null;
        dbSelectResult = 'Promise1 fulfilled';
        dbInsertUserInfoErr = new Error('Promise2 Rejected');
        dbInsertUserInfoRes = null;

        sandbox.stub(unitUnderTest, 'getUserByUsernameAndEmail').callsArgWith(2, dbSelectError, null);
        sandbox.stub(unitUnderTest, 'postUserIntoUserInfo').callsArgWith(1, dbInsertUserInfoErr, dbInsertUserInfoRes);

        // Act
        unitUnderTest.registerUser({Username : 'inno', Email: 'inno@abc.com', Password: 'inno_secret'}, function(promise) {
            promise.done(undefined, function(rejectedReason) {
                assert.ok(rejectedReason === dbInsertUserInfoErr);
                assert.ok(unitUnderTest.getUserByUsernameAndEmail.calledOnce);
                assertionTests = true;
                assert.ok(assertionTests, 'Assertions did not get run');
                done();
            });
        });
    }));

    it('should reject the third promise - postUserIntoUserAccountPromise', sinon.test(function(done) {
        dbSelectError = null;
        dbSelectResult = 'Promise1 fulfilled';
        dbInsertUserInfoErr = null;
        dbInsertUserInfoRes = 'Promise2 fulfilled';
        dbInsertUserAccErr  = new Error('Promise3 rejected');
        dbInsertUserAccRes  = null;

        sandbox.stub(unitUnderTest, 'getUserByUsernameAndEmail').callsArgWith(2, dbSelectError, null);
        sandbox.stub(unitUnderTest, 'postUserIntoUserInfo').callsArgWith(1, dbInsertUserInfoErr, dbInsertUserInfoRes);
        sandbox.stub(unitUnderTest, 'postUserIntoUserAccount').callsArgWith(1, dbInsertUserAccErr, dbInsertUserAccRes);

        // Act
        unitUnderTest.registerUser({Username : 'inno', Email: 'inno@abc.com', Password: 'inno_secret'}, function(promise) {
            promise.done(undefined, function(rejectedReason) {
                assert.ok(rejectedReason === dbInsertUserAccErr);
                assert.ok(unitUnderTest.getUserByUsernameAndEmail.calledOnce);
                assert.ok(unitUnderTest.postUserIntoUserInfo.calledOnce);
                assertionTests = true;
                assert.ok(assertionTests, 'Assertions did not get run');
                done();
            });
        });
    }));

    it('should fulfill all promises in sequence - success case', sinon.test(function(done) {
        dbSelectError = null;
        dbSelectResult = 'Promise1 fulfilled';
        dbInsertUserInfoErr = null;
        dbInsertUserInfoRes = 'Promise2 fulfilled';
        dbInsertUserAccErr  = null;
        dbInsertUserAccRes  = 'Promise3 fulfilled';

        sandbox.stub(unitUnderTest, 'getUserByUsernameAndEmail').callsArgWith(2, dbSelectError, null);
        sandbox.stub(unitUnderTest, 'postUserIntoUserInfo').callsArgWith(1, dbInsertUserInfoErr, dbInsertUserInfoRes);
        sandbox.stub(unitUnderTest, 'postUserIntoUserAccount').callsArgWith(1, dbInsertUserAccErr, dbInsertUserAccRes);

        // Act
        unitUnderTest.registerUser({Username : 'inno', Email: 'inno@abc.com', Password: 'inno_secret'}, function(promise) {
            promise.done(function(fulfilledValue) {
                assert.ok(fulfilledValue === dbInsertUserAccRes);
                assert.ok(unitUnderTest.getUserByUsernameAndEmail.calledOnce);
                assert.ok(unitUnderTest.postUserIntoUserInfo.calledOnce);
                assert.ok(unitUnderTest.postUserIntoUserAccount.calledOnce);
                assert.ok(unitUnderTest.getUserByUsernameAndEmail
                          .calledBefore(unitUnderTest.postUserIntoUserInfo), 'getUserByUserNameAndEmail should be called in sequence before postUserIntoUserInfo');
                assert.ok(unitUnderTest.postUserIntoUserInfo
                          .calledBefore(unitUnderTest.postUserIntoUserAccount), 'postUserIntoUserInfo should be called in sequence before postUserIntoUserAccount');
                assertionTests = true;
                assert.ok(assertionTests, 'Assertions did not get run');
                done();
            });
        });
    }));    
});
// *********** end registerUser tests *********** //