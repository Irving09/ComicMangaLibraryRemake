'use strict';

var clearDB	= require('../../clearDB/clearDB.js');

exports.booksHome =  function(req, res, next) {
	res.send('respond with a resource');
};

exports.getBookByISBN = function(req, res) {
	clearDB.getBookByISBN(req.params.isbn, function(err, result) {
		if (err) {
			return res.send(err);
		}
		return res.send(result);
	});
};