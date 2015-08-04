'use strict';

var clearDB	= require('../../clearDB/clearDB.js');

exports.usersHome =  function(req, res, next) {
	if (typeof req.query.username != 'undefined') {
		return exports.getUserByUsername(req, res);
	}
	res.send('respond with a resource');
};

exports.getUserByUsername = function(req, res) {
	clearDB.getUserByUsername(req.query.username, function(err, result) {
		if (err) {
			return res.status(400).send(err);
		}
		return res.send(result);
	});
};