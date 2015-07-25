(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("RatingEditCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings",
                     RatingEditCtrl]);

    function RatingEditCtrl($scope, $http, $state, $stateParams, appSettings) {
        $scope.ratings = {};
        $scope.ratings.statusname = "";
        $scope.ratings.note = "";
        //$scope.modeldetail._id = "";
        $http.get(appSettings.serverPath + "/rating/getcode/" + $stateParams.modelId + "/" + $stateParams.ratingCode)
        .success(function (data) {
            if (data["getbycode"]["header"].code == 0) {

                $scope.ratings = data["getbycode"]["body"]["codein"][0];
                $scope.ratingfull = data["getbycode"]["body"];
            }
            else {
                data["getbycode"]["header"].message;
            }
            //getmodeldetailangular($scope,$http,url_modeldetailangular_scala+"/"+data.rating.modelid);

        })


        //get model by id
        $http.post(appSettings.serverPath + "/modelinfo/getbymodelinfoid", { _id: $stateParams.modelId }).
		success(function (data, status, headers, config) {
		    if (data["getModelInfoByIdJSON"]["header"].code == 0) {
		        $scope.modeldetail = data["getModelInfoByIdJSON"]["body"];
		    }
		    else {
		        alert(data["getModelInfoByIdJSON"]["header"].message);
		    }
		}).
		error(function (data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});


        $scope.save = function () {
            var url = "";
            var strMsg = '';
            var ratingobj = {};

            var codein = {
                code: $scope.ratings.code,
                scorefrom: $scope.ratings.scorefrom,
                scoreto: $scope.ratings.scoreto,
                status: $scope.ratings.status,
                statusname: $scope.ratings.statusname,
                note: $scope.ratings.note
            };
            alert($scope.ratings.code);
            ratingobj = {
                modelid: $stateParams.modelId,
                codein: codein
            };
            url = appSettings.serverPath + "/rating/insert";
            //alert(url);
            //alert(angular.toJson(ratingobj));
            //alert(url);
            if (checkrating($scope, $http, $scope.ratings)) {
                $http.post(url, angular.toJson(ratingobj)).
                success(function (data, status, headers, config) {
                    // window.location.assign("/ratings.html")
                    //window.location.assign("/ratings.html?modelid=" + $scope.modeldetail._id);

                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            }
        }
    }
    function checkrating($scope, $http, ratings) {
        //alert('aaa2');
        if (ratings.scorefrom < ratings.scoreto) {
            //alert('aaa1');
            //for(var i=0;i<$scope.modelinfos.length;i++)
            //{
            //alert($scope.modelinfos[i]._id);
            //if($scope.modeldetail._id==ratings.rating.modelid)
            //{
            //alert('aaa2');
            //alert($scope.modeldetail.min);
            if ($scope.modeldetail.min > ratings.scorefrom) {
                alert("Score form more than minscore of model!");
                return false;
            }
            else {
                if ($scope.modeldetail.max < ratings.scoreto) {
                    alert("Model maximum more than Score to!");
                }
                else {
                    return true;
                }
            }
            //}
            //}
            /*$http.get(url_ratinglistbymodelidangular+"/"+ratings.rating.modelid)
            .success(function (data) {
                data.sort(function(a, b){
                    return a.rating.scorefrom-b.rating.scorefrom;
                })
    
            })*/
        }
        else {
            alert("Score to more than score form!");
            return false;
        }
    }
}());
