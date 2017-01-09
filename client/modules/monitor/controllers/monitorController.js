"use strict";
CQ.mainApp.monitorController
   .controller("monitorController", ["$rootScope", "$scope", "$interval", "ngDialog","MonitorFacService",
    "$location","$stateParams", "$http", "PostDataService", "$timeout",function ($rootScope, $scope, $interval,
        ngDialog, MonitorFacService, $location, $stateParams, $http, PostDataService,
        $timeout) {
        console.log("monitorController", "start!!!");
        //页面UI初始化；
        $scope.topic_id = null;
        $scope.monitortopic_id = null;
        $scope.monitorData = null;
        $scope.topicLists = null;
        $scope.dataType = $stateParams.dataType;
        $scope.siteId = $stateParams.siteId;
        $scope.freshLists = [];
        $scope.cons = {};
        $scope.date = getFormatData();
        $scope.pics = ["/static/assets/img/news2.svg","/static/assets/img/luntan.svg", "/static/assets/img/weibo.svg"
        ,"/static/assets/img/tieba.svg","/static/assets/img/weixin1.svg","/static/assets/img/baidu.svg"];
        $scope.$on('$viewContentLoaded', function() {
            if($rootScope.mainController) {
                console.log("monitor app start!!!");
                App.runui();
            }
        });
        getMonitorData();
        $("#datepicker-default")
            .datepicker({todayHighlight:true, autoclose:true, format: 'yyyy-mm-dd' })
            .on('changeDate', function(ev){
                //console.log(ev);
                //console.log($scope.date);
                $scope.monitorData = [];
                $scope.freshLists.forEach(function (d) {
                $interval.cancel(d);
                });
                getMonitorData();

            });
        function getMonitorData() {
            var cons = {};
            cons.dataType = $scope.dataType ;
            cons.siteId = $scope.siteId;
            cons.date = $scope.date;
            cons.pageCount = 20;
            $scope.cons = angular.copy(cons);
            MonitorFacService.getMonitorData(cons).then(function(res){
                console.log(res);
                $scope.monitorData = res;
                getFreshData(cons);
            },function(error){
                console.log(error);
            });
        };

        // get format data
        function getFormatData() {
            var datetime = new Date();  
            var year=datetime.getFullYear();//获取完整的年份(4位,1970)  
            var month=datetime.getMonth()+1;//获取月份(0-11,0代表1月,用的时候记得加上1)  
            if(month<=9){  
                month="0"+month;  
            }  
            var date=datetime.getDate();//获取日(1-31)  
            if(date<=9){  
                date="0"+date;  
            }  
            return year+"-"+month+"-"+date;  
        }
        // fresh data
        function getFreshData(cons) {
            var ll = $interval(function(){
                $(".loads").slideDown("slow");
                var topicLists = [];
                $scope.monitorData.forEach(function (d) {
                    var tl = {};
                    tl.topicId = d.topicId;
                    tl.newTime = d.newTime;
                    topicLists.push(tl);
                });
                cons.topicLists = topicLists;
                //console.log(JSON.stringify(cons));
                    PostDataService.flushData(cons).then(function(freshdata) {
                        console.log(freshdata.data.data);
                        var res = freshdata.data.data;
                        $scope.monitorData.forEach(function(d) {
                            res.forEach(function(rr) {
                                if(rr.topicId == d.topicId){
                                    d.newTime = rr.newTime;
                                    if(rr.postData.length != 0) {
                                        d.count = rr.count;
                                        $(".addnums").slideDown("slow");
                                        d.postData = rr.postData.concat(d.postData);
                                    }
                                }
                            });
                        });
                        //console.log($scope.monitorData);
                        $timeout(function(){
                            $(".addnums").slideUp("slow");
                        }, 4000);
                        $(".loads").slideUp("slow");
                    },function(error) {
                        $(".loads").slideUp("slow");
                        console.log(error);
                    });
            },30000);
            $scope.freshLists.push(ll);
            // $http.post('http://117.32.155.61:9091/yqdata/monitor/flush/', JSON.stringify(cons))
            //     .success(function(rr){
            //         console.log(rr);
            //     // some code
            // });
            // var ll = $interval(function(){
            //     $(".loads").slideDown("slow");
            //     //$(".loads").removeClass("hidden");
            //     MonitorFacService.getFreshData(JSON.stringify(cons)).then(function(res) {
            //         //$(".loads").addClass("hidden");
            //         $(".loads").slideUp("slow");

            //         console.log(res);
            //     },function(error) {
            //         $(".loads").slideUp("slow");
            //         for(var i = 0; i < $(".panel").length; i ++) {
            //             var t  =  $(".panel")[i];
            //             var n = $(t).find(".panel-body");
            //             $(n).find("ul .loads").after($scope.post);
            //         }
            //         console.log(error);
            //     });
            // },10000);
           // $scope.freshLists.push(ll);
        }
        $scope.$on('$destroy',function(){
           $scope.freshLists.forEach(function (d) {
                $interval.cancel(d);
           });
        }); 

        // move positions
        $scope.movePosition = function(topic_id) {
            console.log(topic_id);
            var ht = $("#topic_"+topic_id+"");
            if($("#topic_"+topic_id+"")) {
                $("#topic_"+topic_id+"").hide("slow");
                $timeout(function(){
                    $("#topicLists").prepend(ht);
                    $("#topic_"+topic_id+"").fadeIn("2000");
                },500);
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
            angular.element(doms).find(".loads").slideDown("slow");
                var topicLists = [];
                $scope.monitorData.forEach(function (d) {
                    if(d.topicId == topic_id) {
                        var tl = {};
                        tl.topicId = d.topicId;
                        tl.newTime = d.newTime;
                        topicLists.push(tl);
                    }
                });
            $scope.cons.topicLists = topicLists;
            //console.log(JSON.stringify($scope.cons));
            PostDataService.flushData($scope.cons).then(function(freshdata) {
                console.log(freshdata.data.data);
                var res = freshdata.data.data;
                $scope.monitorData.forEach(function(d) {
                    res.forEach(function(rr) {
                        if(rr.topicId == d.topicId){
                            d.newTime = rr.newTime;
                            if(rr.postData.length != 0) {
                                d.count = rr.count;
                                angular.element(doms).find(".addnums").slideDown("slow");
                                $timeout(function(){
                                    d.postData = rr.postData.concat(d.postData);
                                }, 100);
                                //d.postData = rr.postData.concat(d.postData);
                                //angular.element(doms).find(".addnums").slideUp("slow");
                            }
                        }
                    });
                });
                //console.log($scope.monitorData);
                angular.element(doms).find(".loads").slideUp("slow");
                $timeout(function(){
                        angular.element(doms).find(".addnums").slideUp("slow");
                }, 4000);
            },function(error) {
                angular.element(doms).find(".loads").slideUp("slow");
                angular.element(doms).find(".addnums").slideUp("slow");
                console.log(error);
            });
            
        };

        $scope.showMore = function(topicId) {
            console.log(topicId);
            console.log('show more triggered');  
            var cons = {};
            cons.dataType = $scope.dataType ;
            cons.siteId = $scope.siteId;
            cons.date = $scope.date;
            cons.pageCount = 20;
            cons.topicId = topicId;
            $scope.monitorData.forEach(function(d) {
                console.log(d);
                if(d.topicId == topicId) {
                    cons.oldTime = d.oldTime;
                }
            });
            angular.element("#topic_" + topicId).find(".loadsMore").slideDown("slow");
            MonitorFacService.getLoadData(cons).then(function(res) {
                angular.element("#topic_" + topicId).find(".loadsMore").slideUp("slow");
                console.log(res);
                $scope.monitorData.forEach(function(d) {
                    if(res[0].topicId == d.topicId){
                        d.oldTime = res[0].oldTime;
                        res[0].postData.forEach(function (mm) {
                            d.postData.push(mm);
                        });
                    }
                });
            }, function (error) {
                console.log(error);
            });
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

        $scope.addBg = function($event) {
            //console.log($event.target);
            var tt = $event.target;
            if(angular.element(tt.closest("li")).hasClass("monitor-bg-color") == false) {
                angular.element(tt.closest("li")).addClass("monitor-bg-color");
                angular.element(tt.closest("li")).find(".iconslists").removeClass("ng-hide");
            }
        };
        $scope.removeBg = function($event) {
            var tt = $event.target;
            if(angular.element(tt.closest("li")).hasClass("monitor-bg-color")) {
                angular.element(tt.closest("li")).removeClass("monitor-bg-color");
                angular.element(tt.closest("li")).find(".iconslists").addClass("ng-hide");
            }
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