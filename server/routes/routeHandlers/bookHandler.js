'use strict';

var clearDB	= require('../../clearDB/clearDB.js');

exports.booksHome =  function(req, res, next) {
	if (typeof req.query.isbn != 'undefined') {
		return exports.getBookByISBN(req, res);
	}
	return res.send('booksHome invoked');
};

exports.getBookByISBN = function(req, res) {
	return clearDB.getBookByISBN(req.query.isbn, function(queryError, queryResult) {
		if (queryError) {
			return res.send(queryError);
		}
		return res.send(queryResult);
	});
};

exports.getMangaBooks = function(req, res) {
	return clearDB.getMangaBooks(function(queryError, queryResult) {
		if (queryError) {
			return res.status(400).send(queryError);
		}
		return res.send(queryResult);
	});	
};

exports.getMarvelBooks = function(req, res) {
	return clearDB.getMarvelBooks(function(queryError, queryResult) {
		if (queryError) {
			return res.status(400).send(queryError);
		}
		return res.send(queryResult);
	});
};

exports.getDCBooks = function(req, res) {
	return clearDB.getDCBooks(function(queryError, queryResult) {
		if (queryError) {
			return res.status(400).send(queryError);
		}
		return res.send(queryResult);
	});
};