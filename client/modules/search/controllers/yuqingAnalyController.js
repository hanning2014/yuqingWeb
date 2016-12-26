"use strict";
CQ.mainApp.searchController
    .controller("yuqingAnalyController", ["$rootScope", "$scope", function ($rootScope, $scope) {
        console.log("yuqingAnalyController", "start!!!");
        //页面UI初始化；
        $scope.$on('$viewContentLoaded', function() {
            if($rootScope.mainController) {
                App.runui();
            }
        });
        
   }]);