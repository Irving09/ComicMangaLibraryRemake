(function() {

	angular
		.module('app.books')
		.service('BooksService', BooksService);

	BooksService.$inject = ['$http'];

	function BooksService($http) {
		return {
			getBooks : function() {
				console.log('make a call to the api books!!');

				$http.get('http://localhost:3000/books/manga')
					.then(function(response) {
						console.log('response: ', response);
					}, function(err) {
						console.log('err:', err);
					});
			}
		};
	}
})();