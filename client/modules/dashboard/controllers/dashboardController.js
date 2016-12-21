"use strict";
CQ.mainApp.dashboardController
	.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "/static/modules/dashboard/pages/dashboard.html",
                controller: "dashboardController"
            });
    }])
	.controller('dashboardController', ['$scope', '$rootScope', '$state', 
		function($scope, $rootScope, $state) {
			$rootScope.dashboardController = true;
			console.log("dashboardController", "start!");
			//页面UI初始化；
			$scope.$on('$viewContentLoaded', function() {
				if($rootScope.mainController) {
					App.runui();
					//Dashboard.init();
				}
			});

	}]);