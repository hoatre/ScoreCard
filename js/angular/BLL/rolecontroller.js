
	app.controller('rolelistController', function ($scope, $http) {
		//alert(url_rolelistangular);
		rolelistangular($scope,$http,url_rolelistangular);
		roledelete($scope,$http,url_roledelete);
	}).controller('rolelistAction', function ($scope, $http) {
		modulecheckroleaction($scope,$http,'/rolelist');
	}).controller('roleDetailController', function ($scope, $http,$location) {
		$scope.roles = roles;
		getroledetailangular($scope,$http,url_roledetailangular+"/"+geturlidhtml($location.absUrl()));
		actionroledetailangular($scope,$http,url_roledetailangular);
	})