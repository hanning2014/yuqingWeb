"use strict";
CQ.mainApp.monitorController
   .controller("monitorController", ["$rootScope", "$scope", function ($rootScope, $scope) {
        console.log("monitorController", "start!!!");
        //页面UI初始化；
        $scope.$on('$viewContentLoaded', function() {
            if($rootScope.mainController) {
                console.log("monitor app start!!!");
                App.runui();
            }
        });
   }]);