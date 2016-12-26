"use strict";
CQ.mainApp.topicController
    .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state("topicController", {
                url:"/senTopic",
                templateUrl: "/static/modules/topic/pages/senTopic.html",
                controller: "senTopicController"
            });
            // .state("cardPost", {
            //     url:"/monitor/:siteId",
            //     templateUrl: "/static/modules/monitor/pages/monitor.html",
            //     controller: "manageSettingController"
            // })
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