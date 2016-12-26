"use strict";
CQ.mainApp.topicController
    .controller("senTopicController", ["$rootScope", "$scope", function($rootScope, $scope) {
        console.log("senTopicController", "start!!!");
        //页面UI初始化；
        $scope.$on('$viewContentLoaded', function() {
            if($rootScope.mainController) {
                console.log("monitor app start!!!");
                App.runui();
            }
        });
    }]);