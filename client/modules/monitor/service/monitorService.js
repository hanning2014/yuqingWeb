"use strict";

angular.module('monitorService',['commons'])
    .factory("MonitorFac", ['$resource', 'parseResource', function ($resource, parseResource) {
        var factories = {};
        factories.monitorData = $resource(CQ.variable.RESTFUL_URL + "monitor/all/", parseResource.params, parseResource.actions);
        //factories.freshData = $resource(CQ.variable.RESTFUL_URL + "monitor/flush", parseResource.params, parseResource.actions);
        factories.loadData = $resource(CQ.variable.RESTFUL_URL + "monitor/load/", parseResource.params, parseResource.actions);
        
        return factories;
    }])
    .factory("MonitorFacService",['MonitorFac', 'RestService', function(MonitorFac, RestService) {
        var factories = {};
        factories.getMonitorData = function(params) {
            return RestService.get(MonitorFac.monitorData, params);
        };
        // factories.getFreshData = function(data) {
        //     return RestService.create(MonitorFac.freshData, data);
        // };
        factories.getLoadData = function(params) {
            return RestService.get(MonitorFac.loadData, params);
        };
        return factories;
    }])
    .factory("PostDataService", ["$http", function($http) {
        var factories = {};
        factories.flushData = function(data) {
            return $http.post(CQ.variable.RESTFUL_URL + "monitor/flush/", data);
        };
        return factories;
    }]);