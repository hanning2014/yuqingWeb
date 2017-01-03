'use strict';

CQ.mainApp.manageSettingsController.
    controller("logsController", ["$rootScope", "$scope", "LogService", "$state","TimeFormat",
     function ($rootScope,$scope,LogService, $state, TimeFormat) {
        console.log("logsController start!!");
        $rootScope.styles = false;
        $scope.$emit("initPage", {});
        $scope.keywords = "";
        $scope.logchart = false;
        $scope.loglist = true;
        $scope.system = "bi";
        var dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S');
        $scope.enddate_D = dateFormat(new Date());
        var lastmonth = (new Date()).getTime() - 24 * 3600 * 30 * 1000;
        $scope.startdate_D = dateFormat(new Date(lastmonth));
        var loadInfo = (function () {
            //draw panel tool bar
            $('.admin-panels').adminpanel();
        })();
        $scope.logdatas = [];
        //日期选择配置
        datepick_range("from", "to", true, true, 3, '2014:2018');
        //default theme.
        //激活右侧配置栏
        $scope.toggerRbar = function (flag) {
            var Body = $('body');
            if (!Body.hasClass('mobile-view') && Body.hasClass('sb-r-o')) {
                Body.toggleClass('sb-r-o sb-r-c').toggleClass('sb-l-m'); 
            } else {
                Body.toggleClass('sb-r-o sb-r-c').addClass('sb-l-m');
            }
            $('#sidebar_right .nav-tabs  .active').removeClass('active');
            $('#sidebar_right .tab-content  .active').removeClass('active');
            var activetab = '#navtab' + flag;
            var activetabcontent = '#sidebar-right-tab' + flag;
            $(activetab).addClass('active');
            $(activetabcontent).addClass('active');
        };
        $scope.themes = CQ.variable.defaultParams.themes;
        $scope.theme = CQ.variable.defaultParams.themes[2];
        //default page
        $scope.pageSizeOptions = CQ.variable.defaultParams.pageSizeOptions;
        $scope.pageSize = CQ.variable.defaultParams.pageSizeOptions[0];
        $scope.gridOptions = {
            columnDefs: LogService.columnDefs($scope),
            rowData: null,
            rowHeight: 50,
            rowSelection: 'multiple',
            rowModelType: 'pagination',
            enableServerSideSorting: true,
            enableServerSideFilter: true,
            enableColResize: true,
            suppressRowClickSelection: true,
            angularCompileRows: true
        };
        var filterParams = {
            pageSize: $scope.pageSize,
            keywords: $scope.keywords
        };
        var loadData = function () {
            console.log(LogService.serverPagingFromDataSource(filterParams));
            $scope.gridOptions.api.setDatasource(LogService.serverPagingFromDataSource(filterParams));
            $scope.gridOptions.api.sizeColumnsToFit();
        };
        $scope.pageSizeChanged = function () {
            filterParams.pageSize = new Number($scope.pageSize);
            loadData();
        };
        $scope.filterChanged = function (value) {
            filterParams.keywords = value;
            if (value.length > 3) {
                loadData();
            }
            if (value.length === 0) {
                loadData();
            }
        };

        $scope.filterBtnSearch = function () {
            loadData();
        };
        $scope.refresh = function () {
            $scope.gridOptions.api.refreshView();
        };
        $scope.charts = function () {
            $scope.logchart = true;
            $scope.loglist = false;
            var cons = {};
            if ($scope.startdate_D.length === 10) {
                $scope.startdate_D = $scope.startdate_D + " 00:00:00";
            }
            if ($scope.enddate_D.length === 10) {
                $scope.enddate_D = $scope.enddate_D + " 00:00:00";
            }
            cons.system = $scope.system;
            cons.start =  $scope.startdate_D;
            cons.end =  $scope.enddate_D;
            LogService.allLogData(cons).then(function (res) {
                $scope.drawAll(res);
            }, function (data) {
                if (data.message == "用户未登录") {
                    window.location.href = "/static/login.html";
                }
            });
        };

        $scope.getData = function (type) {
                    $scope.logchart = true;
                    $scope.loglist = false;
                    var cons = {};
                    if (type == 1) { // 今天
                        $scope.startdate_D = dateFormat(new Date()).substring(0, 10) + " 00:00:00";
                        $scope.enddate_D = dateFormat(new Date());
                        //console.log($scope.startdate_D);
                    }else if (type == 3) { // 本月
                        $scope.startdate_D = dateFormat(new Date()).substring(0, 7) + "-01 00:00:00";
                        $scope.enddate_D = dateFormat(new Date());
                    }else if (type == 2) { // 本周
                        var now = new Date();
                        if (now.getDay() == 0) {
                            $scope.startdate_D = dateFormat(new Date(now.getTime() - 6 * 24 * 3600 * 1000)).substring(0,10) + " 00:00:00";
                        }else {
                            $scope.startdate_D = dateFormat(new Date(now.getTime() - (now.getDate() - now.getDay() + 1) * 24 * 3600 * 1000));
                        }
                        $scope.enddate_D = dateFormat(new Date());
                    }else if (type == 4) { // 本季度
                        var now = new Date();
                        var nowMonth = now.getMonth();
                        var quarterMonth = parseInt(nowMonth / 3) * 3;
                        $scope.startdate_D = dateFormat(new Date(now.getFullYear(), quarterMonth, 1));
                        $scope.enddate_D = dateFormat(new Date()); 
                    }
                    cons.system = $scope.system;
                    cons.start =  $scope.startdate_D;
                    cons.end =  $scope.enddate_D;
                    LogService.allLogData(cons).then(function (res) {
                        //console.log(res);
                        $scope.drawAll(res);
                    }, function (data) {
                        if (data.message == "用户未登录") {
                            window.location.href = "/static/login.html";
                        }
                    });
                };
        $scope.loglists = function () {
            console.log("loglists");
            $scope.loglist = true;
            $scope.logchart = false;
        };
        $scope.$on('$viewContentLoaded', function () {
            loadData();
        });

        $scope.drawAll = function (res) {
            var methodChart = dc.pieChart('#piechart');
            var moduleBarChart = dc.barChart('#barchart2');
            var top5usersRowChart = dc.rowChart('#barchart1');
            var moveChart = dc.lineChart('#linechart1');
            var volumeChart = dc.barChart('#linechart2');
            var hh = 250;
            var dateFormat =d3.time.format("%Y-%m-%d %H:%M:%S");
            var numberFormat = d3.format('.2f');
            res.forEach(function (d) {
                d.dd = dateFormat.parse(d.date);
            });
            var top5userlist = [];
            //### Create Crossfilter Dimensions and Groups
            var ndx = crossfilter(res);
            var all = ndx.groupAll();
            // Create categorical dimension
            var methodPie = ndx.dimension(function (d) {
                return d.method;
            });
            // Produce counts records in the dimension
            var methodPieGroup = methodPie.group();
            methodChart      
                .width(hh)
                .height(hh)
                .innerRadius(10)
                .radius(hh / 2 - 20)
                .dimension(methodPie)
                .group(methodPieGroup)
                .legend(dc.legend())
                .label(function (d) {
                    return d.key;
                })
                .title(function (p) {
                    return [
                        "方法名称: " + p.key,
                        "访问次数: " + p.value
                    ].join("\n");
                });
            methodChart.render();
            // draw row chart    
            var top5usersRow = ndx.dimension(function (d) {
                return d.username;
            });
            var top5usersRowGroup =  top5usersRow.group();
            top5usersRowChart
                .width($("#barchart1").width() * 0.9)
                .height(hh)
                .margins({top: 20, left: 10, right: 10, bottom: 20})
                .group(top5usersRowGroup)
                .dimension(top5usersRow)
                .ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
                .label(function (d) {
                    return d.key;
                })
                .title(function (p) {
                    return [
                        "用户名: " + p.key,
                        "访问次数: " + p.value
                    ].join("\n");
                })
                .elasticX(true)
                .xAxis()
                .ticks(5);  
            top5usersRowChart.render();
            // draw module barchart
            var moduleRow = ndx.dimension(function (d) {
                return d.module;
            });
            var moduleRowGroup = moduleRow.group();
            moduleBarChart
                .width($("#barchart2").width() * 0.9)
                .height(hh)
                .centerBar(false) //柱子居中
                .margins({top: 10, right: 50, bottom: 30, left: 40})
                .dimension(moduleRow)
                .group(moduleRowGroup)
                .title(function (p) {
                    return [
                        "模块名称: " + p.key,
                        "访问次数: " + p.value
                    ].join("\n");
                })
                .elasticY(true)
                .gap(1)
                .barPadding(0.3)
                .outerPadding(0.2)
                .round(dc.round.floor)
                .alwaysUseRounding(true)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .renderHorizontalGridLines(true)
                .yAxis()
                .ticks(5);
            moduleBarChart.render();
            // move bar
            var moveDays  = ndx.dimension(function (d) {
                return d.dd;
            });
            var moveDaysGroup = moveDays.group();
            moveChart
                .renderArea(true)
                .width($("#linechart1").width() * 0.9)
                .height(hh)
                .transitionDuration(1000)
                .margins({top: 30, right: 50, bottom: 25, left: 40})
                .dimension(moveDays)
                .group(moveDaysGroup)
                .mouseZoomable(true)
                .rangeChart(volumeChart)
                .title(function(p){
                    return [
                        "时间: "+dateFormat(p.key),
                        "访问次数: "+p.value
                    ].join("\n");
                })
                .x(d3.time.scale().domain([new Date($scope.startdate_D), new Date($scope.enddate_D)]))
                .round(d3.time.minute.round)
                .xUnits(d3.time.minutes)
                .elasticY(true)
                .renderHorizontalGridLines(true)
                .brushOn(false);
            moveChart.render();
            // volume chart
            var volumeChartGroup = moveDays.group().reduceSum(function (p) {
                //console.log(d);
                return 0.1;
            });
            volumeChart
                .width($("#linechart2").width()*0.9)
                .height(30)
                .margins({top: 0, right: 50, bottom: 20, left: 40})
                .dimension(moveDays)
                .group(volumeChartGroup)
                .centerBar(true)
                .gap(1)
                .x(d3.time.scale().domain([new Date($scope.startdate_D), new Date($scope.enddate_D)]))
                .round(d3.time.minute.round)
                .alwaysUseRounding(true)
                .xUnits(d3.time.minutes);
            volumeChart.render();
            //dc.renderAll();  
            $("#linechart2 .y").html("");
        };

    }]);
