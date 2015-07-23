//load form list grouplist
function factoroptionlistangular($scope,$http,url)
{
	//alert(url);
	$http.get(url)
	.success(function (data) {
		//alert(data);
		$scope.factoroptions = data;
	})
}

function getfactoroptiondetailangular($scope,$http,url)
{
	//alert(url);
	$http.get(url)
	.success(function (data) {
		//alert(data);
		$scope.factoroptions = data;
	})
}

function factoroptiondelete($scope,$http,url)
{
	$scope.factoroptiondelete = function(index){
			
		$http.post(url, {id:$scope.factoroptions[index]._id}).
		  success(function(data, status, headers, config) {
			alert(data);
			window.location.assign("/factoroptions.html")
		  }).
		  error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
	  });
   }
}

function actionfactoroptiondetailangular($scope,$http,url)
{
	//alert($scope.groups._id);
	$scope.save = function(){
		$http.post(url, {factoroptions:$scope.factoroptions}).
		  success(function(data, status, headers, config) {
			window.location.assign("/factoroptions.html")
		  }).
		  error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	}
}