'use strict';

var express 	= require('express');
var clearDB		= require('../clearDB/clearDB.js');
var bookHandler	= require('./routeHandlers/bookHandler.js');
var router 		= express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// router.get('/:isbn', function(req, res){
// 	clearDB.getBookByISBN(req.params.isbn, function(err, result) {
// 		res.send(result);
// 	});
// });

router.get('/:isbn', bookHandler.getBookByISBN);

module.exports = router;