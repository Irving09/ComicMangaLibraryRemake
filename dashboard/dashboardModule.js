(function() {
	'use strict';

	angular
		.module('dashboard', [
			'ngRoute'
		])
		.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/', {
				templateUrl : 'dashboard/index.html',
				controller : 'DashboardController',
				controllerAs : 'dashboard'
			});
		}]);
})();