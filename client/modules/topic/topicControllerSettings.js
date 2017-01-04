"use strict";
CQ.mainApp.topicController
    .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state("topicController", {
                url:"/senTopic",
                templateUrl: "/static/modules/topic/pages/senTopic.html",
                controller: "senTopicController"
            })
            .state("topicAnalysController", {
                url:"/senTopic/:topicId",
                templateUrl: "/static/modules/topic/pages/topicAnalys.html",
                controller: "topicAnalysController"
            });
            // .state("", {
            //     url:"",
            //     templateUrl: "/static/modules/monitor/pages/monitor.html",
            //     controller: "manageSettingController"
            // })
            // .state("", {
            //     url:"",
            //     templateUrl: "/static/modules/monitor/pages/monitor.html",
            //     controller: "manageSettingController"
            // })
    }]);