(function() {
	'use strict';

	angular
		.module('app.dashboard')
		.controller('DashboardController', DashboardController);

	function DashboardController() {
		var dashboardCtrl = this;
		dashboardCtrl.name = 'Dashboard Controller';
	}
})();