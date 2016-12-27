"use strict";
CQ.mainApp.frameController
	.controller('mainController', ['$scope', '$rootScope', '$state',
		function($scope, $rootScope, $state) {
		console.log("mainController", "start!");
		$rootScope.mainController = false;
		$scope.cardNums = 0;
		$scope.$on('$includeContentLoaded', function(event, data) {
			$scope.cardNums += 1;
			if($scope.cardNums == 3) {
					App.init();
					//Dashboard.init();
					$rootScope.mainController = true;
					$scope.$broadcast('uirun', "uirun");
					console.log("UI框架初始化完成");
			}
		});
	}])
	.controller('headerController', ['$scope', '$rootScope', '$state', 
		function($scope, $rootScope, $state) {
			$rootScope.headerController = true;
			console.log("headerController", "start!");
	}])
	.controller('leftbarController', ['$scope', '$rootScope', '$state','DataSourceTree', 
		function($scope, $rootScope, $state, DataSourceTree) {
			//console.log(DataSourceTree.allLinks);
			var lists = [];
			$scope.allLinks = DataSourceTree.allLinks;
			$rootScope.leftbarController = true;
			$scope.moduleHomelinkclick = function(item) {
				$scope.allLinks.forEach(function(d) {
					d.isActive = "";
					if(d.items != "") {
						d.items.forEach(function(d1) {
							d1.isActive = "";
							if(d1.items != ""){
								d1.items.forEach(function(d2) {
									d2.isActive = "";
								});
							}
						});
					}
				});
				$scope.allLinks.forEach(function(d) {
					if(item.label == d.label) {
						d.isActive = "active";
					}
					if(d.items != "") {
						d.items.forEach(function(d1) {
							if(item.label == d1.label) {
								d1.isActive = "active";
							}
							if(d1.items != ""){
								d1.items.forEach(function(d2) {
									if(item.label == d2.label) {
										d2.isActive = "active";
									}
								});
							}
						});
					}
				});
				//console.log(item);
			};
			console.log("leftbarController", "start!"); 
	}])
	.controller('themeController', ['$scope', '$rootScope', '$state', 
		function($scope, $rootScope, $state) {
			$rootScope.themeController = true;
			console.log("themeController", "start!");
	}]);