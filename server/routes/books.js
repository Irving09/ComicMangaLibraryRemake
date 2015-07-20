'use strict';

var express 	= require('express');
var clearDB		= require('../clearDB/clearDB.js');
var bookHandler	= require('./routeHandlers/bookHandler.js');
var router 		= express.Router();

/* GET users listing. */
router.get('/:isbn', function(req, res) {
	console.log('=========getBookByISBN is here=========');
	return clearDB.getBookByISBN(req.params.isbn, function(queryError, queryResult) {
		if (queryError) {
			return res.send(queryError);
		}
		return res.send(queryResult);
	});
});
router.get('/', bookHandler.booksHome);
router.get('/manga', bookHandler.getMangaBooks);

module.exports = router;