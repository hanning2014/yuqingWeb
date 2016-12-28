"use strict";
CQ.mainApp.monitorController
   .controller("monitorController", ["$rootScope", "$scope", "$interval", "ngDialog", function ($rootScope, $scope, $interval,ngDialog) {
        console.log("monitorController", "start!!!");
        //页面UI初始化；
        $scope.topic_id = null;
        $scope.monitortopic_id = null;
        $scope.$on('$viewContentLoaded', function() {
            if($rootScope.mainController) {
                console.log("monitor app start!!!");
                App.runui();
            }
        });
        $scope.post = '<li class="media media-sm">'+
                        '<a href="javascript:;" class="pull-left">' +
                            '<img src="/static/assets/img/user-1.jpg" alt="" class="media-object rounded-corner">'+
                        '</a>'+
                        '<div class="media-body">'+
                            '<a href="javascript:;"><h4 class="media-heading">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h4></a>'+
                            '<p class="m-b-5">'+
                                'Aenean mollis arcu sed turpis accumsan dignissim. Etiam vel tortor at risus tristique convallis. Donec adipiscing euismod arcu id euismod. Suspendisse potenti. Aliquam lacinia sapien ac urna placerat, eu interdum mauris viverra.'+
                            '</p>'+
                            '<i class="text-muted">Received on 04/16/2013, 12.39pm</i>'+
                        '</div>'+
                     '</li>';
        $interval(function(){
            console.log($(".panel"));
            for(var i = 0; i < $(".panel").length; i ++) {
                var t  =  $(".panel")[i];
                var n = $(t).find(".panel-body");
                $(n).find("ul .loads").after($scope.post);
                $(".loads").removeClass("hidden");
            }
        }, 20000);

        $interval(function(){
            $(".loads").addClass("hidden");
        }, 30000);

        $scope.movePosition = function(topic_id) {
            var ht = $("#"+topic_id+"");
            if($("#"+topic_id+"")) {
                $("#"+topic_id+"").hide("slow");
                $("#topicLists").prepend(ht);
                $("#"+topic_id+"").fadeIn("slow");
            }
        };
        $scope.openDia = function(topic_id) {
            ngDialog.open(
            {
                template: '/static/modules/monitor/pages/openTopic.html',
                controller: 'openTopic',
                width:"40%"
            }
            );
        };
        $scope.pauseTop = function(topic_id, monitortopic_id) {
            $scope.topic_id = topic_id;
            $scope.monitortopic_id = monitortopic_id;
             ngDialog.open(
            {
                template: '/static/modules/monitor/pages/pauseTopic.html',
                controller: 'pauseTopic',
                width:"10%",
                scope:$scope
            }
            );
        };
        $scope.startTop = function(topic_id, monitortopic_id) {
            $scope.topic_id = topic_id;
            $scope.monitortopic_id = monitortopic_id;
             ngDialog.open(
            {
                template: '/static/modules/monitor/pages/startTopic.html',
                controller: 'startTopic',
                width: "10%",
                scope: $scope
            }
            );
        };

   }])
   .controller("openTopic", ["$rootScope","$scope","ngDialog", function($rootScope, $scope, ngDialog) {
        console.log("openTopic","start!!!");
   }])
   .controller("pauseTopic", ["$rootScope","$scope","ngDialog", function($rootScope, $scope, ngDialog) {
        console.log("pauseTopic","start!!!");
        console.log($scope.topic_id);
        $scope.stopTopic = function() {
            if($scope.topic_id) {
                $("#"+$scope.topic_id+"").hide("slow");
                $("#"+$scope.monitortopic_id+" a:first-child").addClass("disabled");
                $("#"+$scope.monitortopic_id+" .start").removeClass("hidden");
                $("#"+$scope.monitortopic_id+" .stop").addClass("hidden");
            }
            ngDialog.closeAll();
        };
       
        
   }])
    .controller("startTopic", ["$rootScope","$scope","ngDialog", function($rootScope, $scope, ngDialog) {
        console.log("startTopic","start!!!");
        console.log($scope.topic_id);
        $scope.starTopic = function() {
            if($scope.topic_id) {
                var ht = $("#"+$scope.topic_id+"");
                $("#topicLists").prepend(ht);
                $("#"+$scope.topic_id+"").fadeIn("slow");
                $("#"+$scope.monitortopic_id+" a:first-child").removeClass("disabled");
                $("#"+$scope.monitortopic_id+" .start").addClass("hidden");
                $("#"+$scope.monitortopic_id+" .stop").removeClass("hidden");
            }
            ngDialog.closeAll();
        };
       
        
   }]);