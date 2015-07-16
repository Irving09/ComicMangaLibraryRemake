(function() {
	'use strict';
	console.log('dashboard module loaded');
	angular
		.module('app.dashboard', ['ngRoute'])
		.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/', {
				templateUrl : 'dashboard/dashboard.html',
				controller : 'DashboardController',
				controllerAs : 'dashboard'
			});
		}]);
})();