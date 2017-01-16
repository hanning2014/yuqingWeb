"use strict";
CQ.mainApp.dashboardController
    .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "/static/modules/dashboard/pages/dashboard.html",
                controller: "dashboardController"
            });
    }])
    .controller('dashboardController', ['$scope', '$rootScope', '$state','ChartService', 'notice',
        function($scope, $rootScope, $state, ChartService, notice) {
            $rootScope.dashboardController = true;
            console.log("dashboardController", "start!");
            $scope.HotPost = [];
            $scope.HotPoster = [];
            $scope.HotWeibo = [];
            $scope.mapData = [];
            $scope.sourceData = [];
            $scope.dataTypeLists = [0,0,0,0,0,0];
            getData();
            //页面UI初始化；
            $scope.$on('$viewContentLoaded', function() {
                if($rootScope.mainController) {
                    App.runui();
                    notice.notify_info("欢迎回来！！","admin!!","",false,"","");
                }
            });
            function getData() {
                ChartService.getDashboardData({}).then(function(res){
                        console.log(res);
                        $scope.HotPost = res.Hot.hotPost;
                        $scope.HotPoster = res.Hot.hotPoster;
                        $scope.HotWeibo = res.Hot.hotWeibo;
                        $scope.mapData = res.mapData;
                        $scope.sourceData = res.sourceData;
                        $scope.sourceData.forEach(function(d) {
                            $scope.dataTypeLists[parseInt(d.data_type)] =  $scope.dataTypeLists[parseInt(d.data_type)] + parseInt(d.post_num);
                        });
                        console.log($scope.dataTypeLists);
                        drawChart();
                        drawMap();
                },function(error){
                    console.log(error);
                    notice.notify_info("抱歉！","数据请求出错，请重试！","",false,"","");
                });
            }
           
            function drawChart() {
                var ndx = crossfilter($scope.sourceData),
                all = ndx.groupAll(),
                dayDist = dc.barChart("#dayDist"),
                dayDim = ndx.dimension(function(d) {
                    return d.time;
                }),
                dayGroup = dayDim.group().reduceSum(function (d) {
                    return d.post_num;
                });
                drawBarDayDist(dayDist, dayDim, dayGroup);
                var topicDist = dc.rowChart("#topicDist"),
                topicDim = ndx.dimension(function(d) {
                    return d.topic_name;
                }),
                topicGroup = topicDim.group().reduceSum(function(d) {
                    return d.post_num;
                });
                drawRowTopicDist(topicDist, topicDim, topicGroup);
                var datatypeDist = dc.pieChart("#datatypeDist"),
                datatypeDim = ndx.dimension(function (d) {
                    return d.dataTypeName;
                }),
                datatypeGroup = datatypeDim.group().reduceSum(function(d) {
                    return d.post_num;
                });
                drawPieDatatypeDist(datatypeDist, datatypeDim, datatypeGroup);
            }
            function drawPieDatatypeDist(datatypeDist, datatypeDim, datatypeGroup) {
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
            function drawBarDayDist(dayDist, dayDim, dayGroup){
                var width = $("#dayDist").width(),
                height = $("#dayDist").height();
                dayDist.width(width)
                        .height(height)
                        .margins({top: 20, right: 10, bottom: 20, left: 40})
                        .dimension(dayDim)
                        .group(dayGroup)
                        .elasticY(true)
                        .yAxisPadding('10%') //设置y轴距离顶部的距离(为了renderLabel才设置)
                        .centerBar(false)
                        .round(dc.round.floor)
                        .alwaysUseRounding(true)
                        .renderLabel(true)
                        .outerPadding(0.2)
                        .controlsUseVisibility(true)
                        .x(d3.scale.ordinal())
                        .xUnits(dc.units.ordinal)
                        .renderHorizontalGridLines(true)
                        .yAxis()
                        .ticks(5);
                        dayDist.render();
            }
            function drawRowTopicDist(topicDist, topicDim, topicGroup) {
                var width = $("#topicDist").width() * 0.9,
                height = $("#topicDist").height() * 0.9;
                topicDist.data = function() {
                    var top10 = topicGroup.top(10);
                    return top10;
                };
                topicDist.width(width)
                    .height(height)
                    .dimension(topicDim)
                    .group(topicGroup)
                    .x(d3.scale.linear().domain([6,20]))
                    .margins({ top: 0, right: 30, bottom: 20, left: 10 })
                    .label(function(d) {
                        return d.key + ":" + d.value; })
                    //.renderLabel(true)
                    .renderTitle(true)
                    .controlsUseVisibility(true)
                    .elasticX(true);
                topicDist.render();
            }
            function drawMap() {
                var width = $("#maps").width(),
                height = $("#maps").height(),
                svg = d3.select("#maps")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(0,0)"),
                projection = d3.geo.mercator()
                    .center([107, 31])
                    .scale(360)
                    .translate([width * 4 / 8, height * 3 / 4]),
                path = d3.geo.path()
                    .projection(projection),
                color = d3.scale.category20();
                d3.json("/static/assets/data/china.geojson", function(error, root) {
                    if (error)
                        return console.error(error);
                    var provinces=svg.selectAll("path")
                        .data( root.features )
                        .enter()
                        .append("path")
                        .attr("stroke","#000")
                        .attr("stroke-width",1)
                        .attr("fill", "rgba(0,0,255,0.2)")
                        .attr("d", path );
                        //求最大值和最小
                        var maxvalue = d3.max($scope.mapData,function(d){return d.nums;});
                        var minvalue = 0;
                        //定义一个线性比例尺，将最小值和最大值之间的值映射到[0, 1]
                        var linear = d3.scale.linear()
                            .domain([minvalue,maxvalue]).range([0,1]);
                        //定义最小值和最大值对应的颜色
                        var a = 0.2;
                        var b = 1;
                        //颜色插值函数
                        var computeColor = d3.interpolate(a,b);
                        //将读取到的数据存到数组values，令其索引号为各省的名称
                        var values = [];
                        for(var i = 0;i < $scope.mapData.length;i++){
                            var name = $scope.mapData[i].pro;
                            var value =$scope.mapData[i].nums;
                            values[name] = value;
                        }
                        //设定各省份的填充色
                        provinces.style("fill", function(d,i){
                            var t = linear( values[d.properties.name] );
                            var color = computeColor(t);
                            return "rgba(0,0,255,"+color.toString()+")";
                        });
                    
                    });
            }
    }]);