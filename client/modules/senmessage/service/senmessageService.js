"use strict";
angular.module("senmessageService", ["commons"])
	.factory("SenFac", ['$resource', 'parseResource', function ($resource, parseResource) {
		var factories = {};

		factories.getSenLists = $resource(CQ.variable.RESTFUL_URL + "senmassage/showmsg", parseResource.params, parseResource.actions);
	
		factories.getDetailData = $resource(CQ.variable.RESTFUL_URL + "senmassage/showrawmsg/", parseResource.params, parseResource.actions);

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

		return factories;
	}]);
