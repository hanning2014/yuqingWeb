"use strict";
CQ.mainApp.senmessageController
   .controller("senmessageController", ["$rootScope", "$scope","$http","ngDialog", "SenFacService", "notice", 
    function ($rootScope, $scope, $http, ngDialog, SenFacService, notice) {
        console.log("senmessageController", "start!!!");
        $scope.sendata = null;
        $scope.pageSize = 5;
        $scope.pages = 10;
        $scope.newpage = $scope.pages > 5 ? 5:$scope.pages;
        $scope.pageList = [];
        $scope.pageNum = 1;
        $scope.baseUrl = CQ.variable.RESTFUL_URL;
        $scope.selectList = [];
        $scope.date = getFormatData();
        $scope.dataObj = new DataObj();
        $scope.topic = [{"name":"--所有话题--","value":"-1"},{"name":"交大","value":0},{"name":"校庆","value":1},{"name":"买答案","value":2}];
        $scope.state = [{"name":"--所有状态--","value":-1},{"name":"未上报","value":0},{"name":"上报未处理","value":1},{"name":"上报已处理","value":2}];
        getData();
        getTopic();
        $scope.selectPage = function (page) {
            if (page < 1 || page > $scope.pages) return;
            //最多显示分页数5
            if (page > 2) {
                //因为只显示5个页数，大于2页开始分页转换
                var newpageList = [];
                for (var i = (page - 3) ; i < ((page + 2) > $scope.pages ? $scope.pages : (page + 2)) ; i++) {
                    newpageList.push(i + 1);
                }
                $scope.pageList = newpageList;
            }
            $scope.pageNum = page;
            $scope.dataObj.pageNum = page;
            $scope.isActivePage(page);
            console.log("选择的页：" + page);
            getData();
        };
        $scope.isActivePage = function (page) {
            if($scope.pageNum==page){
                return "btn btn-primary";
            }else return "btn";
        };
        //上一页
        $scope.Previous = function () {
        $scope.selectPage($scope.pageNum - 1);
        };
        //下一页
        $scope.Next = function () {
        $scope.selectPage($scope.pageNum + 1);
        };


        //页面UI初始化；
        $scope.$on('$viewContentLoaded', function() {
            if($rootScope.mainController) {
                console.log("senmessage app start!!!");
                App.runui();
                getData();
            }
        });
        $("#datepicker-start")
        .datepicker({todayHighlight:true, autoclose:true, format: 'yyyy-mm-dd' });
               $("#datepicker-end")
        .datepicker({todayHighlight:true, autoclose:true, format: 'yyyy-mm-dd' });
            
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
        //定义参数对象
        function DataObj () {
            DataObj.prototype.userId = 1;
            DataObj.prototype.pageCounts = 10;
            DataObj.prototype.pageNum = 1,
            DataObj.prototype.is_report = -1,
            DataObj.prototype.topicId = -1,
            DataObj.prototype.dataType =-1,
            DataObj.prototype.startDate = "",
            DataObj.prototype.endDate = ""
        }
        //get data
        function getData (object) {
            $scope.sendata = [];
            var cons = {
                        "userId":$scope.dataObj.userId,
                        "pageCounts":$scope.dataObj.pageCounts,
                        "is_report":$scope.dataObj.is_report,
                        "topicId":$scope.dataObj.topicId,
                        "dataType":$scope.dataObj.dataType,
                        "pageNum":$scope.dataObj.pageNum,
                        "startDate":$scope.dataObj.startDate == "" ? '""' : $scope.dataObj.startDate,
                        "endDate":$scope.dataObj.endDate == "" ? '""' : $scope.dataObj.endDate
                };
            SenFacService.getSenLists(cons).then(function(res) {
               // console.log(res);
                res.postData.forEach(function(d) {
                    if(d.content.length > 40) {
                        d.content = d.content.substring(0, 40) + "...";
                    }
                });
                $scope.sendata = res.postData;
                $scope.pages = Math.ceil(res.totalCount/10);
                $scope.newpage = Math.ceil(res.totalCount/10);
                for(var i=0;i<$scope.newpage;i++){
                    $scope.pageList[i]=i+1;
                }
            });
        }

        //设置搜索
       $scope.search = function(){
        //console.log($scope.dataObj);
        getData();
       };

    function getTopic(){
      var cons = {"userId":1};
      SenFacService.getTopic(cons).then(function(res) {
        for(var i=0;i<res.length;i++){
          $scope.topic.push({"name":res[i].topicName,"value":i});
        }
      });
    }
    // 元数据显示
    $scope.getMetaData = function(id)
    {
        $scope.detailDataId = id;
         ngDialog.open(
            {
                template: '/static/modules/senmessage/pages/detailData.html',
                controller: 'displayDetailData',
                appendClassName: "ngdialog-theme-details",
                width: "100%",
                scope: $scope
            }
        );
    };
    // 撤销操作
    $scope.revoke = function(d)
    {
        var postLists = [];
        if(d)
        {
            postLists = [d];
        }
        else
        {
            postLists = $scope.selectList;
        }
        // var url = $scope.baseUrl + "senmassage/delmesg/";
        var Data = {
            userId: $scope.dataObj.userId,
            postLists: postLists
        };
        SenFacService.removeSenData(Data).then(function(res) {
               console.log(res);
               notice.notify_info("您好！", "删除成功！" ,"",false,"","");
               setTimeout(function() {
                    getData();
               }, 2000);
               
            },function(err) {
                notice.notify_info("您好！", "删除失败！ 请重试" ,"",false,"","");
            });
    };
    //修改状态
    $scope.changeState = function(state,d)
    {
        var postLists;
        if(d)
        {
            postLists = [d];
        }
        else
        {
            postLists = $scope.selectList;
        }
        var Data = {userId: $scope.dataObj.userId,
                    postLists: postLists};

        if(state != 1 && state != 2)
            return;
        else if(state == 1)
        {
            SenFacService.reportData(Data).then(function(res) {
               console.log(res);
               notice.notify_info("您好！", "操作成功！" ,"",false,"","");
               setTimeout(function() {
                    getData();
               }, 2000);
            },function(err) {
                notice.notify_info("您好！", "操作失败，请重试！" ,"",false,"","");
            });
        }
        else if(state == 2)
        {
            SenFacService.handleData(Data).then(function(res) {
               //console.log(res);
               notice.notify_info("您好！", "操作成功！" ,"",false,"","");
               setTimeout(function() {
                    getData();
               }, 2000);
            },function(err) {
                notice.notify_info("您好！", "操作失败，请重试！" ,"",false,"","");
            });    
        }
    };
    //选择按钮
    $scope.selectBoxChange = function(d){
        if(d.selected)
        {
            $scope.selectList.push(d.id);
        }
        else
        {
            for(var index = 0; index < $scope.selectList.length; index++)   
            {
                if($scope.selectList[index] == d.id)
                {
                    $scope.selectList.splice(index,1);
                    break;
                } 
            }
        }
        console.log($scope.selectList);
    };
    //全选
    $scope.selectAll = function()
    {
        $scope.sendata.forEach(function(d){
            // console.log(d);
            d.selected = $scope.allselected;
            $scope.selectBoxChange(d);
        });
    };
    //取证
    $scope.forensics = function(d)
    {
        $http({
                url: CQ.variable.RESTFUL_URL+ 'senmassage/evidence/',
                method: "get",
                params: {
                    userId: $scope.dataObj.userId,
                    id: d
                },
                responseType: 'blob'
            }).success(function (data, status, headers, config) {
                var blob = new Blob([data], {type: "text/xml"});
                var fileName = "evidence.html";
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.download = fileName;
                a.href = URL.createObjectURL(blob);
                a.click();
                notice.notify_info("您好！", "下载成功！" ,"",false,"","");
            }).error(function (data, status, headers, config) {
                //upload failed
                notice.notify_info("您好！", "下载失败！" ,"",false,"","");
            });
    };
    $scope.export = function(tableId,type)
    {
        tableExport(tableId, 'test', type);
        notice.notify_info("您好！", "导出成功！" ,"",false,"","");
    };
   }])
    .controller("displayDetailData", ["$scope", "SenFacService", function ($scope, SenFacService) {
        //console.log($scope.detailDataId);
        $scope.detailData = null;
        var cons = {
            userId: 1,
            id: $scope.detailDataId
        };
        SenFacService.getDetailData(cons).then(function(res) {
            //console.log(res);
            $scope.detailData = res[0];
        });

    }]);
