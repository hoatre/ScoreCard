

//load form list grouplist
function grouplistangular($scope,$http,url)
{
	$http.get(url)
	.success(function (data) {
		$scope.groups = data["GroupsList"];
	})
}

function groupdelete($scope,$http,url)
{
	
	$scope.groupdelete = function(index){
			var req = {
			 method: 'DELETE',
			 url: "http://10.15.171.21:8080/group/delete/" + $scope.groups[index]._id
			
			}
		   // $http.defaults.headers.post["Content-Type"] = "application/json";
			$http({url:"http://10.15.171.21:8080/group/delete/" + $scope.groups[index]._id
				  ,
				  method:"DELETE"
			}).
			  success(function(data, status, headers, config) {
				alert(data);
			  }).
			  error(function(data, status, headers, config) {
		  });
	}
}

function getgroupdetailangular($scope,$http,url)
{
	//alert(url);
	$http.get(url)
	.success(function (data) {
		$scope.groups = data;
	})
}

function actiongroupdetailangular($scope,$http,url)
{
	$scope.save = function(){
		$http.post(url, {groups:$scope.groups}).
		  success(function(data, status, headers, config) {
			window.location.assign("/grouplist.html")
		  }).
		  error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
   }
}