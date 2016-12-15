"use strict";
CQ.mainApp.dashboardController
	.controller('dashboardController', ['$scope', '$rootScope', '$state', 
		function($scope, $rootScope, $state) {
			$rootScope.dashboardController = true;
			console.log("dashboardController", "start!");
		
	}]);