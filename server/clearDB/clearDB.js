'use strict';

var _u 		= require('lodash');
var	mysql 	= require('mysql');
// var config	= require('./dbConfig');
var config	= require('../../../localDBConfigs/dbConfig');
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

exports.isUniqueUsernameAndEmail = function(username, email, callback) {
	exports.getPool().getConnection(function(connectionError, connection) {
		if (connectionError) {
			connection.release();
			return callback(connectionError, undefined);
		}

		connection.query('select Username, Email from userinfo', function(dbSelectError, dbSelectResult) {
			connection.release();
			if (dbSelectError) {
				return callback(dbSelectError, undefined);
			}

			var searchUser = _u.find(dbSelectResult, function(row) {
            	return row.username === username || row.Email === email;
            });

            if (searchUser != null) {
            	return callback(new Error('The username or email is already taken'), undefined);
            }
			return callback(undefined, true);
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

exports.getUsernameAndEmailPromise = function(username, email) {
	var deferred = Q.defer();
	exports.isUniqueUsernameAndEmail(username, email, function(err, res) {
		if (err) {
			return deferred.reject(err);
		}
		return deferred.resolve(res);
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

	// deleted the old Password property from the original post here???

	var finalPromise = exports.getUsernameAndEmailPromise(username, email)
		.then(function(fulfilledValue) {
			return  exports.postUserIntoUserInfoPromise(post);
		})
		.then(function(fulfilledValue) {
			// TODO Implement dbResult.insertId
			var userAccountPost = {
				Username : username,
				Pw : password,
				UserNo : fulfilledValue.insertId
			};

			return exports.postUserIntoUserAccountPromise(userAccountPost); 
		});

	return callback(finalPromise);
};

exports.getBookByISBN = function(isbn, callback) {
	exports.getPool().getConnection(function(connectionError, connection) {
		if (connectionError) {
			connection.release();
			return callback(connectionError, null);
		}
		
		// TODO
		connection.query('select ISBN, Title, Author, Category from bookinfo where ISBN=\'' + isbn + '\'', function(queryError, dbResult) {
			connection.release();
			if (queryError) {
				return callback(queryError, null);
			}

			var res = _u.find(dbResult, function(row) {
				return row.ISBN == isbn;
			});

			return callback(null, res);
		});
	});
};

exports.getMangaBooks = function(callback) {
	exports.getPool().getConnection(function(connectionError, connection) {
		if (connectionError) {
			connection.release();
			return callback(connectionError, undefined);
		}

		var queryString ="select ISBN, Author, Title, Category from bookinfo where Category='Manga'";
		connection.query(queryString, function(queryError, dbResult) {
			connection.release();
			if (queryError) {
				return callback(queryError, undefined);
			}

			var result = dbResult.map(function(row) {
				return {
					isbn : row.ISBN,
                    author : row.Author,
                    title : row.Title,
                    category : row.Category
				};
			});

			return callback(undefined, result);
		});
	});
};

exports.getMarvelBooks = function(callback) {
	exports.getPool().getConnection(function(connectionError, connection) {
		if (connectionError) {
			connection.release();
			return callback(connectionError, undefined);
		}

		var queryString = 'select ISBN, Author, Title, Category from bookinfo where Category=\'Marvel Comics\'';
		connection.query(queryString, function(queryError, dbResult) {
			connection.release();
			if (queryError) {
                return callback(queryError, undefined);
            }
        	return callback(undefined, exports.generateBookJSON(dbResult));
		});
	});
};

exports.getDCBooks = function(callback) {
	exports.getPool().getConnection(function(connectionError, connection) {
		if (connectionError) {
			connection.release();
			return callback(connectionError, undefined);
		}

		var queryString = 'select ISBN, Author, Title, Category from bookinfo where Category=\'DC Comics\'';
		connection.query(queryString, function(queryError, dbResult) {
			connection.release();
			if (queryError) {
                return callback(queryError, null);
            }
            return callback(undefined, exports.generateBookJSON(dbResult));
		});
	});
};

exports.generateBookJSON = function(dbResult) {
	return dbResult.map(function(row) {
		return {
			isbn : row.ISBN,
            author : row.Author,
            title : row.Title,
            category : row.Category
        };
	});
};

exports.getUserByUsername = function(authorName, callback) {
	exports.getPool().getConnection(function(connectionError, connection) {
		if (connectionError) {
			connection.release();
			return callback(connectionError, undefined);
		}
		
		var queryString = 'select ISBN, Author, Title, Category from bookinfo where Author like ?';
		connection.query(queryString, '%' + authorName + '%', function(err, dbResult) {
			if (err) {
				return callback(err, undefined);
			}

			var result = dbResult.reduce(function(currentValue, dbRow, index) {
				if (dbRow.Author.toLowerCase().indexOf(authorName.toLowerCase()) > -1) {
					currentValue.push({
						ISBN : dbRow.ISBN,
						Author : dbRow.Author,
						Title : dbRow.Title,
						Category : dbRow.Category,
					});
				}
				return currentValue;
			}, []);

			callback(undefined, dbResult);
		});
	});
};