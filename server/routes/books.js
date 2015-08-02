'use strict';

var express 	= require('express');
var clearDB		= require('../clearDB/clearDB.js');
var bookHandler	= require('./routeHandlers/bookHandler.js');
var router 		= express.Router();

router
	.route('/')
	.get(bookHandler.booksHome);

router
	.route('/manga')
	.get(bookHandler.getMangaBooks);

router
	.route('/marvel')
	.get(bookHandler.getMarvelBooks);

router
	.route('/dc')
	.get(bookHandler.getDCBooks);

module.exports = router;