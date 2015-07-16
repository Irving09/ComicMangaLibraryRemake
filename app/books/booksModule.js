(function() {
	'use strict';
	console.log('dashboard module loaded');
	angular
		.module('app.books', ['ngRoute'])
		.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/books', {
				templateUrl : 'books/books.html',
				controller : 'BooksController',
				controllerAs : 'books'
			});
		}]);
})();