
	app.controller('factoroptionController', function ($scope, $http) {
		//alert(url_factoroptionlistangular);
		factoroptionlistangular($scope,$http,url_factoroptionlistangular);
		factoroptiondelete($scope,$http,url_factoroptiondelete);
	}).controller('factoroptionAction', function ($scope, $http) {
		//modulecheckroleaction($scope,$http,'/factoroptions');
	}).controller('factoroptionDetailController', function ($scope, $http,$location) {
		//alert(url_factoroptiondetailangular);
		$scope.factoroptions = factoroptions;
		getfactoroptiondetailangular($scope,$http,url_factoroptiondetailangular+"/"+geturlidhtml($location.absUrl()));
		actionfactoroptiondetailangular($scope,$http,url_factoroptiondetailangular);
	})