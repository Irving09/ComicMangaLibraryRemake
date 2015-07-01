'use strict';

var clearDB	= require('../../clearDB/clearDB.js');

exports.getBookByISBN = function(req, res) {
	clearDB.getBookByISBN(req.params.isbn, function(err, result) {
		// console.log('err:', err);
		// if (err) {
		// 	res.send(err);
		// }
		res.send(result);
	});
};