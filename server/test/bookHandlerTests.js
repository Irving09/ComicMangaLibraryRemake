'use strict';

var assert          = require('assert');
var sinon           = require('sinon');
var mysql           = require('mysql');
var _u              = require('lodash');
var clearDB			= require('../clearDB/clearDB.js');
var unitUnderTest   = require('../routes/routeHandlers/bookHandler.js');

describe('getBookByISBN', function() {
	it('should return the expected error in the clearDB callback - fail case', sinon.test(function() {
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

describe('getMangaBooks', function() {
	var fakeRequest, fakeResponse, sandbox;
    
    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        fakeRequest = {
            params : {
                isbn : sandbox.stub()
            }
        };

        fakeResponse = {
            send : sandbox.stub()
        };
    });
    
    afterEach(function() {
        sandbox.restore();
    });

    it('should return the expected error in the clearDB callback - fail case', sinon.test(function() {
        // Arrange
        var expectedError = new Error('expected error');
        this.stub(clearDB, 'getMangaBooks').callsArgWith(0, expectedError, undefined);

        // Act
        unitUnderTest.getMangaBooks(fakeRequest, fakeResponse);

        // Arrange
        assert.ok(clearDB.getMangaBooks.calledOnce);
        assert.ok(fakeResponse.send.calledOnce);
        sinon.assert.calledWith(fakeResponse.send, expectedError);
    }));

    it('should be able to return the expected result - success case', sinon.test(function() {
        // Arrange
        var expectedResult = 'Success';
        this.stub(clearDB, 'getMangaBooks').callsArgWith(0, undefined, expectedResult);

        // Act
        unitUnderTest.getMangaBooks(fakeRequest, fakeResponse);

        // Arrange
        assert.ok(clearDB.getMangaBooks.calledOnce);
        assert.ok(fakeResponse.send.calledOnce);
        sinon.assert.calledWith(fakeResponse.send, expectedResult);
    }));
});

describe('getMarvelBooks', function() {
	var fakeRequest, fakeResponse, sandbox;
    
    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        fakeRequest = {
            params : {
                isbn : sandbox.stub()
            }
        };

        fakeResponse = {
            send : sandbox.stub()
        };
    });
    
    afterEach(function() {
        sandbox.restore();
    });

    it('should return the expected error in the clearDB callback - fail case', sinon.test(function() {
        // Arrange
        var expectedError = new Error('expected error');
        this.stub(clearDB, 'getMarvelBooks').callsArgWith(0, expectedError, undefined);

        // Act
        unitUnderTest.getMarvelBooks(fakeRequest, fakeResponse);

        // Arrange
        assert.ok(clearDB.getMarvelBooks.calledOnce);
        assert.ok(fakeResponse.send.calledOnce);
        sinon.assert.calledWith(fakeResponse.send, expectedError);
    }));

    it('should be able to return the expected result - success case', sinon.test(function() {
        // Arrange
        var expectedResult = 'Success';
        this.stub(clearDB, 'getMarvelBooks').callsArgWith(0, undefined, expectedResult);

        // Act
        unitUnderTest.getMarvelBooks(fakeRequest, fakeResponse);

        // Arrange
        assert.ok(clearDB.getMarvelBooks.calledOnce);
        assert.ok(fakeResponse.send.calledOnce);
        sinon.assert.calledWith(fakeResponse.send, expectedResult);
    }));
});

describe('getDCBooks', function() {
	var fakeRequest, fakeResponse, sandbox;
    
    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        fakeRequest = {
            params : {
                isbn : sandbox.stub()
            }
        };

        fakeResponse = {
            send : sandbox.stub()
        };
    });
    
    afterEach(function() {
        sandbox.restore();
    });

    it('should return the expected error in the clearDB callback - fail case', sinon.test(function() {
        // Arrange
        var expectedError = new Error('expected error');
        this.stub(clearDB, 'getDCBooks').callsArgWith(0, expectedError, undefined);

        // Act
        unitUnderTest.getDCBooks(fakeRequest, fakeResponse);

        // Arrange
        assert.ok(clearDB.getDCBooks.calledOnce);
        assert.ok(fakeResponse.send.calledOnce);
        sinon.assert.calledWith(fakeResponse.send, expectedError);
    }));

    it('should be able to return the expected result - success case', sinon.test(function() {
        // Arrange
        var expectedResult = 'Success';
        this.stub(clearDB, 'getDCBooks').callsArgWith(0, undefined, expectedResult);

        // Act
        unitUnderTest.getDCBooks(fakeRequest, fakeResponse);

        // Arrange
        assert.ok(clearDB.getDCBooks.calledOnce);
        assert.ok(fakeResponse.send.calledOnce);
        sinon.assert.calledWith(fakeResponse.send, expectedResult);
    }));
});