'use strict';

var express 	= require('express');
var userHandler = require('./routeHandlers/userHandler.js');
var router 		= express.Router();

router.get('/', userHandler.usersHome);
router.get('/:username', userHandler.getAuthor);

module.exports = router;
