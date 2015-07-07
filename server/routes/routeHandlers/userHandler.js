'use strict';

var clearDB	= require('../../clearDB/clearDB.js');

exports.usersHome =  function(req, res, next) {
	res.send('respond with a resource');
};

exports.getAuthor = function(req, res) {
	clearDB.getAuthor(req.params.username, function(err, result) {
		if (err) {
			return res.send(err);
		}
		return res.send(result);
	});
};