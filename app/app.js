(function() {
	'use strict';
	console.log('app module loaded');
	angular
		.module('app', [
			'ngRoute',
			'app.dashboard',
			'app.books'
		]);
})();