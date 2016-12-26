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
    .controller('dashboardController', ['$scope', '$rootScope', '$state','ChartService', 
        function($scope, $rootScope, $state, ChartService) {
            $rootScope.dashboardController = true;
            console.log("dashboardController", "start!");
            //页面UI初始化；
            $scope.$on('$viewContentLoaded', function() {
                if($rootScope.mainController) {
                    App.runui();
                }
            });
            ChartService.getDashboardData({}).then(function(res){
                console.log(res);
            },function(error){
                console.log(error);
            });

	}]);