var assert			= require('assert');
var sinon 			= require('sinon');
var request			= require('supertest');
var mysql			= require('mysql');
var server 			= require('../server.js');
var clearDB			= require('../clearDB/clearDB.js');
var bookHandler		= require('../routes/routeHandlers/bookHandler.js');
var unitUnderTest 	= require('../routes/books.js');


// TODO Not yet implemented
describe('router.books', function() {
	var sandbox, expectedMessage, expectedError;

	before(function() {
		expectedMessage = 'success';
		expectedError = 'fail';
		sandbox = sinon.sandbox.create();
	});

	beforeEach(function() {
		sandbox.stub(mysql, 'createPool');
	});

	afterEach(function() {
		sandbox.restore();
	});

	it('should return 200 when books home is accessed', sinon.test(function(done) {
		request(server)
			.get('/books')
			.end(function(err, res) {
				assert.ok(res.statusCode === 200);
				done();
			});
	}));

	it('should return 200 when books home when isbn query is accessed', sinon.test(function(done) {
		this.stub(clearDB, 'getBookByISBN').callsArgWith(1, undefined, expectedMessage);
		request(server)
			.get('/books?isbn=12345')
			.end(function(err, res) {
				assert.ok(res.statusCode === 200);
				assert.ok(res.text === expectedMessage);
				done();
			});
	}));	

	it('should call the correct routeHandler for bookHandler.getMangaBooks - success case', sinon.test(function(done) {
		this.stub(clearDB, 'getMangaBooks').callsArgWith(0, undefined, expectedMessage);
		request(server)
			.get('/books/manga')
			.end(function(err, res) {
				assert.ok(res.statusCode === 200);
				assert.ok(res.text === expectedMessage);
				done();
			});
	}));

	it('should call the correct routeHandler for bookHandler.getMangaBooks - error case', sinon.test(function(done) {
		this.stub(clearDB, 'getMangaBooks').callsArgWith(0, expectedError, undefined);
		request(server)
			.get('/books/manga')
			.end(function(err, res) {
				assert.ok(res.statusCode === 400);
				assert.ok(res.text === expectedError);
				done();
			});
	}));

	it('should call the correct routeHandler for bookHandler.getMangaBooks - success case', sinon.test(function(done) {
		this.stub(clearDB, 'getMarvelBooks').callsArgWith(0, undefined, expectedMessage);
		request(server)
			.get('/books/marvel')
			.end(function(err, res) {
				assert.ok(res.statusCode === 200);
				assert.ok(res.text === expectedMessage);
				done();
			});
	}));

	it('should call the correct routeHandler for bookHandler.getMangaBooks - error case', sinon.test(function(done) {
		this.stub(clearDB, 'getMarvelBooks').callsArgWith(0, expectedError, undefined);
		request(server)
			.get('/books/marvel')
			.end(function(err, res) {
				assert.ok(res.statusCode === 400);
				assert.ok(res.text === expectedError);
				done();
			});
	}));

	it('should call the correct routeHandler for bookHandler.getMangaBooks - success case', sinon.test(function(done) {
		this.stub(clearDB, 'getDCBooks').callsArgWith(0, undefined, expectedMessage);
		request(server)
			.get('/books/dc')
			.end(function(err, res) {
				assert.ok(res.statusCode === 200);
				assert.ok(res.text === expectedMessage);
				done();
			});
	}));

	it('should call the correct routeHandler for bookHandler.getMangaBooks - error case', sinon.test(function(done) {
		this.stub(clearDB, 'getDCBooks').callsArgWith(0, expectedError, undefined);
		request(server)
			.get('/books/dc')
			.end(function(err, res) {
				assert.ok(res.statusCode === 400);
				assert.ok(res.text === expectedError);
				done();
			});
	}));
	
});