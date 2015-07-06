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

// *********** start isUniqueUsernameAndEmail tests *********** //
describe('isUniqueUsernameAndEmail', function() {
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
            query   : sandbox.stub()
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
        unitUnderTest.isUniqueUsernameAndEmail('username', 'password', function(error, result) {
            assert.ok(unitUnderTest.getPool.calledOnce);
            assert.ok(error === poolConnectionError);
            assert.ok(connectionObject.release.calledOnce);
            assert.ok(undefined === result);
            assertionTests = true;
        });

        // assert
        assert.ok(assertionTests, 'Tests inside callback did not get run');
    }));

    it('should fail to query - query error', sinon.test(function() {
        // Arrange
        poolConnectionError     = null;
        dbQueryError            = 'DB Query Error';
        dbQueryResult           = null;
        connectionObject.query  = sandbox.stub().callsArgWith(1, dbQueryError, dbQueryResult);

        // Act
        unitUnderTest.isUniqueUsernameAndEmail('username', 'password', function(error, result) {
            assert.ok(unitUnderTest.getPool.calledOnce, 'getPool was not called once'); 
            assert.ok(error === dbQueryError);
            assert.ok(connectionObject.release.calledOnce);
            assert.ok(undefined === result);
            assertionTests = true;
        });

        // assert
        assert.ok(assertionTests, 'Tests inside callback did not get run');
    }));

    it('should fail - duplicate user', sinon.test(function() {
        // Arrange
        var duplicateUsername   = 'DUPLICATE USERNAME';
        var uniqueEmail         = 'UNIQUE EMAIL';
        var expectedDbResult    = [ { username : duplicateUsername } ];
        connectionObject.query.callsArgWith(1, undefined, expectedDbResult)

        // Act
        unitUnderTest.isUniqueUsernameAndEmail(duplicateUsername, uniqueEmail, function(actualError, actualResult) {
            // Assert
            assert.ok(actualError.message === 'The username or email is already taken');
            assert.ok(actualResult === undefined);
            assert.ok(connectionObject.query.calledOnce);
            assert.ok(connectionObject.release.calledOnce);
            assertionTests = true;
        });
        assert.ok(assertionTests, 'Tests inside callback did not get run');
    }));

    it('should be able to call back with the expected result - success case', sinon.test(function() {
        // Arrange
        var uniqueUsername          = 'different username lol';
        var uniqueEmail             = 'different Email lol';
        var expectedDbSelectResult  = [{ username : 'unique', Email : 'unique@unique.com' }];
        var expectedResultMessage   = 'SUCCESS';
        connectionObject.query.callsArgWith(1, undefined, expectedDbSelectResult)
        this.stub(_u, 'find').returns(undefined);

        // Act
        unitUnderTest.isUniqueUsernameAndEmail(uniqueUsername, uniqueEmail, function(actualError, actualResult) {
            // Assert
            assert.ok(actualResult === true);
            assert.ok(_u.find.calledOnce);

            assert.ok(connectionObject.query.calledOnce);
            assert.ok(connectionObject.release.calledOnce);
            assertionTests = true;
        });
        assert.ok(assertionTests, 'Tests inside callback did not get run');
    }));
});
// *********** end isUniqueUsernameAndEmail tests*********** //

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
        sandbox.stub(unitUnderTest, 'isUniqueUsernameAndEmail').callsArgWith(2, dbSelectError, dbSelectResult);

        // Act
        var actual = unitUnderTest.getUsernameAndEmailPromise(username, email);

        // Assert
        actual.then(function() {/*NOT INVOKED*/}, function(rejectedReason) {
            assert.ok(rejectedReason === dbSelectError, 'Expected error assertion \'' + dbSelectError + '\' does not match actual: \'' + rejectedReason + '\'');
        }).done(function() {
            assertionTests = true;
            assert.ok(unitUnderTest.isUniqueUsernameAndEmail.calledOnce);
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
        sandbox.stub(unitUnderTest, 'isUniqueUsernameAndEmail').callsArgWith(2, dbSelectError, dbSelectResult);

        // Act
        var actual = unitUnderTest.getUsernameAndEmailPromise(username, email);

        // Assert
        actual.then(function(fulfilledPromise) {
            assert.ok(fulfilledPromise === dbSelectResult, 'Expected promise assertion \'' + dbSelectResult + '\' does not match actual: \'' + fulfilledPromise + '\'');
        }, function(rejectedReason) {/*NOT INVOKED*/}).done(function() {
            assertionTests = true;
            assert.ok(unitUnderTest.isUniqueUsernameAndEmail.calledOnce);
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

        sandbox.stub(unitUnderTest, 'isUniqueUsernameAndEmail').callsArgWith(2, dbSelectError, null);

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

    it('should reject the second promise - postUserIntoUserInfoPromise', sinon.test(function(done) {
        dbSelectError = null;
        dbSelectResult = 'Promise1 fulfilled';
        dbInsertUserInfoErr = new Error('Promise2 Rejected');
        dbInsertUserInfoRes = null;

        sandbox.stub(unitUnderTest, 'isUniqueUsernameAndEmail').callsArgWith(2, dbSelectError, dbSelectResult);
        sandbox.stub(unitUnderTest, 'postUserIntoUserInfo').callsArgWith(1, dbInsertUserInfoErr, dbInsertUserInfoRes);

        // Act
        unitUnderTest.registerUser({Username : 'inno', Email: 'inno@abc.com', Password: 'inno_secret'}, function(promise) {
            promise.done(undefined, function(rejectedReason) {
                assert.ok(rejectedReason === dbInsertUserInfoErr);
                assert.ok(unitUnderTest.isUniqueUsernameAndEmail.calledOnce);
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

        sandbox.stub(unitUnderTest, 'isUniqueUsernameAndEmail').callsArgWith(2, dbSelectError, dbSelectResult);
        sandbox.stub(unitUnderTest, 'postUserIntoUserInfo').callsArgWith(1, dbInsertUserInfoErr, dbInsertUserInfoRes);
        sandbox.stub(unitUnderTest, 'postUserIntoUserAccount').callsArgWith(1, dbInsertUserAccErr, dbInsertUserAccRes);

        // Act
        unitUnderTest.registerUser({Username : 'inno', Email: 'inno@abc.com', Password: 'inno_secret'}, function(promise) {
            promise.done(undefined, function(rejectedReason) {
                assert.ok(rejectedReason === dbInsertUserAccErr);
                assert.ok(unitUnderTest.isUniqueUsernameAndEmail.calledOnce);
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

        sandbox.stub(unitUnderTest, 'isUniqueUsernameAndEmail').callsArgWith(2, dbSelectError, null);
        sandbox.stub(unitUnderTest, 'postUserIntoUserInfo').callsArgWith(1, dbInsertUserInfoErr, dbInsertUserInfoRes);
        sandbox.stub(unitUnderTest, 'postUserIntoUserAccount').callsArgWith(1, dbInsertUserAccErr, dbInsertUserAccRes);

        // Act
        unitUnderTest.registerUser({Username : 'inno', Email: 'inno@abc.com', Password: 'inno_secret'}, function(promise) {
            promise.done(function(fulfilledValue) {
                assert.ok(fulfilledValue === dbInsertUserAccRes);
                assert.ok(unitUnderTest.isUniqueUsernameAndEmail.calledOnce);
                assert.ok(unitUnderTest.postUserIntoUserInfo.calledOnce);
                assert.ok(unitUnderTest.postUserIntoUserAccount.calledOnce);
                assert.ok(unitUnderTest.isUniqueUsernameAndEmail
                          .calledBefore(unitUnderTest.postUserIntoUserInfo), 'isUniqueUsernameAndEmail should be called in sequence before postUserIntoUserInfo');
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

// *********** start registerUser tests *********** //
describe('getBookByISBN', function() {
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

    it('should return expected error - pool connection failed', sinon.test(function() {
        // Arrange
        poolConnectionError = new Error('It failed to get connection from the pool');
        
        // Act
        unitUnderTest.getBookByISBN(12345, function(actualError, result) {
            // Assert
            assert.ok(actualError === poolConnectionError, 'actualError (' + actualError + ') does not match expected error (' + poolConnectionError + ')'); 
            assert.ok(connectionObject.release.calledOnce);
            assertionTests = true;
        });

        assert.ok(assertionTests, 'Tests did not get run in the callback');
    }));

    it('should fail to query - query error', sinon.test(function() {
        // Arrange
        poolConnectionError     = null;
        dbQueryError            = 'DB Query Error';
        dbQueryResult           = null;
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

    it('should return expected error - query failed', sinon.test(function() {
        // Arrange
        poolConnectionError     = null;
        dbQueryError            = new Error('DB Query Error');
        dbQueryResult           = null;
        connectionObject.query  = sandbox.stub().callsArgWith(1, dbQueryError, dbQueryResult);;
        
        // Act
        unitUnderTest.getBookByISBN(12345, function(actualError, actualResult) {
            // Assert
            assert.ok(actualError === dbQueryError, 'actualError (' + actualError + ') does not match expected error (' + dbQueryError + ')'); 
            assert.ok(unitUnderTest.getPool.calledOnce, 'behavior expectation was not met - exports.getPool() was not called');
            assert.ok(connectionObject.release.calledOnce, 'behavior expectation was not met - connection.release() was not called');
            assert.ok(actualResult == null);
            assertionTests = true;
        });

        assert.ok(assertionTests, 'Tests did not get run in the callback');
    }));

    it('should not get any error - success case', sinon.test(function() {
        // Arrange
        poolConnectionError = null;
        dbQueryError = null;
        dbQueryResult = 'DB Query Result';
        connectionObject.query = sandbox.stub().callsArgWith(1, dbQueryError, dbQueryResult);
        sandbox.stub(_u, 'find').returns(dbQueryResult);

        // Act
        unitUnderTest.getBookByISBN(12345, function(error, result) {
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
// *********** end registerUser tests *********** //

// *********** start getMangaBooks tests *********** //

describe('getMangaBooks', function() {
    var assertionTests = null;

    beforeEach(function() {
        assertionTests = false;
    });

    it('should get connection error to the pool', sinon.test(function() {
        var expectedError = new Error('Pool connection error');
        var fakeConnection = { release : this.stub() };

        var fakePool = {
            getConnection : this.stub().callsArgWith(0, expectedError, fakeConnection)
        };
        this.stub(unitUnderTest, 'getPool').returns(fakePool);

        unitUnderTest.getMangaBooks(function(actualError, result) {
            assert.ok(fakeConnection.release.calledOnce, 'connection.release() did not get called');
            assert.ok(actualError === expectedError, 'actualError ' + actualError + ' does not match expectedError ' + expectedError);
            assertionTests = true;
        });

        assert.ok(assertionTests, 'Tests did not get run');
    }));

    it('should get query error even though pool connection succeeded', sinon.test(function() {
        var expectedError = new Error('Query error');
        var fakeConnection = {
            release : this.stub(),
            query   : this.stub()
                          .callsArgWith(1, expectedError, undefined)
        };
        var fakePool = {
            getConnection : this.stub()
                                .callsArgWith(0, undefined, fakeConnection)
        };

        this.stub(unitUnderTest, 'getPool').returns(fakePool);

        unitUnderTest.getMangaBooks(function(actualError, result) {
            assert.ok(fakeConnection.release.calledOnce, 'connection.release() did not get called');
            assert.ok(actualError === expectedError, 'actualError ' + actualError + ' does not match expectedError ' + expectedError);
            assertionTests = true;
        });

        assert.ok(assertionTests, 'Tests did not get run');
    }));

    it('should get result - success case', sinon.test(function() {
        var callbackResult = 'HELLO WORLD';
        var expectedDbResult = { map : this.stub().returns(callbackResult) };
        var fakeConnection = {
            release : this.stub(),
            query   : this.stub()
                          .callsArgWith(1, undefined, expectedDbResult)
        };
        var fakePool = {
            getConnection : this.stub()
                                .callsArgWith(0, undefined, fakeConnection)
        };

        this.stub(unitUnderTest, 'getPool').returns(fakePool);

        unitUnderTest.getMangaBooks(function(actualError, actualResult) {
            assert.ok(fakeConnection.release.calledOnce, 'connection.release() did not get called');
            assert.ok(actualError === undefined, 'actualError is ' + actualError + ', should be ' + undefined);
            assert.ok(actualResult === callbackResult, 'actualResult is ' + actualResult + ', should be ' + callbackResult);
            assert.ok(expectedDbResult.map.calledOnce, 'map function is not invoke against the expectedDbResult');
            assertionTests = true;
        });

        assert.ok(assertionTests, 'Tests did not get run');
    }));
});
// *********** end getMangaBooks tests *********** //

// *********** start getMarvelBooks tests *********** //
describe('getMarvelBooks', function() {
    var assertionTests = null;

    beforeEach(function() {
        assertionTests = false;
    });

    it('should get connection error to the pool', sinon.test(function() {
        var expectedError   = new Error('Pool connection error');
        var fakeConnection  = {
            release : this.stub()
        };
        var fakePool        = { 
            getConnection : this.stub().callsArgWith(0, expectedError, fakeConnection)
        };
        this.stub(unitUnderTest, 'getPool').returns(fakePool);

        unitUnderTest.getMarvelBooks(function(actualError, result) {
            assert.ok(fakeConnection.release.calledOnce, 'connection.release() did not get called');
            assert.ok(actualError === expectedError, 'actualError ' + actualError + ' does not match expectedError ' + expectedError);
            assertionTests = true;
        });

        assert.ok(assertionTests, 'Tests did not get run');
    }));

    it('should get query error even though pool connection succeeded', sinon.test(function() {
        var expectedError = 'FAILED';
        var fakeConnection = {
            release : this.stub(),
            query   : this.stub()
                          .callsArgWith(1, expectedError, undefined)
        };
        var fakePool = {
            getConnection : this.stub()
                                .callsArgWith(0, undefined, fakeConnection)
        };

        this.stub(unitUnderTest, 'getPool').returns(fakePool);

        unitUnderTest.getMarvelBooks(function(actualError, result) {
            assert.ok(fakeConnection.release.calledOnce, 'connection.release() did not get called');
            assert.ok(actualError === expectedError, 'actualError ' + actualError + ' does not match expectedError ' + expectedError);
            assertionTests = true;
        });

        assert.ok(assertionTests, 'Tests did not get run');
    }));

    it('should get result - success case', sinon.test(function() {
        var expectedDbResult = 'SUCCESS';
        var fakeConnection = {
            release : this.stub(),
            query   : this.stub()
                          .callsArgWith(1, undefined, expectedDbResult)
        };
        var fakePool = {
            getConnection : this.stub()
                                .callsArgWith(0, undefined, fakeConnection)
        };

        this.stub(unitUnderTest, 'getPool').returns(fakePool);
        this.stub(unitUnderTest, 'generateBookJSON').returns(expectedDbResult);

        unitUnderTest.getMarvelBooks(function(actualError, actualResult) {
            assert.ok(fakeConnection.release.calledOnce, 'connection.release() did not get called');
            assert.ok(actualError === undefined, 'actualError is ' + actualError + ', should be ' + undefined);
            assert.ok(actualResult === expectedDbResult, 'actualResult is ' + actualResult + ', should be ' + expectedDbResult);
            assertionTests = true;
        });
        assert.ok(assertionTests, 'Tests did not get run');
    }));
});
// *********** end getMangaBooks tests *********** //

// *********** start getDCBooks tests *********** //
describe('getDCBooks', function() {
    var assertionTests = null;
    beforeEach(function() {
        assertionTests = false;
    });

    it('should get connection error to the pool', sinon.test(function() {
        var expectedError   = new Error('Pool connection error');
        var fakeConnection  = {
            release : this.stub()
        };
        var fakePool        = { 
            getConnection : this.stub().callsArgWith(0, expectedError, fakeConnection)
        };
        this.stub(unitUnderTest, 'getPool').returns(fakePool);

        unitUnderTest.getDCBooks(function(actualError, result) {
            assert.ok(fakeConnection.release.calledOnce, 'connection.release() did not get called');
            assert.ok(actualError === expectedError, 'actualError ' + actualError + ' does not match expectedError ' + expectedError);
            assertionTests = true;
        });

        assert.ok(assertionTests, 'Tests did not get run');
    }));

    it('should get query error even though pool connection succeeded', sinon.test(function() {
        var expectedError = 'FAILED';
        var fakeConnection = {
            release : this.stub(),
            query   : this.stub()
                          .callsArgWith(1, expectedError, undefined)
        };
        var fakePool = {
            getConnection : this.stub()
                                .callsArgWith(0, undefined, fakeConnection)
        };

        this.stub(unitUnderTest, 'getPool').returns(fakePool);

        unitUnderTest.getDCBooks(function(actualError, result) {
            assert.ok(fakeConnection.release.calledOnce, 'connection.release() did not get called');
            assert.ok(actualError === expectedError, 'actualError ' + actualError + ' does not match expectedError ' + expectedError);
            assertionTests = true;
        });

        assert.ok(assertionTests, 'Tests did not get run');
    }));

    it('should get result - success case', sinon.test(function() {
        var expectedDbResult = 'SUCCESS';
        var fakeConnection = {
            release : this.stub(),
            query   : this.stub()
                          .callsArgWith(1, undefined, expectedDbResult)
        };
        var fakePool = {
            getConnection : this.stub()
                                .callsArgWith(0, undefined, fakeConnection)
        };

        this.stub(unitUnderTest, 'getPool').returns(fakePool);
        this.stub(unitUnderTest, 'generateBookJSON').returns(expectedDbResult);

        unitUnderTest.getDCBooks(function(actualError, actualResult) {
            assert.ok(fakeConnection.release.calledOnce, 'connection.release() did not get called');
            assert.ok(actualError === undefined, 'actualError is ' + actualError + ', should be ' + undefined);
            assert.ok(actualResult === expectedDbResult, 'actualResult is ' + actualResult + ', should be ' + expectedDbResult);
            assertionTests = true;
        });
        assert.ok(assertionTests, 'Tests did not get run');
    }));
});
// *********** end getDCBooks tests *********** //

// *********** start generateBookJSON tests *********** //
describe('generateBookJSON', function() {
    it('should return expected properties', sinon.test(function() {
        var testInput = [
            {
                ISBN : '1234',
                Author : 'Inno',
                Title : 'MyBook',
                Category : 'Javascript'
            },
            {
                ISBN : '5678',
                Author : 'Kon',
                Title : 'HerBook',
                Category : 'Java'
            }
        ];

        var res = unitUnderTest.generateBookJSON(testInput);

        assert.ok(res[0].isbn === testInput[0].ISBN);
        assert.ok(res[0].author === testInput[0].Author);
        assert.ok(res[0].title === testInput[0].Title);
        assert.ok(res[0].category === testInput[0].Category);

        assert.ok(res[1].isbn === testInput[1].ISBN);
        assert.ok(res[1].author === testInput[1].Author);
        assert.ok(res[1].title === testInput[1].Title);
        assert.ok(res[1].category === testInput[1].Category);
    }));
});
// *********** end generateBookJSON tests *********** //

// *********** start getAuthor tests *********** //
describe('getAuthor', function() {
    var assertionTests;
    var fakeConnection;
    var sandbox;
    var fakePool;

    before(function() {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(function() {
        fakePool = {
            getConnection : sandbox.stub()
        };
        sandbox.stub(unitUnderTest, 'getPool').returns(fakePool);

        fakeConnection = {
            release : sandbox.stub(),
            query : sandbox.stub()
        };
        assertionTests = false;
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should get expected error from the callback when trying to get connection', sinon.test(function() {
        var authorName = 'Smith Jones';
        var expectedError = 'Expected Error';
        fakePool.getConnection.callsArgWith(0, expectedError, fakeConnection);

        unitUnderTest.getAuthor(authorName, function(actualError, actualResult) {
            assert.ok(actualError === expectedError);
            assert.ok(actualResult === undefined);
            assert.ok(fakeConnection.release.calledOnce);
            assertionTests = true;
        });

        assert.ok(assertionTests, 'Tests did not get run');
    }));

    it('should get get an error in the connection.query callback', sinon.test(function() {
        var authorName = 'smith jones';
        var expectedError = new Error('Expected Error');
        fakePool.getConnection.callsArgWith(0, undefined, fakeConnection);
        fakeConnection.query.callsArgWith(2, expectedError, undefined);

        unitUnderTest.getAuthor(authorName, function(actualError, actualResult) {
            assert.ok(actualError === expectedError);
            assertionTests = true;
        });

        assert.ok(assertionTests, 'tests in the callback did not get run');
    }));

    // it('should get expectedResult and call necessary methods', sinon.test(function() {
    //     var authorName = 'smith jones';
    //     var expectedDbResult = [
    //         { 
    //             Author : 'smith Jones',
    //             ISBN : 12345,
    //             Title : 'The black cannary',
    //             Category : 'DC'
    //         },
    //         {
    //             Author : 'Smith jonas',
    //             ISBN : 67890,
    //             Title : 'The white cannary',
    //             Category : 'Marvel'
    //         },
    //         {
    //             Author : 'Smith jones',
    //             ISBN : 54321,
    //             Title : 'The yellow cannary',
    //             Category : 'Manga'
    //         }
    //     ];
    //     fakePool.getConnection.callsArgWith(0, undefined, fakeConnection);
    //     fakeConnection.query.callsArgWith(2, undefined, expectedDbResult);

    //     unitUnderTest.getAuthor(authorName, function(actualError, actualResult) {
    //         assert.ok(actualResult[0].Author === expectedDbResult[0].Author);
    //         assert.ok(actualResult[0].ISBN === expectedDbResult[0].ISBN);
    //         assert.ok(actualResult[0].Title === expectedDbResult[0].Title);
    //         assert.ok(actualResult[0].Category === expectedDbResult[0].Category);

    //         assert.ok(actualResult[1].Author === expectedDbResult[1].Author);
    //         assert.ok(actualResult[1].ISBN === expectedDbResult[1].ISBN);
    //         assert.ok(actualResult[1].Title === expectedDbResult[1].Title);
    //         assert.ok(actualResult[1].Category === expectedDbResult[1].Category);
    //         assertionTests = true;
    //     });
    //     assert.ok(assertionTests, 'tests in the callback did not get run');
    // }));
});
// *********** end getAuthor tests *********** //