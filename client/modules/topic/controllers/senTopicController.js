"use strict";
CQ.mainApp.topicController
    .controller("senTopicController", ["$rootScope", "$scope", "TopicFacService", "$http", "ngDialog", "$state",
    function($rootScope, $scope, 
    TopicFacService, $http, ngDialog, $state) {
        console.log("senTopicController", "start!!!");
        //页面UI初始化；
        $scope.$on('$viewContentLoaded', function() {
            if($rootScope.mainController) {
                console.log("topic app start!!!");
                App.runui();
                getTopicData();
            }
        });
        
        function getTopicData() {
            var cons = {};
            cons.userId = 1;
            TopicFacService.getTopicData(cons).then(function(res){
                console.log(res);
                var imgs2 = ["/static/assets/img/1.jpg","/static/assets/img/2.jpg","/static/assets/img/3.jpg"];
                var imgs3 = ["/static/assets/img/ky1.jpg","/static/assets/img/ky2.jpg","/static/assets/img/ky3.jpg"];
                var imgs4 = ["/static/assets/img/gk1.jpg","/static/assets/img/gk2.jpg","/static/assets/img/gk3.jpg"];
                var imgs9 = ["/static/assets/img/da1.jpg","/static/assets/img/da2.jpg","/static/assets/img/da3.jpg"];
                res.forEach(function(d) {
                    if(d.topicId == 2) {
                        d.imgs = imgs2;
                    }else if(d.topicId == 9) {
                        d.imgs = imgs3;
                    }else if(d.topicId == 4) {
                        d.imgs = imgs4;
                    }else if(d.topicId == 3) {
                        d.imgs = imgs9;
                    }
                    //d.imgs = imgs;
                });
                $scope.data = res;
                setTimeout(function(){
                    $scope.$apply(function(){
                            drawClouds();
                    　　　　});
                　}, 1000);

                
            },function(error) {
                console.log(error);
            });
        }

        function drawClouds() {
            $scope.data.forEach(function (d) {
                var doms = "wordsCloud_" + d.topicId;
                if(document.getElementById(doms) != undefined) {
                    //console.log("aaa");
                var chart = echarts.init(document.getElementById(doms));
                var options = {
                    series: [{
                        type: 'wordCloud',
                        gridSize: 20,
                        sizeRange: [12, 50],
                        rotationRange: [0, 0],
                        shape: 'circle',
                        textStyle: {
                            normal: {
                                color: function() {
                                    return 'rgb(' + [
                                        Math.round(Math.random() * 160),
                                        Math.round(Math.random() * 160),
                                        Math.round(Math.random() * 160)
                                    ].join(',') + ')';
                                }
                            },
                            emphasis: {
                                shadowBlur: 10,
                                shadowColor: '#333'
                            }
                        },
                        data: []
                    }]
                };
                var keylists = [];
                d.topicKeywords.forEach(function (d) {
                    var tt = {};
                    tt.name = d;
                    tt.value = Math.random() * 50 + 50;
                    keylists.push(tt);
                });
                options.series[0].data = keylists;
                chart.setOption(options);
                }
            });
        }
        $scope.openModal = function(topicId){
            $state.go("topicAnalysController", {topicId: topicId});
        };

    }])
    .controller("topicAnalysController", ["$rootScope", "$scope", "$http", "$stateParams", "TopicFacService","$state",
        function($rootScope, $scope, $http, $stateParams, TopicFacService, $state) {
        console.log("topicAnalys", "start!!!");
        $scope.postData = null;
        $scope.eventData = null;
        $scope.topicName = "";
        $scope.backTopic = false;
        $scope.$on('$viewContentLoaded', function() {
            if($rootScope.mainController) {
                App.runui();
                getTopicAnalysData();
            }
        });
        $scope.openModal = function(){
            $state.go("topicController");
        };
        function getTopicAnalysData() {
            var cons = {};
            cons.userId = 1;
            cons.topicId = $stateParams.topicId;
             TopicFacService.getTopicAnalyData(cons).then(function(res){
                //console.log(res);
                // res.postData.forEach(function(d) {
                //     d.postTime = d.postTime.substring(0,10)
                // });
                $scope.topicName = res.topicName;
                $scope.postData = res.postData;
                $scope.backTopic = true;
                drawChart();
            },function(error) {
                console.log(error);
            });
        }
        function drawChart() {
            var dateFormat =d3.time.format("%Y-%m-%d %H:%M:%S");
            $scope.postData.forEach(function (d) {
                d.postTime = dateFormat.parse(d.postTime);
            });
            var ndx = crossfilter($scope.postData);
            var datatypeDist = dc.pieChart("#datatypeDist");
            var datatypeDim = ndx.dimension(function(d) {
                return d.dataTypeName;
            });
            var datatypeGroup = datatypeDim.group();
            drawdatatypeDist(datatypeDist, datatypeDim, datatypeGroup);
            // draw sitedist
            var siteDist = dc.rowChart("#siteDist");
            var siteDim = ndx.dimension(function(d) {
                return d.site_name;
            });
            var siteGroup = siteDim.group();
            drawsiteDist(siteDist, siteDim, siteGroup);
            // linechart1 and linechart2
            var dayDist1  = dc.lineChart('#dayDist1');
            var dayDim1  = ndx.dimension(function (d) {
                return d.postTime;
            });
            var dayGroup1 = dayDim1.group();
            drawdayDist1(dayDist1, dayDim1, dayGroup1);
        }

        function drawdatatypeDist(datatypeDist, datatypeDim, datatypeGroup) {
             var width = $("#datatypeDist").width() * 0.9,
                height = $("#datatypeDist").height() * 0.9;
                datatypeDist
                    .width(width)
                    .height(height)
                    .innerRadius(20)
                    .dimension(datatypeDim)
                    .group(datatypeGroup)
                    .legend(dc.legend());
                datatypeDist.render();
        }
        function drawsiteDist(siteDist, siteDim, siteGroup) {
            var width = $("#siteDist").width() * 0.9,
                height = $("#siteDist").height() * 0.9;
                siteDist.data = function() {
                    var top10 = siteGroup.top(10);
                    return top10;
                };
                siteDist.width(width)
                    .height(height)
                    .dimension(siteDim)
                    .group(siteGroup)
                    .x(d3.scale.linear().domain([6,20]))
                    .margins({ top: 0, right: 30, bottom: 20, left: 10 })
                    .label(function(d) {
                        return d.key + ":" + d.value; })
                    .renderTitle(true)
                    .controlsUseVisibility(true)
                    .elasticX(true);
                siteDist.render();
        }
        function drawdayDist1(dayDist1, dayDim1, dayGroup1) {
             var dateFormat =d3.time.format("%Y-%m-%d %H:%M:%S");
             var dayDist2 = dc.barChart("#dayDist2");
             var dayDim2 = dayDim1;
             var dayGroup2 = dayDim2.group().reduceSum(function(d) {
                return 0.2;
             });
             dayDist1
                .renderArea(true)
                .width($("#dayDist1").width() * 0.9)
                .height($("#dayDist1").height() * 0.9)
                .transitionDuration(1000)
                .margins({top: 30, right: 50, bottom: 25, left: 40})
                .dimension(dayDim1)
                .group(dayGroup1)
                .mouseZoomable(true)
                .rangeChart(dayDist2)
                .title(function(p){
                    return [
                        "时间: "+dateFormat(p.key),
                        "数目: "+p.value
                    ].join("\n");
                })
                .x(d3.time.scale().domain([$scope.postData[$scope.postData.length - 1].postTime, 
                    $scope.postData[0].postTime]))
                .round(d3.time.minute.round)
                .xUnits(d3.time.minutes)
                .elasticY(true)
                .renderHorizontalGridLines(true)
                .brushOn(false);
            dayDist1.render();

            // line2  
            
            dayDist2
                .width($("#dayDist2").width() * 0.9)
                .height(50)
                .margins({top: 20, right: 10, bottom: 20, left: 30})
                .dimension(dayDim2)
                .group(dayGroup2)
                .elasticY(false)
                .yAxisPadding('10%') //设置y轴距离顶部的距离(为了renderLabel才设置)
                .centerBar(true)
                .gap(1)
                //.round(d3.time.round)
                .alwaysUseRounding(true)
                //.xUnits(d3.time.minutes);
                .renderLabel(false)
                .outerPadding(0.2)
                .controlsUseVisibility(true)
                .x(d3.time.scale().domain([$scope.postData[$scope.postData.length - 1].postTime, 
                    $scope.postData[0].postTime]))
                .renderHorizontalGridLines(false)
                .brushOn(true);
            dayDist2.render();
            $("#dayDist2 .y").html("");
            $("#dayDist2 .y").remove();
        }
    }]);