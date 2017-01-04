"use strict";
CQ.mainApp.monitorController
   .controller("monitorController", ["$rootScope", "$scope", "$interval", "ngDialog","MonitorFacService",
    "$location","$stateParams",function ($rootScope, $scope, $interval,ngDialog, MonitorFacService, 
        $location, $stateParams) {
        console.log("monitorController", "start!!!");
        console.log($location.path());
        console.log($stateParams.dataType);
        console.log($stateParams.siteId);
        //页面UI初始化；
        $scope.topic_id = null;
        $scope.monitortopic_id = null;
        $scope.monitorData = null;
        $scope.topicLists = null;
        $scope.$on('$viewContentLoaded', function() {
            if($rootScope.mainController) {
                console.log("monitor app start!!!");
                App.runui();
            }
        });
        getMonitorData();
        function getMonitorData() {
            var cons = {};
            cons.dataType = -1;
            cons.siteId = -1;
            cons.date = "2016-12-30";
            cons.pageNum = 1;
            cons.pageCount = 20;
            MonitorFacService.getMonitorData(cons).then(function(res){
                console.log(res);
                $scope.monitorData = res.topic;
            },function(error){
                console.log(error);
            });
        }
        // $scope.post = '<li class="media media-sm">'+
        //                 '<a href="javascript:;" class="pull-left">' +
        //                     '<img src="/static/assets/img/user-1.jpg" alt="" class="media-object rounded-corner">'+
        //                 '</a>'+
        //                 '<div class="media-body">'+
        //                     '<a href="javascript:;"><h4 class="media-heading">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h4></a>'+
        //                     '<p class="m-b-5">'+
        //                         'Aenean mollis arcu sed turpis accumsan dignissim. Etiam vel tortor at risus tristique convallis. Donec adipiscing euismod arcu id euismod. Suspendisse potenti. Aliquam lacinia sapien ac urna placerat, eu interdum mauris viverra.'+
        //                     '</p>'+
        //                     '<i class="text-muted">Received on 04/16/2013, 12.39pm</i>'+
        //                 '</div>'+
        //              '</li>';
        // $interval(function(){
        //     console.log($(".panel"));
        //     for(var i = 0; i < $(".panel").length; i ++) {
        //         var t  =  $(".panel")[i];
        //         var n = $(t).find(".panel-body");
        //         $(n).find("ul .loads").after($scope.post);
        //         $(".loads").removeClass("hidden");
        //     }
        // }, 20000);

        // $interval(function(){
        //     $(".loads").addClass("hidden");
        // }, 30000);

        $scope.movePosition = function(topic_id) {
            console.log(topic_id);
            var ht = $("#topic_"+topic_id+"");
            if($("#topic_"+topic_id+"")) {
                $("#topic_"+topic_id+"").hide("slow");
                $("#topicLists").prepend(ht);
                $("#topic_"+topic_id+"").fadeIn("slow");
            }
        };
        $scope.openDia = function(topic_id, topic_name) {
            $scope.topic_name = topic_name;
            ngDialog.open(
            {
                template: '/static/modules/monitor/pages/openTopic.html',
                controller: 'openTopic',
                width:"40%",
                scope:$scope
            }
            );
        };
        $scope.refreshData = function(topic_id) {
            var doms = "#topic_" + topic_id;
            angular.element(doms).find(".loads").removeClass("hidden");
            $interval(function(){
                angular.element(doms).find(".loads").addClass("hidden");
            }, 5000);
        };

        $scope.showMore = function() {
            console.log('show more triggered');  
        };

        $scope.panelCollapse = function(topic_id) {
            var doms = "#topic_" + topic_id;
            angular.element(doms).find(".panel-body").slideToggle();
        };
        $scope.pauseTop = function(topic_id) {
            $scope.topic_id = "topic_" + topic_id;
            $scope.monitortopic_id = "monitortopic_" + topic_id;
             ngDialog.open(
            {
                template: '/static/modules/monitor/pages/pauseTopic.html',
                controller: 'pauseTopic',
                width:"10%",
                scope:$scope
            }
            );
        };
        $scope.startTop = function(topic_id) {
            $scope.topic_id = "topic_" + topic_id;
            $scope.monitortopic_id = "monitortopic_" + topic_id;
            ngDialog.open(
            {
                template: '/static/modules/monitor/pages/startTopic.html',
                controller: 'startTopic',
                width: "10%",
                scope: $scope
            }
            );
        };
        $scope.AddSenmessage = function(post_id) {
            $scope.post_id = post_id;
            ngDialog.open(
            {
                template: '/static/modules/monitor/pages/addsenmessage.html',
                controller: 'addSenmessage',
                width: "100%",
                scope: $scope
            }
            );
        };
        $scope.MarkRead  = function(post_id) {
            // console.log($(this).find(".save").find("img").remove());
            // $("#"+post_id+"").find(".save").find("img").remove()
            // $("#"+post_id+"").find(".save").prepend("<img src = '/static/assets/img/saved.svg'>");
        };
        $scope.OpenAnaly = function(analy_topic, topic_id) {
            var anaDom = "#" + analy_topic;
            var topicDom = "#topic_" + topic_id;
            angular.element(topicDom).after(angular.element(anaDom));
            angular.element(anaDom).removeClass("hidden").show("normal");
            var width = angular.element(topicDom).width();
            // time 
            var timeAna = c3.generate({
                bindto:"#timeAna",
                size:{
                    width: width * 0.8
                },
                padding: {
                    top:20,
                    left:40,
                    right:30,
                    bottom: 20
                },
                data: {
                    x: 'x',
                    columns: [
                        ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05'],
                        ['时间', 30, 200, 100, 400, 150]
                    ]
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y-%m-%d'
                        }
                    }
                }
            });
        };
        $scope.stopAnaly = function(analy_topic) {
            var anaDom = "#" + analy_topic;
            angular.element(anaDom).hide("slow");
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
       
        
   }])
    .controller("addSenmessage", ["$rootScope","$scope","ngDialog", function($rootScope, $scope, ngDialog) {
        console.log("addSenmessage","start!!!");
        $scope.DoaddSen = function() {
            ngDialog.closeAll();
        };
       
   }]);