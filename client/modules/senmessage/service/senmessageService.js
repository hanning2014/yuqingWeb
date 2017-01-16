"use strict";
angular.module("senmessageService", ["commons"])
	.factory("SenFac", ['$resource', 'parseResource', function ($resource, parseResource) {
		var factories = {};

		factories.getSenLists = $resource(CQ.variable.RESTFUL_URL + "senmassage/showmsg/?", parseResource.params, parseResource.actions);
	
		factories.getDetailData = $resource(CQ.variable.RESTFUL_URL + "senmassage/showrawmsg/", parseResource.params, parseResource.actions);

		factories.removeSenData = $resource(CQ.variable.RESTFUL_URL + "senmassage/delmesg/?", parseResource.params, parseResource.actions);
		
		factories.reportData = $resource(CQ.variable.RESTFUL_URL + "senmassage/markmesg/?", parseResource.params, parseResource.actions);
		
		factories.getTopic = $resource(CQ.variable.RESTFUL_URL + "topic_statistics/",parseResource.params,parseResource.actions);

		factories.handleData = $resource(CQ.variable.RESTFUL_URL + "senmassage/handlemesg/?", parseResource.params, parseResource.actions);
		return factories;
	}])
	.factory("SenFacService", ["SenFac", "RestService", function(SenFac, RestService) {
		var factories = {};

		factories.getSenLists = function(params) {
			return RestService.get(SenFac.getSenLists, params);
		};

		factories.getDetailData = function(params) {
			return RestService.get(SenFac.getDetailData, params);
		};

		factories.removeSenData = function(data) {
			return RestService.create(SenFac.removeSenData, data);
		};

		factories.reportData = function(data) {
			return RestService.create(SenFac.reportData, data);
		};

		factories.handleData = function(data) {
			return RestService.create(SenFac.handleData, data);
		};

		factories.getTopic = function(params) {
			return RestService.get(SenFac.getTopic,params);
		}

		return factories;
	}]);
