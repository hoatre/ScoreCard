
	app.controller('usergroupController', function ($scope, $http) {
		$scope.usergroup = usergroup;
		grouplistangular($scope,$http,url_grouplistangular);
		userlistangular($scope,$http,url_userangular);
		modulecheckroleaction($scope,$http,'/usergroup');
		groupChanged($scope,$http,url_groupchange);
		actionusergroupdetailangular($scope,$http,url_usergroupdetailangular);
	})