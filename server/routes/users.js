'use strict';

var express 	= require('express');
var clearDB		= require('../clearDB/clearDB.js');
var userHandler = require('./routeHandlers/userHandler.js');
var router 		= express.Router();

router
	.route('/')
	.get(userHandler.usersHome);

//TODO implement the query functionality within routes

// router.get('/', userHandler.usersHome);
// router.get('/:username', userHandler.getAuthor);

module.exports = router;
