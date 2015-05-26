var _u 		= require('lodash');
var	mysql 	= require('mysql');
var config	= require('./dbConfig');

var pool	= mysql.createPool(config);

module.exports = {
	getUser : function(username, password, action) {
		
	},
	getBookByIsbn : function(isbn, action) {

	},
	getAuthor : function(name, action) {

	},
	getDCBooks : function(action) {

	},
	getMarvelBooks : function(action) {

	},
	getMangaBooks : function(action) {

	},
	postUser : function(postBody, callback) {

	}
};