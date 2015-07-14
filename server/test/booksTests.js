var assert			= require('assert');
var sinon 			= require('sinon');
var request			= require('supertest');
var server 			= require('../server.js');
var clearDB			= require('../clearDB/clearDB.js');
var unitUnderTest 	= require('../routes/books.js');


// TODO Not yet implemented
describe('router.books', function() {
	// var sandbox;

	// before(function() {
	// 	sandbox = sinon.sandbox.create();
	// });

	// beforeEach(function() {
	// 	sandbox.stub(clearDB, 'getMangaBooks').callsArgWith(1, undefined, 'success');
	// });

	// afterEach(function() {
	// 	sandbox.restore();
	// });

	// it('should call the correct routeHandler - bookHandler.getMangaBooks', sinon.test(function(done) {
	// 	// this.stub(clearDB, 'getMangaBooks').callsArgWith(1, undefined, 'success');
	// 	request(server)
	// 		.get('/books/manga')
	// 		.end(function(err, res) {
	// 			console.log('res.statusCode:', res.statusCode);
	// 			done();
	// 		});
	// }));

	// it('should call the correct routeHandler - bookHandler.getBookByISBN', sinon.test(function(done) {
	// 	this.stub(clearDB, 'getBookByISBN').callsArgWith(1, undefined, 'success');

		// Act
			// request(server)
				// .get('/books?isbn=123456789')
				// .end(function(err, res) {
				// 	// assert.ok(clearDB.getBookByISBN.calledOnce);
					// done();
				// });
	// }));
});