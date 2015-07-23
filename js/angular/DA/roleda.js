

//load form list rolelist
function rolelistangular($scope,$http,url)
{
	$http.get(url)
	.success(function (data) {
		//alert(data[0].role.rolename);
		$scope.roles = data;
	})
}

function roledelete($scope,$http,url)
{
	$scope.roledelete = function(index){
			
			$http.post(url, {id:$scope.roles[index]._id}).
			  success(function(data, status, headers, config) {
				alert(data);
				window.location.assign("/rolelist.html")
			  }).
			  error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
		  });
	   }
}

function getroledetailangular($scope,$http,url)
{
	//alert(url);
	$http.get(url)
	.success(function (data) {
		$scope.roles = data;
	})
}

function actionroledetailangular($scope,$http,url)
{
	$scope.save = function(){
		$http.post(url, {roles:$scope.roles}).
		  success(function(data, status, headers, config) {
			window.location.assign("/rolelist.html")
		  }).
		  error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
   }
}