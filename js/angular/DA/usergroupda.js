

//load form list grouplist
function grouplistangular($scope,$http,url)
{
	$http.get(url)
	.success(function (data) {
		//alert(data);
		$scope.groups = data;
	})
}
//load form list grouplist
function userlistangular($scope,$http,url)
{
	//alert(url);
	$http.get(url)
	.success(function (data) {
		//alert(data);
		$scope.users = data;
	})
}

function groupChanged($scope,$http,url)
{
	$scope.groupChanged = function(index){
		//alert("groupChanged: "+index);
		$http.post(url_usergroupchange, {groupid:index}).
		  success(function(data, status, headers, config) {
			//alert(data);
			$scope.userschoice = data;
			loaduser(data);
		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
	  });
   }
}


function actionusergroupdetailangular($scope,$http,url)
{
	$scope.save = function(){
		//alert(url);
		$scope.usergroup.userid = getvalue_func();
		$http.post(url, {usergroup:$scope.usergroup}).
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

//script access form
function clearcheckedtable()
{
	$('#div_table .case').each(function() {
		this.checked=false;
	});
}
function loaduser(data)
{
	//alert(data);
	clearcheckedtable();
	//alert(data.length);
	for(var i=0;i<data.length;i++)
	{
		checktable(data[i]._id);
	}
	paginguserchoice();
}
function checktable(moduleroleid)
{
	//alert(moduleroleid);
	$('#div_table .case').each(function() {
		if(this.value==moduleroleid)
		{
			this.checked=true;
		}
	});
}
function getvalue_func() {
  return $('#div_table input:checked').map(function() {
	//alert(this.value);
	return this.value;
  }).get().join(',');
}

jQuery(function($){
	//------------table----------
	//------------tableall----------
	//------------paging----------
	function pagingtable(){
		$( "#nav" ).remove();
		$('#div_table').after('<div id="nav"></div>');
		var rowsShown = 10;
		var rowsTotal = $('#div_table tbody tr').length;
		var numPages = rowsTotal/rowsShown;
		for(i = 0;i < numPages;i++) {
			var pageNum = i + 1;
			$('#nav').append('<a href="#" rel="'+i+'">'+pageNum+'</a> ');
		}
		$('#div_table tbody tr').hide();
		$('#div_table tbody tr').slice(0, rowsShown).show();
		$('#nav a:first').addClass('active');
		$('#nav a').bind('click', function(){

			$('#nav a').removeClass('active');
			$(this).addClass('active');
			var currPage = $(this).attr('rel');
			var startItem = currPage * rowsShown;
			var endItem = startItem + rowsShown;
			$('#div_table tbody tr').css('opacity','0.0').hide().slice(startItem, endItem).
					css('display','table-row').animate({opacity:1}, 300);
		});
	}
	pagingtable();
	//------------paging----------

	$(function(){$("#div_table #selectall").click(function()
	{$('#div_table .case').attr('checked',this.checked);});
	$("#div_table .case").click(function(){
	if($("#div_table .case").length==$("#div_table .case:checked").length)
	{
		$("#div_table #selectall").attr("checked","checked");
	}
	else{$("#div_table #selectall").removeAttr("checked");}});});
	//------------tableall----------
	
});