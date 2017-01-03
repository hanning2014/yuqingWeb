"use strict";

angular.module('monitorService',['commons'])
    .factory("MonitorFac", ['$resource', 'parseResource', function ($resource, parseResource) {
        var factories = {};
        factories.monitorData = $resource(CQ.variable.RESTFUL_URL + "monitor/all/", parseResource.params, parseResource.actions);
        return factories;
    }])
    .factory("MonitorFacService",['MonitorFac', 'RestService', function(MonitorFac, RestService) {
        var factories = {};
        factories.getMonitorData = function(params) {
            return RestService.get(MonitorFac.monitorData, params);
        };
        return factories;
    }]);