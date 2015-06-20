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

		connection.query('select username, pw from useraccount', function(queryError, dbResult) {
	        connection.release();
	        if (queryError) {
	            return callback(queryError, null);
	        } else {
	            var result = _u.find(dbResult, function(row) {
	                return row.username == username && row.pw == password;
	            });
                return callback(null, result);
	        }
	    });
	});
};

exports.postUser = function(requestPostBody, callback) {
	exports.getPool().getConnection(function(connectionError, connection) {
		if (connectionError) {
			connection.release();
			return callback(connectionError, null);
		}

		// TODO
		console.log('=================');
		console.log('IN HERE');
		console.log('=================');
	});
};

/*

function _registerAndValidateUser(post, callback) {
	var username = post.Username,
		email = post.Email,
		userPassword = post.Password,
		userName = post.Username;
	delete post['Password'];

	pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            return callback(err, null);
        }
	    connection.query('select Username, Email from userinfo', function(err, dbResult) {
	        if (err) {
	            return callback(err, null);
	        } else {
	            var searchUser = _und.find(dbResult, function(row) {
	                return row.username == username || row.Email == email;
	            });
	            console.log('searchUser: ' + JSON.stringify(searchUser));
	            if (searchUser != null) {
	            	console.log('it is really in here');
	            	return callback(new Error('Duplicated User'), null);
	            }

	            connection.query('insert into userinfo set ?', post, function(err, dbResult, fields) {
	                if (err) {
	                    return callback(err, null);
	                } else {
	                	var useraccountPost = { 
	                		Username : userName, 
	                		Pw : userPassword,
	                		UserNo : dbResult.insertId
	                	}
	                	connection.query('insert into useraccount set ?', useraccountPost, function(err, dbResult, fields) {
			            	connection.release();
			            	if (err) {
			            		return callback(err, null);
			            	} else {
			            		return callback(null, useraccountPost);
			            	}
		            	});
	                }
	            });
	        }
	    });
	});
}

*/

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