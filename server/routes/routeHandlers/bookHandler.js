'use strict';

var clearDB	= require('../../clearDB/clearDB.js');

exports.booksHome =  function(req, res, next) {
	res.send('respond with a resource');
};

exports.getBookByISBN = function(req, res) {
	clearDB.getBookByISBN(req.params.isbn, function(queryError, queryResult) {
		if (queryError) {
			return res.send(queryError);
		}
		return res.send(queryResult);
	});
};

exports.getMangaBooks = function(req, res) {
	clearDB.getMangaBooks(function(queryError, queryResult) {
		if (queryError) {
			return res.send(queryError);
		}
		return res.send(queryResult);
	});	
};

exports.getMarvelBooks = function(req, res) {
	clearDB.getMarvelBooks(function(queryError, queryResult) {
		if (queryError) {
			return res.send(queryError);
		}
		return res.send(queryResult);
	});	
};

exports.getDCBooks = function(req, res) {
	clearDB.getDCBooks(function(queryError, queryResult) {
		if (queryError) {
			return res.send(queryError);
		}
		return res.send(queryResult);
	});	
};