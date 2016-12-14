"use strice";
CCQ.mainApp = {
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
    'ngResource',
    'ngFileUpload',
    "ui.bootstrap",
    "ngDialog",
    "ngScrollable",
    "agGrid",
    "tink.popover"
    ])
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", "ACCESS_LEVELS",
        function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, ACCESS_LEVELS) {

            $httpProvider.interceptors.push('redirectInterceptor');
            //Enable cross domain calls
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];

            $urlRouterProvider.otherwise("/dashboard");
            $stateProvider
                .state('index', {
                    url: "/index",
                    templateUrl: "/static/modules/index/pages/index.html",
                    controller: "indexController"
                })
                .state('sysconfis', {
                    url: "/sysconfis",
                    templateUrl: "/static/commons/template/modulehome.html",
                    controller: "sysConfisController"
                })
                .state('xtsz', {
                    url: "/xtsz",
                    templateUrl: "/static/commons/template/modulehome.html",
                    controller: "xtszController"
                });
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
            var url = $location.url().substring(1);
            $rootScope.setNavs(url);
        }
    }]);