

//load form list modulelist
function modulelistangular($scope,$http,url)
{
	//alert(url);
	$http.get(url)
	.success(function (data) {
		//alert(data);
		$scope.modules = data;
	})
}

function testabc($scope,$http,url)
{
	//alert(url);
	$http.get(url)
	.success(function (data) {
		alert(data);
		$scope.users = data;
	})
}

//fill list module tree
function modulelisttreeangular($scope,$http,url)
{
	$http.get(url)
	.success(function (data) {
		
		var moduletree = [];
		
		data.forEach( function( modules ){
			var moduledetail = {
				id : modules._id,
				parent : modules.module.parent,
				text :  modules.module.modulename
			}
				
			moduletree.push(moduledetail);
		})
		$(function () {
			$('#jstree3').jstree({'core' : { "multiple" : false,
				'data' : moduletree
			}});
			
		});
	})
}

function moduledelete($scope,$http,url)
{
	$scope.moduledelete = function(index){
			
			$http({
				url: url,
				dataType: "json",
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
			}}
			).
			
			//.post(url, {id:$scope.modules[index]._id}).
			  success(function(data, status, headers, config) {
				//alert(data);
				//window.location.assign("/modulelist.html")
			  }).
			  error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
		  });
	   }
}

function getmoduledetailangular($scope,$http,url)
{
	//alert(url);
	$http.get(url)
	.success(function (data) {
		//alert(data);
		$scope.moduledetail = data;
	})
}

function actionmoduledetailangular($scope,$http,url)
{
	$scope.save = function(){
		$http.post(url, {modules:$scope.moduledetail}).
		  success(function(data, status, headers, config) {
			window.location.assign("/modulelist.html")
		  }).
		  error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
   }
}