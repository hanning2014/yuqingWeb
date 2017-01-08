"use strict";
CQ.mainApp.systemsettingController
    .controller("userSettingController", ["$rootScope", "$scope", "$http", function ($rootScope, $scope, $http) {
        console.log("userSettingController", "start!!!");
        
        $scope.onDragComplete = function($data,$event)
        {
            
        }

        $scope.onDropComplete = function($data,$event)
        {
            for(var i = 0; i < $scope.allsites.length; i++)
            {
                for(var j = 0; j < $scope.allsites[i].detail_sites.length; j++)
                {
                    if($scope.allsites[i].detail_sites[j].siteId == $data.siteId)
                    {
                        if($scope.allsites[i].detail_sites[j].selected)
                        {
                            return;
                        }
                        else
                        {
                            $scope.allsites[i].detail_sites[j].selected = true;
                            $scope.topic.siteLists.push($data);
                            return;
                        }
                    }
                }
            }
        }
        //拖动全选
        $scope.onAllDrag = function($data,$event)
        {
            for(var i = 0; i < $scope.allsites.length; i++)
            {
                if($scope.allsites[i].siteTypeId ==$data.siteTypeId)
                {
                    $scope.allsites[i].selected = true;
                    $scope.allsites[i].detail_sites.forEach(function(d1){
                        d1.selected = $scope.allsites[i].selected;
                        $scope.checkBoxChange(d1);
                    });
                    return;
                }
            }
        }

        //全选
        $scope.onAllSelected = function(d)
        {
            d.detail_sites.forEach(function(d1){
                d1.selected = d.selected;
                $scope.checkBoxChange(d1);
            });
        }
        //删除话题
        $scope.remove = function(d)
        {
            $scope.removeUrl = $scope.baseUrl + "/deletetopic/";
            $http({
                params: {topicId : d.topicId, userId : $scope.userId},
                url: $scope.removeUrl,
                method: 'get',
            })
            .success(function(data, status, headers, config){
                window.location.reload("index.html#/userSetting");
            })
            .error(function(){});
        }
        $scope.toggle = function (scope) {
            scope.toggle();
        };
        //修改、添加话题
        $scope.save = function()
        {
            console.log($scope.topic);
            $scope.jsonData = {};
            $scope.jsonData.userId = $scope.userId;
            // if($scope.topic.topicId)
            //     $scope.jsonData.topicId = $scope.topic.topicId;
            $scope.jsonData.topicName = $scope.topic.topicName;
            $scope.jsonData.topicKeywords = $scope.topic.topicKeywords.toString().split(',');
            $scope.jsonData.sites = $scope.topic.siteLists;
            $scope.jsonData = JSON.stringify($scope.jsonData);
            console.log($scope.jsonData);
            $http({
                url: $scope.submitUrl,
                method: 'post',
                data: $scope.jsonData,
            }).success(function(data, status, headers, config){
                if(data.success == false)
                    alert("操作失败!即将为您跳转...");
                else(data.success == true)
                    alert("操作成功!即将为您跳转...");
                setTimeout(function(){
                    window.location.reload("index.html#/userSetting");
                },1000);
            })
            .error(function(){
                alert("未知的错误!即将为您跳转...");
            });
        }
        //添加话题
        $scope.newTopic = function()
        {
            $scope.modelName = "添加话题";
            $scope.topic = {topicName:"",topicKeywords:"",siteLists:[]};
            $scope.allsites.forEach(function(d1)
            {
                d1.detail_sites.forEach(function(d){
                    d.selected = false;
                });
            });
            console.log($scope.topic);
            $scope.topicNameEnable = false;
            $scope.submitUrl  = $scope.baseUrl + "/addtopic/";
        }
        //选择站点
        $scope.checkBoxChange = function(d)
        {
            if(d.selected)
            {
                for(var index = 0; index < $scope.topic.siteLists.length; index++)
                {
                    if($scope.topic.siteLists[index].siteId == d.siteId)
                        return;
                }
                $scope.topic.siteLists.push({"siteId":d.siteId,"siteName":d.siteName});
            }
            else
            {
                for(var index = 0; index < $scope.topic.siteLists.length; index++)
                {
                    if($scope.topic.siteLists[index].siteId == d.siteId)
                        $scope.topic.siteLists.splice(index, 1);
                }
            }
            console.log($scope.topic.siteLists);
        }
        //分页
        $scope.getDataByPage = function(page)
        {
            $scope.maxPage = $scope.maxPage || 0;
            $scope.page = $scope.page || 0;
            if(page>=0&&page<=$scope.maxPage)
            {
                $scope.page = page;
            }
            var pageSize = 5.0;
            $scope.maxPage = Math.ceil($scope.topicList.length/pageSize) - 1;
            $scope.pageData = $scope.topicList.slice(pageSize * $scope.page, pageSize * ($scope.page + 1));
        }
        //修改话题
        $scope.changeTopic = function(d){
                    $scope.modelName = "修改话题";
                    $scope.topicNameEnable = true;
                    $scope.topic = JSON.parse(JSON.stringify(d)) || {};
                    // console.log(new d.constructor());
                    $scope.submitUrl = $scope.baseUrl + "/modifytopic/";
                    $scope.allsites.forEach(function(d3){
                        console.log(d3);
                        d3.selected = false;
                        d3.detail_sites.forEach(function(d1)
                        {
                            d1.selected = false;
                            $scope.topic.siteLists.forEach(function(d2){
                            if(d2.siteId == d1.siteId)
                            {
                                d1.selected = true;
                            }
                            });
                        });
                    });
                }
        //页面UI初始化；
        $scope.$on('$viewContentLoaded', function() {
            if($rootScope.mainController) {
                $scope.userId = 1;
                $scope.baseUrl = "http://117.32.155.61:9091/yqdata";
                var url = $scope.baseUrl+"/settopic/?userId=" + $scope.userId;
                // var url = "/static/setup.json";
                var sites = "";
                $scope.page = 0;
                $http.get(url).success(function(data){
                    console.log(data.data.topicData);
                    data.data.topicData.forEach(function(d){
                        sites = "";
                        d.siteLists.forEach(function(site){
                            if(sites != "")
                            {
                                sites += ",";
                            }
                            if(site.siteName)
                            {
                                sites += site.siteName;
                            }
                        });
                        d.sitesStr = sites;
                    });
                    $scope.topicList = data.data.topicData;
                    $scope.topicCount = $scope.topicList.length;
                    console.log($scope.topicList);

                    // $scope.group = data.data.allSites;
                    //站点分类
                    // data.allsites.forEach(function(d){
                    //     console.log(d.siteTypeName);
                    //     for(var i=0;i<$scope.group.length;i++)
                    //     {
                    //         console.log("group.id");
                    //         console.log($scope.group[i].id);
                    //         console.log("siteid");
                    //         console.log(d.siteTypeId);
                    //         if($scope.group[i].id == d.siteTypeId)
                    //         {
                    //             $scope.group[i].nodes.push(d);
                    //             break;
                    //         }
                    //     }
                    //     if(i >= $scope.group.length)
                    //     {
                    //         var oneTypeSites = {};
                    //         oneTypeSites.id = d.siteTypeId;
                    //         oneTypeSites.siteName = d.siteTypeName;
                    //         oneTypeSites.nodes = [];
                    //         oneTypeSites.nodes.push(d);
                    //         $scope.group.push(oneTypeSites);
                    //     }
                    // });
                    $scope.allsites = data.data.allSites;
                    $scope.getDataByPage($scope.page);
                    console.log($scope.allsites);

                });
                console.log("monitor app start!!!");
                App.runui();
            }
        });
        
   }]);
CQ.mainApp.systemsettingController.directive('nameexistCheck', nameexistCheck);

// nameexistCheck.$inject = ['$http', '$q'];

function nameexistCheck(){
    return {
        restrict: 'A',
        require: 'ngModel',
        link:function($scope,element,attrs,ctrl){
            // 同步验证
            ctrl.$validators.exist = function(modelValue, viewValue) {
                if($scope.modelName!='添加话题' || $scope.topicList == undefined)
                    return true;
                var value = modelValue || viewValue; 
                for(var index = 0; index<$scope.topicList.length; index++)
                {
                    if($scope.topicList[index].topicName == value)
                    {console.log(false);
                        return false;}    
                }
                return true;
            };
        }
    }
}