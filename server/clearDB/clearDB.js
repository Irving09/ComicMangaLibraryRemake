'use strict';

var _u 		= require('lodash');
var	mysql 	= require('mysql');
var config	= require('./dbConfig');
var Q 		= require('q');

var _pool   = mysql.createPool(config);

exports.getPool = function() {
	return _pool;
};

exports.getUserByUsernameAndPassword = function(username, password, callback) {
	exports.getPool().getConnection(function(connectionError, connection) {

		if (connectionError) {
			connection.release();
			return callback(connectionError, null);
		}

		connection.query('select username, pw from useraccount', function(queryError, dbResult) {
	        connection.release();
	        if (queryError) {
	            return callback(queryError, null);
	        }
            var result = _u.find(dbResult, function(row) {
                return row.username == username && row.pw == password;
            });
            return callback(null, result);
	    });
	});
};

exports.getUserByUsernameAndEmail = function(username, email, callback) {
	exports.getPool().getConnection(function(connectionError, connection) {
		if (connectionError) {
			connection.release();
			return callback(connectionError, null);
		}

		connection.query('select Username, Email from userinfo', function(dbSelectError, dbSelectResult) {
			connection.release();
			if (dbSelectError) {
				return callback(dbSelectError, null);
			}

			var searchUser = _u.find(dbSelectResult, function(row) {
                return row.username == username || row.Email == email;
            });
			
			return callback(null, searchUser);
		});
	});
}

exports.postUserIntoUserInfo = function(requestPostBody, callback) {
	exports.getPool().getConnection(function(connectionError, connection) {
		if (connectionError) {
			connection.release();
			return callback(connectionError, null);
		}

		connection.query('insert into userinfo set ?', requestPostBody, function(err, dbResult, fields) {
			connection.release();
            if (err) {
                return callback(err, null);
            }

            var userAccountPost = {
            	Username : requestPostBody.userName,
            	Pw : requestPostBody.userPassword,
            	UserNo : dbResult.insertId
            };

            return callback(null, userAccountPost);
        });
	});
};
// useraccountPost = { Username : post.Username, Pw : post.Password };
// useraccountPost.UserNo = dbResult.insertId;
exports.postUserIntoUserAccount = function(requestPostBody, callback) {
	exports.getPool().getConnection(function(connectionError, connection) {
		if (connectionError) {
			connection.release();
			return callback(connectionError, null);
		}

		connection.query('insert into useraccount set ?', requestPostBody, function(err, dbResult, fields) {
			connection.release();
			//{"fieldCount":0,"affectedRows":1,"insertId":182,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}

            if (err) {
                return callback(err, null);
            }

            return callback(null, requestPostBody);
	    });
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