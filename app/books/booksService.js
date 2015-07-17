(function() {

	angular
		.module('app.books')
		.service('BooksService', BooksService);

	BooksService.$inject = ['$http'];

	function BooksService($http) {
		return {
			getBooks : function() {
				console.log('make a call to the api books!!');
			}
		};
	}
})();