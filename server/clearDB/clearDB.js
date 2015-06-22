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

exports.postUserIntoUserAccount = function(requestPostBody, callback) {
	exports.getPool().getConnection(function(connectionError, connection) {
		if (connectionError) {
			connection.release();
			return callback(connectionError, null);
		}
		//{"fieldCount":0,"affectedRows":1,"insertId":182,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
		connection.query('insert into useraccount set ?', requestPostBody, function(err, dbResult, fields) {
			connection.release();
            if (err) {
                return callback(err, null);
            }
            return callback(null, requestPostBody);
	    });
	});
};

/*

function _registerAndValidateUser(post, callback) {
	var username = post.Username,
		email = post.Email,
		useraccountPost = { Username : post.Username, Pw : post.Password };
	delete post['Password'];

	pool.getConnection(function(err, connection) {
		checkSQLConnection(err, connection);
	    connection.query('select Username, Email from userinfo', function(err, dbResult) {
	        if (err) {
	            return callback(err, null);
	        } else {
	            var searchUser = _und.find(dbResult, function(row) {
	                return row.username == username || row.Email == email;
	            });

	            if (searchUser != null) {
	            	console.log('It is really in here');
	            	return callback(new Error('Duplicated User'), null);
	            }

	            connection.query('insert into userinfo set ?', post, function(err, dbResult, fields) {
	            	//{"fieldCount":0,"affectedRows":1,"insertId":182,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}

	                if (err) {
	                    return callback(err, null);
	                } else {
	                	useraccountPost.UserNo = dbResult.insertId;

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

	            console.log('useraccountPost: ' + JSON.stringify(useraccountPost));

	            //insert into useraccount (UserNo, Username, Pw) values(888, 'inno23', 'xxxx');
	            
	        }
	    });
	});
}
*/

exports.getUsernameAndEmailPromise = function(usernae, email) {
	var deferred = Q.defer();
	exports.getUserByUsernameAndEmail(username, email, function(err, result) {
		if (err) {
			return deferred.reject(err);
		}
		return deferred.resolve(result);
	});

	return deferred.promise;
};

exports.postUserIntoUserInfoPromise = function(requestPostBody) {
	var deferred = Q.defer();
	exports.postUserIntoUserInfo(requestPostBody, function(err, res) {
		if (err) {
			return deferred.reject(err);
		}
		return deferred.resolve(res);
	});

	return deferred.promise;
};

exports.postUserIntoUserAccountPromise = function(requestPostBody) {
	var deferred = Q.defer();
	exports.postUserIntoUserAccount(requestPostBody, function(err, res) {
		if (err) {
			return deferred.reject(err);
		}
		return deferred.resolve(res);
	});

	return deferred.promise;
};

exports.registerUser = function(post, callback) {
	var username 	= post.Username;
	var email 		= post.Email;
	var password 	= post.Password;

	// Perform post logic here using promises
	var promises = [];
	promises.push(exports.getUsernameAndEmailPromise(username, email));
	promises.push(exports.postUserIntoUserInfoPromise(post));
	promises.push(exports.postUserIntoUserAccountPromise(userAccountPost));


	var funcs = [foo, bar, baz, qux];

	// var result = Q(initialVal);
	// funcs.forEach(function (f) {
	//     result = result.then(f);
	// });
	// return result;
	// You can make this slightly more compact using reduce:

	// return funcs.reduce(function (soFar, f) {
	//     return soFar.then(f);
	// }, Q(initialVal));

	return callback(deferred.promise);
		/*
		Q.fcall(promisedStep1)
		.then(promisedStep2)
		.then(promisedStep3)
		.then(promisedStep4)
		.then(function (value4) {
		    // Do something with value4 
		})
		.catch(function (error) {
		    // Handle any error from all above steps 
		})
		.done();
		*/

    // exports.getUserByUsernameAndEmail(username, email, function(userExists, result) {
	// 	if (userExists) {

	// 	}
	// 	exports.postUserIntoUserInfo({}, function(userInfoError, result) {
	// 		if (userInfoErrorrr) {

	// 		}
	// 		exports.postUserIntoUserAccount({}, function(userAccountError) {
	// 			if (userAccountError) {

	// 			}
	// 		});
	// 	});
	// });


	// useraccountPost = { Username : post.Username, Pw : post.Password };
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