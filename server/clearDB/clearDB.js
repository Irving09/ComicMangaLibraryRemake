var _u 		= require('lodash');
var	mysql 	= require('mysql');
var config	= require('./dbConfig');

var _pool   = mysql.createPool(config);

exports.getPool = function() {
	return _pool;
};

exports.getUser = function(username, password, callback) {
	exports.getPool().getConnection(function(connectionError, connection) {
		if (connectionError) {
			connection.release();
			return callback(connectionError, null);
		}

		// connection.query('select username, pw from useraccount', function(queryError, dbResult) {
		// 	console.log('queryError:', queryError);
		// 	console.log('dbResult:', dbResult);
	 //        connection.release();
	 //        if (err) {
	 //            return err;
	 //        } else {
	 //            var result = _und.find(dbResult, function(row) {
	 //                return row.username == username && row.pw == password;
	 //            });
  //               callback(null, result);
	 //        }
	    // });
	});
};

/*
module.exports = {
	connectionPool : function() {
		
	},
	getUser : function(username, password, callback) {
		getPool.getConnection(function(err, conn) {

		});
	},
	getBookByIsbn : function(isbn, callback) {

	},
	getAuthor : function(name, callback) {

	},
	getDCBooks : function(callback) {

	},
	getMarvelBooks : function(callback) {

	},
	getMangaBooks : function(callback) {

	},
	postUser : function(postBody, callback) {

	}
};
*/