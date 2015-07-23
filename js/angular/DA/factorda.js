//load form list grouplist
function factorlistangular($scope,$http,url)
{
	//alert(url);
	$http.get(url)
	.success(function (data) {
		//alert(data);
		$scope.factors = data;
	})
}

function getfactordetailangular($scope,$http,url)
{
	//alert(url);
	$http.get(url)
	.success(function (data) {
		//alert(data);
		$scope.factors = data;
	})
}

function factordelete($scope,$http,url)
{
	$scope.factordelete = function(index){
			
		$http.post(url, {id:$scope.factors[index]._id}).
		  success(function(data, status, headers, config) {
			alert(data);
			window.location.assign("/factors.html")
		  }).
		  error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
	  });
   }
}

function actionfactordetailangular($scope,$http,url)
{
	//alert($scope.groups._id);
	$scope.save = function(){
		$http.post(url, {factors:$scope.factors}).
		  success(function(data, status, headers, config) {
			window.location.assign("/factors.html")
		  }).
		  error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	}
}