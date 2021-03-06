"use strict";
CQ.mainApp = {
    frameController:         angular.module("frame.controller", ["settingservice"]),
    frameServices:           angular.module("frame.services", ["commons","Notice", "scrollBottom"]),
    dashboardController:     angular.module("dashboard.Controller", ["dashboardService"]),
    topicController:         angular.module("topic.Controller", ["topicService"]),
    monitorController:       angular.module("monitor.Controller", ["monitorService","Notice"]),
    senmessageController:    angular.module("senmessage.Controller", ["senmessageService", "Notice"]),
    systemsettingController: angular.module("systemsetting.Controller", ["Notice"]),
    searchController:        angular.module("search.Controller", [])
};
angular.module('mainApp', [
    "ui.router",
    "ngResource",
    "ui.bootstrap",
    "ngDraggable",
    "ngDialog",
    "frame.controller",
    "frame.services",
    "dashboard.Controller",
    "monitor.Controller",
    "topic.Controller",
    "senmessage.Controller",
    "systemsetting.Controller",
    "search.Controller"
    ])
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider",
        function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
            //Enable cross domain calls
            $httpProvider.defaults.useXDomain = true;
            $urlRouterProvider.otherwise("/dashboard");
            // $stateProvider
            // .state('dashboard', {
            //     url: "/dashboard",
            //     templateUrl: "/static/modules/dashboard/pages/dashboard.html",
            //     controller: "dashboardController"
            // });
            // $httpProvider.defaults.headers.common = {};
            // $httpProvider.defaults.headers.post = {};
            // $httpProvider.defaults.headers.put = {};
            // $httpProvider.defaults.headers.patch = {};
        }
    ])
    .run(['$rootScope', '$window', '$location', '$log', function($rootScope, $window, $location, $log) {

        var locationChangeStartOff = $rootScope.$on('$locationChangeStart', locationChangeStart);
        var locationChangeSuccessOff = $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);
        var routeChangeStartOff = $rootScope.$on('$routeChangeStart', routeChangeStart);
        var routeChangeSuccessOff = $rootScope.$on('$routeChangeSuccess', routeChangeSuccess);

        function routeChangeStart(event) {
            console.log("manageSettings routeChangeStart");
        }

        function routeChangeSuccess(event) {
            console.log("manageSettings routeChangeSuccess");
        }

        function locationChangeStart(event) {
            console.log("manageSettings locationChangeStart");
        }

        function locationChangeSuccess(event) {
            console.log("mainApp locationChangeSuccess");
        }
    }]);