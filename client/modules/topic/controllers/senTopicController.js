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
                getData();
            }
        });
        
        function getTopicData() {
            var cons = {};
            cons.userId = 1;
            TopicFacService.getTopicData(cons).then(function(res){
                console.log(res);
            },function(error) {
                console.log(error);
            })
        }
        function getData() {
            $http.get("/static/assets/data/topic.json").success(function(data){
                $scope.data = data.data;
                console.log($scope.data);
            });
        }

        $scope.openModal = function(){
            $state.go("topicAnalysController", 1);
            // ngDialog.open({
            //     template:"/static/modules/topic/pages/topicAnalys.html",
            //     controller: 'topicAnalys',
            //     className: "ngDialog-theme-custom",
            //     width: "70%",
            //     scope: $scope
            // });
        };

    }])
    .controller("topicAnalysController", ["$rootScope", "$scope", "$http", function($rootScope, $scope, $http) {
        console.log("topicAnalys", "start!!!");
        $scope.postData = null;
        $scope.eventData = null;
        getTopicAnalysData();
        function getTopicAnalysData() {
            $http.get("/static/assets/data/topicAnaly.json").success(function(res){
                $scope.postData = res.data.postData;
                console.log($scope.postData);
                drawChart();
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
                    .renderLabel(true)
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
                return 0;
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
                .elasticY(true)
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
                .brushOn(true)
                //dayDist.render();
            dayDist2.render();
            $("#dayDist2 g.axis.y").html("");

        }



    }]);