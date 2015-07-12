var sinon 			= require('sinon');
var request			= require('supertest');
var server 			= require('../server.js');
var unitUnderTest 	= require('../routes/books.js');

describe('/:isbn', function() {
	it('should call the correct routeHandler - bookHandler.getBookByISBN', function() {
		// TODO Not yet implemented

		// Act
		// request(server)
		// 	.get(':isbn')
		// 	.expect(400)
		// 	.end(function(err, res) {
		// 		console.log('res:', res);
		// 	});
	});
});