"use strict";
CQ.mainApp.monitorController
   .controller("monitorController", ["$rootScope", "$scope", function ($rootScope, $scope) {
        console.log("monitorController", "start!!!");
        //页面UI初始化；
        $scope.$on('$viewContentLoaded', function() {
            if($rootScope.mainController) {
                App.init();
                //Dashboard.init();
            }
        });
   }]);