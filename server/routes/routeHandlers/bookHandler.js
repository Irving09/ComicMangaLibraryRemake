'use strict';

var clearDB	= require('../../clearDB/clearDB.js');

exports.booksHome =  function(req, res, next) {
	res.send('respond with a resource');
	return res.end();
};

exports.getBookByISBN = function(req, res) {
	// console.log('=========getBookByISBN is here=========');
	return clearDB.getBookByISBN(req.params.isbn, function(queryError, queryResult) {
		if (queryError) {
			return res.send(queryError);
		}
		return res.send(queryResult);
	});
};

exports.getMangaBooks = function(req, res) {
	// console.log('=========getMangaBooks is here=========');
	return clearDB.getMangaBooks(function(queryError, queryResult) {
		if (queryError) {
			return res.send(queryError);
		}
		return res.send(queryResult);
	});	
};

exports.getMarvelBooks = function(req, res) {
	return clearDB.getMarvelBooks(function(queryError, queryResult) {
		if (queryError) {
			return res.send(queryError);
		}
		return res.send(queryResult);
	});	
};

exports.getDCBooks = function(req, res) {
	return clearDB.getDCBooks(function(queryError, queryResult) {
		if (queryError) {
			return res.send(queryError);
		}
		return res.send(queryResult);
	});	
};