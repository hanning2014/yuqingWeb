"use strict";
CQ.mainApp.systemsettingController
    .controller("userSettingController", ["$rootScope", "$scope", "$http", "ngDialog", "notice",function ($rootScope, 
        $scope, $http, ngDialog, notice) {
        console.log("userSettingController", "start!!!");
        $scope.topic_id = null;
        //页面UI初始化；
        $scope.$on('$viewContentLoaded', function() {
            if($rootScope.mainController) {
                $scope.userId = 1;
                $scope.baseUrl = CQ.variable.RESTFUL_URL ;
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
                    $scope.allsites = data.data.allSites;
                    $scope.getDataByPage($scope.page);
                });
                console.log("userSetting app start!!!");
                App.runui();
            }
        });

        $scope.onDragComplete = function($data,$event)
        {
            
        };

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
        };
        //拖动全选
        $scope.onAllDrag = function($data,$event)
        {
            //$event.stopPropagation();
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
        };

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
            $scope.topic_id = d.topicId;
            console.log($scope.topic_id);
            ngDialog.open(
            {
                template: '/static/modules/systemsetting/pages/deleteTopic.html',
                controller: 'deleteTopic',
                width:"10%",
                scope:$scope
            });
        };
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
                if(data.success == false) {
                    //alert("操作失败!即将为您跳转...");
                    notice.notify_info("您好！", "操作失败，请重试！" ,"",false,"","");
                }
                else if(data.success == true){
                    notice.notify_info("您好！", "话题操作成功！" ,"",false,"","");
                }
                setTimeout(function(){
                    window.location.reload("index.html#/userSetting");
                },2000);
            })
            .error(function(){
                //alert("未知的错误!即将为您跳转...");
                notice.notify_info("您好！", "服务器出错！！" ,"",false,"","");
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
        };
   }])
    .controller("deleteTopic", ["$rootScope", "$scope", "$http", "ngDialog", "notice",function($rootScope, $scope, 
        $http, ngDialog, notice) {
        console.log("delete topic");
        $scope.deleteTopic = function() {
            $scope.removeUrl = $scope.baseUrl + "/deletetopic/";
            $http({
                params: {topicId : $scope.topic_id, userId : $scope.userId},
                url: $scope.removeUrl,
                method: 'get',
            })
            .success(function(data, status, headers, config){
                ngDialog.closeAll();
                notice.notify_info("您好！","话题删除成功！","",false,"","");
                setTimeout(function(){
                    window.location.reload("index.html#/userSetting");
                },2000);
            })
            .error(function(error){
                notice.notify_info("您好！", "操作失败，请重试！" ,"",false,"","");
            });
        };
    }]);
//CQ.mainApp.systemsettingController.directive('nameexistCheck', nameexistCheck);

// // nameexistCheck.$inject = ['$http', '$q'];

// function nameexistCheck(){
//     return {
//         restrict: 'A',
//         require: 'ngModel',
//         link:function($scope,element,attrs,ctrl){
//             // 同步验证
//             ctrl.$validators.exist = function(modelValue, viewValue) {
//                 if($scope.modelName!='添加话题' || $scope.topicList == undefined)
//                     return true;
//                 var value = modelValue || viewValue; 
//                 for(var index = 0; index<$scope.topicList.length; index++)
//                 {
//                     if($scope.topicList[index].topicName == value)
//                     {console.log(false);
//                         return false;}    
//                 }
//                 return true;
//             };
//         }
//     }
// }