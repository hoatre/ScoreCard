

//load form list grouplist
function grouplistangular($scope,$http,url)
{
	$http.get(url)
	.success(function (data) {
		$scope.groups = data;
	})
}

function modulelistangular($scope,$http,url)
{
	//alert(url);
	$http.get(url)
	.success(function (data) {
		//alert(data);
		$scope.modules = data;
	})
}

function groupChanged($scope,$http,url)
{
	$scope.groupChanged = function(index){
		//alert("groupChanged: "+index);
		$http.post(url, {groupid:index}).
		  success(function(data, status, headers, config) {
			$('#jstree3').jstree(true).deselect_all(true);
			for(var i=0;i<data.length;i++)
			{
				$('#jstree3').jstree(true).select_node(data[i].groupmodule.moduleid);
			}
		  }).
		  error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
	  });
   }
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
			$('#jstree3').jstree({'plugins':["wholerow","checkbox"],'core' : { "multiple" : true,
				'data' : moduletree
			}});
			
		});
	})
}

function actiongroupmoduledetailangular($scope,$http,url)
{
	$scope.save = function(){
		//alert('abc');
		//alert("groupmodule: "+$scope.groupmodule.moduleid);
		//alert(getvalue_func());
		$scope.groupmodule.moduleid=getvalue_func();
		alert($scope.groupmodule.moduleid);
		$http.post(url, {groupmodule:$scope.groupmodule}).
		  success(function(data, status, headers, config) {
			//window.location.assign("/grouplist")
			alert(data);
		  }).
		  error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
   }
}

function getvalue_func() {
	return $('#tablemodule').find('tr > td:first-child input:checkbox').map(function () {
		//this is the current checkbox
		return this.value;
		}).get().join(',');
}