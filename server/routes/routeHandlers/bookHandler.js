'use strict';

var clearDB	= require('../../clearDB/clearDB.js');

exports.booksHome =  function(req, res, next) {
	res.send('respond with a resource');
};

exports.getBookByISBN = function(req, res) {
	// console.log('=========getBookByISBN is here=========');
	clearDB.getBookByISBN(req.params.isbn, function(queryError, queryResult) {
		if (queryError) {
			return res.send(queryError);
		}
		return res.send(queryResult);
	});
};

exports.getMangaBooks = function(req, res) {
	// console.log('=========getMangaBooks is here=========');
	clearDB.getMangaBooks(function(queryError, queryResult) {
		console.log('queryError:', queryError);
		console.log('queryResult:', queryResult);
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