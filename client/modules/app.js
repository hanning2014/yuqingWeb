"use strict";
CQ.mainApp = {
    frameController:         angular.module("frame.controller", []),
    frameServices:           angular.module("frame.services", []),
    dashboardController:     angular.module("dashboard.Controller", []),
    topicController:         angular.module("topic.Controller", []),
    monitorController:       angular.module("monitor.Controller", []),
    senmessageController:    angular.module("senmessage.Controller", []),
    systemsettingController: angular.module("systemsetting.Controller", []),
    searchController:        angular.module("search.Controller", [])
};
angular.module('mainApp', [
    "ui.router",
    "ui.bootstrap",
    "frame.controller",
    "frame.services",
    "dashboard.Controller",
    "monitor.Controller"
    ])
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider",
        function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
            //Enable cross domain calls
            $httpProvider.defaults.useXDomain = true;
            $urlRouterProvider.otherwise("/dashboard");
            // $stateProvider
            //     .state('index', {
            //         url: "/index",
            //         templateUrl: "/static/modules/index/pages/index.html",
            //         controller: "indexController"
            //     });
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