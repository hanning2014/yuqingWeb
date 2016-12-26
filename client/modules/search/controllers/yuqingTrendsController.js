"use strict";
CQ.mainApp.searchController
    .controller("yuqingTrendsController", ["$rootScope", "$scope", function ($rootScope, $scope) {
        console.log("yuqingTrendsController", "start!!!");
        //页面UI初始化；
        $scope.$on('$viewContentLoaded', function() {
            if($rootScope.mainController) {
                console.log("app start!!!");
                App.runui();
            }
        });
        
   }]);