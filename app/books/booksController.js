(function() {
	'use strict';

	angular
		.module('app.books')
		.controller('BooksController', BooksController);

	BooksController.$inject = ['BooksService'];

	function BooksController(BooksService) {
		var booksCtrl = this;
		booksCtrl.name = 'Books Controller';

		booksCtrl.testBooksService = BooksService.getBooks;
	}
})();