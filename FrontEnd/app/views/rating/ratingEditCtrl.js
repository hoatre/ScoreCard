(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("RatingEditCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "popupService",
                     RatingEditCtrl]);

    function RatingEditCtrl($scope, $http, $state, $stateParams, appSettings, popupService) {

        $scope.rating = {};
        $scope.model = {};

        // Get rating by code
        if ($stateParams.ratingCode != null && $stateParams.ratingCode != '') {
            $http.get(appSettings.serverPath + "/rating/getcode/" + $stateParams.modelId + "/" + $stateParams.ratingCode)
            .success(function (data) {
                if (data["getbycode"]["header"].code == 0) {

                    $scope.rating = data["getbycode"]["body"]["codein"][0];
                    $scope.ratingfull = data["getbycode"]["body"];
                }
                else {
                    data["getbycode"]["header"].message;
                }

            });
        }


        // Get model by id
        $http.post(appSettings.serverPath + "/modelinfo/getbymodelinfoid", { _id: $stateParams.modelId })
		    .success(function (data, status, headers, config) {
		        if (data["getModelInfoByIdJSON"]["header"].code == 0) {
		            $scope.model = data.getModelInfoByIdJSON.body[0];
		        }
		        else {
		            alert(data["getModelInfoByIdJSON"]["header"].message);
		        }
		    })
		    .error(function (data, status, headers, config) {
		        // called asynchronously if an error occurs
		        // or server returns response with an error status.
		    });


        // Save data
        $scope.save = function () {
            var url = "";
            var strMsg = '';
            var ratingobj = {};

            var codein = {
                code: $scope.rating.code,
                scorefrom: $scope.rating.scorefrom,
                scoreto: $scope.rating.scoreto,
                status: $scope.rating.status,
                statusname: $scope.rating.status,
                note: $scope.rating.code
            };


            ratingobj = {
                modelid: $stateParams.modelId,
                codein: codein
            };
            url = appSettings.serverPath + "/rating/add";
            $http.post(url, angular.toJson(ratingobj)).
            success(function (data, status, headers, config) {
                popupService.showMessage('Insert Success!');
                $scope.back();
            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }

        // Reset data to original
        $scope.cancel = function (editForm) {
            editForm.$setPristine();
            //$scope.model = angular.copy($scope.originalModel);
            $scope.message = "";
        };

        // Back to list
        $scope.back = function () {
            $state.go("ratingList", { modelId: $stateParams.modelId });
        }
    }
}());
