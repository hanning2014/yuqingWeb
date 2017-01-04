"use strict";
angular.module('settingservice',[])
    .factory("DataSourceTree",function($rootScope) {
        var factories = {};
        var dashboard = [
            {
                label: "统计面板",
                link: "#/dashboard", 
                hasShow:true,
                icon:"",
                items: ""
            }
        ];
        var topicLists = [
            {
                label: "敏感话题",
                link: "#/senTopic", 
                hasShow: true,
                icon:"",
                items: ""
            },
            {
                label: "热点话题",
                link: "#/hotTopic", 
                hasShow:true,
                icon:"",
                items: ""
            }
        ];
        var monitorLists = [
            {
                label: "全部数据源",
                link: "#/monitor/-1/-1", 
                hasShow: true,
                icon:"",
                items: "",
                siteTypeId: -1,
                siteId: -1
            },
            {
                label: "新闻类",
                link: "#/monitor/0/-1", 
                hasShow:true,
                icon:"",
                siteTypeId: 0,
                siteId: -1,
                items: [
                  
                ]
            },
            {
                label: "论坛类",
                link: "#/monitor/1/-1", 
                hasShow:true,
                icon:"",
                siteTypeId: 1,
                siteId: -1,
                items: [
                  
                ]
            },
            {
                label: "微博类",
                link: "#/monitor/2/-1", 
                hasShow:true,
                siteTypeId: 2,
                siteId: -1,
                icon:"",
                items: [
                 
                ]
            },
            {
                label: "贴吧类",
                link: "#/monitor/3/-1", 
                hasShow:true,
                siteTypeId: 3,
                siteId: -1,
                icon:"",
                items: [
                 
                ]
            },
            {
                label: "微信类",
                link: "#/monitor/4/-1", 
                hasShow:true,
                icon:"",
                siteTypeId: 4,
                siteId: -1,
                items: ""
            },
            {
                label: "全网搜索",
                link: "#/monitor/5/-1", 
                hasShow:true,
                icon:"",
                siteTypeId: 5,
                siteId: -1,
                items: ""
            }
        ];
        var senMessages = [
            {
                label:"自动识别",
                link: "#/senmessages",
                hasShow: true,
                icon: "",
                items: ""
            },
            {
                label:"手工添加",
                link: "#/addmessages",
                hasShow: true,
                icon: "",
                items: ""
            }
        ];
        var systemSettings = [
            {
                label:"用户设置",
                link: "#/userSetting",
                hasShow: true,
                icon: "",
                items: ""
            },
            {
                label:"角色设置",
                link: "#/roleSetting",
                hasShow: true,
                icon: "",
                items: ""
            }
        ];
        var yuqingSearch = [
            {
                label:"舆情趋势",
                link: "#/yuqingTrends",
                hasShow: true,
                icon: "",
                items: ""
            },
            {
                label:"关联分析",
                link: "#/yuqingAnaly",
                hasShow: true,
                icon: "",
                items: ""
            }
        ];
        factories.allLinks = [
            {
                label:"面板",
                link: "#/dashboard",
                hasShow: true,
                icon: "fa fa-dashboard",
                items: dashboard
            },
            {
                label:"话题分析",
                link: "#/senTopic",
                hasShow: true,
                icon: "fa fa-bar-chart-o",
                items: topicLists
            },
            {
                label:"实时监控",
                link: "#/monitor/-1/-1",
                hasShow: true,
                icon: "fa fa-eye",
                items: monitorLists
            },
            {
                label:"敏感信息",
                link: "#/senmessages",
                hasShow: true,
                icon: "fa fa-table",
                items: senMessages
            },
            {
                label:"系统设置",
                link: "#/userSetting",
                hasShow: true,
                icon: "fa fa-gear",
                items: systemSettings
            },
            {
                label:"舆情检索",
                link: "#/yuqingTrends",
                hasShow: true,
                icon: "fa fa-search",
                items: yuqingSearch
            }
        ];
        /**
         * 将json格式的数据转化为字符串作为value,以"jsondatas"为key
         */
        factories.jsonDataToForm = function(jsondata) {
            console.log("jsonDataToForm");
            if (jsondata.$$hashKey) {
                delete jsondata.$$hashKey;
            }
            if (jsondata.objectId) {
                delete jsondata.objectId;
            }

            var obj = {};
            for (var key in jsondata) {
                obj[key] = jsondata[key];
            }
            //格式化对象,作为form数据
            var formData = $.param(obj);
            return formData;
        };
        return factories;
    });