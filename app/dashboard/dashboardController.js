(function() {
	'use strict';

	angular
		.module('app.dashboard')
		.controller('DashboardController', DashboardController);

	function DashboardController() {
		var dashboardCtrl = this;
		console.log('Dashboard controller loaded');
		dashboardCtrl.name = 'Dashboard Controller';
	}
})();