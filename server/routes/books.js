'use strict';

var express 	= require('express');
var clearDB		= require('../clearDB/clearDB.js');
var bookHandler	= require('./routeHandlers/bookHandler.js');
var router 		= express.Router();

/* GET users listing. */
router.get('/', bookHandler.booksHome);
router.get('/:isbn', bookHandler.getBookByISBN);

module.exports = router;