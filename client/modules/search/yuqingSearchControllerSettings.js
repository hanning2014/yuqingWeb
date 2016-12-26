"use strict";
CQ.mainApp.searchController
    .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state("yuqingTrendsController", {
                url:"/yuqingTrends",
                templateUrl: "/static/modules/search/pages/yuqingTrends.html",
                controller: "yuqingTrendsController"
            })
            .state("yuqingAnalyController", {
                url:"/yuqingAnaly",
                templateUrl: "/static/modules/search/pages/yuqingAnaly.html",
                controller: "yuqingAnalyController"
            });
}]);