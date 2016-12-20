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
					//App.init();
					//Dashboard.init();
					$rootScope.mainController = true;
					console.log("UI框架初始化完成");
			}
        });
	}])
	.controller('headerController', ['$scope', '$rootScope', '$state', 
		function($scope, $rootScope, $state) {
			$rootScope.headerController = true;
			console.log("headerController", "start!");
	}])
	.controller('leftbarController', ['$scope', '$rootScope', '$state', 
		function($scope, $rootScope, $state) {
			$rootScope.leftbarController = true;
			console.log("leftbarController", "start!"); 
	}])
	.controller('themeController', ['$scope', '$rootScope', '$state', 
		function($scope, $rootScope, $state) {
			$rootScope.themeController = true;
			console.log("themeController", "start!");
	}]);