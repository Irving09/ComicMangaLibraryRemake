(function() {
	'use strict';

	angular
		.module('app.dashboard')
		.controller('BooksController', BooksController);

	function BooksController() {
		var booksCtrl = this;
		console.log('Books controller loaded');
		booksCtrl.name = 'Books Controller';
	}
})();