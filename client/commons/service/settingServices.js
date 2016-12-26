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
                link: "#/monitor", 
                hasShow: true,
                icon:"",
                items: ""
            },
            {
                label: "新闻类",
                link: "#/monitor?data_type = 0", 
                hasShow:true,
                icon:"",
                items: [
                   {
                        label: "网易新闻",
                        link: "#/monitor?data_type =0&site_id = 1", 
                        hasShow: true,
                        icon:"",
                        items: ""
                    },
                    {
                        label: "新浪新闻",
                        link: "#/monitor?data_type =0&site_id = 2",  
                        hasShow: true,
                        icon:"",
                        items: ""
                    }
                ]
            },
            {
                label: "论坛类",
                link: "#/monitor?data_type = 1", 
                hasShow:true,
                icon:"",
                items: [
                   {
                        label: "天涯论坛",
                        link: "#/monitor?data_type =1&site_id = 3", 
                        hasShow: true,
                        icon:"",
                        items: ""
                    },
                    {
                        label: "虎扑论坛",
                        link: "#/monitor?data_type =1&site_id = 4",  
                        hasShow: true,
                        icon:"",
                        items: ""
                    }
                ]
            },
            {
                label: "微博类",
                link: "#/monitor?data_type = 2", 
                hasShow:true,
                icon:"",
                items: [
                   {
                        label: "新浪微博",
                        link: "#/monitor?data_type=2&site_id = 5", 
                        hasShow: true,
                        icon:"",
                        items: ""
                    }
                ]
            },
            {
                label: "贴吧类",
                link: "#/monitor?data_type = 3", 
                hasShow:true,
                icon:"",
                items: [
                   {
                        label: "高考吧",
                        link: "#/monitor?data_type=2&site_id=6", 
                        hasShow: true,
                        icon:"",
                        items: ""
                    },
                    {
                        label: "教育吧",
                        link: "#/monitor?data_type=2&site_id=7",  
                        hasShow: true,
                        icon:"",
                        items: ""
                    }
                ]
            },
            {
                label: "微信类",
                link: "#/monitor?data_type = 4", 
                hasShow:true,
                icon:"",
                items: ""
            },
            {
                label: "全网搜索",
                link: "#/monitor?data_type =5", 
                hasShow:true,
                icon:"",
                items: [
                   {
                        label: "百度搜索",
                        link: "#/monitor?data_type=5&site_id=8", 
                        hasShow: true,
                        icon:"",
                        items: ""
                    },
                    {
                        label: "贴吧搜索",
                        link: "#/monitor?data_type =5&site_id=9",  
                        hasShow: true,
                        icon:"",
                        items: ""
                    }
                ]
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
                link: "#/monitor",
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