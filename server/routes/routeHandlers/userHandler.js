'use strict';

var clearDB	= require('../../clearDB/clearDB.js');

exports.usersHome =  function(req, res, next) {
	res.send('respond with a resource');
};

exports.getAuthor = function(req, res) {
	clearDB.getAuthor(req.query.username, function(err, result) {
		if (err) {
			return res.status(400).send(err);
		}
		return res.send(result);
	});
};