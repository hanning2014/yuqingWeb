"use strict";
CQ.mainApp.senmessageController
   .controller("senmessageController", ["$rootScope", "$scope", function ($rootScope, $scope) {
        console.log("senmessageController", "start!!!");
        //页面UI初始化；
        $scope.$on('$viewContentLoaded', function() {
            if($rootScope.mainController) {
                console.log("monitor app start!!!");
                App.runui();
            }
        });
        
   }]);