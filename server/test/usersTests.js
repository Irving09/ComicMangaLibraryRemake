var assert			= require('assert');
var sinon 			= require('sinon');
var request			= require('supertest');
var mysql			= require('mysql');
var server 			= require('../server.js');
var clearDB			= require('../clearDB/clearDB.js');
var bookHandler		= require('../routes/routeHandlers/bookHandler.js');
var unitUnderTest 	= require('../routes/books.js');

describe('router.users', function() {
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
			.get('/users')
			.end(function(err, res) {
				assert.ok(res.statusCode === 200);
				done();
			});
	}));

	it('should call the correct routeHandler for userHandler.getAuthor - success case', sinon.test(function(done) {
		this.stub(clearDB, 'getUserByUsername').callsArgWith(1, undefined, expectedMessage);
		request(server)
			.get('/users?username=helloworld')
			.end(function(err, res) {
				assert.ok(res.statusCode === 200);
				assert.ok(res.text === expectedMessage);
				done();
			});
	}));
});