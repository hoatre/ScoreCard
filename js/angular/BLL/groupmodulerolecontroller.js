
	app.controller('groupmoduleController', function ($scope, $http) {
		$scope.groupmodulerole = groupmodulerole;
		loadgroupmodulerole($scope,$http);
		groupChanged($scope,$http);
		modulecheckroleaction($scope,$http,'/groupmodulerole');
		actiongroupmoduleroledetailangular($scope,$http,url_groupmoduleroledetailangular);
	})