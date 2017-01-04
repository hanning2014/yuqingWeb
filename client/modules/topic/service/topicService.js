"use strict";

angular.module('topicService',['commons'])
    .factory("TopicFac", ['$resource', 'parseResource', function ($resource, parseResource) {
        var factories = {};
        factories.topicData = $resource(CQ.variable.RESTFUL_URL + "topic_statistics/", parseResource.params, parseResource.actions);
        return factories;
    }])
    .factory("TopicFacService",['TopicFac', 'RestService', function(TopicFac, RestService) {
        var factories = {};
        factories.getTopicData = function(params) {
            return RestService.get(TopicFac.topicData, params);
        };
        return factories;
    }]);