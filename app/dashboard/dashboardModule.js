(function() {
	'use strict';

	angular
		.module('app.dashboard', ['ngRoute'])
		.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/', {
				templateUrl : 'dashboard/dashboard.html',
				controller : 'DashboardController',
				controllerAs : 'dashboardCtrl'
			});
		}]);
})();